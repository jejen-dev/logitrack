import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    merchantId?: string;
    isMerchantOwner?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      merchantId?: string;
      isMerchantOwner?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    merchantId?: string;
    isMerchantOwner?: boolean;
    authProvider?: string;
  }
}
