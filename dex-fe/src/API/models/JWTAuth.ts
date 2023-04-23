export declare interface TokenObtainPair {
  access: string;
  refresh: string;
}

export declare interface TokenRefresh {
  access: string;
}

export declare interface BillingAccount {
  id: number;
  username: string;
  name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export declare interface RegisterBillingAccount {
  username: string;
  email: string;
  password1: string;
  password2: string;
}
