import { Button, Fieldset, Group, isNumberLike, TextInput, useMantineTheme } from "@mantine/core";
import { hasLength, useForm } from '@mantine/form'
import { useState } from "react";

export default function EditAddress({ 
    address, 
    toggleEditAddress, 
    isSaveAddressPending,
    handleSaveAddress }){
    const theme = useMantineTheme();
    const [initializeFields, setInitializeFields] = useState(false);
    const combineValidators = (...validators)=>{
        return ( value) =>{
            for ( const validate of validators){
                const error = validate(value);
                if (error) return error;
            }
            return null;
        }
    }
    const form = useForm({
            mode: 'controlled',
            initialValues: {
                streetAddress: address ? address.streetAddress : '',
                postalCode: address ? address.postalCode : '' ,
                city : address ? address.city : ''
            },
            validate: {
                streetAddress: combineValidators(
                    hasLength({ min: 3}, 'Street address must be at least 3 characters!'),
                    (value)=> (RegExp(`^(?=.*\\d).+$`).test(value) ? null: 'Street address must contain number!' )
                ),
                postalCode: (value) =>
                    /^\d+$/.test(value) ? null : 'Postal code must contain only digits',
                city: hasLength({ min: 3}, 'City must be at least 3 characters!')
                
            }
    })

    const cancelHandler = ()=>{
        if ( !address){
            setInitializeFields(false);
            return;
        }
        toggleEditAddress();
    }


    return (
        <form onSubmit={form.onSubmit(handleSaveAddress)}>
        <Fieldset styles={{
                legend: { color: theme.colors['ocean-blue'][5]},
                root: { borderColor: theme.colors['ocean-blue'][5]}
            }} m="sm" variant='filled' legend="Address information" >
            { ( !address && !initializeFields) ?  
            <Button variant='outline' onClick={()=> setInitializeFields(true)}>Add address</Button>
            :
            <>
            <TextInput {...form.getInputProps('streetAddress')}  label="Street" placeholder="Street address" /> 
            <TextInput {...form.getInputProps('postalCode')}  label="Postal code" placeholder="Postal code" />
            <TextInput {...form.getInputProps('city')}  label="City" placeholder="City" /> 
            </>
            }    
        </Fieldset>
        { ( address || initializeFields) &&
        <Group m="sm" justify="flex-end">
            <Button variant='outline' onClick={cancelHandler}>Cancel</Button>
            <Button disabled={isSaveAddressPending} type="submit">Save</Button>
        </Group>
        }
        </form>
    )
}