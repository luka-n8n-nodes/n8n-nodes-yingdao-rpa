import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const DetailOperate: ResourceOperations = {
	name: '常规任务详情',
	value: 'detail',
	action: '查询常规任务详情',
	description: 'POST /oapi/dispatch/v2/schedule/detail',
	order: 20,
	requestIntervalMs: 0,
	options: [
		{
			displayName: 'Schedule UUID',
			name: 'scheduleUuid',
			type: 'string',
			required: true,
			default: '',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/schedule/detail',
			body: {
				scheduleUuid: this.getNodeParameter('scheduleUuid', index),
			},
		});
	},
};

export default DetailOperate;
