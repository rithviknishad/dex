import { useState } from "react";
import PaginatedApiTable from "../../Components/Common/PaginatedApiTable";
import { Order, Prosumer } from "../../API/models/DEX";
import { Orders } from "../../API";
import { classNames } from "../../utils/classNames";
import { navigate } from "raviger";

const Table = PaginatedApiTable<Order>;

interface RouteParams {
  prosumer?: string;
}

export default function OrdersList({ prosumer }: RouteParams) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-4">
      <div className="px-4 py-8 bg-white rounded-lg">
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
            id: "ID",
            created_on: "Issued on",
            prosumer: "Prosumer",
            category: "Category",
            energy: "Net Export Energy (Wh)",
            price: "Price (Sparks)",
            status: "Status",
          }}
          render={{
            prosumer: ({ prosumer }) => (prosumer as Prosumer).name,
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
