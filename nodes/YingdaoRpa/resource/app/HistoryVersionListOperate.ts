import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const HistoryVersionListOperate: ResourceOperations = {
	name: '版本历史列表',
	value: 'historyVersionList',
	action: '查询版本历史列表',
	description: 'POST /oapi/app/open/historyVersionList',
	order: 40,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '分页参数走 pageDTO.page / pageDTO.size，不是顶层 page/size。',
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
		paginationOptions.returnAll,
		paginationOptions.limit(20),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const result = await RequestUtils.requestPaged.call(this, {
			method: 'POST',
			url: '/oapi/app/open/historyVersionList',
			pageIn: 'pageDTO',
			body: {
				appId: this.getNodeParameter('appId', index),
			},
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 20) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default HistoryVersionListOperate;
