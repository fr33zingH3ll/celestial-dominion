import Express from 'express';
const messagesRouter = Express.Router();

import { message_request } from '../../messages_api.js'

messagesRouter.get('/', message_request.get_all_messages.bind(this));
messagesRouter.get('/:id', message_request.get_message_by_id.bind(this));
messagesRouter.post('/', message_request.new_message.bind(this));
messagesRouter.put('/:id', message_request.modify_message.bind(this));
messagesRouter.delete('/:id', message_request.delete_message.bind(this));

export { messagesRouter };