import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { ROBOT_PARAM_TYPE_OPTIONS } from './constants';
import { pickFilled } from './parameters';

export const robotParamsCollection: INodeProperties = {
	displayName: '运行参数',
	name: 'params',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: true,
	},
	placeholder: '添加参数',
	default: {},
	description:
		'Must match published app parameter names. For type=file, value must be the fileKey from file upload.',
	options: [
		{
			name: 'param',
			displayName: '参数',
			values: [
				{
					displayName: '参数名',
					name: 'name',
					type: 'string',
					default: '',
					required: true,
				},
				{
					displayName: '参数值',
					name: 'value',
					type: 'string',
					default: '',
					description: 'For type=file, fill the fileKey returned by file upload',
				},
				{
					displayName: '类型',
					name: 'type',
					type: 'options',
					options: ROBOT_PARAM_TYPE_OPTIONS,
					default: 'str',
				},
			],
		},
	],
};

export function readRobotParams(
	context: IExecuteFunctions,
	index: number,
	parameterName = 'params',
): IDataObject[] {
	const collection = context.getNodeParameter(parameterName, index, {}) as IDataObject;
	const items = (collection.param as IDataObject[]) ?? [];
	return items
		.filter((item) => String(item.name ?? '').trim() !== '')
		.map((item) =>
			pickFilled({
				name: item.name,
				value: item.value,
				type: item.type,
				direction: 'In',
			}),
		);
}
