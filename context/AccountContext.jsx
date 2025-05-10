// context/AccountContext.tsx
"use client";
import { createContext, useContext } from "react";
import useAccount from "@/hooks/useAccount"; // Your custom hook


const AccountContext = createContext(undefined);

export const AccountProvider = ({ children }) => {
  const { user, loading } = useAccount(); // Use the existing hook

  return <AccountContext.Provider value={{ user, loading }}>{children}</AccountContext.Provider>;
};

// Custom hook to consume the context
export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }
  return context;
};

