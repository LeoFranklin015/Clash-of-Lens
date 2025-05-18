import { fetchGroupMembers } from "@lens-protocol/client/actions";
import { client } from "../utils/client";
import { evmAddress } from "@lens-protocol/client";
export const getGroupMembers = async (groupAddress: string) => {
  let members: any[] = [];
  const result = await fetchGroupMembers(client, {
    group: evmAddress(groupAddress),
  });
  if (result.isErr()) {
    return console.error(result.error);
  }

  const { items, pageInfo } = result.value;
  for (const item of items) {
    console.log(item.account.address);
    members.push(item.account.address);
  }
  return members;
};
