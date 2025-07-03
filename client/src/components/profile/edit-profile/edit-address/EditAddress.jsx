import { Button, Fieldset, TextInput, useMantineTheme } from "@mantine/core";
import { useSelector } from 'react-redux'
import { hasLength, useForm } from '@mantine/form'

export default function EditAddress(){
    const theme = useMantineTheme();
    const user = useSelector( state => state.user);
    const {
        address: {
            streetAddress = undefined,
            postalCode    = undefined,
            city          = undefined,
        } = {},             // <‑‑ default for address
    } = user ?? {};
    console.log({user})

    const form = useForm({
            mode: 'controlled',
            initialValues: {
                streetAddress,
                postalCode ,
                city 
            },
            validate: {
                streetAddress: hasLength({ min: 3}, 'Street address must be at least 3 characters!'),
                email: (value)=> 
                    (RegExp(`^(?=.*\\d).+$`).test(value) ? null: 'Street address must contain number!' )
            }
    })

    return (
        <Fieldset styles={{
                legend: { color: theme.colors['ocean-blue'][5]},
                root: { borderColor: theme.colors['ocean-blue'][5]}
            }} m="sm" variant='filled' legend="Address" >
            { !user ?  
            <Button variant='outline' onClick={()=>{}}>Add address</Button>
            :
            <TextInput {...form.getInputProps('streetAddress')}  label="Street" placeholder="Street address" /> 
            }    
        </Fieldset>
    )
}