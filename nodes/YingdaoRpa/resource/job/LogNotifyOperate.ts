import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const LogNotifyOperate: ResourceOperations = {
	name: '提交日志查询请求',
	value: 'logNotify',
	action: '提交日志查询请求',
	description: 'POST /oapi/dispatch/v2/job/log/notify',
	order: 60,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'需要平台级客户端凭证（accessKeyId 通常带 @platform）。返回 requestId，再调用「轮询日志结果」。日志量大、担心超时用本接口 + 轮询；日志量小用同步查询。',
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
			url: '/oapi/dispatch/v2/job/log/notify',
			body: pickFilled({
				jobUuid: this.getNodeParameter('jobUuid', index),
				page: this.getNodeParameter('page', index, 1),
				size: this.getNodeParameter('size', index, 20),
				queryFilter: Object.keys(queryFilter).length ? queryFilter : undefined,
			}),
		});
	},
};

export default LogNotifyOperate;
