import fireRequest, { modelEndpoints } from "./fireRequest";
import { JWTAuth, ModelPK } from "./models";
import { BuyOrder, Prosumer, SellOrder } from "./models/Prosumers";
import { Trade } from "./models/Trades";

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

export const Prosumers = {
  ...modelEndpoints<Prosumer>("/api/v1/prosumers/"),

  buyOrders: (prosumer_id: ModelPK) => {
    const { list, create, read } = modelEndpoints<BuyOrder>(
      `/api/v1/prosumers/${prosumer_id}/buy/`
    );
    return { list, create, read };
  },

  sellOrders: (prosumer_id: ModelPK) => {
    const { list, create, read } = modelEndpoints<SellOrder>(
      `/api/v1/prosumers/${prosumer_id}/sell/`
    );
    return { list, create, read };
  },

  trades: (prosumer_id: ModelPK) => {
    const { list, read } = modelEndpoints<Trade>(
      `/api/v1/prosumers/${prosumer_id}/trades/`
    );
    return { list, read };
  },
};

export const Trades = {
  list: modelEndpoints<Trade>("/api/v1/trades/").list,
  create: modelEndpoints<Trade>("/api/v1/trades/").create,
};
