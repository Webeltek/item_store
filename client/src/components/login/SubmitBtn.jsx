import { useFormStatus } from "react-dom"


export default function SubmitBtn() {
    const { pending} = useFormStatus();
    return (
        <button disabled={pending} className="btn">Login</button>
    );
}