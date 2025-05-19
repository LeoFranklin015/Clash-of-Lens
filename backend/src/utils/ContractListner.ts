import { publicClient } from "./client";
import { ClashOfLensABI } from "./abi";
import { Log } from "viem";
import dotenv from "dotenv";
import { storeSnapShot } from "../handlers/storeSnapShot";
import { postWarDetails } from "../handlers/postWarDetails";
dotenv.config();

export class ContractListener {
  private unwatch: (() => void) | null = null;
  private contractAddress: string;
  private eventName: string;

  constructor(contractAddress: string, eventName: string) {
    this.contractAddress = contractAddress;
    this.eventName = eventName;
  }

  public startListening(onLogs: (logs: Log[]) => void): void {
    try {
      this.unwatch = publicClient.watchContractEvent({
        address: this.contractAddress as `0x${string}`,
        abi: ClashOfLensABI,
        eventName: this.eventName,
        onLogs: async (logs: any) => {
          onLogs(logs);

          await storeSnapShot(
            logs[0].args.warId,
            logs[0].args.clan1,
            logs[0].args.clan2
          );

          await postWarDetails(
            logs[0].args.warId,
            logs[0].args.clan1,
            logs[0].args.clan2
          );
          console.log(logs);
        },
        onError: (error) => {
          console.error("Error in contract event listener:", error);
          // Attempt to restart listening on error
          this.stopListening();
          this.startListening(onLogs);
        },
      });

      console.log(
        `Started listening to ${this.eventName} events on contract ${this.contractAddress}`
      );
    } catch (error) {
      console.error("Failed to start contract event listener:", error);
      throw error;
    }
  }

  public stopListening(): void {
    if (this.unwatch) {
      this.unwatch();
      this.unwatch = null;
      console.log(`Stopped listening to ${this.eventName} events`);
    }
  }
}

// Example usage:
// const listener = new ContractListener('0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2')
// listener.startListening((logs) => {
//   console.log('Received logs:', logs)
// })
