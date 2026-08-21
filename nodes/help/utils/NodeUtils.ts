import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

interface IUploadFileData {
	value: Buffer;
	options: {
		filename?: string;
		filelength?: number;
		contentType?: string;
	};
}

class NodeUtils {
	static getNodeFixedCollection(data: IDataObject, collectionName: string): IDataObject[] {
		const collection = data[collectionName];
		if (Array.isArray(collection)) {
			return collection as IDataObject[];
		}
		return [];
	}

	static async buildUploadFileData(
		this: IExecuteFunctions,
		inputDataFieldName: string,
		index = 0,
	): Promise<IUploadFileData> {
		const binaryData = this.helpers.assertBinaryData(index, inputDataFieldName);

		if (!binaryData) {
			throw new NodeOperationError(this.getNode(), '未找到二进制数据', { itemIndex: index });
		}

		const buffer = await this.helpers.getBinaryDataBuffer(index, inputDataFieldName);

		let fileLength: number | undefined;
		if (binaryData.fileSize !== undefined) {
			fileLength =
				typeof binaryData.fileSize === 'string'
					? parseInt(binaryData.fileSize, 10)
					: binaryData.fileSize;
		}

		return {
			value: buffer,
			options: {
				filename: binaryData.fileName,
				filelength: fileLength,
				contentType: binaryData.mimeType,
			},
		};
	}
}

export default NodeUtils;
