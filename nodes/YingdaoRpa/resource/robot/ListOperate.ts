import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { ROBOT_STATUS_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '机器人列表',
	value: 'list',
	action: '查询机器人列表',
	description: 'POST /oapi/dispatch/v2/client/list',
	order: 10,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'出参是形态 B：data 直接是数组，分页信息在最外层 page。判断可分配/空闲应筛选 idle，没有 available/free。',
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
					displayName: '状态',
					name: 'status',
					type: 'options',
					options: ROBOT_STATUS_OPTIONS,
					default: 'idle',
				},
				{
					displayName: '机器人分组 UUID',
					name: 'robotClientGroupUuid',
					type: 'string',
					default: '',
				},
			],
		},
		paginationOptions.returnAll,
		paginationOptions.limit(20),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const result = await RequestUtils.requestPaged.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/client/list',
			body: pickFilled({
				status: additional.status,
				robotClientGroupUuid: additional.robotClientGroupUuid,
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 20) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ListOperate;
