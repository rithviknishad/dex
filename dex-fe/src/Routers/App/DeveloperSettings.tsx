import { atom, useAtom } from "jotai";
import { classNames } from "../../utils/classNames";
import { Order, Prosumer } from "../../API/models/DEX";
import { useCallback, useEffect, useState } from "react";
import { Prosumers, Webhooks } from "../../API";
import { handleFireRequestError } from "../../API/fireRequest";
import { Model } from "../../API/models";
import { toast } from "react-hot-toast";
import { authProfileAtom } from "../../hooks/useJWTAuth";
import APIErrors from "../../Components/Common/APIErrors";
import moment from "moment";

const exchangeSignatureAtom = atom("");

export default function DeveloperSettings() {
  const [exchangeSignature, setExchangeSignature] = useAtom(
    exchangeSignatureAtom
  );
  return (
    <div className="p-4">
      <div className="p-8 bg-white rounded-lg">
        <h2 className="text-xl font-bold leading-7 text-gray-800 sm:truncate sm:text-2xl sm:tracking-tight">
          Developer Settings
        </h2>
        <div className="rounded-md bg-yellow-50 p-4 my-4">
          <div className="flex">
            <i className="fa-solid fa-exclamation-triangle text-yellow-400"></i>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Caution</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  These settings are for developers only. Changing these
                  settings may cause unexpected behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="m-4">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Exchange's Private Network Access Headers
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              These headers are used to control your access to the exchange's
              private network.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  X-Exchange-Signature
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div
                    className={classNames(
                      exchangeSignature ? "text-gray-900" : "text-gray-600"
                    )}
                  >
                    {exchangeSignature || "Not set"}
                  </div>
                  <button
                    type="submit"
                    onClick={() => {
                      setExchangeSignature(
                        prompt("Enter new X-Exchange-Signature") || ""
                      );
                    }}
                  >
                    Modify
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="m-4 mt-20">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Webhooks
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              These webhooks are used to invoke sensitive actions on the
              exchange's private network.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-96 sm:flex-none sm:pr-6">
                  /api/v1/trades/webhooks/exchange/
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div className="text-gray-600">
                    This webhook is used to manually trigger the processing of
                    all OPEN orders.
                  </div>
                  <button
                    type="submit"
                    className="!bg-yellow-600 hover:!bg-yellow-700"
                    onClick={() => {
                      toast.promise(Webhooks.processTrades(exchangeSignature), {
                        loading: "Triggering webhook: process_trades",
                        success: "All OPEN orders have been processed",
                        error: (err) => <APIErrors error={err} asRecord />,
                      });
                    }}
                  >
                    Invoke
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="m-4 mt-20">
          <OrderCreateBuilder />
        </div>
      </div>
    </div>
  );
}

interface BuilderOrder {
  prosumer?: Model<Prosumer>;
  price?: number;
  energy?: number;
  category?: Order["category"];
  created_obj?: Order;
}

const OrderCreateBuilder = () => {
  const [orders, setOrders] = useState<BuilderOrder[]>([]);

  const [availableProsumers, setAvailableProsumers] = useState<
    readonly Model<Prosumer>[]
  >([]);

  useEffect(() => {
    Prosumers.list()
      .then((res) => {
        setAvailableProsumers(res.data.results);
      })
      .catch(handleFireRequestError());
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create bulk orders on behalf of other prosumers
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Create bulk orders on behalf of other prosumers. This is useful for
            testing. Works only if you are a superuser.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              Prosumers.list()
                .then((res) => {
                  setAvailableProsumers(res.data.results);
                })
                .catch(handleFireRequestError());
            }}
          >
            Refresh prosumers list
          </button>
          <button
            type="button"
            onClick={() => setOrders((orders) => [...orders, {}])}
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>

      <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        {orders.length === 0 && (
          <div className="pt-6 sm:flex">
            <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
              No entries
            </dt>
          </div>
        )}
        {orders.map((order, index) => (
          <OrderCreateBuilderItem
            key={index}
            order={order}
            availableProsumers={availableProsumers}
            update={(order) => {
              setOrders((orders) => {
                const newOrders = [...orders];
                newOrders[index] = order;
                return newOrders;
              });
            }}
            remove={() => {
              setOrders((orders) => {
                const newOrders = [...orders];
                newOrders.splice(index, 1);
                return newOrders;
              });
            }}
          />
        ))}
      </dl>
    </div>
  );
};

const OrderCreateBuilderItem = ({
  order,
  availableProsumers,
  update,
  remove,
}: {
  order: BuilderOrder;
  availableProsumers: readonly Model<Prosumer>[];
  update: (order: BuilderOrder) => void;
  remove: () => void;
}) => {
  const [account] = useAtom(authProfileAtom);

  const validate = useCallback(() => {
    if (!account?.is_superuser) {
      toast.error("You are not a superuser");
      return false;
    }
    if (!order.prosumer) {
      toast.error("Please select a prosumer");
      return false;
    }

    if (!order.energy) {
      toast.error("Please enter energy");
      return false;
    }

    if (order.energy > 0 && !order.price) {
      toast.error("Please enter price");
      return false;
    }

    if (!order.category) {
      toast.error("Please select a category");
      return false;
    }

    return true;
  }, [order]);

  const create = useCallback(() => {
    if (!validate()) return;

    toast.promise(
      Prosumers.get(order.prosumer!.id)
        .orders.create({
          prosumer: order.prosumer!.id,
          price: order.price ?? 0,
          energy: order.energy,
          category: order.category,
        })
        .then((res) => {
          update({ ...order, created_obj: res.data });
        }),
      {
        loading: "Creating order",
        success: "Order created",
        error: "Failed to create order",
      }
    );
  }, [order]);
  return (
    <div className="pt-6 sm:flex items-center">
      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
        <select
          disabled={!!order.created_obj}
          value={order.prosumer?.id || ""}
          onChange={(e) => {
            const prosumer = availableProsumers.find(
              (p) => p.id === e.target.value
            );
            if (prosumer) {
              update({ ...order, prosumer });
            }
          }}
        >
          <option value="">Select prosumer</option>
          {availableProsumers.map((prosumer) => (
            <option value={prosumer.id}>
              {prosumer.name} ({moment(prosumer.updated_on).fromNow()})
            </option>
          ))}
        </select>
      </dt>
      <div className="flex whitespace-nowrap items-center gap-2">
        <label className="required">Net Export Energy (Wh)</label>
        <input
          className="max-w-[128px]"
          disabled={!!order.created_obj}
          type="number"
          value={order.energy || ""}
          step={1}
          onChange={(e) => {
            update({ ...order, energy: e.target.valueAsNumber });
          }}
        />
      </div>
      <div className="flex whitespace-nowrap items-center gap-2 ml-4">
        <label>Price (Sparks)</label>
        <input
          className="max-w-[128px]"
          disabled={!!order.created_obj}
          type="number"
          value={order.price || ""}
          step={1}
          onChange={(e) => {
            update({ ...order, price: e.target.valueAsNumber });
          }}
        />
      </div>
      <div className="flex whitespace-nowrap items-center gap-2 ml-4">
        <label>Category</label>
        <select
          disabled={!!order.created_obj}
          value={order.category}
          onChange={(e) => {
            update({ ...order, category: e.target.value as Order["category"] });
          }}
        >
          <option value="">Select category</option>
          {Object.values(OrderCategory).map((category) => (
            <option value={category}>{category}</option>
          ))}
        </select>
      </div>
      <dd className="mt-1 flex justify-end gap-x-3 sm:mt-0 sm:flex-auto">
        <button
          disabled={!!order.created_obj || !order.energy}
          type="submit"
          onClick={() => create()}
          className={classNames(
            order.energy
              ? order.energy > 0
                ? "!bg-green-600"
                : "!bg-yellow-500"
              : ""
          )}
        >
          {order.energy ? (order.energy < 0 ? "Buy" : "Sell") : "Enter energy"}
        </button>
        <button
          disabled={!!order.created_obj}
          className="!bg-red-500"
          type="submit"
          onClick={() => remove()}
        >
          <i className="fa-solid fa-minus" />
        </button>
      </dd>
    </div>
  );
};

const OrderCategory = [
  "SOLAR",
  "WIND",
  "HYDRO",
  "GEOTHERMAL",
  "NUCLEAR",
  "BIOMASS",
  "STORAGE",
  "DOMESTIC",
  "MUNICIPAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "AGRICULTURAL",
];
