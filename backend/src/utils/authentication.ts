import { client } from "./client";
import { signMessageWith } from "@lens-protocol/client/ethers";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// Function to get signer from private key
export const getSignerFromPrivateKey = (privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(
    `https://lens-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
  );
  return new ethers.Wallet(privateKey, provider);
};

export const authenticate = async () => {
  // Get signer from private key
  const signer = getSignerFromPrivateKey(process.env.PRIVATE_KEY!);

  console.log(signer.address);

  const authenticated = await client.login({
    accountOwner: {
      account: `0x446e9e88Dc725f236527535a44Ae1fdEfbC47B55`,
      app: "0x93cfc80caEf74845880a5AD0AAfc585f89f6c637",
      owner: signer.address,
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
