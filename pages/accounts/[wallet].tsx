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

const fetcher = (url) => fetch(url).then((r) => r.json());

import { proxyImageUrl } from '../../libs/imgix';

const myLoader = ({ src, width, quality }) => {
  return proxyImageUrl(src, width, quality);
};

export default function WalletPage({ wallet, nfts }) {
  const { data, error } = useSWR(`/api/get-account-info/${wallet}`, fetcher, {
    fallbackData: nfts,
  });

  if (data) {
    console.log(data.nfts);
  }

  return (
    <div className="min-h-screen p-8 text-white bg-black">
      <div className="min-h-full mx-auto rounded-lg max-w-7xl">
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
