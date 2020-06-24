import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentServices from './CreateAppointmentService';

import AppError from '@shared/errors/AppError';

describe('Create Appointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentServices(
            fakeAppointmentsRepository
        );

        const fakeProviderId = '123';

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: fakeProviderId
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe(fakeProviderId);
    });

    it('should not be able to create two appointment in same time', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentServices(
            fakeAppointmentsRepository
        );

        const fakeProviderId = '123';

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: fakeProviderId
        });

        expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: fakeProviderId
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
