import { authenticate } from "../utils/authentication";
import { textOnly } from "@lens-protocol/metadata";
import { storageClient } from "../utils/storageClient";
import {
  blockchainData,
  dateTime,
  evmAddress,
  postId,
  uri,
} from "@lens-protocol/client";
import { executePostAction, post } from "@lens-protocol/client/actions";
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

  const metadata = textOnly({
    content: `GM! GM!`,
  });

  const { uri: postURI } = await storageClient.uploadAsJson(metadata);

  // 2. Create keccak keys
  const keyWarId = keccak256(toUtf8Bytes("lens.param.warId"));
  const keyOutcome = keccak256(toUtf8Bytes("lens.param.outcome"));

  // 3. Encode the values as ABI
  const encodedWarId = defaultAbiCoder.encode(["uint256"], [1]);
  const encodedOutcome1 = defaultAbiCoder.encode(["uint16"], [1]);
  const encodedOutcome2 = defaultAbiCoder.encode(["uint16"], [2]);

  const stake = parseEther("0.001");

  // const result = await post(sessionClient, {
  //   contentUri: uri(postURI),
  //   actions: [
  //     {
  //       unknown: {
  //         address: evmAddress("0xF13D917D037e7d65cacfd2F739B579AC70203e0A"),
  //         params: [
  //           {
  //             raw: {
  //               key: blockchainData(keyWarId),
  //               data: blockchainData(encodedWarId),
  //             },
  //           },
  //           {
  //             raw: {
  //               key: blockchainData(keyOutcome),
  //               data: blockchainData(encodedOutcome1),
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   ],
  // }).andThen(handleOperationWith(signer));

  const result = await executePostAction(sessionClient, {
    post: postId(
      "3074444738793955210812987261500622091936914464418994570129214333300368901845"
    ),
    action: {
      unknown: {
        address: evmAddress("0xF13D917D037e7d65cacfd2F739B579AC70203e0A"),
        params: [
          {
            key: blockchainData(
              "0xc4b43ac09e131e6a42c80d3aef32e77c3bc28d5423789bcfbfcf8be0feac708d"
            ),
            data: blockchainData(
              "0x0000000000000000000000000000000000000000000000000000000000000001"
            ),
          },
          {
            key: blockchainData(
              "0x5db60783da8fbb85fb7e3f94133fddb5a81cde2c804f358f6db1854a56ea10e0"
            ),
            data: blockchainData(
              "0x0000000000000000000000000000000000000000000000000000000000000001"
            ),
          },
        ],
      },
    },
  }).andThen(handleOperationWith(signer));

  console.log(result);
};
