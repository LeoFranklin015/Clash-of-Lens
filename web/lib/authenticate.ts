import { client } from "./client";
import { signMessageWith } from "@lens-protocol/client/ethers";

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
