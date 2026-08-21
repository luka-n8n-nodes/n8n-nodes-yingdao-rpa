import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const QueryOperate: ResourceOperations = {
	name: '机器人详情',
	value: 'query',
	action: '查询机器人详情',
	description: 'POST /oapi/dispatch/v2/client/query',
	order: 20,
	requestIntervalMs: 0,
	options: [
		{
			displayName: 'robotClientUuid 与 accountName 二选一。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '查询方式',
			name: 'queryBy',
			type: 'options',
			options: [
				{ name: '机器人 UUID', value: 'uuid' },
				{ name: '账号名', value: 'account' },
			],
			default: 'uuid',
		},
		{
			displayName: '机器人 UUID',
			name: 'robotClientUuid',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					queryBy: ['uuid'],
				},
			},
		},
		{
			displayName: '账号名',
			name: 'accountName',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					queryBy: ['account'],
				},
			},
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const queryBy = this.getNodeParameter('queryBy', index) as string;
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/client/query',
			body: pickFilled({
				robotClientUuid:
					queryBy === 'uuid' ? this.getNodeParameter('robotClientUuid', index, '') : undefined,
				accountName:
					queryBy === 'account' ? this.getNodeParameter('accountName', index, '') : undefined,
			}),
		});
	},
};

export default QueryOperate;
