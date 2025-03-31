import './ErrorMsg.css'
export default function ErrorMsg({
    errorMsg
}) {
    
    return (
        <>
        { errorMsg && (
            <p className="notification error-message">{errorMsg}</p>
        )}
        </>
    );
}