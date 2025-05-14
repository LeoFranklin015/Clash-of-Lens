"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type SessionClient = any; // Replace with your actual SessionClient type if available

interface SessionContextType {
  sessionClient: SessionClient | null;
  setSessionClient: (session: SessionClient) => void;
  clearSession: () => void;
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
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("session");
      if (stored) setSessionClientState({ session: JSON.parse(stored) });
    }
  }, []);

  // Save session to localStorage when it changes
  const setSessionClient = (sessionClient: SessionClient) => {
    setSessionClientState(sessionClient);
    if (typeof window !== "undefined" && sessionClient?.session) {
      localStorage.setItem("session", JSON.stringify(sessionClient.session));
    }
  };

  const clearSession = () => {
    setSessionClientState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("session");
    }
  };

  return (
    <SessionContext.Provider
      value={{ sessionClient, setSessionClient, clearSession }}
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
