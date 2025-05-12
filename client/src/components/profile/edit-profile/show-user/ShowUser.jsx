export default function ShowUser({
    username,
    email,
    toggleEditMode
}){
    return(
    <>
        <div className="flex-prof">
            <p>Username: </p>
            <p>{username}</p>
        </div>
        <div className="flex-prof">
            <p>Email: </p>
            <p>{email}</p>
        </div>
        <div>
            <button className="edit-button" onClick={toggleEditMode}>Edit</button>
        </div>
    </>
    )
}