import fireRequest, { modelEndpoints } from "./fireRequest";
import { JWTAuth, ModelPK } from "./models";
import { Order, Prosumer, Trade } from "./models/DEX";

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
      { refresh }
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

export const Prosumers = {
  ...modelEndpoints<Prosumer>("/api/v1/prosumers/"),

  get(prosumer_id: ModelPK) {
    return {
      orders: modelEndpoints<Order>("/api/v1/prosumers/:prosumer_id/orders/", {
        rewrites: { prosumer_id },
      }),

      trades: modelEndpoints<Trade>("/api/v1/prosumers/:prosumer_id/trades/", {
        rewrites: { prosumer_id },
      }),
    };
  },
};

export const Orders = modelEndpoints<Order>("/api/v1/orders/");
export const Trades = modelEndpoints<Trade>("/api/v1/trades/");
