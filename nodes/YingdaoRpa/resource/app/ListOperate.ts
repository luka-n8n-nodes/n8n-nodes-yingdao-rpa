import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { APP_TYPE_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '查询应用列表',
	value: 'list',
	action: '查询应用列表',
	description: 'POST /oapi/app/open/query/list',
	order: 10,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'selfApp 默认 false。与 ownerUserSearchKey 同时传时，以 ownerUserSearchKey 为准，selfApp 不生效。',
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
				{ displayName: '应用 ID', name: 'appId', type: 'string', default: '' },
				{ displayName: '应用名称', name: 'appName', type: 'string', default: '' },
				{
					displayName: '应用类型',
					name: 'appType',
					type: 'options',
					options: APP_TYPE_OPTIONS,
					default: 'app',
				},
				{
					displayName: 'Owner 账号（精确）',
					name: 'ownerUserSearchKey',
					type: 'string',
					default: '',
				},
				{
					displayName: '只查自己的应用',
					name: 'selfApp',
					type: 'boolean',
					default: false,
				},
			],
		},
		paginationOptions.returnAll,
		paginationOptions.limit(30),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const result = await RequestUtils.requestPaged.call(this, {
			method: 'POST',
			url: '/oapi/app/open/query/list',
			maxPageSize: 30,
			body: pickFilled({
				appId: additional.appId,
				appName: additional.appName,
				appType: additional.appType,
				ownerUserSearchKey: additional.ownerUserSearchKey,
				selfApp: additional.selfApp,
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 30) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ListOperate;
