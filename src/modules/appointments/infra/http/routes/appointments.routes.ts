import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';

import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.use(isAuthenticated);

appointmentsRouter.get('/', async (request: Request, response: Response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request: Request, response: Response) => {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id
    });

    return response.json(appointment);
});

export default appointmentsRouter;
