import { authenticate } from "../utils/authentication";
import { textOnly } from "@lens-protocol/metadata";
import { storageClient } from "../utils/storageClient";
import { blockchainData, evmAddress, uri } from "@lens-protocol/client";
import {
  executePostAction,
  fetchGroup,
  post,
} from "@lens-protocol/client/actions";
import {
  keccak256,
  toUtf8Bytes,
  Interface,
  parseEther,
  ethers,
  AbiCoder,
} from "ethers";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import dotenv from "dotenv";
import { ClashOfLensAddress } from "../utils/abi";
dotenv.config();

// Function to get signer from private key
export const getSignerFromPrivateKey = (privateKey: string) => {
  const provider = new ethers.JsonRpcProvider(
    `https://lens-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
  );
  return new ethers.Wallet(privateKey, provider);
};

export const postWarDetails = async (
  warid: string,
  clan1: string,
  clan2: string
) => {
  const sessionClient: any = await authenticate();
  const signer = getSignerFromPrivateKey(process.env.PRIVATE_KEY!);
  const defaultAbiCoder = new AbiCoder();

  const clan1Details: any = await fetchGroup(sessionClient, {
    group: evmAddress(clan1),
  });

  const clan2Details: any = await fetchGroup(sessionClient, {
    group: evmAddress(clan2),
  });

  const clan1Data = clan1Details.value;
  const clan2Data = clan2Details.value;

  if (!clan1Data || !clan2Data) {
    throw new Error("Clan details not found");
  }

  console.log(clan1Details);
  console.log(clan2Details);

  const metadata = textOnly({
    content: `🏆 Place your bet for Favourite Clan ❤️. \n\n War ID: ${warid} \n\n War: ${clan1Data.metadata.name} vs ${clan2Data.metadata.name}`,
  });

  const { uri: postURI } = await storageClient.uploadAsJson(metadata);

  // 2. Create keccak keys
  const keyWarId = keccak256(toUtf8Bytes("lens.param.warId"));
  const keyOutcome = keccak256(toUtf8Bytes("lens.param.outcome"));

  // 3. Encode the values as ABI
  const encodedWarId = defaultAbiCoder.encode(["uint256"], [warid]);
  const encodedOutcome1 = defaultAbiCoder.encode(["uint16"], [1]);

  const result = await post(sessionClient, {
    contentUri: uri(postURI),
    actions: [
      {
        unknown: {
          address: evmAddress(ClashOfLensAddress),
          params: [
            {
              raw: {
                key: blockchainData(keyWarId),
                data: blockchainData(encodedWarId),
              },
            },
            {
              raw: {
                key: blockchainData(keyOutcome),
                data: blockchainData(encodedOutcome1),
              },
            },
          ],
        },
      },
    ],
  }).andThen(handleOperationWith(signer));

  console.log(result);
};
