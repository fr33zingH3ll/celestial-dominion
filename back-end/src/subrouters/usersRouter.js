import Express from 'express';
const usersRouter = Express.Router();

import { user_request } from '../../messages_api.js'

usersRouter.get('/', user_request.get_all_users.bind(this));
usersRouter.get('/:id', user_request.get_user_by_id.bind(this));

export { usersRouter };