import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditProfile, useDeleteProfile } from "../../../api/authApi";
import useAuth from "../../../hooks/useAuth";
import { UserDeleteOutlined } from "@ant-design/icons"
import classes from './EditProfile.module.css'
import { toast } from "react-toastify";
import { Box, Button, Container, Fieldset, Stack, Title } from "@mantine/core";
import ShowUser from "./show-user/ShowUser";
import DeleteAccPrompt from "./delete-acc-prompt/DeleteAccPrompt";
import { useDisclosure } from "@mantine/hooks";
import EditAddress from "./edit-address/EditAddress";
import { useSelector } from 'react-redux'
import ShowAddress from "./show-address/ShowAddress";

export default function EditProfile() {
    const [isAddressEditMode, setAddressEditMode] = useState(false);
    const { email, username, userLoginHandler, userLogoutHandler } = useAuth();
    const address = useSelector( state => state.user.address);
        
    const { editProfile} = useEditProfile();
    const { deleteProfile } = useDeleteProfile();
    const [isSavePending, setIsSavePending] = useState(false);
    const [isSaveAddressPending, setIsSaveAddressPending] = useState(false);
    const [opened, setOpened] = useState();


    const handleSaveProfile = async (data) => {

        const { username, email, password, newPassword } = data;
        try {
            setIsSavePending(true);
            const userData = await editProfile({ username, email, password, newPassword});
            setIsSavePending(false);
            userLoginHandler(userData);
        } catch (error) {
            setIsSavePending(false);
        }
    }
    const handleSaveAddress = async (addressData) =>{
        const { streetAddress, postalCode, city } = addressData;
        try {
            setIsSaveAddressPending(true);
            const userData = await editProfile({ address: { streetAddress, postalCode, city } });
            setIsSaveAddressPending(false);
            userLoginHandler(userData);
            toggleAddressEditMode();
        } catch (error) {
            setIsSaveAddressPending(false);
        }
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
        <section className="flex-col shadow-xl rounded-xl w-[35rem] my-8 mx-[calc((100%-35rem)/2)] p-4 bg-white">
            <Title c="gray.5" ta="center" order={2}>My account</Title>
            <ShowUser savedUsername={username} savedEmail={email} 
            handleSaveProfile={handleSaveProfile}
            isSavePending={isSavePending}  />    
            
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
        </section>
    );
}