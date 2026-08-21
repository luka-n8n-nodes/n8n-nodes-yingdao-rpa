import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { splitList } from '../../../help/utils/parameters';
import { timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const LastHeartTimeOperate: ResourceOperations = {
	name: '查询最后心跳时间',
	value: 'lastHeartTime',
	action: '查询机器人最后心跳时间',
	description: 'POST /oapi/dispatch/v2/client/getLastHeartTime',
	order: 40,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '请求体必须是字符串数组 [uuid1, uuid2, ...]，不是包一层对象。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '机器人 UUID 列表',
			name: 'robotClientUuids',
			type: 'string',
			typeOptions: {
				rows: 3,
			},
			required: true,
			default: '',
			description: '多个 UUID 用逗号或换行分隔',
		},
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const uuids = splitList(this.getNodeParameter('robotClientUuids', index)) ?? [];
		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/client/getLastHeartTime',
			body: uuids as unknown as IDataObject,
		});
	},
};

export default LastHeartTimeOperate;
