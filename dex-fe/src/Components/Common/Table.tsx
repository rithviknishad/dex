interface TableRowActionProps<T extends object> {
  label: string;
  onClick: (object: T) => void;
}

interface Props<T extends object> {
  title: string;
  description?: string;
  theads: Record<keyof T, string | number>;
  content: T[];
  render?: Partial<Record<keyof T, (item: T) => React.ReactNode>>;
  tableActions?: React.ReactNode[];
  rowActions?: TableRowActionProps<T>[];
  primaryKey: keyof T;
}

const Table = <T extends object>(props: Props<T>) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {props.title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{props.description}</p>
        </div>
        <div className="flex gap-2 items-center mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {(props.tableActions ?? []).map((action) => action)}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {Object.entries(props.theads).map(([key, value]) => (
                    <th
                      key={key}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {value as any}
                    </th>
                  ))}
                  {(props.rowActions ?? []).map((action) => (
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">{action.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {props.content.map((row, index) => (
                  <tr key={index}>
                    {Object.entries(props.theads).map(([key, value]) => {
                      const item = (row as any)[key];

                      return (
                        <td
                          key={key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                        >
                          {(props.render as any)?.[key]?.(item) ?? item}
                        </td>
                      );
                    })}
                    {(props.rowActions ?? []).map((action) => (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => action.onClick(row)}
                        >
                          {action.label}
                        </a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
