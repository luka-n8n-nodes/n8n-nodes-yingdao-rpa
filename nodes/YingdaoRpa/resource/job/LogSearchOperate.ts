import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const LogSearchOperate: ResourceOperations = {
	name: '同步查询日志',
	value: 'logSearch',
	action: '同步查询日志',
	description: 'POST /oapi/dispatch/v2/job/log/search',
	order: 80,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '需要平台级客户端凭证。日志量小、要立即拿结果用本接口；量大用 notify + query。',
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
		{
			displayName: '页码',
			name: 'page',
			type: 'number',
			default: 1,
		},
		{
			displayName: '每页条数',
			name: 'size',
			type: 'number',
			default: 20,
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加筛选',
			default: {},
			options: [
				{ displayName: '开始时间', name: 'beginTime', type: 'string', default: '' },
				{ displayName: '结束时间', name: 'endTime', type: 'string', default: '' },
				{ displayName: '关键字', name: 'searchKey', type: 'string', default: '' },
				{ displayName: '选中日志 ID', name: 'selectLogId', type: 'number', default: 0 },
				{ displayName: '选中范围', name: 'selectRange', type: 'number', default: 0 },
			],
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const queryFilter = pickFilled({
			beginTime: additional.beginTime,
			endTime: additional.endTime,
			searchKey: additional.searchKey,
			selectLogId: additional.selectLogId || undefined,
			selectRange: additional.selectRange || undefined,
		});
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/job/log/search',
			body: pickFilled({
				jobUuid: this.getNodeParameter('jobUuid', index),
				page: this.getNodeParameter('page', index, 1),
				size: this.getNodeParameter('size', index, 20),
				queryFilter: Object.keys(queryFilter).length ? queryFilter : undefined,
			}),
		});
	},
};

export default LogSearchOperate;
