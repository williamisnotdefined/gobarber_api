import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
    public async update(
        request: Request,
        response: Response
    ): Promise<Response> {
        const avatarService = container.resolve(UpdateUserAvatarService);
        const user = await avatarService.execute({
            userId: request.userId,
            avatarFilename: request.file.filename
        });

        return response.json(user);
    }
}
