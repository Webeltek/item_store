// PumpController.jsx
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './PiMonitor.css';

// Configuration
const API_URL = import.meta.env.VITE_API_MONITOR_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH;

function PumpController() {
    // ===== STATE =====
    const [pumpRunning, setPumpRunning] = useState(false);
    const [waterLevel, setWaterLevel] = useState('HIGH');
    const [schedules, setSchedules] = useState({});
    const [nextRun, setNextRun] = useState(null);
    const [isServerConnected, setIsServerConnected] = useState(false);
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastSynced, setLastSynced] = useState(null);
    const [pendingCommands, setPendingCommands] = useState({});
    const [socket, setSocket] = useState(null);
    const pendingCommandsRef = useRef({});
    const lastSyncedRef = useRef(null);
    
    // ===== REFS =====
    const socketRef = useRef(null);
    const syncIntervalRef = useRef(null);

    const addPendingCommand = (commandId, commandInfo) => {
        const next = {
            ...pendingCommandsRef.current,
            [commandId]: commandInfo
        };
        pendingCommandsRef.current = next;
        setPendingCommands(next);
    };

    const removePendingCommand = (commandId) => {
        const next = { ...pendingCommandsRef.current };
        delete next[commandId];
        pendingCommandsRef.current = next;
        setPendingCommands(next);
    };

    const markSynced = (date) => {
        setLastSynced(date);
        lastSyncedRef.current = date;
    };

    // ===== 1. FETCH CACHED STATUS FROM EXPRESS if not initial =====
    // 2. queue full status request command to be pooled from Flask if initial
    const syncWithHardware = async (isInitialSync = false) => {
        try {
            const endpoint = isInitialSync ? '/initial-full-status' : '/status';
            const response = await axios.get(`${API_URL}${endpoint}`);
            console.log(`📊 Full status response if isInitialSync=${isInitialSync}:`, response.data);
            if (response.data.success) {
                // Update ALL state from hardware
                setPumpRunning(response.data.pump?.running || false);
                setWaterLevel(response.data.pump?.water_level || 'HIGH');
                const schedulesData = response.data.schedules || {};
                console.log('📅 Schedules received:', schedulesData);
                setSchedules(schedulesData);
                setNextRun(response.data.next_run || null);
                markSynced(new Date());
                setIsServerConnected(true);
                setIsDeviceConnected(response.data.device_online || false);
                setLoading(false);
            } else {
                console.warn('⚠️ Status response not successful:', response.data);
            }
        } catch (error) {
            console.error('❌ Sync error:', error);
            setIsServerConnected(false);
            setLoading(false);
        }
    };

    // ===== 2. SEND COMMAND TO FLASK (via Express) =====
    const sendCommand = async (endpoint, data = {}) => {
        try {
            const response = await axios.post(`${API_URL}${endpoint}`, data);
            console.log('✅ Command sent:', response.data);
            const commandId = response.data?.command_id;
            if (commandId) {
                addPendingCommand(commandId, {
                    endpoint,
                    data,
                    submittedAt: new Date().toISOString()
                });
            }

            // Optimistic update - immediately update UI and suppress immediate status refresh
            if (endpoint === '/pump/on') {
                setPumpRunning(true);
                markSynced(new Date());
            } else if (endpoint === '/pump/off') {
                setPumpRunning(false);
                markSynced(new Date());
            }

            return response.data;
        } catch (error) {
            console.error('❌ Command error:', error);
            await syncWithHardware();
            throw error;
        }
    };

    // ===== 3. ADD SCHEDULE =====
    const addSchedule = async (scheduleData) => {
        try {
            const response = await sendCommand('/schedule', scheduleData);
            const scheduleId = response.schedule_id || response.command_id || `pending_${Date.now()}`;
            const newSchedule = {
                [scheduleId]: {
                    hour: scheduleData.hour,
                    minute: scheduleData.minute,
                    duration: scheduleData.duration,
                    days: scheduleData.days || 'daily',
                    enabled: true,
                    pending: true
                }
            };
            setSchedules(prev => ({ ...prev, ...newSchedule }));
            markSynced(new Date());
            return response;
        } catch (error) {
            console.error('❌ Add schedule error:', error);
            await syncWithHardware();
            throw error;
        }
    };

    // ===== 4. DELETE SCHEDULE =====
    const deleteSchedule = async (scheduleId) => {
        try {
            await axios.delete(`${API_URL}/schedule/${scheduleId}`);
            // Optimistic update - remove from UI
            setSchedules(prev => {
                const newSchedules = { ...prev };
                delete newSchedules[scheduleId];
                return newSchedules;
            });
            markSynced(new Date());
        } catch (error) {
            console.error('❌ Delete schedule error:', error);
            await syncWithHardware();
        }
    };

    // ===== 5. TOGGLE SCHEDULE (Enable/Disable) =====
    const toggleSchedule = async (scheduleId, enabled) => {
        try {
            await axios.post(`${API_URL}/schedule/${scheduleId}/toggle`, { enabled });
            // Optimistic update
            setSchedules(prev => ({
                ...prev,
                [scheduleId]: {
                    ...prev[scheduleId],
                    enabled: enabled
                }
            }));
            markSynced(new Date());
        } catch (error) {
            console.error('❌ Toggle schedule error:', error);
            await syncWithHardware();
        }
    };

    // ===== 6. EMERGENCY STOP =====
    const emergencyStop = async () => {
        try {
            await axios.post(`${API_URL}/pump/emergency`);
            setPumpRunning(false);
            markSynced(new Date());
        } catch (error) {
            console.error('❌ Emergency stop error:', error);
            await syncWithHardware();
        }
    };

    // ===== 7. SOCKET.IO SETUP (Real-time updates from Flask via Express) =====
    useEffect(() => {
        // Create socket connection
        const newSocket = io(SOCKET_URL, {
            path: SOCKET_PATH,
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });
        
        socketRef.current = newSocket;
        setSocket(newSocket);

        // Socket event listeners
        newSocket.on('connect', () => {
            console.log('🔌 Socket connected');
            setIsServerConnected(true);
        });
        newSocket.on('connect_error', (error) => {
            console.error('❌ Socket connect_error:', error);
        });
        newSocket.on('connect_timeout', (timeout) => {
            console.error('❌ Socket connect_timeout:', timeout);
        });
        newSocket.on('reconnect_failed', () => {
            console.error('❌ Socket reconnect_failed');
        });

        newSocket.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            setIsServerConnected(false);
        });

        newSocket.on('full-update', (data) => {
            console.log('📡 Full update received:', data);
            if (data.pump) {
                setPumpRunning(data.pump.running);
                setWaterLevel(data.pump.water_level);
            }
            if (data.schedules) {
                setSchedules(data.schedules);
            }
            if (data.next_run) {
                setNextRun(data.next_run);
            }
            markSynced(new Date());
            setLoading(false);
        });

        newSocket.on('command-result', (data) => {
            console.log('📡 Command result received:', data);
            if (data?.command_id) {
                removePendingCommand(data.command_id);
            }
            if (data?.success) {
                syncWithHardware();
            }
        });

        newSocket.on('error', (error) => {
            console.error('❌ Socket error:', error);
            setIsServerConnected(false);
        });

        // Cleanup on unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, []); // Empty deps - run once on mount

    // ===== 8. PERIODIC SYNC (Backup for missed socket events) =====
    useEffect(() => {
        // Initial sync
        const initialSync = true; // Set to true for initial sync
        syncWithHardware(true);

        // Set up periodic sync every 10 seconds
        syncIntervalRef.current = setInterval(() => {
            if (Object.keys(pendingCommandsRef.current).length > 0) {
                console.log('🔄 Skipping periodic sync: commands pending');
                return;
            }

            const last = lastSyncedRef.current;
            if (!last || (new Date() - last) > 10000) {
                console.log('🔄 Periodic sync triggered');
                syncWithHardware();
            }
        }, 10000); // 10 seconds

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, []); // Empty deps - run once on mount

    // ===== 9. RENDER =====
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader">Loading pump status...</div>
            </div>
        );
    }

    return (
        <div className="pump-controller">
            {/* Header */}
            <div className="header">
                <h1>💧 Water Pump Controller</h1>
                <div className={`connection-status ${isServerConnected ? 'connected' : 'disconnected'}`}>
                    {isServerConnected ? '🟢 Server Connected' : '🔴 Server Disconnected'}
                    {!isServerConnected && (
                        <span className="warning"> ⚠️ Reconnecting...</span>
                    )}
                </div>
                {lastSynced && (
                    <div className="last-synced">
                        Last updated: {lastSynced.toLocaleTimeString()}
                    </div>
                )}
                <div className={`connection-status ${isDeviceConnected ? 'connected' : 'disconnected'}`}>
                    {isDeviceConnected ? '🟢 Device Connected' : '🔴 Device Disconnected'}
                    {!isDeviceConnected && (
                            <span className="warning"> ⚠️ Reconnecting...</span>
                        )}
                </div>
                
            </div>

            {/* Manual Control */}
            <div className="card">
                <h2>🎮 Manual Control</h2>
                <div className={`pump-status ${pumpRunning ? 'on' : 'off'}`}>
                    <span className="status-text">
                        {pumpRunning ? '🟢 Pump is ON' : '🔴 Pump is OFF'}
                    </span>
                    <span className="status-indicator"></span>
                </div>
                <div className="level-indicator">
                    💧 Water Level: <strong>{waterLevel}</strong>
                </div>
                <div className="button-group">
                    <button 
                        className="btn-on" 
                        onClick={() => sendCommand('/pump/on')}
                        disabled={pumpRunning}
                    >
                        💧 Turn ON
                    </button>
                    <button 
                        className="btn-off" 
                        onClick={() => sendCommand('/pump/off')}
                        disabled={!pumpRunning}
                    >
                        ⛔ Turn OFF
                    </button>
                    <button 
                        className="btn-emergency" 
                        onClick={emergencyStop}
                    >
                        🛑 Emergency Stop
                    </button>
                </div>
            </div>

            {/* Schedules */}
            <div className="card">
                <h2>📅 Active Schedules</h2>
                <div className="schedule-list">
                    {console.log('🔍 Rendering schedules, state:', schedules) || Object.keys(schedules).length === 0 ? (
                        <div className="empty-state">No schedules configured</div>
                    ) : (
                        Object.entries(schedules).map(([id, schedule]) => (
                            <div 
                                key={id} 
                                className={`schedule-item ${schedule.enabled ? '' : 'disabled'}`}
                            >
                                <div className="schedule-info">
                                    <div className="schedule-time">
                                        ⏰ {String(schedule.hour).padStart(2, '0')}:
                                        {String(schedule.minute).padStart(2, '0')}
                                        {schedule.is_running && (
                                            <span className="running-badge"> 🔄 RUNNING</span>
                                        )}
                                        {!schedule.enabled && (
                                            <span className="disabled-badge"> (Disabled)</span>
                                        )}
                                    </div>
                                    <div className="schedule-duration">
                                        💧 Duration: {schedule.duration / 60} minutes
                                    </div>
                                    <div className="schedule-days">
                                        📅 Days: {schedule.days === 'daily' ? 'Every day' : schedule.days}
                                    </div>
                                    {schedule.next_run_time && (
                                        <div className="schedule-next">
                                            ⏭️ Next: {new Date(schedule.next_run_time).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                                <div className="schedule-actions">
                                    <button 
                                        className="btn-toggle"
                                        onClick={() => toggleSchedule(id, !schedule.enabled)}
                                    >
                                        {schedule.enabled ? '⏸️ Disable' : '▶️ Enable'}
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => deleteSchedule(id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {nextRun && (
                    <div className="next-run">
                        ⏰ Next scheduled watering: {new Date(nextRun).toLocaleString()}
                    </div>
                )}
            </div>

            {/* Add Schedule Form */}
            <div className="card">
                <h2>⏰ Add Schedule</h2>
                <ScheduleForm onAdd={addSchedule} />
            </div>
        </div>
    );
}

// ===== Schedule Form Component =====
function ScheduleForm({ onAdd }) {
    const [time, setTime] = useState('08:00');
    const [duration, setDuration] = useState(30);
    const [days, setDays] = useState('daily');

    const handleSubmit = (e) => {
        e.preventDefault();
        const [hour, minute] = time.split(':').map(Number);
        
        onAdd({
            hour,
            minute,
            duration: duration * 60, // Convert to seconds
            days: days === 'daily' ? null : days
        });

        // Reset form (optional)
        // setTime('08:00');
        // setDuration(30);
    };

    const handleTimeChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length >= 2) {
            var hours = value.substring(0, 2);
            if (parseInt(hours) > 23) hours = '23';
            if (value.length >= 3) {
                var minutes = value.substring(2, 4);
                if (parseInt(minutes) > 59) minutes = '59';
                e.target.value = hours + ':' + minutes;
            } else {
                e.target.value = hours;
            }
        }
        setTime(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit} className="schedule-form">
            <div className="form-group">
                <label>Time (24h)</label>
                <input 
                    type="text" 
                    value={time} 
                    onChange={handleTimeChange}
                    pattern="[0-9]{2}:[0-9]{2}"
                    maxLength="5"
                    placeholder="08:00" 
                    required
                />
            </div>
            <div className="form-group">
                <label>Duration (minutes)</label>
                <input 
                    type="number" 
                    value={duration} 
                    onChange={(e) => setDuration(Number(e.target.value))} 
                    min="1"
                    max="1440"
                    required
                />
            </div>
            <div className="form-group">
                <label>Days</label>
                <select value={days} onChange={(e) => setDays(e.target.value)}>
                    <option value="daily">Every Day</option>
                    <option value="weekdays">Weekdays (Mon-Fri)</option>
                    <option value="weekend">Weekend (Sat-Sun)</option>
                </select>
            </div>
            <button type="submit" className="btn-add">➕ Add Schedule</button>
        </form>
    );
}

export default PumpController;