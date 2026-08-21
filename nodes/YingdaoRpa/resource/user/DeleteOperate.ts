import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { commonOptions } from '../../../help/utils/sharedOptions';

const DeleteOperate: ResourceOperations = {
	name: '删除企业用户',
	value: 'delete',
	action: '删除企业用户',
	description: 'POST /oapi/rpa/user/v1/delete',
	order: 20,
	options: [
		{
			displayName:
				'删除账号时，其名下应用等资产会转移给接收账号。两个账号必须同企业；不填接收账号表示不转移资产。',
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
			description: '要删除的账号',
		},
		{
			displayName: '接收账号',
			name: 'receiveAccount',
			type: 'string',
			default: '',
			description: '资产转移目标账号，留空表示不转移',
		},
		commonOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/rpa/user/v1/delete',
			body: pickFilled({
				account: this.getNodeParameter('account', index),
				receiveAccount: this.getNodeParameter('receiveAccount', index, ''),
			}),
		});
	},
};

export default DeleteOperate;
