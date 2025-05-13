import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditProfile, useDeleteProfile } from "../../../api/authApi";
import useAuth from "../../../hooks/useAuth";
import { UserDeleteOutlined } from "@ant-design/icons"
import classes from './EditProfile.module.css'
import { toast } from "react-toastify";
import EditUser from "./edit-user/EditUser";
import { Box, Button, Container, Fieldset, Stack } from "@mantine/core";
import ShowUser from "./show-user/ShowUser";

export default function EditProfile() {
    const [isEditMode, setEditMode] = useState(false);
    const { email, username, userLoginHandler, userLogoutHandler } = useAuth();
    const { editProfile} = useEditProfile();
    const { deleteProfile } = useDeleteProfile();
    const [isSavePending, setIsSavePending] = useState(false);

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
        <Stack className={classes.editProfStack}>
                <h2>User Profile</h2>
                {/* <!-- Readonly mode--> */}
                { !isEditMode ?
                <ShowUser username={username} email={email} toggleEditMode={toggleEditMode} />    
                : 
                <EditUser savedUsername={username} savedEmail={email} 
                handleSaveProfile={handleSaveProfile}
                toggleEditMode={toggleEditMode}
                isSavePending={isSavePending} />
                }
            <Fieldset m="sm" variant='filled' legend="Danger zone">
                <Button
                className={classes.deleteAccBtn} 
                onClick={handleDelete} 
                variant="filled" 
                size="md"
                color="pink"
                leftSection={<UserDeleteOutlined /> }>Delete My Account</Button>
            </Fieldset>    
        </Stack>
    );
}