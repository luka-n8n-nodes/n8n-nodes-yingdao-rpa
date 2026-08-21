import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { commonOptions } from '../../../help/utils/sharedOptions';

const RetryOperate: ResourceOperations = {
	name: '重试执行',
	value: 'retry',
	action: '重试 Job',
	description: 'POST /oapi/dispatch/v2/job/retry',
	order: 50,
	options: [
		{
			displayName: '只有终态 error / skipped / cancel / stopped 支持重试，finish 不能重试。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
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
			url: '/oapi/dispatch/v2/job/retry',
			body: {
				jobUuid: this.getNodeParameter('jobUuid', index),
			},
		});
	},
};

export default RetryOperate;
