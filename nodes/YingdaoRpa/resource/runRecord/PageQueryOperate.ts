import type { IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { START_MODEL_OPTIONS } from '../../../help/utils/constants';
import { normalizePageResult } from '../../../help/utils/pagination';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const PageQueryOperate: ResourceOperations = {
	name: '分页查询运行记录',
	value: 'pageQuery',
	action: '分页查询应用运行记录',
	description: 'POST /oapi/app/open/query/pageRunRecordData',
	order: 10,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'minTime / maxTime 必填，时间跨度不能超过 7 天。startModelList 大小写不统一，请使用选项原值，不要自行规范化。响应可能是形态 A（pageDTO+result）或形态 B（data 数组 + 顶层 page），节点会做轻量归一。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '应用 ID',
			name: 'appId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '开始时间',
			name: 'minTime',
			type: 'dateTime',
			required: true,
			default: '',
		},
		{
			displayName: '结束时间',
			name: 'maxTime',
			type: 'dateTime',
			required: true,
			default: '',
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加筛选',
			default: {},
			options: [
				{ displayName: '用户 ID', name: 'userId', type: 'string', default: '' },
				{
					displayName: '运行方式',
					name: 'startModelList',
					type: 'multiOptions',
					options: START_MODEL_OPTIONS,
					default: [],
				},
			],
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const minTime = this.getNodeParameter('minTime', index) as string;
		const maxTime = this.getNodeParameter('maxTime', index) as string;
		const minMs = new Date(minTime).getTime();
		const maxMs = new Date(maxTime).getTime();
		if (!Number.isFinite(minMs) || !Number.isFinite(maxMs)) {
			throw new NodeOperationError(this.getNode(), 'minTime / maxTime 不是有效时间', {
				itemIndex: index,
			});
		}
		if (maxMs - minMs > SEVEN_DAYS_MS) {
			throw new NodeOperationError(this.getNode(), '时间跨度不能超过 7 天，请分段多次调用', {
				itemIndex: index,
			});
		}

		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const result = await RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/app/open/query/pageRunRecordData',
			body: pickFilled({
				appId: this.getNodeParameter('appId', index),
				minTime,
				maxTime,
				userId: additional.userId,
				startModelList: additional.startModelList,
			}),
		});
		return normalizePageResult(result);
	},
};

export default PageQueryOperate;
