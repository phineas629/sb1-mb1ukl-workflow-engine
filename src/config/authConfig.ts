import { AuthAdapterFactory } from '../infrastructure/auth/AuthAdapterFactory';

const authAdapter = AuthAdapterFactory.getAuthAdapter(process.env.AUTH_ADAPTER || 'cognito');

export default authAdapter;
