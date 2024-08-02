  import {Router} from 'express'
import {getAgencyDashboardAnalytics, GetAllAgencies, GetAllAgencyInfoWithAgencyId } from '../controller/agency.controller.js';


 const agencyRoute = Router();
 agencyRoute.get('/',GetAllAgencies)
 agencyRoute.get('/analytics/:agencyId',getAgencyDashboardAnalytics)
 agencyRoute.post('/:id',GetAllAgencyInfoWithAgencyId)
 

 export default agencyRoute;