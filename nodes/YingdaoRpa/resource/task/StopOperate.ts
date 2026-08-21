import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { commonOptions } from '../../../help/utils/sharedOptions';

const StopOperate: ResourceOperations = {
	name: '停止常规任务',
	value: 'stop',
	action: '停止常规任务',
	description: 'POST /oapi/dispatch/v2/task/stop',
	order: 20,
	options: [
		{
			displayName: '停止的是整个 Task，会连带停止其下所有未结束的 Job，无法只停某一台机器人。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Task UUID',
			name: 'taskUuid',
			type: 'string',
			required: true,
			default: '',
		},
		commonOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/task/stop',
			body: {
				taskUuid: this.getNodeParameter('taskUuid', index),
			},
		});
	},
};

export default StopOperate;
