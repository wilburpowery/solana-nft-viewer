import Head from 'next/head';
import useSWR from 'swr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SearchCircleIcon } from '@heroicons/react/solid';

import { useEffect, useState } from 'react';

import { validatePublicKey } from '../utils/utils';

import { useRouter } from 'next/router';

import Image from 'next/image';

import Logo from '../components/Logo';

export default function Home() {
  useEffect(() => {
    document.getElementById('wallet').focus();
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const lookupWallet = async (event) => {
    event.preventDefault();
    const { error } = validatePublicKey(event.target.wallet.value);

    if (error) {
      return toast.error('Invalid wallet address');
    }

    router.push({
      pathname: `/accounts/${event.target.wallet.value}`,
    });

    setLoading(true);
  };

  return (
    <div className="min-h-screen px-6 font-sans text-white bg-dark-primary">
      <Head>
        <title>SolNFT.Gallery - Your own NFT Gallery</title>
        <meta name="title" content="SolNFT.Gallery - Your own NFT Gallery" />
        <meta
          name="description"
          content="Scan any Solana wallet address and see all the NFTs in a beautiful gallery."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solnft.gallery" />
        <meta
          property="og:title"
          content="SolNFT.Gallery - Your own NFT Gallery"
        />
        <meta
          property="og:description"
          content="Scan any Solana wallet address and see all the NFTs in a beautiful gallery."
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta property="og:image" content="/og.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://solnft.gallery" />
        <meta
          property="twitter:title"
          content="SolNFT.Gallery - Your own NFT Gallery"
        />
        <meta
          property="twitter:description"
          content="Scan any Solana wallet address and see all the NFTs in a beautiful gallery."
        />

        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <div className="absolute right-10 top-8">
        <a
          href="https://twitter.com/solnftgallery"
          className="text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            className="w-6 h-6 fill-current"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 30 30"
          >
            <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path>
          </svg>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-7xl">
        <div className="flex flex-col justify-center p-8 rounded-lg bg-dark-tertiary">
          <div>
            <Logo classes="" />
          </div>
          <p className="mb-4">
            Enter a wallet address and view your entire collection.
          </p>

          <form action="" onSubmit={lookupWallet}>
            <div>
              <label
                htmlFor="wallet"
                className="block text-sm font-medium text-white"
              >
                Wallet Address
              </label>
              <div className="mt-1 mb-2 rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <input
                    type="text"
                    name="wallet"
                    id="wallet"
                    className="block w-full py-3 text-white bg-gray-900 border-gray-800 rounded-md shadow-sm focus:ring-solana-purple focus:border-solana-purple sm:text-sm"
                    placeholder="Wallet Address"
                    required
                    autoComplete="off"
                    autoFocus={true}
                  />
                </div>
              </div>
              <div className="mb-2">
                <button className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-sm font-medium text-white rounded-md bg-solana-purple hover:bg-opacity-80 focus:outline-none">
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
