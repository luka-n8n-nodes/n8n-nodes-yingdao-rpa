import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { ACCOUNT_TYPE_OPTIONS, USER_ROLE_OPTIONS } from '../../../help/utils/constants';
import { commonOptions } from '../../../help/utils/sharedOptions';

const CreateOperate: ResourceOperations = {
	name: '创建企业用户',
	value: 'create',
	action: '创建企业用户',
	description: 'POST /oapi/rpa/user/v1/create',
	order: 10,
	options: [
		{
			displayName: '账号',
			name: 'account',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '手机号',
			name: 'phone',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '账号类型',
			name: 'accountType',
			type: 'options',
			options: ACCOUNT_TYPE_OPTIONS,
			required: true,
			default: 'basic',
		},
		{
			displayName: '角色',
			name: 'userRole',
			type: 'options',
			options: USER_ROLE_OPTIONS,
			required: true,
			default: 'e_user',
		},
		{
			displayName: '密码',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: '附加字段',
			name: 'additionalFields',
			type: 'collection',
			placeholder: '添加字段',
			default: {},
			options: [
				{ displayName: '姓名', name: 'name', type: 'string', default: '' },
				{ displayName: '邮箱', name: 'email', type: 'string', default: '' },
			],
		},
		commonOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/rpa/user/v1/create',
			body: pickFilled({
				account: this.getNodeParameter('account', index),
				phone: this.getNodeParameter('phone', index),
				accountType: this.getNodeParameter('accountType', index),
				userRole: this.getNodeParameter('userRole', index),
				password: this.getNodeParameter('password', index),
				name: additional.name,
				email: additional.email,
			}),
		});
	},
};

export default CreateOperate;
