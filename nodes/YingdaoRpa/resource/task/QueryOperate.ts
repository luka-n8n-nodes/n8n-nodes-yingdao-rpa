import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const QueryOperate: ResourceOperations = {
	name: '查询任务运行总详情',
	value: 'query',
	action: '查询单个任务运行总详情',
	description: 'POST /oapi/dispatch/v2/task/query',
	order: 50,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'必须展开 jobDataList 才能看到每台机器人的真实执行状态，不要只看顶层聚合 status。',
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
		timeoutOnlyOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/task/query',
			body: {
				taskUuid: this.getNodeParameter('taskUuid', index),
			},
		});
	},
};

export default QueryOperate;
