import { client } from "./client";
import { signMessageWith } from "@lens-protocol/client/ethers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lensAuth = async (address: string, signer: any) => {
  const authenticated = await client.login({
    accountOwner: {
      app: "0xC75A89145d765c396fd75CbD16380Eb184Bd2ca7",
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
