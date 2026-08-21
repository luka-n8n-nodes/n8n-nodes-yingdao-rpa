import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { commonOptions } from '../../../help/utils/sharedOptions';

const StopOperate: ResourceOperations = {
	name: '停止执行',
	value: 'stop',
	action: '停止 Job',
	description: 'POST /oapi/dispatch/v2/job/stop',
	order: 40,
	options: [
		{
			displayName: 'Job UUID',
			name: 'jobUuid',
			type: 'string',
			required: true,
			default: '',
		},
		commonOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/job/stop',
			body: {
				jobUuid: this.getNodeParameter('jobUuid', index),
			},
		});
	},
};

export default StopOperate;
