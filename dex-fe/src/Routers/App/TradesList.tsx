import { useState } from "react";
import PaginatedApiTable from "../../Components/Common/PaginatedApiTable";
import { Order, Prosumer, Trade } from "../../API/models/DEX";
import { Trades } from "../../API";
import { classNames } from "../../utils/classNames";
import { navigate } from "raviger";

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
            id: "ID",
            created_on: "Issued on",
            order: "Prosumer",
            price: "Price (Sparks)",
            settlement_status: "Settlement Status",
            transmission_losses: "Transmission Losses (Wh)",
          }}
          render={{
            order: ({ order }) => ((order as Order).prosumer as Prosumer).name,
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
