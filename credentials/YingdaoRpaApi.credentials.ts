import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';
import {
	YINGDAO_AUTH_DOC_URL,
	YINGDAO_DEFAULT_BASE_URL,
	YINGDAO_TOKEN_PATH,
} from '../nodes/help/type/enums';
import { isYingdaoSuccess, YingdaoApiResponse } from '../nodes/help/utils/RequestUtils';

export class YingdaoRpaApi implements ICredentialType {
	name = 'yingdaoRpaApi';
	displayName = '影刀 RPA API';
	documentationUrl = YINGDAO_AUTH_DOC_URL;
	icon = 'file:../nodes/YingdaoRpa/icon.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API 基础地址',
			name: 'baseUrl',
			type: 'string',
			default: YINGDAO_DEFAULT_BASE_URL,
			required: true,
			description:
				'影刀 OAPI 基础地址。公有云默认为 https://api.yingdao.com，专有云请填写专有云地址',
		},
		{
			displayName: 'Access Key ID',
			name: 'accessKeyId',
			type: 'string',
			default: '',
			required: true,
			description:
				'企业管理员在影刀控制台 API 配置中创建。平台级凭证通常带 @platform 后缀，运行日志等接口需要平台级凭证',
		},
		{
			displayName: 'Access Key Secret',
			name: 'accessKeySecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: '与 Access Key ID 成对的密钥，请妥善保管',
		},
		{
			displayName: 'AccessToken',
			name: 'accessToken',
			type: 'hidden',
			default: '',
			typeOptions: {
				expirable: true,
				password: true,
			},
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const res = (await this.helpers.httpRequest({
			method: 'GET',
			baseURL: String(credentials.baseUrl).replace(/\/$/, ''),
			url: YINGDAO_TOKEN_PATH,
			qs: {
				accessKeyId: credentials.accessKeyId,
				accessKeySecret: credentials.accessKeySecret,
			},
			json: true,
		})) as YingdaoApiResponse;

		if (!isYingdaoSuccess(res)) {
			throw new Error(`授权失败：${res?.code}, ${res?.msg || '未知错误'}`);
		}

		const data = (res.data ?? {}) as { accessToken?: string };
		if (!data.accessToken) {
			throw new Error('授权失败：响应中没有 accessToken');
		}

		return { accessToken: data.accessToken };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: YINGDAO_TOKEN_PATH,
			method: 'GET',
			qs: {
				accessKeyId: '={{$credentials.accessKeyId}}',
				accessKeySecret: '={{$credentials.accessKeySecret}}',
			},
		},
	};
}
