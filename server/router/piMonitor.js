import express from 'express';

export default function createPiMonitor(io) {
    const router = express.Router();

    // ===== STORAGE =====
    // Command queue - stores commands waiting to be picked up by Flask
    let commandQueue = [];
    let commandResults = {};

    // Device status (updated ONLY via webhooks from Flask)
    let deviceStatus = {
        lastSeen: null,
        pump: {
            running: false,
            water_level: 'HIGH',
            level_state: 'HIGH'
        },
        schedules: {},
        next_run: null,
        system: {}
    };

    // Store connected clients
    const connectedClients = new Set();

    // ===== SOCKET.IO EVENT HANDLERS =====
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);
        connectedClients.add(socket.id);

        // Send current cached status immediately on connection
        socket.emit('full-update', {
            pump: deviceStatus.pump,
            schedules: deviceStatus.schedules,
            next_run: deviceStatus.next_run,
            system: deviceStatus.system
        });

        // Send pump status separately for redundancy
        socket.emit('pump-update', deviceStatus.pump);

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
            connectedClients.delete(socket.id);
        });
    });

    // ===== HELPER FUNCTIONS =====
    // Broadcast updates to all connected clients
    function broadcastUpdate(event, data) {
        console.log(`📡 Broadcasting ${event} to ${connectedClients.size} clients`);
        io.emit(event, data);
    }

    // Broadcast pump status update
    function broadcastPumpUpdate(pumpData) {
        // Update cached status
        deviceStatus.pump = {
            ...deviceStatus.pump,
            ...pumpData
        };
        deviceStatus.lastSeen = new Date().toISOString();

        // Send both individual and full updates
        broadcastUpdate('pump-update', deviceStatus.pump);
        broadcastUpdate('full-update', {
            pump: deviceStatus.pump,
            schedules: deviceStatus.schedules,
            next_run: deviceStatus.next_run,
            system: deviceStatus.system
        });
    }

    // Broadcast schedule update
    function broadcastScheduleUpdate(schedules, nextRun) {
        deviceStatus.schedules = schedules;
        deviceStatus.next_run = nextRun;
        
        broadcastUpdate('schedule-update', {
            schedules: schedules,
            next_run: deviceStatus.next_run
        });
        broadcastUpdate('full-update', {
            pump: deviceStatus.pump,
            schedules: schedules,
            next_run: deviceStatus.next_run,
            system: deviceStatus.system
        });
    }

    // Broadcast full status update
    function broadcastFullUpdate() {
        broadcastUpdate('full-update', {
            pump: deviceStatus.pump,
            schedules: deviceStatus.schedules,
            next_run: deviceStatus.next_run,
            system: deviceStatus.system
        });
    }

    // ===== COMMAND QUEUE FUNCTIONS =====
    function queueCommand(type, data) {
        const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

        const command = {
            id: commandId,
            type: type,
            data: data,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        commandQueue.push(command);

        // Keep queue manageable (max 100 commands)
        if (commandQueue.length > 100) {
            commandQueue.shift();
        }

        console.log(`📝 Command queued: ${type} (${commandId})`);
        return commandId;
    }

    // ===== WEBHOOK RECEIVER (ONLY WAY Flask updates Express) =====
    router.post('/webhook/pump-status', (req, res) => {
        const { event, data, immediate, updates, batch } = req.body;

        console.log(`📨 Webhook received: ${event}`);

        if (batch) {
            // Handle batch updates
            console.log(`📦 Processing ${updates.length} batched updates`);
            updates.forEach(update => {
                processWebhookEvent(update.event, update.data);
            });
        } else {
            // Handle single update
            processWebhookEvent(event, data);
        }

        // Always acknowledge webhook
        res.json({ success: true });
    });

    function processWebhookEvent(event, data) {
        switch (event) {
            case 'pump_status':
                console.log(`🔄 Pump status update: ${data.running ? 'ON' : 'OFF'}`);
                broadcastPumpUpdate({
                    running: data.running,
                    water_level: data.level || data.water_level || 'HIGH',
                    level_state: data.level_state || (data.running ? 'LOW' : 'HIGH')
                });
                break;

            case 'schedule_added':
                console.log('🔄 Schedule added');
                // Flask sends the full schedules list in the webhook
                if (data.schedules) {
                    broadcastScheduleUpdate(data.schedules, data.next_run);
                }
                break;

            case 'schedule_deleted':
                console.log('🔄 Schedule deleted');
                if (data.schedules) {
                    broadcastScheduleUpdate(data.schedules, data.next_run);
                }
                break;

            case 'schedule_toggled':
                console.log('🔄 Schedule toggled');
                if (data.schedules) {
                    broadcastScheduleUpdate(data.schedules, data.next_run);
                }
                break;

            case 'full_status':
                console.log('🔄 Full status update from Flask');
                if (data.pump) {
                    deviceStatus.pump = { ...deviceStatus.pump, ...data.pump };
                }
                if (data.schedules) {
                    deviceStatus.schedules = data.schedules;
                }
                if (data.next_run) {
                    deviceStatus.next_run = data.next_run;
                }
                if (data.system) {
                    deviceStatus.system = data.system;
                }
                deviceStatus.lastSeen = new Date().toISOString();
                broadcastFullUpdate();
                break;

            case 'error':
                console.error(`❌ Error from Flask: ${data.error}`);
                io.emit('error', {
                    message: data.error,
                    timestamp: new Date().toISOString()
                });
                break;

            default:
                console.log(`⚠️ Unknown event type: ${event}`);
        }
    }

    // ===== FLASK COMMAND POLLING ENDPOINTS =====
    // Flask polls this endpoint to get pending commands (OUTGOING from Flask)
    router.get('/commands/pending', (req, res) => {
        const deviceId = req.headers['x-device-id'];

        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID required' });
        }

        // Update device last seen timestamp
        deviceStatus.lastSeen = new Date().toISOString();

        // Get all pending commands
        const pending = commandQueue.filter(cmd => cmd.status === 'pending');

        if (pending.length === 0) {
            return res.status(204).send(); // No content
        }

        // Mark commands as delivered (in_progress)
        pending.forEach(cmd => {
            cmd.status = 'in_progress';
        });

        console.log(`📤 Sending ${pending.length} pending commands to Flask`);

        res.json({
            commands: pending.map(cmd => ({
                id: cmd.id,
                type: cmd.type,
                data: cmd.data,
                timestamp: cmd.timestamp
            }))
        });
    });

    // Flask reports command result back here (OUTGOING from Flask)
    router.post('/commands/result', (req, res) => {
        const { id, success, result, timestamp } = req.body;
        const deviceId = req.headers['x-device-id'];

        console.log(`📥 Command result for ${id}: ${success ? '✅ SUCCESS' : '❌ FAIL'}`);

        // Store result
        commandResults[id] = {
            success,
            result,
            timestamp,
            deviceId
        };

        // Update command status
        const cmd = commandQueue.find(c => c.id === id);
        if (cmd) {
            cmd.status = success ? 'completed' : 'failed';
            cmd.result = result;
        }

        // Broadcast command result to React frontend
        io.emit('command-result', {
            command_id: id,
            success: success,
            result: result,
            timestamp: timestamp
        });

        res.json({ success: true });
    });

    // ===== REACT FRONTEND API ENDPOINTS =====
    // These queue commands for Flask to pick up

    // Turn pump ON
    router.post('/pump/on', (req, res) => {
        const commandId = queueCommand('pump_on', {});
        res.json({
            success: true,
            command_id: commandId,
            message: 'Command queued'
        });
    });

    // Turn pump OFF
    router.post('/pump/off', (req, res) => {
        const commandId = queueCommand('pump_off', {});
        res.json({
            success: true,
            command_id: commandId,
            message: 'Command queued'
        });
    });

    // Emergency stop
    router.post('/pump/emergency', (req, res) => {
        const commandId = queueCommand('emergency_stop', {});
        res.json({
            success: true,
            command_id: commandId,
            message: 'Emergency stop queued'
        });
    });

    // Add schedule
    router.post('/schedule', (req, res) => {
        const { hour, minute, duration, days } = req.body;
        const commandId = queueCommand('add_schedule', {
            hour,
            minute,
            duration,
            days
        });
        res.json({
            success: true,
            command_id: commandId,
            message: 'Schedule creation queued'
        });
    });

    // Delete schedule
    router.delete('/schedule/:id', (req, res) => {
        const commandId = queueCommand('delete_schedule', {
            schedule_id: req.params.id
        });
        res.json({
            success: true,
            command_id: commandId,
            message: 'Schedule deletion queued'
        });
    });

    // Toggle schedule
    router.post('/schedule/:id/toggle', (req, res) => {
        const { enabled } = req.body;
        const commandId = queueCommand('toggle_schedule', {
            schedule_id: req.params.id,
            enabled
        });
        res.json({
            success: true,
            command_id: commandId,
            message: 'Schedule toggle queued'
        });
    });

    // Get command status
    router.get('/command/:id/status', (req, res) => {
        const cmd = commandQueue.find(c => c.id === req.params.id);
        if (!cmd) {
            return res.status(404).json({ error: 'Command not found' });
        }
        res.json({
            id: cmd.id,
            status: cmd.status,
            result: cmd.result,
            timestamp: cmd.timestamp
        });
    });

    // Get current status (cached - from last webhook update)
    router.get('/status', (req, res) => {
        res.json({
            success: true,
            device_online: deviceStatus.lastSeen !== null,
            last_seen: deviceStatus.lastSeen,
            pump: deviceStatus.pump,
            schedules: deviceStatus.schedules,
            next_run: deviceStatus.next_run,
            system: deviceStatus.system
        });
    });

    return router;
}

