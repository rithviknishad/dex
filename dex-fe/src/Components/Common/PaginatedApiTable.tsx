import { modelEndpoints } from "../../API/fireRequest";
import { useEffect, useState } from "react";
import Table, { GenericTableProps } from "./Table";
import { Model } from "../../API/models";

type ListApi<T extends object> = ReturnType<typeof modelEndpoints<T>>["list"];

interface Props<T extends object> extends GenericTableProps<Model<T>> {
  onQuery: (limit: number, offset: number) => ReturnType<ListApi<T>>;
  autoRefreshInterval?: number;
  perPageLimit?: number;
}

const PaginatedApiTable = <T extends object>({
  onQuery,
  autoRefreshInterval = 60e3,
  perPageLimit = 20,
  ...props
}: Props<T>) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<readonly Model<T>[]>();

  useEffect(() => {
    const fetchData = () =>
      onQuery(perPageLimit, (page - 1) * perPageLimit).then((response) => {
        const { count, results } = response.data;
        setTotal(count);
        setData(results);
      });

    fetchData();
    const interval = setInterval(fetchData, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [page]);

  return (
    <Table
      {...props}
      content={data || []}
      pagination={{
        start: (page - 1) * perPageLimit + 1,
        end: page * perPageLimit,
        total,
        onPrevious: () => setPage(page - 1),
        onNext: () => setPage(page + 1),
      }}
    />
  );
};

export default PaginatedApiTable;
