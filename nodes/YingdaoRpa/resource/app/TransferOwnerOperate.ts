import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { commonOptions } from '../../../help/utils/sharedOptions';

const TransferOwnerOperate: ResourceOperations = {
	name: '转移应用 Owner',
	value: 'transferOwner',
	action: '转移应用 Owner',
	description: 'POST /oapi/app/open/translate/owner',
	order: 60,
	options: [
		{
			displayName: '应用 ID',
			name: 'appId',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '接收人账号',
			name: 'receiveUserAccount',
			type: 'string',
			required: true,
			default: '',
		},
		commonOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/app/open/translate/owner',
			body: pickFilled({
				appId: this.getNodeParameter('appId', index),
				receiveUserAccount: this.getNodeParameter('receiveUserAccount', index),
			}),
		});
	},
};

export default TransferOwnerOperate;
