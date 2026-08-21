import { INodePropertyOptions, INodeProperties, NodePropertyTypes } from 'n8n-workflow';
import {
	IResource,
	ResourceOperations,
	OperationCallFunction,
	ResourceOptionWithoutOperations,
	OperationOptionWithoutDetails,
} from '../type/IResource';

class ResourceBuilder {
	private resources: IResource[] = [];

	addResource(resource: INodePropertyOptions): void {
		this.resources.push({
			...resource,
			operations: [],
		});
	}

	addOperate(resourceName: string, operate: ResourceOperations): void {
		const resource = this.resources.find((r) => r.value === resourceName);
		if (resource) {
			resource.operations.push(operate);
		}
	}

	build(): INodeProperties[] {
		const properties: INodeProperties[] = [];
		properties.push(this.buildResourceProperty());
		for (const resource of this.resources) {
			if (resource.operations.length === 0) continue;
			properties.push(this.buildOperationProperty(resource));
			properties.push(...this.buildOperationOptions(resource));
		}
		return properties;
	}

	private buildResourceProperty(): INodeProperties {
		const resourceOptions: ResourceOptionWithoutOperations[] = this.resources.map((item) => ({
			...item,
			description: item.description || '',
			action: item.action || '',
			operations: null,
		}));

		return {
			displayName: 'Resource',
			name: 'resource',
			type: 'options' as NodePropertyTypes,
			noDataExpression: true,
			options: resourceOptions as INodePropertyOptions[],
			default: this.resources[0]?.value ?? '',
		};
	}

	private buildOperationProperty(resource: IResource): INodeProperties {
		const operationOptions: OperationOptionWithoutDetails[] = resource.operations.map((item) => ({
			...item,
			description: item.description || '',
			action: item.action || item.name || '',
			options: null,
			call: undefined,
			order: undefined,
			requestIntervalMs: undefined,
		}));

		return {
			displayName: 'Operation',
			name: 'operation',
			type: 'options' as NodePropertyTypes,
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: [resource.value],
				},
			},
			options: operationOptions as INodePropertyOptions[],
			default: resource.operations[0]?.value ?? '',
		};
	}

	private buildOperationOptions(resource: IResource): INodeProperties[] {
		const options: INodeProperties[] = [];
		for (const operation of resource.operations) {
			for (const option of operation.options) {
				const mergedDisplayOptions = {
					...option.displayOptions,
					show: {
						...option.displayOptions?.show,
						resource: [resource.value],
						operation: [operation.value],
					},
				};
				options.push({
					...option,
					displayOptions: mergedDisplayOptions,
				});
			}
		}
		return options;
	}

	getOperate(resourceName: string, operateName: string): ResourceOperations | undefined {
		const resource = this.resources.find((item) => item.value === resourceName);
		return resource?.operations.find((item) => item.value === operateName);
	}

	getCall(resourceName: string, operateName: string): OperationCallFunction | undefined {
		return this.getOperate(resourceName, operateName)?.call;
	}
}

export default ResourceBuilder;
