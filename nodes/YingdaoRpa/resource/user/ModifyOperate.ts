import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { ACCOUNT_TYPE_OPTIONS, USER_ROLE_OPTIONS } from '../../../help/utils/constants';
import { commonOptions } from '../../../help/utils/sharedOptions';

const ModifyOperate: ResourceOperations = {
	name: '修改企业用户',
	value: 'modify',
	action: '修改企业用户',
	description: 'POST /oapi/rpa/user/v1/modify',
	order: 40,
	options: [
		{
			displayName:
				'name / phone / accountType / userRole 不传或传空表示不修改。email 例外：传空串会清空邮箱，不传才表示不修改。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '账号',
			name: 'account',
			type: 'string',
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
				{ displayName: '手机号', name: 'phone', type: 'string', default: '' },
				{
					displayName: '账号类型',
					name: 'accountType',
					type: 'options',
					options: ACCOUNT_TYPE_OPTIONS,
					default: 'basic',
				},
				{
					displayName: '角色',
					name: 'userRole',
					type: 'options',
					options: USER_ROLE_OPTIONS,
					default: 'e_user',
				},
				{ displayName: '邮箱', name: 'email', type: 'string', default: '' },
				{
					displayName: '清空邮箱',
					name: 'clearEmail',
					type: 'boolean',
					default: false,
					description: '开启后会传空串清空邮箱，忽略上方邮箱字段',
				},
			],
		},
		commonOptions,
	],
	async call(this, index) {
		const additional = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
		const body = pickFilled({
			account: this.getNodeParameter('account', index),
			name: additional.name,
			phone: additional.phone,
			accountType: additional.accountType,
			userRole: additional.userRole,
		});
		if (additional.clearEmail === true) {
			body.email = '';
		} else if (typeof additional.email === 'string' && additional.email.trim() !== '') {
			body.email = additional.email;
		}
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/rpa/user/v1/modify',
			body,
		});
	},
};

export default ModifyOperate;
