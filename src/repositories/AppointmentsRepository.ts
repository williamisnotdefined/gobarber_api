import Appointment from '../models/Appointment';
import { isEqual } from 'date-fns';

interface CreateAppointmentDTO {
    provider: string;
    date: Date;
}

class AppointmentsRepository {
    private appointments: Appointment[];

    constructor() {
        this.appointments = [];
    }

    public findByDate(date: Date): Appointment | null {
        const appointment = this.appointments.find(appointment =>
            isEqual(appointment.date, date)
        );

        return appointment || null;
    }

    public create({ provider, date }: CreateAppointmentDTO): Appointment {
        const appointment = new Appointment({ provider, date });
        this.appointments.push(appointment);

        return appointment;
    }

    public findAll(): Appointment[] {
        return this.appointments;
    }
}

export default AppointmentsRepository;
