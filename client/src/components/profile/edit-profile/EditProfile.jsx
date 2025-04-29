import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditProfile, useDeleteProfile } from "../../../api/authApi";
import useAuth from "../../../hooks/useAuth";
import { Button } from "antd"
import { UserDeleteOutlined } from "@ant-design/icons"
import './EditProfile.css'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const [isEditMode, setEditMode] = useState(false);
    let navigate = useNavigate();
    const { email, username, userLoginHandler, userLogoutHandler } = useAuth();
    const { editProfile} = useEditProfile();
    const { deleteProfile } = useDeleteProfile();
    const [isSavePending, setIsSavePending] = useState(false);
    const { register, handleSubmit, formState: { errors },} = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    });

    function getEmailPref() {
        const emailPrefixLength = import.meta.env.VITE_EMAIL_PREFIX_LENGTH;
        const emailPref = emailPrefixLength === null ? 1 : emailPrefixLength;
        
        return emailPref;
    }

    const handleSaveProfile = async (data) => {

        const { username, email} = data;
        try {
            setIsSavePending(true);
            const authData = await editProfile(username, email);
            setIsSavePending(false);
            userLoginHandler(authData);
            toggleEditMode();
        } catch (error) {
            setIsSavePending(false);
        }
    }
    const toggleEditMode = () => {
        setEditMode( state=> !state);
    }
    
    const handleDelete = async ()=>{
        try {
            await deleteProfile();
            await userLogoutHandler();
        } catch (error){
            toast.warn("Error deleting profile!")
        }
    }
    return (
        <section className="profile-hero">
            <div className="container">
                <h2>User Profile</h2>
                {/* <!-- Readonly mode--> */}
                { !isEditMode
                    ?
                    <>
                        <div className="flex-prof">
                            <p>Username: </p>
                            <p>{username}</p>
                        </div>
                        <div className="flex-prof">
                            <p>Email: </p>
                            <p>{email}</p>
                        </div>
                        <div>
                            <button className="edit-button" onClick={toggleEditMode}>Edit</button>
                        </div>
                    </>
                : 
                <>
                    <form  action={handleSubmit(handleSaveProfile)}>
                        <div className="flex-prof">
                            <p>Username: </p>
                            <input
                            className={ errors.username ? 'input-error': ''} 
                            type="text" 
                            name="username" 
                            id="username"
                            defaultValue={username}
                            {...register('username',{
                                required: 'Username is required!',
                                minLength: {
                                    value: 5,
                                    message: 'Username must be at least 5 characters!'
                                }
                            })} />
                        </div>
                        { errors.username && 
                            <div>
                                    <p className="edit-prof-error">
                                        {errors.username.message}
                                    </p>
                            </div>
                        }
                        <div className="flex-prof">
                            <p>Email: </p>
                            <input
                            className={ errors.email ? 'input-error': ''}
                            {...register('email',{
                                required: 'Email is required!',
                                pattern: { 
                                    value: RegExp(`[_a-z0-9\\.]{${getEmailPref()},}@[a-z0-9_]+\\.[a-z0-9_]+`),
                                    message: 'Email is not valid!'
                                }
                            })}
                            defaultValue={email}
                            type="email" 
                            name="email" 
                            id="email" />
                        </div>
                        { errors.email && 
                            <div>
                                    <p className="edit-prof-error">
                                        {errors.email.message}
                                    </p>
                            </div>
                        }
                        <div>
                            <button className="cancel-button" onClick={toggleEditMode}>Cancel</button>
                            <button className="save-button" 
                            disabled={isSavePending} 
                            style={ {
                                marginLeft: '50px',
                                backgroundColor: isSavePending ? 'grey':'#5cb85c',
                                borderColor: isSavePending ? 'grey': '#5cb85c'
                            } }>Save</button>
                        </div>
                    </form>
                </>
                }
            </div>
            <Button onClick={handleDelete} type="primary" size="large" danger icon={<UserDeleteOutlined /> }>Delete My Account</Button>
        </section>
    );
}