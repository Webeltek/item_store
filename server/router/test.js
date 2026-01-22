import express from 'express';
import * as utils from '../utils/index.js';

const router = express.Router();

// middleware that is specific to this router

const data = {
    "name": "rest-api",
    "version": "1.0.0",
    "description": "REST-api for back-end of Angular course workshop in SoftUni",
    "main": "index.js",
}

router.get('/', function (req, res) {

    res.send(data);
})

export default router