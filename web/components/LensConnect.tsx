import { useState, useEffect } from "react";
import { client } from "@/lib/client";
import { useEthersSigner } from "@/lib/walletClientToSigner";
import { signMessageWith } from "@lens-protocol/client/ethers";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";

const appId = {
    mainnet: "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE",
    testnet: "0xC75A89145d765c396fd75CbD16380Eb184Bd2ca7",
}

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
                    app: appId.testnet,
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
            {!authenticated ? (
                <div>{loading ? "Authenticating…" : "Waiting for authentication…"}</div>
            ) : (
                <div>
                    <div>Authenticated!</div>
                    {accounts ? (
                        <div>
                            <h3>Accounts:</h3>
                            <ul>
                                {Array.isArray(accounts) && accounts.length > 0 ? (
                                    accounts.map((acc, idx) => (
                                        <li key={idx}>{JSON.stringify(acc)}</li>
                                    ))
                                ) : (
                                    <li>No accounts found.</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <div>Loading accounts…</div>
                    )}
                </div>
            )}
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
        </div>
    );
};

