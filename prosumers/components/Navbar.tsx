"use client";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import classNames from "@/utils/classNames";
import Image from "next/image";

const user = {
  name: "Rithvik Nishad",
  email: "rithviknishad@vaidyuti.in",
  imageUrl: "https://github.com/rithviknishad.png",
};

// const navigation = [
//   { name: "Dashboard", href: "#", current: true },
//   { name: "Team", href: "#", current: false },
//   { name: "Projects", href: "#", current: false },
//   { name: "Calendar", href: "#", current: false },
// ];
// const userNavigation = [
//   { name: "Your Profile", href: "#" },
//   { name: "Settings", href: "#" },
//   { name: "Sign out", href: "#" },
// ];

export default function Navbar() {
  return (
    <Disclosure as="header" className="bg-black border-b border-brand-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-zinc-800 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0 overflow-clip">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    height={96}
                    width={96}
                    src="https://github.com/vaidyuti.png"
                    alt="Vaidyuti"
                  />
                </div>
              </div>
              <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <i className="fa-solid fa-magnifying-glass text-zinc-500"></i>
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="text-white focus:shadow-xl focus:shadow-brand-500/20 transition-all duration-200 ease-in-out block w-full rounded-md border border-zinc-600 focus:border-brand-500 bg-zinc-900 py-2 pl-10 pr-3 text-sm placeholder-zinc-500 ring-0 outline-none focus:outline-none focus:placeholder-zinc-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex items-center lg:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <i className="fa-solid fa-x"></i>
                  ) : (
                    <i className="fa-solid fa-bars"></i>
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                <button
                  type="button"
                  className="flex-shrink-0 rounded-full hover:bg-zinc-900 p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <i className="fa-regular fa-bell"></i>
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-4 flex-shrink-0">
                  <div>
                    <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <Image
                        height={32}
                        width={32}
                        className="rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-zinc-100" : "",
                                "block py-2 px-4 text-sm text-zinc-700"
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition> */}
                </Menu>
              </div>
            </div>
            {/* <nav
              className="hidden lg:flex lg:space-x-8 lg:py-2"
              aria-label="Global"
            >
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900",
                    "rounded-md py-2 px-3 inline-flex items-center text-sm font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </nav> */}
          </div>

          {/* <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900",
                    "block rounded-md py-2 px-3 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Image
                    height={40}
                    width={40}
                    className="rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-zinc-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-zinc-500">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <i className="fa-regular fa-bell"></i>
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md py-2 px-3 text-base font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel> */}
        </>
      )}
    </Disclosure>
  );
}
