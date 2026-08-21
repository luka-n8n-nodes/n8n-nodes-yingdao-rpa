import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const VersionDetailOperate: ResourceOperations = {
	name: '查询当前开发版本明细',
	value: 'versionDetail',
	action: '查询当前开发版本明细',
	description: 'GET /oapi/app/open/query/appVersionDetail',
	order: 30,
	requestIntervalMs: 0,
	options: [
		{
			displayName:
				'查的是当前开发版本；若没有已发布版本会回退展示开发版本。不要用它替代「已发布版本详情」去获取执行参数。',
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
			url: '/oapi/app/open/query/appVersionDetail',
			qs: {
				appId: this.getNodeParameter('appId', index),
			},
		});
	},
};

export default VersionDetailOperate;
