import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '常规任务列表',
	value: 'list',
	action: '查询常规任务列表',
	description: 'POST /oapi/dispatch/v2/schedule/list',
	order: 10,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '常规任务的创建/修改只能在控制台完成，OAPI 只提供 list/detail 只读能力。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加筛选',
			default: {},
			options: [
				{
					displayName: '是否启用',
					name: 'enabled',
					type: 'boolean',
					default: true,
				},
				{
					displayName: '任务类型',
					name: 'scheduleType',
					type: 'string',
					default: '',
				},
			],
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/schedule/list',
			body: pickFilled({
				enabled: additional.enabled,
				scheduleType: additional.scheduleType,
			}),
		});
	},
};

export default ListOperate;
