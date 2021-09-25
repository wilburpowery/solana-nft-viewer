/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';

export default function Modal({ show, close, collectible }) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={close}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden text-left text-white align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-gray-800 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-white"
                    >
                      {collectible?.name}
                    </Dialog.Title>
                    <div className="mt-2">
                      {collectible ? (
                        <Image
                          src={`/api/imageproxy?url=${collectible?.image}`}
                          alt={collectible?.name}
                          width={500}
                          height={250}
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUlZatBwABiADWf0OGmQAAAABJRU5ErkJggg=="
                          placeholder="blur"
                          className="object-contain w-full h-auto transition-all duration-200 pointer-events-none group-hover:opacity-80 group-hover:scale-105"
                        />
                      ) : (
                        ''
                      )}
                      <p className="mb-4 text-sm text-white">
                        {collectible?.description}
                      </p>

                      <div>
                        <p className="mb-2 font-semibold">Properties</p>
                        <dl className="grid grid-cols-3 gap-3">
                          {collectible?.attributes?.map((trait) => (
                            <div className="p-2 border border-gray-700">
                              <dt className="text-xs font-semibold text-gray-500 uppercase">
                                {trait?.trait_type}
                              </dt>
                              <dd className="text-sm font-semibold">
                                {trait?.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-700 sm:px-6 sm:flex sm:flex-row-reverse">
                <a
                  href={collectible?.external_url}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-black border border-transparent rounded-md shadow-sm bg-solana-green hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => close()}
                >
                  View Website
                </a>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-white bg-gray-800 rounded-md shadow-sm hover:bg-gray-900 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => close()}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
