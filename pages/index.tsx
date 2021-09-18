import Head from 'next/head';
import useSWR from 'swr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Image from 'next/image';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { SearchCircleIcon } from '@heroicons/react/solid';

import { useState } from 'react';

export default function Home() {
  const [collectibles, setCollectibles] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookupWallet = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(
      `api/get-account-info/${event.target.wallet.value}`,
    );
    if (!response.ok) {
      const data = await response.json();
      if (response.status == 422) {
        toast.error(data.message);
      } else {
        toast.error('Something went wrong.');
      }
      setLoading(false);
      return;
    }
    setCollectibles(await response.json());
    setLoading(false);
  };

  return (
    <div className="bg-black">
      <div className="flex flex-col min-h-screen font-sans">
        <Head>
          <title>Solana NFT Viewer</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>

        <Header />

        <main className="flex flex-col justify-center flex-1 px-10 py-10 md:px-20">
          <div className="w-full">
            <form action="" onSubmit={lookupWallet}>
              <div>
                <label
                  htmlFor="wallet"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wallet Address
                </label>
                <div className="flex mt-1 rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                      type="text"
                      name="wallet"
                      id="wallet"
                      className="block w-full py-3 text-white bg-gray-900 border-gray-800 rounded-none shadow-sm focus:ring-solana-purple focus:border-solana-purple rounded-l-md sm:text-sm"
                      placeholder="Wallet Address"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <button className="relative inline-flex items-center px-4 py-2 -mr-px space-x-2 text-sm font-medium text-white bg-solana-purple rounded-r-md hover:bg-opacity-80 focus:outline-none">
                    <span>Search</span>
                    <SearchCircleIcon
                      className={`w-6 h-5 text-white ${
                        loading ? 'hidden' : 'block'
                      }`}
                      aria-hidden="true"
                    />
                    <svg
                      className={`w-6 h-5 text-white animate-spin ${
                        loading ? 'block' : 'hidden'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <ul
            className={`mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {collectibles?.nfts?.map((nft) => (
              <li className="relative" key={nft.name}>
                <div className="block w-full overflow-hidden rounded-lg group aspect-w-10 aspect-h-7 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-solana">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={500}
                    height={490}
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOUlZatBwABiADWf0OGmQAAAABJRU5ErkJggg=="
                    placeholder="blur"
                    className="object-cover transition-all duration-200 pointer-events-none group-hover:opacity-80 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    className="absolute inset-0 focus:outline-none"
                  >
                    <span className="sr-only">View details for {nft.name}</span>
                  </button>
                </div>
                <p className="block mt-2 text-sm font-bold text-white truncate pointer-events-none">
                  {nft.name}
                </p>
                <p className="block text-sm font-medium text-gray-400 pointer-events-none">
                  {nft.description || 'No Description'}
                </p>
              </li>
            ))}
          </ul>
        </main>

        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
