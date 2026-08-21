import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { JOB_STATUS_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const NewestListOperate: ResourceOperations = {
	name: '查询最新执行记录',
	value: 'newestList',
	action: '查询常规任务最新执行记录',
	description: 'POST /oapi/dispatch/v2/task/newest/list',
	order: 40,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'页码分页（不是游标），不需要 sourceUuid，用于跨计划查最新记录。响应是形态 B：data 直接是数组，分页在顶层 page。',
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
					name: 'statusList',
					type: 'multiOptions',
					options: JOB_STATUS_OPTIONS,
					default: [],
				},
				{
					displayName: '开始时间',
					name: 'startTime',
					type: 'string',
					default: '',
					placeholder: 'yyyy-MM-dd HH:mm',
				},
				{
					displayName: '结束时间',
					name: 'endTime',
					type: 'string',
					default: '',
					placeholder: 'yyyy-MM-dd HH:mm',
				},
			],
		},
		paginationOptions.returnAll,
		paginationOptions.limit(10),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const result = await RequestUtils.requestPaged.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/task/newest/list',
			maxPageSize: 100,
			body: pickFilled({
				statusList: additional.statusList,
				startTime: additional.startTime,
				endTime: additional.endTime,
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 10) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default NewestListOperate;
