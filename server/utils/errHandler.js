function errorHandler(err, req, res, next) {
    //console.log({errHandlerErr: err});
    if (res.headersSent) {
    // Headers already sent — can't modify response, just log the error
    console.error('Unhandled error after response sent:', err);
    return;
    }
    
    if (err.status === 333) {
        res.status(333)
            .json({ message: 'ErrorHandler: not allowed!',err })
    } else if( err.status === 404){
        res.status(404).json( { message: 'Not found',err})
    } else {
        console.error(err.stack)
        // console.log(err)
        res.status(500)
            .json({ message: 'ErrorHandler: Something went wrong!', err })
    }
}

module.exports = errorHandler;
