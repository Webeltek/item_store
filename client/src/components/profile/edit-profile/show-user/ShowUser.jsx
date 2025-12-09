import { Button, Group, PasswordInput, Stack, Text, TextInput, ThemeIcon, useMantineTheme } from "@mantine/core";
import { useContext, useState } from "react";
import { IconDeviceFloppy, IconKey, IconMail, IconPencilPlus, IconUserPlus } from "@tabler/icons-react";
import { hasLength, useForm } from '@mantine/form'
import { UserContext } from "../../../../contexts/UserContext";

export default function ShowUser({
    savedUsername,
    savedEmail,
    handleSaveProfile,
    isSavePending,
}){
    const [isEditInfo, setEditInfo] = useState(false);
    const [isEditPass, setEditPass] = useState(false);
    const emailPrefixLength = import.meta.env.VITE_EMAIL_PREFIX_LENGTH ?? 1;
    const { isFirebaseUser } = useContext(UserContext);
    

    const form = useForm({
            mode: 'controlled',
            initialValues: {
                username: savedUsername,
                email: savedEmail,
                password: "",
                newPassword: "",
                confirmNewPassword: ""
            },
            validate: {
                username: hasLength({ min: 5}, 'Username must be at least 5 characters!'),
                email: (value)=> 
                    (RegExp(`[_a-z0-9\\.]{${emailPrefixLength},}@[a-z0-9_]+\\.[a-z0-9_]+`).test(value) ? null: 'Email is not valid!' ),
                password: (value) => {
                    if(isEditPass && !isFirebaseUser && value.length < 5){
                        return 'Password must be at least 5 characters!'
                    }
                    if(isEditPass && !isFirebaseUser && !/^[a-zA-Z0-9\s]+$/.test(value)){
                        return 'Password must contain only latin letters and digits!'
                    }
                    return null;
                },
                newPassword: (value) => {
                    if(isEditPass && value.length < 5){
                        return 'Password must be at least 5 characters!'
                    }
                    if(isEditPass && !/^[a-zA-Z0-9\s]+$/.test(value)){
                        return 'Password must contain only latin letters and digits!'
                    }
                    return null;
                },
                confirmNewPassword: (value, vaues)=>(
                    (isEditPass && value !== vaues.newPassword) ?
                    'Passwords do not match!' : null)
                    
                    
            }
        })
    return(
    <>
        <form onSubmit={form.onSubmit(async (values) => {
            try { await handleSaveProfile(values) }
            catch (error){ if (error.message == "Wrong password!"){
                form.setErrors({ password: "Wrong password!" });
            } }
            setEditInfo(false);
            })
            } className="flex flex-col mx-8">
            <TextInput disabled={!isEditInfo} variant="default"  label="Username:" 
            placeholder={savedUsername} leftSection={<IconUserPlus />}
            {...form.getInputProps('username')}  
             />
            <TextInput disabled={!isEditInfo} label="Email:" placeholder={savedEmail}
            leftSection={<IconMail />} 
            {...form.getInputProps('email')}
            />
            { !isEditInfo  ? 
            <Button variant="transparent" className="my-2" style={{ alignSelf: "flex-end"}}
            onClick={() => setEditInfo( state => !state)} leftSection= {<IconPencilPlus size={24} />} 
            >Edit</Button>
            :
            <div className="flex justify-between">
                <Button variant="transparent" className="my-2" 
                disabled={isSavePending} onClick={()=> {
                    setEditInfo( state => !state)
                    form.setValues({ username: savedUsername, email: savedEmail })
                    }
                }
                >Cancel</Button>
                <Button variant="transparent" className="my-2" 
                disabled={isSavePending} type="submit"
                leftSection={<IconDeviceFloppy size={24} />}
                >Save</Button>
            </div>
            }
            { 
            (isFirebaseUser && isEditPass) ? null :
                <PasswordInput disabled={!isEditPass} variant="default"  
                label={ isEditPass ? "Current password:": "Password:"} 
                leftSection={<IconKey />}
                {...form.getInputProps('password')}  
                />
            }
            { !isEditPass  ? 
                <Button variant="transparent" className="my-2" style={{ alignSelf: "flex-end"}}
                onClick={() => setEditPass( state => !state)}  
                >Change password</Button>
                :
                <>
                    <PasswordInput disabled={!isEditPass} variant="default"  
                    label="New password:" 
                    leftSection={<IconKey />}
                    {...form.getInputProps('newPassword')}
                    />
                    <PasswordInput disabled={!isEditPass} variant="default"  
                    label="Confirm new password:" 
                    leftSection={<IconKey />}
                    {...form.getInputProps('confirmNewPassword')}
                    />
                    <div className="flex justify-between">
                        <Button variant="transparent" className="my-2" 
                        disabled={isSavePending} onClick={()=> {
                            setEditPass( state => !state)
                            form.setValues({ username: savedUsername, email: savedEmail })
                            }
                        }
                        >Cancel</Button>
                        <Button variant="transparent" className="my-2" 
                        disabled={isSavePending} type="submit"
                        leftSection={<IconDeviceFloppy size={24} />}
                        >Save</Button>
                    </div>
                </>    
            } 
        </form>
    </>
    )
}