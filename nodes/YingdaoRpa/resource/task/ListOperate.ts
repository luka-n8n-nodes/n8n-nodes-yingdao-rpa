import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { CURSOR_DIRECTION_OPTIONS, JOB_STATUS_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '查询执行记录',
	value: 'list',
	action: '查询指定常规任务的执行记录',
	description: 'POST /oapi/dispatch/v2/task/list',
	order: 30,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'游标分页。必须指定 sourceUuid（即某个 scheduleUuid）。时间格式 yyyy-MM-dd HH:mm。列表字段是 data.dataList。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Source UUID',
			name: 'sourceUuid',
			type: 'string',
			required: true,
			default: '',
			description: '对应某个 scheduleUuid',
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加筛选',
			default: {},
			options: [
				{
					displayName: '游标方向',
					name: 'cursorDirection',
					type: 'options',
					options: CURSOR_DIRECTION_OPTIONS,
					default: 'next',
				},
				{
					displayName: '状态',
					name: 'statusList',
					type: 'multiOptions',
					options: JOB_STATUS_OPTIONS,
					default: [],
					description: 'Task 聚合状态与 Job 状态是两套枚举，命名可能相似但要分开对待',
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
		paginationOptions.limit(50),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const result = await RequestUtils.requestCursor.call(this, {
			url: '/oapi/dispatch/v2/task/list',
			maxPageSize: 500,
			cursorDirection: (additional.cursorDirection as string) || 'next',
			body: pickFilled({
				sourceUuid: this.getNodeParameter('sourceUuid', index),
				statusList: additional.statusList,
				startTime: additional.startTime,
				endTime: additional.endTime,
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 50) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ListOperate;
