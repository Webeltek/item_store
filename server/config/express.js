import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

const cookieSecret = process.env.COOKIESECRET || 'SoftUni';

export default (app) => {
    app.use(express.json());

    app.use(cookieParser(cookieSecret));

    //app.use(express.static(path.resolve(global.__basedir, 'static')));

    // app.use(errorHandler(err, req, res, next));
};
