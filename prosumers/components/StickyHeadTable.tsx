import classNames from "@/utils/classNames";

interface TableData {
  [key: string]: React.ReactNode;
}

interface Props<T extends TableData> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  theads: Record<keyof T, string>;
  trows: T[];
  primaryColumn?: keyof T;
}

export default function StickyHeadTable<T extends TableData>(props: Props<T>) {
  const tkeys = Object.keys(props.theads) as (keyof T)[];
  const theads = Object.values(props.theads);
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-zinc-50">
            {props.title}
          </h1>
          {props.description && (
            <p className="mt-2 text-sm text-zinc-200">{props.description}</p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {/* <button
            type="button"
            className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button> */}
          {props.actions}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {theads.map((thead, idx) => (
                    <th
                      key={`thead-${idx}`}
                      scope="col"
                      className="sticky top-0 z-10 border-b border-brand-800 bg-white bg-opacity-10 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-50 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      {thead}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {props.trows.map((trow, trowIdx) => (
                  <tr key={trowIdx}>
                    {tkeys.map((tkey, tkeyIdx) => (
                      <td
                        key={`trow-${trowIdx}-tkey-${tkeyIdx}`}
                        className={classNames(
                          "whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-50 sm:pl-6 lg:pl-8",
                          trowIdx !== props.trows.length - 1 &&
                            "border-b border-zinc-700",
                          tkey === props.primaryColumn && "font-medium"
                        )}
                      >
                        {trow[tkey]}
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
}
