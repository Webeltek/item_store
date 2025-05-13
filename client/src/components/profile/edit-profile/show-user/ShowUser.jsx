import { Button, Fieldset, Group, Paper, Stack, Text, useMantineTheme } from "@mantine/core";

export default function ShowUser({
    username,
    email,
    toggleEditMode
}){
    const theme = useMantineTheme();
    return(
    <>
        <Fieldset styles={{
                        legend: { color: theme.colors['ocean-blue'][5]},
                        root: { borderColor: theme.colors['ocean-blue'][5]}
                    }} m="sm" variant='filled' legend="Personal information">
            <Stack gap="lg">
            <Group justify="space-between">
                <span>Username: </span>
                <span>{username}</span>
            </Group>
            <Group justify="space-between">
                <span>Email: </span>
                <span>{email}</span>
            </Group>
            <Button style={{ alignSelf: 'center'}} onClick={toggleEditMode}>Edit</Button>
            </Stack>
        </Fieldset>
    </>
    )
}