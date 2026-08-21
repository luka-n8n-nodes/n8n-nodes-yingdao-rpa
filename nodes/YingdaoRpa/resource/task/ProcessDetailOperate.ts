import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ProcessDetailOperate: ResourceOperations = {
	name: '查询执行过程明细',
	value: 'processDetail',
	action: '查询任务在某机器人上的执行过程明细',
	description: 'POST /oapi/dispatch/v2/task/process/detail',
	order: 60,
	requestIntervalMs: 0,
	options: [
		{
			displayName: 'Task UUID',
			name: 'taskUuid',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '机器人 UUID',
			name: 'robotClientUuid',
			type: 'string',
			required: true,
			default: '',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/task/process/detail',
			body: pickFilled({
				taskUuid: this.getNodeParameter('taskUuid', index),
				robotClientUuid: this.getNodeParameter('robotClientUuid', index),
			}),
		});
	},
};

export default ProcessDetailOperate;
