import { atom, useAtom } from "jotai";
import { classNames } from "../../utils/classNames";

const exchangeSignatureAtom = atom("");

export default function DeveloperSettings() {
  const [exchangeSignature, setExchangeSignature] = useAtom(
    exchangeSignatureAtom
  );
  return (
    <div className="p-4">
      <div className="p-8 bg-white rounded-lg">
        <h2 className="text-xl font-bold leading-7 text-gray-800 sm:truncate sm:text-2xl sm:tracking-tight">
          Developer Settings
        </h2>
        <div className="rounded-md bg-yellow-50 p-4 my-4">
          <div className="flex">
            <i className="fa-solid fa-exclamation-triangle text-yellow-400"></i>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Caution</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  These settings are for developers only. Changing these
                  settings may cause unexpected behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="m-4">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Exchange's Private Network Access Headers
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              These headers are used to control your access to the exchange's
              private network.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  X-Exchange-Signature
                </dt>
                <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                  <div
                    className={classNames(
                      exchangeSignature ? "text-gray-900" : "text-gray-600"
                    )}
                  >
                    {exchangeSignature || "Not set"}
                  </div>
                  <button
                    type="submit"
                    onClick={() => {
                      setExchangeSignature(
                        prompt("Enter new X-Exchange-Signature") || ""
                      );
                    }}
                  >
                    Modify
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
