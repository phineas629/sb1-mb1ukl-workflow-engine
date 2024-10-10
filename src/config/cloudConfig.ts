import { CloudProviderFactory } from '../infrastructure/cloud/CloudProviderFactory';

const cloudProvider = CloudProviderFactory.getCloudProvider(process.env.CLOUD_PROVIDER || 'aws');

export default cloudProvider;
