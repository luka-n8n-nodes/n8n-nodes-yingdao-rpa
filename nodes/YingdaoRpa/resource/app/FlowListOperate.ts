import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const FlowListOperate: ResourceOperations = {
	name: '获取子流程/指令集列表',
	value: 'flowList',
	action: '获取子流程/指令集列表',
	description: 'GET /oapi/app/open/queryVersionFlowList',
	order: 50,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '应用 ID',
			name: 'appId',
			type: 'string',
			required: true,
			default: '',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: '/oapi/app/open/queryVersionFlowList',
			qs: {
				appId: this.getNodeParameter('appId', index),
			},
		});
	},
};

export default FlowListOperate;
