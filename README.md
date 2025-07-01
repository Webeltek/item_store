### Installation

1. run npm install inside client folder
2. run npm install inside server folder
3. mongo database server must be installed and running on localhost:27017 (with default configuration - no access control)
    - optionally execute inside server folder "mongorestore --db itemstore db_backup/itemstore" to feed sample data with some tvs and 2 users ( pesho@abv.bg with password 12345 and gosho@abv.bg with password 12345 ) 

    - mongo db connection string is inside server/config/config.js ( dbURL: 'mongodb://127.0.0.1:27017/itemstore' )

4. run npm start inside server folder
 - express rest api server is accepting requests on port 3100 in development mode with address http://localhost:3100/api
5. npm run dev inside client folder
 - react application is configured on port 5173 ( or the next available port if another is running already) and is accessible on http://localhost:5173 

* The application has the following public views: Home, Catalog, Tv Details without buttons and post comment form , About, Login, Register.
* The private views available for registered users are: Profile, Add Tv , Edit Tv , (inside Tv details view - Edit and Delete buttons or Order button if user is not the owner of the tv and post comment form).

### Views
1. Home: 
    - in the home view are listed the last 3 added tvs from every user with details button
    which redirects to tv details and Shop Now button which redirects to Catalog view

2. Catalog:
    - shows all tvs added from all users with details button which redirects to tv details

3. About: 
    - general site info

4. Login:
    - registered users can login with email ( with validation) and password 
    ( minimum 5 characters and latin letters and digits ), all fields are required
    - if wrong username or password error message is displayed

5. Register:
    - unregistered users can register with username email and password with the same 
    validation, password and comfirm password must match
    - if user is already registered error message is displayed

6. Profile:
    - contains edit profile section , section with tvs added from the current user
    and section with tvs not owned but ordered from the current user

7. Add TV:
    - contains form with the required fields: model, screen size, price, image link
    and description. 

8. TV Details:
    - is accessible after View Details button click ( from Home, Catalog and Profile views). For logged in user it shows the order button if the current user is not the owner of the tv or edit and delete buttons if the
    current user is owner of the tv
    - contains section underneath with user comments for this tv and for logged in user - textarea to post comment from the current user for this tv.
9. Edit Tv
    - edit button click redirects to the edit tv view
    - contains form with the required fields: model, screen size, price, image link
    and description. 
    - after submit tv data is updated and the application redirects to the catalog view

* live deployment: 
    - https://item-store-wlyi.onrender.com/
    - https://tv-store-2025.web.app/
    - webeltek.org

