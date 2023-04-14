import { modelEndpoints } from "../../API/fireRequest";
import { useEffect, useState } from "react";
import Table, { GenericTableProps } from "./Table";
import { Model } from "../../API/models";

const PER_PAGE_LIMIT = 20;

type ListApi<T extends object> = ReturnType<typeof modelEndpoints<T>>["list"];

interface Props<T extends object> extends GenericTableProps<Model<T>> {
  onQuery: (limit: number, offset: number) => ReturnType<ListApi<T>>;
  autoRefreshInterval?: number;
}

const PaginatedApiTable = <T extends Model<object>>({
  onQuery,
  autoRefreshInterval = 20e3,
  ...props
}: Props<T>) => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<readonly Model<T>[]>();

  useEffect(() => {
    const fetchData = () =>
      onQuery(PER_PAGE_LIMIT, (page - 1) * PER_PAGE_LIMIT).then((response) => {
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
        start: (page - 1) * PER_PAGE_LIMIT + 1,
        end: page * PER_PAGE_LIMIT,
        total,
        onPrevious: () => setPage(page - 1),
        onNext: () => setPage(page + 1),
      }}
    />
  );
};

export default PaginatedApiTable;
