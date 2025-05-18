import { Coins } from "lucide-react"
import { useChainId, useReadContract, useWriteContract } from "wagmi";
import { contractsConfig } from "@/lib/contractsConfig";
import { formatEther, parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function DepositBalanceButton({ groupAddress, onDeposited }: { groupAddress: string, onDeposited: () => void }) {
    const chainId = useChainId();
    const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();
    const [showInput, setShowInput] = useState(false);
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleDeposit = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast({ title: "Invalid amount", description: "Please enter a valid amount of ETH to deposit.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            await writeContract({
                address: contractsConfig[chainId as keyof typeof contractsConfig]?.contractAddress as `0x${string}`,
                abi: contractsConfig[chainId as keyof typeof contractsConfig]?.contractABI,
                functionName: "depositBalance",
                args: [groupAddress],
                value: parseEther(amount),
            });
            toast({ title: "Deposit submitted", description: `Depositing ${amount} ETH...` });
            setShowInput(false);
            setAmount("");
            onDeposited();
        } catch (err: unknown) {
            let message = "Transaction failed";
            if (err instanceof Error) message = err.message;
            toast({ title: "Deposit failed", description: message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            {showInput ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="number"
                        min="0"
                        step="any"
                        className="bg-black border border-[#a3ff12] text-white rounded px-2 py-1 focus:outline-none"
                        placeholder="Amount in ETH"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        disabled={isPending || isLoading}
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleDeposit}
                            disabled={isPending || isLoading || !amount}
                            className="cursor-pointer bg-[#a3ff12] text-black border border-[#a3ff12] hover:bg-black hover:text-[#a3ff12]"
                        >
                            {(isPending || isLoading) ? (
                                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-[#a3ff12] border-t-transparent rounded-full animate-spin" /> Depositing...</span>
                            ) : "Confirm Deposit"}
                        </Button>
                        <Button
                            className="cursor-pointer"
                            variant="outline"
                            onClick={() => setShowInput(false)}
                            disabled={isPending || isLoading}
                        >Cancel</Button>
                    </div>
                </div>
            ) : (
                <Button
                    onClick={() => setShowInput(true)}
                    className="cursor-pointer bg-[#a3ff12] text-black border border-[#a3ff12] hover:bg-black hover:text-[#a3ff12] w-full"
                >Deposit</Button>
            )}
            {isError && <div className="text-red-500 text-xs mt-2">{error?.message || "Transaction failed"}</div>}
            {isSuccess && <div className="text-green-500 text-xs mt-2">Deposit successful!</div>}
        </div>
    );
}

export function GroupTreasury({ groupAddress }: { groupAddress: string }) {
    const chainId = useChainId();
    const {
        data: balance,
        isLoading: balanceLoading,
        refetch: refetchBalance
    } = useReadContract({
        address: contractsConfig[chainId as keyof typeof contractsConfig].contractAddress as `0x${string}`,
        abi: contractsConfig[chainId as keyof typeof contractsConfig].contractABI,
        functionName: "clanBalances",
        args: [groupAddress],
    });

    return <div className="border border-[#a3ff12] bg-black bg-opacity-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
            <Coins className="h-5 w-5 text-[#a3ff12] mr-2" />
            <h3 className="text-gray-400 text-xs font-medium">TREASURY</h3>
        </div>
        {balanceLoading ? (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-24 mb-2"></div>
            </div>
        ) : (
            <p className="text-white text-2xl font-bold">
                {formatEther(balance as bigint)}
            </p>
        )}
        <DepositBalanceButton groupAddress={groupAddress} onDeposited={refetchBalance} />
    </div>
}
