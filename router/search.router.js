import express from "express";
import { Search } from "../controller/search.controller.js";


const SearchRouter = express.Router();

SearchRouter.get('',Search)


export default SearchRouter