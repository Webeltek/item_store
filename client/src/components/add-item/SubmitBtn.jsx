import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
    const { pending } = useFormStatus();
    return (
        <button  
        className="btn"
        disabled={pending}
        style={ {backgroundColor: pending ? 'grey':'#0073e6' }}>Create Product</button>
    );
}