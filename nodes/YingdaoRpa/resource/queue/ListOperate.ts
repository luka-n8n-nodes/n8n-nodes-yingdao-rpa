import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import { pickFilled } from '../../../help/utils/parameters';
import { paginationOptions, timeoutOnlyOptions } from '../../../help/utils/sharedOptions';

const ListOperate: ResourceOperations = {
	name: '查询队列列表',
	value: 'list',
	action: '查询队列列表',
	description: 'GET /oapi/tool/queue/v1/queues',
	order: 10,
	requestIntervalMs: 0,
	options: [
		{
			displayName: '关键字',
			name: 'keyword',
			type: 'string',
			default: '',
		},
		paginationOptions.returnAll,
		paginationOptions.limit(20),
		timeoutOnlyOptions,
	],
	async call(this, index) {
		const result = await RequestUtils.requestPaged.call(this, {
			method: 'GET',
			url: '/oapi/tool/queue/v1/queues',
			pageIn: 'qs',
			qs: pickFilled({
				keyword: this.getNodeParameter('keyword', index, ''),
			}),
			returnAll: this.getNodeParameter('returnAll', index, false) as boolean,
			limit: this.getNodeParameter('limit', index, 20) as number,
		});
		return (result.data as IDataObject[]) ?? [];
	},
};

export default ListOperate;
