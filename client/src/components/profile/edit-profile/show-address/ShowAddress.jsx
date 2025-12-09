import { Button, Fieldset, Group, Stack, useMantineTheme } from "@mantine/core";

export default function ShowAddress({
    savedAddress,
    toggleEditAddress
}) {
    const theme = useMantineTheme();
        return(
        <>
            <Fieldset styles={{
                            legend: { color: theme.colors['ocean-blue'][5]},
                            root: { borderColor: theme.colors['ocean-blue'][5]}
                        }} m="sm" legend="Address information">
                <Stack gap="lg">
                    <Group justify="space-between">
                        <span>Street address: </span>
                        <span>{savedAddress.streetAddress || ''}</span>
                    </Group>
                    <Group justify="space-between">
                        <span>Postal code: </span>
                        <span>{savedAddress.postalCode || ''}</span>
                    </Group>
                    <Group justify="space-between">
                        <span>City: </span>
                        <span>{savedAddress.city || ''}</span>
                    </Group>
                    <Button style={{ alignSelf: 'center'}} onClick={toggleEditAddress}>Edit</Button>
                </Stack>
            </Fieldset>
        </>
        )
}