import type { IDataObject } from 'n8n-workflow';

export function pickFilled(values: Record<string, unknown>): IDataObject {
	const out: IDataObject = {};
	for (const [key, value] of Object.entries(values)) {
		if (value === undefined || value === null) {
			continue;
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (trimmed === '') {
				continue;
			}
			out[key] = trimmed;
			continue;
		}
		if (Array.isArray(value) && value.length === 0) {
			continue;
		}
		out[key] = value as IDataObject[string];
	}
	return out;
}

export function asJsonString(value: unknown): string | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed === '' ? undefined : trimmed;
	}
	return JSON.stringify(value);
}

export function parseJsonValue(value: unknown): unknown {
	if (typeof value !== 'string') {
		return value;
	}
	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}
	try {
		return JSON.parse(trimmed);
	} catch {
		return trimmed;
	}
}

export function toResultObj(result: unknown): IDataObject | undefined {
	if (!Array.isArray(result)) {
		return undefined;
	}
	const out: IDataObject = {};
	for (const item of result) {
		if (!item || typeof item !== 'object' || Array.isArray(item)) {
			continue;
		}
		const name = String((item as IDataObject).name ?? '').trim();
		if (!name) {
			continue;
		}
		out[name] = parseJsonValue((item as IDataObject).value) as IDataObject[string];
	}
	return out;
}

export function attachResultObj(data: IDataObject, enabled: boolean): IDataObject {
	if (!enabled) {
		return data;
	}
	const resultObj = toResultObj(data.result);
	if (resultObj === undefined) {
		return data;
	}
	return { ...data, resultObj };
}

export function toNumberOrUndefined(value: unknown): number | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	const num = Number(value);
	return Number.isFinite(num) ? num : undefined;
}

export function splitList(value: unknown): string[] | undefined {
	if (Array.isArray(value)) {
		const items = value.map((item) => String(item).trim()).filter(Boolean);
		return items.length ? items : undefined;
	}
	if (typeof value === 'string') {
		const items = value
			.split(/[\n,]/)
			.map((item) => item.trim())
			.filter(Boolean);
		return items.length ? items : undefined;
	}
	return undefined;
}
