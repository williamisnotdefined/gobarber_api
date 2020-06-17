import { EntityRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointments from '@modules/appointments/repositories/IAppointmentsRepository';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>
    implements IAppointments {
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const appointment = await this.findOne({
            where: { date }
        });

        return appointment;
    }
}

export default AppointmentsRepository;
