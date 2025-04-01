import { useRef, useState } from "react";

export const useLoginValidation = (initialErrors = { 
    email: '', 
    password: '', 
}
) => {
        const [errors, setErrors] = useState(initialErrors);

        // Validation function
        const validateField = (name, value) => {
            const emailPrefixLength = import.meta.env.VITE_EMAIL_PREFIX_LENGTH;
            const emailPref = emailPrefixLength === null ? 1 : emailPrefixLength;
            let error = '';
            
            if (!value) {
                error = `${name} is required!`;
            } else if( 
            (name === 'username' || name === 'password') && value.length < 5){
                error = `${name} must be at least 5 characters!`  
            } else if(
                (name === 'username' || name === 'password') && !/^[a-zA-Z0-9\s]+$/.test(value)
            ){
                error = `${name} must contain only latin letters and digits!`
            } else if (
                name === 'email' 
                && !RegExp(`[_a-z0-9\\.]{${emailPref},}@[a-z0-9_]+\\.[a-z0-9_]+`).test(value)
            ) {
                error = 'Invalid email address';
            }
            
            setErrors((prev) => ({ ...prev, [name]: error }));
        }; 
        
        
        //Validate on blur
        const handleBlur = (e) => {
            // in case of uncontrolled form
            const { name, value } = e.target;


            validateField(name, value);
        };

        return { errors, handleBlur, validateField };
    }
