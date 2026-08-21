import {
	INodePropertyOptions,
	INodeExecutionData,
	INodeProperties,
	IDataObject,
	type IExecuteFunctions,
} from 'n8n-workflow';
import { OutputType } from './enums';

export type OperationResult =
	| IDataObject
	| IDataObject[]
	| {
			outputType: OutputType;
			outputData?: INodeExecutionData[][];
	  };

export type OperationCallFunction = (
	this: IExecuteFunctions,
	index: number,
) => Promise<OperationResult>;

export type ResourceOperations = INodePropertyOptions & {
	options: INodeProperties[];
	call?: OperationCallFunction;
	order?: number;
	requestIntervalMs?: number;
};

export type ResourceOptions = INodePropertyOptions & {
	order?: number;
};

export interface IResource extends INodePropertyOptions {
	operations: ResourceOperations[];
}

export type ResourceOptionWithoutOperations = Omit<IResource, 'operations'> & {
	operations: null;
};

export type OperationOptionWithoutDetails = Omit<ResourceOperations, 'options' | 'call'> & {
	options: null;
};
