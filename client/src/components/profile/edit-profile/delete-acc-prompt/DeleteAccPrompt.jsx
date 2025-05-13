import { useEffect, useState } from 'react';
import { Modal, Button, TextInput, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

function DeleteAccPrompt({
    confirmHandler,
    email,
    opened,
    setOpened
}) {

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            email: ''
        },
        validate: {
            email: (value) => (value ===  email ?  null : 'Wrong email! Please try again!')
        }
    })
    return (
      <>
        <Modal centered="true" opened={opened} onClose={()=> setOpened(false)} title="Enter account email">
          <form onSubmit={form.onSubmit(confirmHandler)}>
            <TextInput
                placeholder="Your email"
                {...form.getInputProps('email')}
            />
            <Group justify='space-between' mt="md">
            <Button onClick={()=>setOpened(false)} variant='outline' color="green.3" >Cancel</Button>
            <Button type='submit' color='pink'  >
                Confirm deleting account
            </Button>
            </Group>
          </form>
        </Modal>
  
      </>
    );
  }

export default DeleteAccPrompt;