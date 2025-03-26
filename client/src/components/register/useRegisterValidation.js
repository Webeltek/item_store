import { useRef, useState } from "react";

export const useRegisterValidation = (initialErrors = { 
    username: '', 
    email: '', 
    password: '', 
    rePassword: ''}) => {
        const [values, setValues] = useState({
            username: '',
            email: '',
            password: '',
            rePassword: ''
        });
        const [errors, setErrors] = useState(initialErrors);
    
        // in case of uncontrolled form
        const usernameRef = useRef(null);
        const emailRef = useRef(null);
        const passwordRef = useRef(null);
        const rePasswordRef = useRef(null);
        const refs = {
            username: usernameRef,
            email:emailRef,
            password: passwordRef,
            rePassword: rePasswordRef 
        }

        const passRePass = {};

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
                (name === 'username' || name === 'password') && !/[a-zA-Z0-9]+/.test(value)
            ){
                error = `${name} must contain only latin letters and digits!`
            } else if (
                name === 'email' 
                && !RegExp(`[_a-z0-9\\.]{${emailPref},}@[a-z0-9_]+\\.[a-z0-9_]+`).test(value)
            ) {
                error = 'Invalid email address';
            } else if ( name === 'rePassword'){
                //in case of uncontrolled form
                // const passwordVal = passwordRef.current.value;
                // const rePasswordVal = rePasswordRef.current.value;

                if(name === 'rePassword' && value !== values.password){
                    error = 'Repeat Password does not match password!'
                }
            }
            
            setErrors((prev) => ({ ...prev, [name]: error }));
        }; 
        
        
        //Validate on blur
        const handleBlur = (e) => {
            // in case of uncontrolled form
            // const { name } = e.target;
            const { name, value } = e.target;

            // used in case of uncontrolled form
            //const value = refs[name].current?.value;

            validateField(name, value);
        };

        //returns refs in case of uncontrolled form
        return { refs, errors, setErrors, handleBlur, validateField , values, setValues};
    }
