import { IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';
import FormData from 'form-data';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';
import NodeUtils from '../../../help/utils/NodeUtils';
import { commonOptions } from '../../../help/utils/sharedOptions';

const FileUploadOperate: ResourceOperations = {
	name: '上传文件',
	value: 'fileUpload',
	action: '上传文件',
	description: 'POST /oapi/dispatch/v2/file/upload',
	order: 90,
	options: [
		{
			displayName:
				'返回 data.fileKey，用于 Job 启动时 type=file 的参数 value，不能直接传文件路径或 URL。',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: '二进制字段名',
			name: 'binaryPropertyName',
			type: 'string',
			required: true,
			default: 'data',
			description: '输入项中的二进制属性名',
		},
		commonOptions,
	],
	async call(this, index) {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index) as string;
		const file = await NodeUtils.buildUploadFileData.call(this, binaryPropertyName, index);

		if (!file?.value) {
			throw new NodeOperationError(this.getNode(), '未找到文件数据，请检查二进制字段名', {
				itemIndex: index,
			});
		}

		const formData = new FormData();
		formData.append('file', file.value, {
			filename: file.options.filename || 'upload.bin',
			contentType: file.options.contentType,
		});

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: '/oapi/dispatch/v2/file/upload',
			body: formData,
			headers: formData.getHeaders(),
			json: false,
		} as IHttpRequestOptions);
	},
};

export default FileUploadOperate;
