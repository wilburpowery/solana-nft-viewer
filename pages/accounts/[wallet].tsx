import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import dynamic from 'next/dynamic';
const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false,
});

import ContentLoader from 'react-content-loader';

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';

import Link from 'next/link';

import { ArrowRightIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import Redis from '../../libs/redis';
import useSWR from 'swr';

import collect from 'collect.js';

import Head from 'next/head';

const fetcher = (url) => fetch(url).then((r) => r.json());

import { proxyImageUrl } from '../../libs/imgix';

const myLoader = ({ src, width, quality }) => {
  return proxyImageUrl(src, width, quality);
};

import Logo from '../../components/Logo';

export default function WalletPage({ wallet, nfts }) {
  const { data, error } = useSWR(`/api/get-account-info/${wallet}`, fetcher, {
    // fallbackData: nfts,
  });

  if (data) {
    console.log(data.nfts);
  }

  return (
    <div className="min-h-screen p-8 text-white bg-black">
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
        <meta property="og:image" content="https://solnft.gallery/og.png" />

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
      <div className="min-h-full mx-auto rounded-lg max-w-7xl">
        <header className="flex items-center justify-between mb-4">
          <div>
            <Link href="/">
              <span>
                <Logo classes="h-16 cursor-pointer" />
              </span>
            </Link>
          </div>
          <div>
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
        </header>
        <div className="p-4 rounded-lg bg-dark-tertiary">
          <h1 className="mb-4 text-lg break-words md:text-2xl">
            Viewing NFTs in: {wallet}
          </h1>

          <Link href="/">
            <span className="flex items-center cursor-pointer text-solana-purple">
              Do Another Search
              <ArrowRightIcon className="w-5 h-5 ml-1" />
            </span>
          </Link>
        </div>

        {!data ? (
          <div className="grid grid-cols-2 gap-2 mt-8 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item) => (
              <ContentLoader
                className="rounded-md"
                speed={2}
                width="100%"
                height="auto"
                viewBox="0 0 500 490"
                backgroundColor="#10142a"
                foregroundColor="#22283E"
              >
                <rect x="207" y="112" rx="0" ry="0" width="1" height="1" />
                <rect x="262" y="172" rx="0" ry="0" width="0" height="1" />
                <rect x="0" y="0" rx="0" ry="0" width="500" height="490" />
              </ContentLoader>
            ))}
          </div>
        ) : (
          ''
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center w-full mt-32">
            <span className="mb-2 text-3xl">😢</span>
            <p>
              Something went wrong while loading your NFTs. Please refresh the
              page.
            </p>
          </div>
        ) : (
          ''
        )}

        {data?.nfts?.length ? (
          <LightGallery
            speed={500}
            plugins={[lgThumbnail]}
            elementClassNames="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
            selector=".item"
            licenseKey={'AAC7666D-D0114A77-8C96F80F-E927E68C'}
          >
            {data?.nfts?.map((nft) => (
              <a
                href={nft.image}
                className="block w-full overflow-hidden rounded-lg group aspect-w-10 aspect-h-7 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-solana item"
                key={nft.name}
                data-src={nft.image}
                data-sub-html={`
                <h2 class="mb-2 text-2xl font-bold">${nft.name}</h2>
                <p class="text-lg">${nft.description || ''}</p>
              `}
                data-thumb={nft.image}
              >
                <img
                  src={proxyImageUrl(nft.image)}
                  className="hidden"
                  alt={nft.name}
                />

                <Image
                  loader={myLoader}
                  src={nft.image}
                  alt={nft.name}
                  width={500}
                  height={490}
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//9PPQAJegN7evrihQAAAABJRU5ErkJggg=="
                  placeholder="blur"
                  className="object-cover transition-all duration-200 pointer-events-none group-hover:opacity-80 group-hover:scale-105"
                />
              </a>
            ))}
          </LightGallery>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { wallet } = context.params;

  let nfts = await Redis.hgetall(wallet);
  nfts = Object.values(nfts);
  nfts = nfts.map((item) => JSON.parse(item));

  return {
    props: {
      wallet: wallet,
      nfts: collect(nfts).sortBy('properties.creators.0.address').toArray(),
    },
  };
};
