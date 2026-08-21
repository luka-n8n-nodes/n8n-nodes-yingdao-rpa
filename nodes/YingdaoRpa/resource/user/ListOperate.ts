import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled, toNumberOrUndefined } from '../../../help/utils/parameters';
import { ACCOUNT_TYPE_OPTIONS } from '../../../help/utils/constants';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '获取企业用户列表',
	value: 'list',
	action: '获取企业用户列表',
	description: 'GET /oapi/rpa/user/v1/list',
	order: 30,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '该接口走页码分页，size 最大 100。出参 data 直接是数组，不是 PageResult 包装。',
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
				{ displayName: '电话', name: 'phone', type: 'string', default: '' },
				{ displayName: '账户关键字（模糊）', name: 'accountKeyword', type: 'string', default: '' },
				{ displayName: '账户关键字（精确）', name: 'accurateKeyMatch', type: 'string', default: '' },
				{
					displayName: '最后登录时间起',
					name: 'latestLoginTimeBegin',
					type: 'number',
					default: 0,
					description: '时间戳',
				},
				{
					displayName: '最后登录时间止',
					name: 'latestLoginTimeEnd',
					type: 'number',
					default: 0,
					description: '时间戳',
				},
				{
					displayName: '过期时间起',
					name: 'expiredTimeBegin',
					type: 'number',
					default: 0,
					description: '时间戳',
				},
				{
					displayName: '过期时间止',
					name: 'expiredTimeEnd',
					type: 'number',
					default: 0,
					description: '时间戳',
				},
				{
					displayName: '账号类型',
					name: 'accountTypes',
					type: 'multiOptions',
					options: ACCOUNT_TYPE_OPTIONS,
					default: [],
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
			method: 'GET',
			url: '/oapi/rpa/user/v1/list',
			pageIn: 'qs',
			maxPageSize: 100,
			qs: pickFilled({
				phone: additional.phone,
				accountKeyword: additional.accountKeyword,
				accurateKeyMatch: additional.accurateKeyMatch,
				latestLoginTimeBegin: toNumberOrUndefined(additional.latestLoginTimeBegin),
				latestLoginTimeEnd: toNumberOrUndefined(additional.latestLoginTimeEnd),
				expiredTimeBegin: toNumberOrUndefined(additional.expiredTimeBegin),
				expiredTimeEnd: toNumberOrUndefined(additional.expiredTimeEnd),
				accountTypes: additional.accountTypes,
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 20) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ListOperate;
