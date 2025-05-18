"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { client } from "@/lib/client";
import type { SessionClient } from "@lens-protocol/client";
import { currentSession } from "@lens-protocol/client/actions";
import type { AuthenticatedSession } from "@lens-protocol/graphql";
import { useAccount } from "wagmi";
import { fetchAccountsBulk } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/client";

// Add LensAccount and related types
interface LensUsername {
  __typename: "Username";
  id: string;
  value: string;
  localName: string;
  linkedTo: string;
  ownedBy: string;
  timestamp: string;
  namespace: string;
  operations: null | unknown;
}

interface AccountMetadata {
  __typename: "AccountMetadata";
  attributes: unknown[];
  bio: string | null;
  coverPicture: string | null;
  id: string;
  name: string | null;
  picture: string | null;
}

interface LensAccount {
  __typename: "Account";
  address: string;
  owner: string;
  score: number;
  createdAt: string;
  username: LensUsername | null;
  metadata: AccountMetadata | null;
  operations: null | unknown;
  rules: unknown;
  actions: unknown[];
}

interface SessionContextType {
  sessionClient: SessionClient | null;
  setSessionClient: (session: SessionClient) => void;
  getCurrentSession: () => Promise<AuthenticatedSession | null>;
  clearSession: () => Promise<void>;
  profile: LensAccount | null;
  setProfile: (profile: LensAccount | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sessionClient, setSessionClientState] = useState<SessionClient | null>(
    null
  );
  const [profile, setProfile] = useState<LensAccount | null>(null);
  const { address } = useAccount();

  // Load session from localStorage on mount
  useEffect(() => {
    const resume = async () => {
      const resumed = await client.resumeSession();
      if (resumed.isErr()) {
        return console.error(resumed.error);
      }
      const sessionClient = resumed.value;
      setSessionClientState(sessionClient);
    };
    resume();
  }, []);

  // Fetch Lens profile when address changes
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!address) return;
      const result = await fetchAccountsBulk(client, {
        ownedBy: [evmAddress(address)],
      });
      if (result.isErr()) {
        return console.error(result.error);
      }
      const accounts = result.value;
      if (accounts && accounts.length > 0) {
        setProfile(accounts[0]);
      } else {
        setProfile(null);
      }
    };
    if (address) {
      fetchAccountDetails();
    } else {
      setProfile(null);
    }
  }, [address]);

  // Expose a method to get the current session details
  const getCurrentSession = async (): Promise<AuthenticatedSession | null> => {
    if (!sessionClient) return null;
    const result = await currentSession(sessionClient);
    if (result.isErr()) {
      console.error(result.error);
      return null;
    }
    return result.value;
  };

  // Expose a method to clear the session and logout
  const clearSession = async () => {
    if (sessionClient) {
      await sessionClient.logout();
    }
    setSessionClientState(null);
    setProfile(null);
  };

  return (
    <SessionContext.Provider
      value={{ sessionClient, setSessionClient: setSessionClientState, getCurrentSession, clearSession, profile, setProfile }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
};
