import type {
	IDataObject,
	INodeExecutionData,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { attachResultObj } from './parameters';

function asDataObject(value: unknown): IDataObject {
	if (value && typeof value === 'object' && !Array.isArray(value)) {
		return value as IDataObject;
	}
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (!trimmed) {
			return {};
		}
		try {
			const parsed = JSON.parse(trimmed) as unknown;
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				return parsed as IDataObject;
			}
			return { data: parsed as IDataObject[string] };
		} catch {
			return { raw: trimmed };
		}
	}
	if (value === undefined || value === null) {
		return {};
	}
	return { data: value as IDataObject[string] };
}

function pickQueryValue(query: IDataObject, key: string): string | undefined {
	const value = query[key];
	if (Array.isArray(value)) {
		const first = value[0];
		return first === undefined || first === null ? undefined : String(first);
	}
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	return String(value);
}

export function handleJobCallbackWebhook(context: IWebhookFunctions): IWebhookResponseData {
	const body = asDataObject(context.getBodyData());
	const query = asDataObject(context.getQueryData() as IDataObject);
	const options = asDataObject(context.getNodeParameter('options', {}));
	const item: INodeExecutionData = {
		json: attachResultObj(
			{
				...body,
				callbackQuery: {
					bodyMd5: pickQueryValue(query, 'bodyMd5'),
					timestamp: pickQueryValue(query, 'timestamp'),
					sign: pickQueryValue(query, 'sign'),
				},
			},
			options.convertResultToObject === true,
		),
	};

	return {
		webhookResponse: { success: true },
		workflowData: [[item]],
	};
}
