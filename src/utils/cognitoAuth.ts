import { CognitoJwtVerifier } from 'aws-jwt-verify';

let verifier: CognitoJwtVerifier<{ userPoolId: string; tokenUse: string; clientId: string }>;

export async function verifyToken(token: string): Promise<boolean> {
  if (!verifier) {
    verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      tokenUse: 'id',
      clientId: process.env.COGNITO_CLIENT_ID!,
    });
  }

  try {
    await verifier.verify(token);
    return true;
  } catch {
    return false;
  }
}
