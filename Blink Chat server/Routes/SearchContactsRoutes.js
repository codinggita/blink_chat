import { Router } from "express";

import { searchContacts } from "../controllers/SearchContacts.js"; // import the function from SearchContact.js file

const contactRoute = Router(); // Initialize a new router instance

contactRoute.post('/searchContacts', searchContacts) // create a post request that calls the searchContacts function

export default contactRoute;
