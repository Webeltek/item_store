function errorHandler(err, req, res, next) {
    //console.log({errHandlerErr: err});
    
    if (err.status === 333) {
        res.status(333)
            .json({ message: 'ErrorHandler: not allowed!' })
    } else if( err.status === 404){
        res.status(404).json( { message: 'Not found'})
    } else {
        console.error(err.stack)
        // console.log(err)
        res.status(500)
            .json({ message: 'ErrorHandler: Something went wrong!', err })
    }
}

module.exports = errorHandler;
