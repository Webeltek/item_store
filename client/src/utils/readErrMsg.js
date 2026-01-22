export function readErrorMessage(message){
    if(message === 'jwt expired'){
        return "Session expired, please login again!"
    } else if (
        message === 'invalid token'
        || message === 'blacklisted token'
        || message === 'jwt must be provided'
        || message === 'jwt malformed'
        || message === 'invalid signature'
    ){
        return 'Invalid session, please login again!'
    } else if ( message === 'Failed to fetch') {
        return 'Server disconnected!'
    } else if (message === '[Network] Unauthorized'){
        // graphql unauthorized error
        return 'Session expired, please login again!';
    }
    
    return message;
}