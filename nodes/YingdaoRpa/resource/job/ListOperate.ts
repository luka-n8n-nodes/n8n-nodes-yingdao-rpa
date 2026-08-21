import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { CURSOR_DIRECTION_OPTIONS, JOB_STATUS_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '查询 Job 集合',
	value: 'list',
	action: '查询 Job 集合',
	description: 'POST /oapi/dispatch/v2/job/list',
	order: 30,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'这是游标分页接口，不是页码分页。列表字段是 data.dataList。cursorDirection 只能是 pre 或 next。size 最大 500。',
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
					displayName: '游标方向',
					name: 'cursorDirection',
					type: 'options',
					options: CURSOR_DIRECTION_OPTIONS,
					default: 'next',
				},
				{ displayName: '机器人 UUID', name: 'robotClientUuid', type: 'string', default: '' },
				{ displayName: '应用 UUID', name: 'robotUuid', type: 'string', default: '' },
				{ displayName: '计划 UUID', name: 'scheduleUuid', type: 'string', default: '' },
				{
					displayName: '状态',
					name: 'statusList',
					type: 'multiOptions',
					options: JOB_STATUS_OPTIONS,
					default: [],
				},
				{
					displayName: '触发时间起',
					name: 'triggerTimeBegin',
					type: 'string',
					default: '',
					placeholder: 'yyyy-MM-dd HH:mm:ss',
				},
				{
					displayName: '触发时间止',
					name: 'triggerTimeEnd',
					type: 'string',
					default: '',
					placeholder: 'yyyy-MM-dd HH:mm:ss',
				},
				{
					displayName: '更新时间起',
					name: 'updateTimeBegin',
					type: 'string',
					default: '',
					placeholder: 'yyyy-MM-dd HH:mm:ss',
				},
				{
					displayName: '更新时间止',
					name: 'updateTimeEnd',
					type: 'string',
					default: '',
					placeholder: 'yyyy-MM-dd HH:mm:ss',
				},
				{
					displayName: '只查调度 API 相关 Job',
					name: 'queryApi',
					type: 'boolean',
					default: false,
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
			url: '/oapi/dispatch/v2/job/list',
			maxPageSize: 500,
			cursorDirection: (additional.cursorDirection as string) || 'next',
			body: pickFilled({
				robotClientUuid: additional.robotClientUuid,
				robotUuid: additional.robotUuid,
				scheduleUuid: additional.scheduleUuid,
				statusList: additional.statusList,
				triggerTimeBegin: additional.triggerTimeBegin,
				triggerTimeEnd: additional.triggerTimeEnd,
				updateTimeBegin: additional.updateTimeBegin,
				updateTimeEnd: additional.updateTimeEnd,
				queryApi: additional.queryApi,
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 50) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ListOperate;
