import Express from 'express';
const postsRouter = Express.Router();

import { post_request } from '../../messages_api.js'

postsRouter.get('/', post_request.get_all_posts.bind(this));
postsRouter.get('/:id', post_request.get_post_by_id.bind(this));
postsRouter.post('/', post_request.new_post.bind(this));
postsRouter.put('/:id', post_request.modify_post.bind(this));
postsRouter.delete('/:id', post_request.delete_post.bind(this));

export { postsRouter };