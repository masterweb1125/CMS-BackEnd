  import {Router} from 'express'
import { GetAllAgencies } from '../controller/agency.controller.js';


 const agencyRoute = Router();
 agencyRoute.get('/',GetAllAgencies)

 export default agencyRoute;