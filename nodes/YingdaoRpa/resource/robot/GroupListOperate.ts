import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const GroupListOperate: ResourceOperations = {
	name: '机器人分组列表',
	value: 'groupList',
	action: '查询机器人分组列表',
	description: 'POST /oapi/dispatch/v2/client/group/list',
	order: 30,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '无强制必填字段，请求体为空对象即可。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		timeoutOnlyOptions,
	],
	async call(this) {
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/client/group/list',
			body: {},
		});
	},
};

export default GroupListOperate;
