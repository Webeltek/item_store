import { Button, Group, PasswordInput, Stack, Text, TextInput, ThemeIcon, useMantineTheme } from "@mantine/core";
import { useContext, useState } from "react";
import { IconDeviceFloppy, IconKey, IconMail, IconPencilPlus, IconUserPlus } from "@tabler/icons-react";
import { hasLength, useForm } from '@mantine/form'
import { UserContext } from "../../../../contexts/UserContext";

export default function EvershopAdmin({
    handleSaveProfile,
}){
    const { showErrorMsg } = useContext(UserContext);
    const [isAdminLoginPending, setIsAdminLoginPending] = useState(false);
    const emailPrefixLength = import.meta.env.VITE_EMAIL_PREFIX_LENGTH ?? 1;
    

    const form = useForm({
            mode: 'controlled',
            initialValues: {
                email: "admin@admin.com",
                password: "hamambair14"
            },
            validate: {
                email: (value)=> 
                    (RegExp(`[_a-z0-9\\.]{${emailPrefixLength},}@[a-z0-9_]+\\.[a-z0-9_]+`).test(value) ? null: 'Email is not valid!' ),
                password: (value) => {
                    if( value.length < 5){
                        return 'Password must be at least 5 characters!'
                    }
                    if( !/^[a-zA-Z0-9\s]+$/.test(value)){
                        return 'Password must contain only latin letters and digits!'
                    }
                    return null;
                }
            }
        });



    const handleAdminLogin = async (data) => {

        const { email, password } = data;
        try {
            setIsAdminLoginPending(true);
            const userData = await evershopAdminLogin({ email, password});
            setIsAdminLoginPending(false);
        } catch (error) {
            setIsAdminLoginPending(false);
            showErrorMsg(error.message);
        }
    }

    async function evershopAdminLogin({ email, password }) {
        const res = await fetch('http://localhost:3000/admin/user/login', {
            method: 'POST',
            credentials: 'include', // IMPORTANT: send/receive cookies
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err || 'Login failed');
        }
        // Server sets cookie; you can also GET current-user to confirm
            return res.json(); // e.g., { success: true } or user info
    }
        
    return(
    <>
        <form onSubmit={form.onSubmit(async (values) => {
            try { await handleAdminLogin(values) }
            catch (error){ if (error.message == "Wrong password!"){
                form.setErrors({ password: "Wrong password!" });
            } }
            setIsAdminLoginPending(false);
            })
            } className="flex flex-col mx-8">
            <TextInput  label="Email:"
            leftSection={<IconMail />} 
            {...form.getInputProps('email')}
            />
            <PasswordInput  variant="default"  
                label={ "Password:"} 
                leftSection={<IconKey />}
                {...form.getInputProps('password')}  
            />
            <Button variant="transparent" className="my-2" style={{ alignSelf: "flex-end"}}
            type="submit" disabled={isAdminLoginPending} leftSection= {<IconPencilPlus size={24} />} 
            >Evershop Admin Login</Button>
                
        </form>
    </>
    )
}