import { useEffect, useState } from 'react';
import { Modal, Button, TextInput } from '@mantine/core';

function EmailPrompt({
    isOpen,
    confirmHandler
}) {
    const [value, setValue] = useState('');
  
    return (
      <>
        <Modal centered="true" opened={isOpen} onClose={() => {}} title="Enter your name">
          <TextInput
            placeholder="Your name"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Button fullWidth mt="md" onClick={()=> confirmHandler(value)}>
            Confirm
          </Button>
        </Modal>
  
      </>
    );
  }

export default EmailPrompt;