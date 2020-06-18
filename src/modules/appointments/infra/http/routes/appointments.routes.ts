import { Router } from 'express';

import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentController = new AppointmentsController();

appointmentsRouter.use(isAuthenticated);

// appointmentsRouter.get('/', async (request: Request, response: Response) => {
//     const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentController.create);

export default appointmentsRouter;
