import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { commonOptions } from '../../../help/utils/sharedOptions';

const ResetPasswordOperate: ResourceOperations = {
	name: '重置密码',
	value: 'resetPassword',
	action: '重置密码',
	description: 'POST /oapi/useracl/v1/rest/pwd',
	order: 50,
	options: [
		{
			displayName: '这是自助改密接口，必须校验旧密码，不是管理员强制重置。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '登录账号',
			name: 'loginAccount',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '旧密码',
			name: 'oldPwd',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: '新密码',
			name: 'pwd',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
		{
			displayName: '踢掉当前会话',
			name: 'kickCurUser',
			type: 'boolean',
			default: true,
			description: '是否将该用户当前登录会话踢下线，默认踢除',
		},
		commonOptions,
	],
	async call(this, index) {
		const kickCurUser = this.getNodeParameter('kickCurUser', index, true) as boolean;
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/useracl/v1/rest/pwd',
			body: pickFilled({
				loginAccount: this.getNodeParameter('loginAccount', index),
				oldPwd: this.getNodeParameter('oldPwd', index),
				pwd: this.getNodeParameter('pwd', index),
				kickCurUser: kickCurUser ? 1 : 0,
			}),
		});
	},
};

export default ResetPasswordOperate;
