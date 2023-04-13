import fireRequest from "./fireRequest";
import { JWTAuth } from "./models";

/**
 * Authentication related endpoints.
 */
export const Auth = {
  tokenCreate(username: string, password: string) {
    return fireRequest<JWTAuth.TokenObtainPair>(
      "POST /api/v1/auth/token/",
      { username, password },
      { noAuth: true }
    );
  },

  tokenRefreshCreate(refresh: string) {
    return fireRequest<JWTAuth.TokenRefresh>(
      "POST /api/v1/auth/token/refresh/",
      {
        refresh,
      }
    );
  },

  register(data: JWTAuth.RegisterBillingAccount) {
    return fireRequest<{}>("POST /api/v1/auth/register/", data as any, {
      noAuth: true,
    });
  },

  profile: {
    read: () => fireRequest<JWTAuth.BillingAccount>("GET /api/v1/auth/user/"),
    update: (data: Partial<JWTAuth.BillingAccount>) =>
      fireRequest<JWTAuth.BillingAccount>("PATCH /api/v1/auth/user/", data),
  },
};
