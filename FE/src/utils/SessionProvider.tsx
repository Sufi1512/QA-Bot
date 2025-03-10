"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

function AuthProvider({ children }: React.PropsWithChildren<object>) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvider;
