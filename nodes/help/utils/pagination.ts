import type { IDataObject } from 'n8n-workflow';

export interface YingdaoPageInfo {
	total?: number;
	size?: number;
	page?: number;
	pages?: number;
}

export function extractList(payload: IDataObject | IDataObject[]): IDataObject[] {
	if (Array.isArray(payload)) {
		return payload;
	}
	if (Array.isArray(payload.dataList)) {
		return payload.dataList as IDataObject[];
	}
	if (Array.isArray(payload.result)) {
		return payload.result as IDataObject[];
	}
	if (Array.isArray(payload.data)) {
		return payload.data as IDataObject[];
	}
	return [];
}

export function extractTotal(payload: IDataObject): number | undefined {
	const page = payload.page as YingdaoPageInfo | undefined;
	const pageDTO = payload.pageDTO as YingdaoPageInfo | undefined;
	const total = page?.total ?? pageDTO?.total ?? payload.total;
	if (total === undefined || total === null || total === '') {
		return undefined;
	}
	const num = Number(total);
	return Number.isFinite(num) ? num : undefined;
}

/**
 * 把形态 A（data.pageDTO + data.result）和形态 B（data 数组 + 顶层 page）归一成统一结构。
 */
export function normalizePageResult(payload: IDataObject): IDataObject {
	const page = (payload.page as YingdaoPageInfo | undefined) ??
		(payload.pageDTO as YingdaoPageInfo | undefined);
	const items = extractList(payload);
	return {
		data: items,
		page,
		requestId: payload.requestId,
		msg: payload.msg,
		hasData: payload.hasData,
		nextId: payload.nextId,
		preId: payload.preId,
		cursorDirection: payload.cursorDirection,
	};
}
