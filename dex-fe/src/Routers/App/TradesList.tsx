import { useState } from "react";
import PaginatedApiTable from "../../Components/Common/PaginatedApiTable";
import { Order, Prosumer, Trade } from "../../API/models/DEX";
import { Trades } from "../../API";
import { classNames } from "../../utils/classNames";
import { navigate } from "raviger";
import moment from "moment";

const Table = PaginatedApiTable<Trade>;

interface RouteParams {
  prosumer?: string;
}

export default function TradesList({ prosumer }: RouteParams) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-4">
      <div className="px-4 py-8 bg-white rounded-lg">
        <Table
          key={refreshKey}
          onQuery={(limit, offset) => {
            setIsRefreshing(true);
            return Trades.list({ query: { limit, offset, prosumer } }).then(
              (res) => {
                setIsRefreshing(false);
                return res;
              }
            );
          }}
          title="Trades"
          description={
            prosumer
              ? "List of all trades associated to the prosumer."
              : "List of all trades associated to all prosumers managed by your billing account."
          }
          theads={{
            id: "Trade#",
            created_on: "Issued",
            order: "Prosumer",
            price: "Price (Sparks/Wh)",
            transmission_losses: "Losses (kWh)",
            energy: "Traded kWh",
            amount: "Amount (Mil. Sparks)",
            settlement_status: "Payment",
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
            order: ({ order }) => ((order as Order).prosumer as Prosumer).name,
            price: ({ price }) => (
              <p>
                <span className="font-mono tracking-wider">{price}</span>
                <span className="text-gray-500 ml-2">Sparks/Wh</span>
              </p>
            ),
            transmission_losses: ({ transmission_losses }) => (
              <p>
                <span className="font-mono tracking-wider">
                  {(transmission_losses * 1e-3).toFixed(2)}
                </span>
                <span className="text-gray-500 ml-2">kWh</span>
              </p>
            ),
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
            amount: ({ amount }) => (
              <p
                className={classNames(
                  "font-bold",
                  amount > 0 ? "text-green-600" : "text-red-700"
                )}
              >
                <span className="tracking-wider">
                  {(amount * 1e-6).toFixed(2)}
                </span>
                <span className="opacity-70 ml-2">Mil. Sparks</span>
              </p>
            ),
            settlement_status: ({ settlement_status }) => (
              <span
                className={classNames(
                  "px-3 py-0.5 rounded text-sm text-center tracking-wider",
                  settlement_status === "PAYMENT_PENDING" &&
                    "bg-yellow-100 text-yellow-600"
                )}
              >
                {settlement_status.replace("PAYMENT_", "")}
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
          onClickRow={(trade) =>
            prosumer
              ? navigate(`/prosumers/${prosumer}/trades/${trade.id}`)
              : navigate(`/trades/${trade.id}`)
          }
        />
      </div>
    </div>
  );
}
