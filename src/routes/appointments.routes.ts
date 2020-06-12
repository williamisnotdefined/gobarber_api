import { Router, Request, Response } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointment from '../services/CreateAppointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request: Request, response: Response) => {
    const appointments = appointmentsRepository.findAll();
    return response.json(appointments);
});

appointmentsRouter.post('/', (request: Request, response: Response) => {
    try {
        const { provider, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointment(appointmentsRepository);

        const appointment = createAppointment.execute({
            date: parsedDate,
            provider
        });

        return response.json(appointment);
    } catch (error) {
        return response.status(400).json({ message: error.message });
    }
});

export default appointmentsRouter;
