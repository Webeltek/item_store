### Installation

1. run npm install inside client folder
2. run npm install inside server folder
3. mongo database server must be installed and running on localhost:27017 (with default configuration - no access control)
    - mongo db connection string is inside server/config/config.js ( dbURL: 'mongodb://127.0.0.1:27017/phonestore' )
4. run npm start inside server folder
 - express rest api server is accepting requests on port 3100 in development mode with address http://localhost:3100/api