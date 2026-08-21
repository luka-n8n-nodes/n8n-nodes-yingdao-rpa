import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const LogQueryOperate: ResourceOperations = {
	name: '轮询日志结果',
	value: 'logQuery',
	action: '轮询日志结果',
	description: 'GET /oapi/dispatch/v2/job/log/query',
	order: 70,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'需要平台级客户端凭证。data.page 是内层分页对象（total/page/size），与顶层 page 不是一回事。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Request ID',
			name: 'requestId',
			type: 'string',
			required: true,
			default: '',
			description: '由「提交日志查询请求」返回',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: '/oapi/dispatch/v2/job/log/query',
			qs: {
				requestId: this.getNodeParameter('requestId', index),
			},
		});
	},
};

export default LogQueryOperate;
