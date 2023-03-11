import { Disclosure, Transition } from "@headlessui/react";
import { MouseEventHandler } from "react";

export const DisclosureTitle = ({
  title,
  length,
  actions,
}: {
  title: string;
  length?: number;
  actions: { [key: string]: MouseEventHandler<HTMLButtonElement> };
}) => {
  return (
    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium border border-zinc-800 text-zinc-200 hover:bg-zinc-800 focus:outline-none focus-visible:ring focus-visible:ring-zinc-500 focus-visible:ring-opacity-75">
      <div>
        <span>{title}</span>
        <span className="ml-2 tracking-widest text-zinc-400">({length})</span>
      </div>
      <div className="flex items-center gap-4">
        {Object.entries(actions).map(([label, onClick], i) => (
          <button
            key={i}
            className="primary-button !border-0 !text-xs"
            onClick={onClick}
          >
            {label}
          </button>
        ))}
        <i className="fa-solid fa-chevron-down ui-open:rotate-180 ui-open:transform transition-transform duration-200 ease-in-out"></i>
      </div>
    </Disclosure.Button>
  );
};

export const DisclosureContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform -translate-y-2 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform -translate-y-2 opacity-0"
    >
      <Disclosure.Panel className="flex flex-col gap-2 px-2 text-sm text-gray-500">
        {children}
      </Disclosure.Panel>
    </Transition>
  );
};

export const DisclosureList = <T,>({
  items,
  children,
  onEmpty,
}: {
  items: T[];
  children: (item: T) => React.ReactNode;
  onEmpty: string;
}) => {
  return (
    <DisclosureContent>
      {items.length ? (
        items.map(children)
      ) : (
        <div className="flex w-full py-4 items-center justify-center">
          {onEmpty}
        </div>
      )}
    </DisclosureContent>
  );
};
