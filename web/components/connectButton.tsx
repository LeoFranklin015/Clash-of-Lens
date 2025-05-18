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
            className="cursor-pointer px-3 py-1 text-xs border border-[#a3ff12]  hover:bg-[#a3ff12] transition-all relative overflow-hidden group rounded flex items-center gap-2 hover:text-[#0B0B0F] text-[#a3ff12] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isConnecting}
          >
            <Wallet2 className={`w-5 h-5 ${isConnecting ? 'animate-spin' : 'animate-pulse group-hover:animate-none'}`} />
            {isConnecting
              ? 'Connecting...'
              : isConnected
                ? ensName ?? truncatedAddress
                : 'Connect Wallet'}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
