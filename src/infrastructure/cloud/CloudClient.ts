export interface CloudClient {
  getStorageClient(): unknown;
  getFunctionClient(): unknown;
  getAuthClient(): unknown;
}
