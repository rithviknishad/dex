import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-5xl h-full mx-auto">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {children}
      </div>
      <div className="relative hidden w-0 flex-1 lg:flex gap-4 items-center justify-center flex-col font-display rounded-xl text-indigo-600 drop-shadow-2xl">
        <h1 className="text-6xl">DEX</h1>
        <h3 className="font-bold text-xl">Decentralized Energy Exchange</h3>
        {/* <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/static/auth-bg.jpg"
            alt=""
          /> */}
      </div>
    </div>
  );
}
