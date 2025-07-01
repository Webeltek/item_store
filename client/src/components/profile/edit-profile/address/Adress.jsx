import { Button, Fieldset, useMantineTheme } from "@mantine/core";

export default function Address(){
    const theme = useMantineTheme();

    return (
        <Fieldset styles={{
                legend: { color: theme.colors['ocean-blue'][5]},
                root: { borderColor: theme.colors['ocean-blue'][5]}
            }} m="sm" variant='filled' legend="Address" >
                <Button variant='outline' onClick={()=>{}}>Add address</Button>
            </Fieldset>
    )
}