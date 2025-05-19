import { lensAccountOnly, StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
export const uploadImage = async (image: File, address: string) => {
  const storageClient = StorageClient.create();
  const acl = lensAccountOnly(address as `0x${string}`, chains.testnet.id);
  const result = await storageClient.uploadFile(image, { acl });
  console.log(result);
  return result.uri;
};
