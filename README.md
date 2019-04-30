## Family Tree

Run `npm install` or `yarn install` to install the dependencies.

In the project directory, you can run:

`npm start` to run the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The API can be set up using https://github.com/kensplanet/family-tree-api<br>
To make network calls against the API, go to `src/actions/apis/api.js` and uncomment the `baseURL`

### Technologies 
* **React** - building User interfaces
* **Redux** - State management
* **D3** - generating SVG tree images
* **Material UI** - Responsives components and layouts
* **Axios** - To make REST calls to the API
* **Font Awesome** - Icons
* **Jquery** - Javascript helper utilities and DOM manipulation
* **Lodash** - Javascript helper utilities

### Databases
* The database can be accessed @ [localhost:8080/h2-console](localhost:8080/h2-console) with the below credentials,
  * JDBC URL: jdbc:h2:mem:test-db;MODE=DB2;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
  * User Name: sa
  * Password: (blank)
