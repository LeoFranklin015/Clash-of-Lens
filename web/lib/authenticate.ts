import { client } from "./client";
import { signMessageWith } from "@lens-protocol/client/ethers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lensAuth = async (address: string, signer: any) => {
  const authenticated = await client.login({
    accountOwner: {
      app: "0x7208e865B25c4A4A8f4F0235bb331Fdb1eb0bA80",
      owner: signer.address,
      account: address,
    },
    signMessage: signMessageWith(signer),
  });

  if (authenticated.isErr()) {
    return console.error(authenticated.error);
  }

  // SessionClient: { ... }
  const sessionClient = authenticated.value;
  return sessionClient;
};
