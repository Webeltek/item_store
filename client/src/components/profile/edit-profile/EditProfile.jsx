import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditProfile, useDeleteProfile } from "../../../api/authApi";
import useAuth from "../../../hooks/useAuth";
import { UserDeleteOutlined } from "@ant-design/icons"
import classes from './EditProfile.module.css'
import { toast } from "react-toastify";
import EditUser from "./edit-user/EditUser";
import { Box, Button, Container, Fieldset, Stack, Title } from "@mantine/core";
import ShowUser from "./show-user/ShowUser";
import DeleteAccPrompt from "./delete-acc-prompt/DeleteAccPrompt";
import { useDisclosure } from "@mantine/hooks";
import EditAddress from "./edit-address/EditAddress";
import { useSelector } from 'react-redux'
import ShowAddress from "./show-address/ShowAddress";

export default function EditProfile() {
    const [isEditMode, setEditMode] = useState(false);
    const [isAddressEditMode, setAddressEditMode] = useState(false);
    const { email, username, userLoginHandler, userLogoutHandler } = useAuth();
    const address = useSelector( state => state.user.address);
        
    const { editProfile} = useEditProfile();
    const { deleteProfile } = useDeleteProfile();
    const [isSavePending, setIsSavePending] = useState(false);
    const [isSaveAddressPending, setIsSaveAddressPending] = useState(false);
    const [opened, setOpened] = useState();


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
    const handleSaveAddress = async (addressData) =>{
        const { streetAddress, postalCode, city } = addressData;
        try {
            //setIsSaveAddressPending(true);
            const savedAddress = ''
            toggleAddressEditMode();
        } catch (error) {
            setIsSaveAddressPending(false);
        }
    }

    const toggleEditMode = () => {
        setEditMode( state=> !state);
    }

    const toggleAddressEditMode = () => {
        setAddressEditMode( state => !state)
    }
    
    const handleDelete = async ()=>{
        setOpened(false)
        try {
            await deleteProfile();
            await userLogoutHandler();
        } catch (error){
            toast.warn("Error deleting profile!")
        }
    }
    return (
        <Stack className={classes.editProfStack}>
            <Title c="gray.7" ta="center" order={2}>User Profile</Title>
            {/* <!-- Readonly mode--> */}
            { !isEditMode ?
            <ShowUser username={username} email={email} toggleEditMode={toggleEditMode} />    
            : 
            <EditUser savedUsername={username} savedEmail={email} 
            handleSaveProfile={handleSaveProfile}
            toggleEditMode={toggleEditMode}
            isSavePending={isSavePending} />
            }
            { (address && !isAddressEditMode) ?
            <ShowAddress toggleEditAddress={toggleAddressEditMode} savedAddress={address} />
            :
            <EditAddress
             isSaveAddressPending={isSaveAddressPending} 
             toggleEditAddress={toggleAddressEditMode} 
             address={address}
             handleSaveAddress={handleSaveAddress} />    
            }    
            <Fieldset m="sm" variant='filled' legend="Danger zone"
            classNames={{
                legend: classes.dangerSoneLegend,
                root: classes.dangerSoneBorder
            }}>
                <Button m="0 auto" display="block"
                className={classes.deleteAccBtn} 
                onClick={()=>setOpened(true)} 
                variant="filled" 
                size="md"
                color="pink"
                leftSection={<UserDeleteOutlined /> }>Delete My Account</Button>
            </Fieldset>
            <DeleteAccPrompt email={email} 
            opened={opened} setOpened={setOpened}
            confirmHandler={handleDelete} />    
        </Stack>
    );
}