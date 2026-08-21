import type { IDataObject } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import {
	convertResultOption,
	extendOptions,
	timeoutOnlyOptions,
} from '../../../help/utils/sharedOptions';
import { attachResultObj } from '../../../help/utils/parameters';
import { getResumeUrl, getWaitTill, jobStartFields, startYingdaoJob } from '../../../help/utils/jobStart';

const StartAndWaitOperate: ResourceOperations = {
	name: '启动 Job 并且 Wait',
	value: 'startAndWait',
	action: '启动 Job 并等待回调',
	description: 'POST /oapi/dispatch/v2/job/start，callbackUrl 使用 n8n Wait 链接',
	order: 15,
	options: [
		...jobStartFields({
			notice:
				'启动后工作流会进入等待，callbackUrl 自动填入 n8n 的 $execution.resumeUrl（/webhook-waiting/{executionId}，与 Wait 节点相同）。影刀在每个 Job 结束后单独 POST 一次回调，并在 query 追加 bodyMd5/timestamp/sign。请确保 n8n 有公网地址。本操作一次只处理一条输入。',
			includeCallbackUrl: false,
		}),
		{
			displayName: '限制等待时间',
			name: 'limitWaitTime',
			type: 'boolean',
			default: false,
			description:
				'是否在指定时间后结束等待。默认一直等到影刀回调；影刀对非 2xx 会在 24 小时内补偿重试。',
		},
		{
			displayName: '最长等待',
			name: 'resumeAmount',
			type: 'number',
			default: 24,
			typeOptions: {
				minValue: 0,
				numberPrecision: 2,
			},
			displayOptions: {
				show: {
					limitWaitTime: [true],
				},
			},
		},
		{
			displayName: '时间单位',
			name: 'resumeUnit',
			type: 'options',
			options: [
				{ name: '分钟', value: 'minutes' },
				{ name: '小时', value: 'hours' },
				{ name: '天', value: 'days' },
			],
			default: 'hours',
			displayOptions: {
				show: {
					limitWaitTime: [true],
				},
			},
		},
		extendOptions(timeoutOnlyOptions, [convertResultOption]),
	],
	async call(this, index) {
		const resumeUrl = getResumeUrl(this, index);
		const started = await startYingdaoJob(this, index, resumeUrl);
		this.setMetadata({ resumeUrl });
		await this.putExecutionToWait(getWaitTill(this, index));
		const options = this.getNodeParameter('options', index, {}) as IDataObject;
		return attachResultObj(
			{
				...started,
				callbackUrl: resumeUrl,
				waiting: true,
			},
			options.convertResultToObject === true,
		);
	},
};

export default StartAndWaitOperate;
