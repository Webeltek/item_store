import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
    const { pending } = useFormStatus;
    return (
        <button className="btn" disabled={pending} >Register</button>
    );
}