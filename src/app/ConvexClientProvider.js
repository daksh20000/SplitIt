"use client";

import {useAuth} from "@clerk/clerk-react"
import {ConvexProviderWithClerk} from "convex/react-clerk"
import{ConvexReactClient} from "convex/react"
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function ConvexClientProvider({ children }) {
  return <ConvexProviderWithClerk client={convex} useAuth = {useAuth}>{children}</ConvexProviderWithClerk>;
}
