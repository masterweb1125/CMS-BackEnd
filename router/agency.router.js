  import {Router} from 'express'
import {getAgencyDashboardAnalytics, GetAllAgencies } from '../controller/agency.controller.js';


 const agencyRoute = Router();
 agencyRoute.get('/',GetAllAgencies)
 agencyRoute.get('/analytics/:agencyId',getAgencyDashboardAnalytics)


 export default agencyRoute;