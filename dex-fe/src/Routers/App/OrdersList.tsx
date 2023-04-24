import { useState } from "react";
import PaginatedApiTable from "../../Components/Common/PaginatedApiTable";
import { Order, Prosumer } from "../../API/models/DEX";
import { Orders } from "../../API";
import { classNames } from "../../utils/classNames";
import { navigate } from "raviger";
import moment from "moment";
import { useAtom } from "jotai";
import { summaryAtom } from ".";

const Table = PaginatedApiTable<Order>;

interface RouteParams {
  prosumer?: string;
}

export default function OrdersList({ prosumer }: RouteParams) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary] = useAtom(summaryAtom);

  return (
    <div className="md:p-4">
      <div className="p-2 md:p-0 md:pb-4 flex flex-wrap gap-2 md:gap-4 items-center">
        <div className="p-4 bg-white rounded-lg">
          <h3 className="uppercase text-gray-700 font-bold text-xs md:text-sm">
            Your Orders
          </h3>
          <h1 className="text-lg md:text-2xl md:tracking-wider font-bold font-mono">
            {summary?.user_orders_count}
          </h1>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <h3 className="uppercase text-gray-700 font-bold text-xs md:text-sm">
            Network Orders
          </h3>
          <h1 className="text-lg md:text-2xl md:tracking-wider font-bold font-mono">
            {summary?.global_orders_count}
          </h1>
        </div>
      </div>
      <div className="px-1 md:px-4 py-8 bg-white rounded-lg">
        <Table
          key={refreshKey}
          onQuery={(limit, offset) => {
            setIsRefreshing(true);
            return Orders.list({ query: { limit, offset, prosumer } }).then(
              (res) => {
                setIsRefreshing(false);
                return res;
              }
            );
          }}
          title="Orders"
          description={
            prosumer
              ? "List of all orders issued by the prosumer."
              : "List of all orders issued by all prosumers managed by your billing account."
          }
          theads={{
            id: "Order#",
            created_on: "Issued",
            prosumer: "Prosumer",
            category: "Category",
            energy: "Net Export Energy (kWh)",
            price: "Price (Sparks/Wh)",
            status: "Status",
          }}
          render={{
            id: ({ id }) => (
              <span className="font-mono font-bold text-gray-500">
                {id.toString().slice(-6)}
              </span>
            ),
            created_on: ({ created_on }) => (
              <span className="text-gray-600">
                {moment(created_on).fromNow()}
              </span>
            ),
            prosumer: ({ prosumer }) => (prosumer as Prosumer).name,
            energy: ({ energy }) => (
              <p
                className={classNames(
                  "font-bold",
                  energy > 0 ? "text-green-600" : "text-red-700"
                )}
              >
                <span className="font-mono tracking-wider">
                  {(energy * 1e-3).toFixed(2)}
                </span>
                <span className="opacity-70 ml-2">kWh</span>
              </p>
            ),
            price: ({ price }) =>
              price ? (
                <p>
                  <span className="font-mono tracking-wider">{price}</span>
                  <span className="text-gray-500 ml-2">Sparks/Wh</span>
                </p>
              ) : (
                <span className="text-xs text-gray-400">N/A</span>
              ),
            status: ({ status }) => (
              <span
                className={classNames(
                  "px-2 py-1 rounded-full text-xs font-bold",
                  status === "ORDER_REQ_RECEIVED" &&
                    "bg-gray-100 text-gray-800",
                  status === "COMPLETED" && "bg-green-100 text-green-800"
                )}
              >
                {status}
              </span>
            ),
          }}
          tableActions={[
            <button
              disabled={isRefreshing}
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className={isRefreshing ? "animate-pulse" : ""}
            >
              <i
                className={classNames(
                  "fa-solid fa-rotate",
                  isRefreshing && "animate-spin"
                )}
              />
              Refresh
            </button>,
          ]}
          onClickRow={(order) =>
            prosumer
              ? navigate(`/prosumers/${prosumer}/orders/${order.id}`)
              : navigate(`/orders/${order.id}`)
          }
        />
      </div>
    </div>
  );
}
