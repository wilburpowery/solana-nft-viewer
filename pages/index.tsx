import Head from 'next/head';
import useSWR from 'swr';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SearchCircleIcon } from '@heroicons/react/solid';

import { useEffect, useState } from 'react';

import { validatePublicKey } from '../utils/utils';

import { useRouter } from 'next/router';

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
        <title>SolanaNFTEyes.com - Your own NFT Gallery</title>
        <meta name="title" content="SolanaNFTEyes.com - Your own NFT Gallery" />
        <meta
          name="description"
          content="Scan any Solana wallet address and see all the NFTs in a beautiful gallery."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://solananfteyes.com" />
        <meta
          property="og:title"
          content="SolanaNFTEyes.com - Your own NFT Gallery"
        />
        <meta
          property="og:description"
          content="Scan any Solana wallet address and see all the NFTs in a beautiful gallery."
        />
        {/* <meta
          property="og:image"
          content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
        /> */}

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://solananfteyes.com" />
        <meta
          property="twitter:title"
          content="SolanaNFTEyes.com - Your own NFT Gallery"
        />
        <meta
          property="twitter:description"
          content="Scan any Solana wallet address and see all the NFTs in a beautiful gallery."
        />
        {/* <meta
          property="twitter:image"
          content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
        /> */}

        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-7xl">
        <div className="flex flex-col justify-center p-8 rounded-lg bg-dark-tertiary">
          <div>
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="w-16 h-auto mx-auto mb-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="200" r="200" fill="black" />
              <g clipPath="url(#clip0)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M123.42 255.13C124.173 254.302 125.09 253.641 126.113 253.188C127.135 252.735 128.242 252.501 129.36 252.5L312.64 252.65C313.421 252.652 314.184 252.88 314.837 253.307C315.491 253.734 316.006 254.342 316.32 255.056C316.635 255.77 316.735 256.561 316.609 257.331C316.483 258.101 316.136 258.818 315.61 259.395L276.58 302.37C275.827 303.198 274.909 303.86 273.886 304.313C272.862 304.766 271.755 305 270.635 305L87.3602 304.85C86.5797 304.848 85.8164 304.62 85.1631 304.193C84.5098 303.766 83.9946 303.158 83.6801 302.444C83.3656 301.73 83.2652 300.939 83.3913 300.169C83.5173 299.399 83.8644 298.682 84.3902 298.105L123.42 255.13ZM315.61 219.355C316.136 219.932 316.483 220.649 316.609 221.419C316.735 222.189 316.635 222.98 316.32 223.694C316.006 224.408 315.491 225.016 314.837 225.443C314.184 225.87 313.421 226.098 312.64 226.1L129.365 226.25C128.246 226.25 127.139 226.016 126.115 225.563C125.091 225.11 124.173 224.448 123.42 223.62L84.3902 180.62C83.8644 180.043 83.5173 179.326 83.3913 178.556C83.2652 177.786 83.3656 176.995 83.6801 176.281C83.9946 175.567 84.5098 174.959 85.1631 174.532C85.8164 174.105 86.5797 173.877 87.3602 173.875L270.64 173.725C271.759 173.726 272.865 173.96 273.888 174.413C274.911 174.866 275.828 175.527 276.58 176.355L315.61 219.355ZM123.42 97.63C124.173 96.8023 125.09 96.1408 126.113 95.6879C127.135 95.2351 128.242 95.0007 129.36 95L312.64 95.15C313.421 95.1516 314.184 95.3798 314.837 95.8069C315.491 96.234 316.006 96.8416 316.32 97.5559C316.635 98.2703 316.735 99.0606 316.609 99.8308C316.483 100.601 316.136 101.318 315.61 101.895L276.58 144.87C275.827 145.698 274.909 146.36 273.886 146.813C272.862 147.266 271.755 147.5 270.635 147.5L87.3602 147.35C86.5797 147.348 85.8164 147.12 85.1631 146.693C84.5098 146.266 83.9946 145.658 83.6801 144.944C83.3656 144.23 83.2652 143.439 83.3913 142.669C83.5173 141.899 83.8644 141.182 84.3902 140.605L123.42 97.63Z"
                  fill="url(#paint0_linear)"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="90.4202"
                  y1="309.58"
                  x2="309.58"
                  y2="90.42"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9945FF" />
                  <stop offset="0.2" stopColor="#7962E7" />
                  <stop offset="1" stopColor="#00D18C" />
                </linearGradient>
                <clipPath id="clip0">
                  <rect
                    width="240"
                    height="210"
                    fill="white"
                    transform="translate(80 95)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-center md:text-5xl font-heading">
            NFT Gallery
          </h1>

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
