"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { client } from "@/lib/client";
import type { SessionClient } from "@lens-protocol/client";
import { currentSession } from "@lens-protocol/client/actions";
import type { AuthenticatedSession } from "@lens-protocol/graphql";

interface SessionContextType {
  sessionClient: SessionClient | null;
  setSessionClient: (session: SessionClient) => void;
  getCurrentSession: () => Promise<AuthenticatedSession | null>;
  clearSession: () => Promise<void>;
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
  };

  return (
    <SessionContext.Provider
      value={{ sessionClient, setSessionClient: setSessionClientState, getCurrentSession, clearSession }}
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
