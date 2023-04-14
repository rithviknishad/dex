import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { classNames } from "../../utils/classNames";

interface Props {
  children: React.ReactNode;
  opened: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}

export default function Modal({
  children,
  opened,
  onClose,
  title,
  className,
}: Props) {
  return (
    <Transition appear show={opened} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-indigo-950 bg-opacity-25 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  "w-full max-w-xl transform overflow-hidden rounded border border-indigo-500 bg-zinc-50 p-6 text-left align-middle shadow-xl transition-all",
                  className
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-indigo-500"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
