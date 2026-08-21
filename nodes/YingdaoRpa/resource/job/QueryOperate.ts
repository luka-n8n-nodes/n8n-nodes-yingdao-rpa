import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const QueryOperate: ResourceOperations = {
	name: '查询 Job 详情',
	value: 'query',
	action: '查询 Job 详情',
	description: 'POST /oapi/dispatch/v2/job/query',
	order: 20,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'idempotentUuid 非空时优先级高于 jobUuid，两者都传时完全按幂等标识查询。请只选一种查询方式。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '查询方式',
			name: 'queryBy',
			type: 'options',
			options: [
				{ name: 'Job UUID', value: 'jobUuid' },
				{ name: '幂等 UUID', value: 'idempotentUuid' },
			],
			default: 'jobUuid',
		},
		{
			displayName: 'Job UUID',
			name: 'jobUuid',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					queryBy: ['jobUuid'],
				},
			},
		},
		{
			displayName: '幂等 UUID',
			name: 'idempotentUuid',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					queryBy: ['idempotentUuid'],
				},
			},
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const queryBy = this.getNodeParameter('queryBy', index) as string;
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/job/query',
			body: pickFilled({
				jobUuid: queryBy === 'jobUuid' ? this.getNodeParameter('jobUuid', index, '') : undefined,
				idempotentUuid:
					queryBy === 'idempotentUuid'
						? this.getNodeParameter('idempotentUuid', index, '')
						: undefined,
			}),
		});
	},
};

export default QueryOperate;
