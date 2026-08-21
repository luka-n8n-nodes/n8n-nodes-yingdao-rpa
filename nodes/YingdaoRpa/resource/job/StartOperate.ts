import { jobStartFields, startYingdaoJob } from '../../../help/utils/jobStart';
import { ResourceOperations } from '../../../help/type/IResource';
import { commonOptions, convertResultOption, extendOptions } from '../../../help/utils/sharedOptions';
import { attachResultObj } from '../../../help/utils/parameters';
import type { IDataObject } from 'n8n-workflow';

const StartOperate: ResourceOperations = {
	name: '启动一次执行',
	value: 'start',
	action: '启动 Job',
	description: 'POST /oapi/dispatch/v2/job/start',
	order: 10,
	options: [
		...jobStartFields({
			notice:
				'accountName 与 robotClientGroupUuid 二选一。priority 只能是 high/middle/low（不是 medium），非法值会被静默当成 low。idempotentUuid 不超过 36 字符。建议用 waitTimeoutSeconds 而不是固定档位 waitTimeout。',
			includeCallbackUrl: true,
		}),
		extendOptions(commonOptions, [convertResultOption]),
	],
	async call(this, index) {
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		return attachResultObj(
			await startYingdaoJob(this, index),
			options.convertResultToObject === true,
		);
	},
};

export default StartOperate;
