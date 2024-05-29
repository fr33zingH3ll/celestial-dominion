import Express from 'express';
const reportsRouter = Express.Router();

import { report_request } from '../../messages_api.js'

reportsRouter.get('/', report_request.get_all_reports.bind(this));
reportsRouter.get('/:id', report_request.get_report_by_id.bind(this));
reportsRouter.post('/', report_request.new_report.bind(this));
reportsRouter.put('/:id', report_request.modify_report.bind(this));
reportsRouter.delete('/:id', report_request.delete_report.bind(this));

export { reportsRouter };