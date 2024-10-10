import { ApiGatewayV2Adapter } from '../infrastructure/routing/ApiGatewayV2Adapter';
import cloudProvider from './cloudConfig';

const routingAdapter = new ApiGatewayV2Adapter(cloudProvider);

export default routingAdapter;
