import { Button, Fieldset, Group, TextInput, useMantineTheme } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form'

export default function EditUser({
    savedEmail,
    savedUsername,
    handleSaveProfile,
    isSavePending,
    toggleEditMode
}) {
    const theme = useMantineTheme();

    function getEmailPref() {
        const emailPrefixLength = import.meta.env.VITE_EMAIL_PREFIX_LENGTH;
        const emailPref = emailPrefixLength === null ? 1 : emailPrefixLength;
        
        return emailPref;
    }

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            username: savedUsername,
            email: savedEmail
        },
        validate: {
            username: hasLength({ min: 5}, 'Username must be at least 5 characters!'),
            email: (value)=> 
                (RegExp(`[_a-z0-9\\.]{${getEmailPref()},}@[a-z0-9_]+\\.[a-z0-9_]+`).test(value) ? null: 'Email is not valid!' )
        }
    })

    return (
        <form onSubmit={form.onSubmit(handleSaveProfile)}>
            <Fieldset styles={{
                legend: { color: theme.colors['ocean-blue'][5]},
                root: { borderColor: theme.colors['ocean-blue'][5]}
            }} m="sm" variant='filled' legend="Personal information">
                <TextInput {...form.getInputProps('username')} label="Your name" placeholder="Your name" />
                <TextInput {...form.getInputProps('email')} label="Email" placeholder="Email" mt="md" />
            </Fieldset>

            <Group m="sm" justify="flex-end">
                <Button variant='outline' onClick={toggleEditMode}>Cancel</Button>
                <Button disabled={isSavePending} type="submit">Save</Button>
            </Group>
        </form>
    );
}