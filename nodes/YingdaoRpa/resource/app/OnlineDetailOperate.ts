import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const OnlineDetailOperate: ResourceOperations = {
	name: '查询已发布版本详情及参数',
	value: 'onlineDetail',
	action: '查询已发布版本详情及参数',
	description: 'GET /oapi/app/open/query/appOnlineDetailWithParam',
	order: 20,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'触发执行前必调。应用必须已有已发布（online）版本，否则返回「应用未上线」。不要用开发版本详情接口替代本接口去获取执行参数。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
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
			url: '/oapi/app/open/query/appOnlineDetailWithParam',
			qs: {
				appId: this.getNodeParameter('appId', index),
			},
		});
	},
};

export default OnlineDetailOperate;
