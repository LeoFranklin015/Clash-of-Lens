import { ConnectKitButton } from "connectkit";
import { Wallet2 } from "lucide-react";

export const ConnectButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        isConnecting,
        show,
        ensName,

        truncatedAddress,
      }) => {
        return (
          <button
            onClick={show}
            className="cursor-pointer px-3 py-1 text-xs border border-[#39FF14]  hover:bg-[#39FF14] transition-all relative overflow-hidden group rounded flex items-center gap-2 hover:text-[#0B0B0F] text-[#39FF14]"
          >
            <Wallet2 className="w-5 h-5 animate-pulse group-hover:animate-none" />
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
