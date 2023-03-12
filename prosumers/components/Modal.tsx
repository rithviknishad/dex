import classNames from "@/utils/classNames";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

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
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md" />
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
                  "w-full max-w-lg transform overflow-hidden rounded border border-brand-500 bg-black p-6 text-left align-middle shadow-xl transition-all",
                  className
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-brand-500"
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
