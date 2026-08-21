import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';
import { Credentials } from '../type/enums';
import { getCommonOptions } from './sharedOptions';
import { extractList, extractTotal } from './pagination';

export interface YingdaoApiResponse {
	code?: number;
	msg?: string;
	success?: boolean;
	data?: unknown;
	page?: IDataObject;
	requestId?: string;
}

export function isTokenExpired(code: unknown): boolean {
	return Number(code) === 401;
}

export function isYingdaoSuccess(res: YingdaoApiResponse | undefined): boolean {
	if (!res) {
		return false;
	}
	if (isTokenExpired(res.code)) {
		return false;
	}
	if (res.success === true) {
		return true;
	}
	return res.code === 0 || res.code === 200;
}

class RequestUtils {
	static unwrap(res: YingdaoApiResponse): IDataObject {
		const extra: IDataObject = {};
		if (res.page) {
			extra.page = res.page;
		}
		if (res.requestId) {
			extra.requestId = res.requestId;
		}
		if (res.msg) {
			extra.msg = res.msg;
		}

		if (res.data === null || res.data === undefined) {
			return { success: true, ...extra };
		}
		if (Array.isArray(res.data)) {
			return { data: res.data, ...extra };
		}
		if (typeof res.data === 'object') {
			return { ...(res.data as IDataObject), ...extra };
		}
		return { data: res.data as IDataObject[string], ...extra };
	}

	static async originRequest(
		this: IExecuteFunctions,
		options: IHttpRequestOptions,
		clearAccessToken = false,
	) {
		const credentials = await this.getCredentials(Credentials.YingdaoRpaApi);
		options.baseURL = String(credentials.baseUrl).replace(/\/$/, '');
		if (options.json === undefined) {
			options.json = true;
		}

		const timeout = getCommonOptions(this).timeout;
		if (options.timeout === undefined && timeout) {
			options.timeout = timeout;
		}

		return this.helpers.httpRequestWithAuthentication.call(
			this,
			Credentials.YingdaoRpaApi,
			options,
			{
				credentialsDecrypted: {
					id: '',
					name: Credentials.YingdaoRpaApi,
					type: Credentials.YingdaoRpaApi,
					data: {
						...credentials,
						accessToken: clearAccessToken ? '' : credentials.accessToken,
					},
				},
			},
		);
	}

	static parseResponse(raw: unknown): YingdaoApiResponse {
		if (typeof raw === 'string') {
			return JSON.parse(raw) as YingdaoApiResponse;
		}
		return raw as YingdaoApiResponse;
	}

	static async request(
		this: IExecuteFunctions,
		options: IHttpRequestOptions,
	): Promise<IDataObject> {
		let res: YingdaoApiResponse;
		try {
			res = RequestUtils.parseResponse(await RequestUtils.originRequest.call(this, options));
		} catch (error) {
			if (error instanceof SyntaxError) {
				throw new NodeApiError(this.getNode(), error as unknown as JsonObject, {
					message: '影刀接口返回了无法解析的响应',
				});
			}
			throw error;
		}

		if (isTokenExpired(res?.code)) {
			res = RequestUtils.parseResponse(
				await RequestUtils.originRequest.call(this, options, true),
			);
		}

		if (!isYingdaoSuccess(res)) {
			throw new NodeApiError(this.getNode(), res as JsonObject, {
				message: `影刀接口错误：${res?.msg || `code=${res?.code}`}`,
			});
		}

		return RequestUtils.unwrap(res);
	}

	static async requestPaged(
		this: IExecuteFunctions,
		options: {
			method?: IHttpRequestOptions['method'];
			url: string;
			qs?: IDataObject;
			body?: IDataObject;
			returnAll: boolean;
			limit?: number;
			maxPageSize?: number;
			pageIn?: 'body' | 'qs' | 'pageDTO';
		},
	): Promise<IDataObject> {
		const maxPageSize = options.maxPageSize ?? 100;
		const limit = Math.max(options.limit ?? maxPageSize, 1);
		const pageSize = options.returnAll ? maxPageSize : Math.min(limit, maxPageSize);
		const pageIn = options.pageIn ?? 'body';
		const records: IDataObject[] = [];
		let page = 1;
		let total: number | undefined;

		while (true) {
			const pageParams: IDataObject = { page, size: pageSize };
			let qs = { ...(options.qs ?? {}) };
			let body = { ...(options.body ?? {}) };

			if (pageIn === 'qs') {
				qs = { ...qs, ...pageParams };
			} else if (pageIn === 'pageDTO') {
				body = {
					...body,
					pageDTO: {
						...pageParams,
						needCount: true,
					},
				};
			} else {
				body = { ...body, ...pageParams };
			}

			const result = await RequestUtils.request.call(this, {
				method: options.method ?? 'POST',
				url: options.url,
				qs: Object.keys(qs).length ? qs : undefined,
				body: pageIn === 'qs' ? undefined : body,
			});

			const items = extractList(result);
			total = extractTotal(result) ?? total ?? page * items.length;
			records.push(...items);

			if (items.length < pageSize) {
				break;
			}
			if (!options.returnAll && records.length >= limit) {
				break;
			}
			if (total !== undefined && records.length >= total) {
				break;
			}
			page += 1;
		}

		return {
			data: options.returnAll ? records : records.slice(0, limit),
			total: total ?? records.length,
		};
	}

	static async requestCursor(
		this: IExecuteFunctions,
		options: {
			url: string;
			body?: IDataObject;
			returnAll: boolean;
			limit?: number;
			maxPageSize?: number;
			cursorDirection?: string;
		},
	): Promise<IDataObject> {
		const maxPageSize = Math.min(options.maxPageSize ?? 500, 500);
		const limit = Math.max(options.limit ?? maxPageSize, 1);
		const pageSize = options.returnAll ? maxPageSize : Math.min(limit, maxPageSize);
		const records: IDataObject[] = [];
		let cursorId: number | undefined;
		const direction = options.cursorDirection || 'next';

		while (true) {
			const body: IDataObject = {
				...(options.body ?? {}),
				cursorDirection: direction,
				size: pageSize,
			};
			if (cursorId !== undefined) {
				body.cursorId = cursorId;
			}

			const result = await RequestUtils.request.call(this, {
				method: 'POST',
				url: options.url,
				body,
			});

			const items = extractList(result);
			records.push(...items);

			if (!options.returnAll && records.length >= limit) {
				break;
			}
			if (!result.hasData || result.nextId === undefined || result.nextId === null) {
				break;
			}
			if (items.length === 0) {
				break;
			}
			cursorId = Number(result.nextId);
			if (!Number.isFinite(cursorId)) {
				break;
			}
		}

		return {
			data: options.returnAll ? records : records.slice(0, limit),
			hasData: records.length > 0,
			nextId: cursorId,
		};
	}
}

export default RequestUtils;
