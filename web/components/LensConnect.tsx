import { useState, useEffect } from "react";
import { client } from "@/lib/client";
import { useEthersSigner } from "@/lib/walletClientToSigner";
import { signMessageWith } from "@lens-protocol/client/ethers";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";

const appId = {
  mainnet: "0x7208e865B25c4A4A8f4F0235bb331Fdb1eb0bA80",
  testnet: "0x93cfc80caEf74845880a5AD0AAfc585f89f6c637",
};

// If you have the type, import it:
// import { AccountManaged } from '@lens-protocol/client';
// For now, define a minimal type for display:
type AccountManaged = Record<string, unknown>;

export const LensConnect = () => {
  const signer = useEthersSigner();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [accounts, setAccounts] = useState<AccountManaged[] | null>(null);

  const handleAuthenticate = async () => {
    if (!signer) return;
    setLoading(true);
    setError(null);
    setAccounts(null);
    try {
      const result = await client.login({
        onboardingUser: {
          app: appId.mainnet,
          wallet: signer.address,
        },
        signMessage: signMessageWith(signer),
      });
      if (result.isErr()) {
        setError(String(result.error));
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      setAuthenticated(true);
      // Now fetch accounts
      const accountsResult = await fetchAccountsAvailable(client, {
        managedBy: evmAddress(signer.address),
        includeOwned: true,
      });
      if (accountsResult.isOk()) {
        setAccounts(Array.from(accountsResult.value.items) as AccountManaged[]);
      } else {
        setError(String(accountsResult.error));
        setAccounts(null);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error");
      }
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Automatically authenticate when signer is available and not already authenticated
  useEffect(() => {
    if (signer && !authenticated && !loading) {
      handleAuthenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  if (!signer) return <div>Connect your wallet to continue.</div>;

  return (
    <div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}
      {authenticated && accounts && (
        <div>
          <h3>Accounts:</h3>
          <ul>
            {accounts.length === 0 && <li>No accounts found.</li>}
            {accounts.map((account, idx) => (
              <li key={idx}>{JSON.stringify(account)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
