import { Request, Response } from 'express';
import { User } from '@models';
import { ResponseUtils } from '@utils';

const register = async (request: Request, response: Response) => {
    try {
        // Get data from body:
        const data = request.body;

        // Create user instance:
        const user = new User(data);

        // Run create function:
        const createdUser = await user.create();

        // Get public details for response:
        const responseBody = createdUser.getPublicData();

        // Send response:
        ResponseUtils.created(response, responseBody, 'User created successfully');
    } catch (error: any) {
        // Send catched error message:
        ResponseUtils.badRequest(response, error?.message || 'Unknown error');
    }
}

export default {
    register,
};
