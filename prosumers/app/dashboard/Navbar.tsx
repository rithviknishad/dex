"use client";

import { Disclosure, Menu } from "@headlessui/react";
import Image from "next/image";

const user = {
  name: "Rithvik Nishad",
  email: "rithviknishad@vaidyuti.in",
  imageUrl: "https://github.com/rithviknishad.png",
};

export default function Navbar() {
  return (
    <Disclosure as="header" className="bg-black border-b border-brand-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-zinc-800 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="relative z-10 flex px-2 lg:px-0 overflow-clip">
                <div className="flex flex-shrink-0 items-center">
                  <p className="text-brand-500 text-sm md:text-lg font-display font-bold tracking-wide">
                    DEX
                  </p>
                  {/* <Image
                    height={96}
                    width={96}
                    src="https://github.com/vaidyuti.png"
                    alt="Vaidyuti"
                  /> */}
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
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
