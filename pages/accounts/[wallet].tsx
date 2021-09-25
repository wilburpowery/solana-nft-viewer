import { useRouter } from 'next/router';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useSWR from 'swr';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  TokenAccountsFilter,
} from '@solana/web3.js';

import { findProgramAddress } from '../../utils/utils';
import { decodeMetadata, Metadata } from '../../utils/types';

const NETWORK = clusterApiUrl('mainnet-beta');
const METAPLEX_SEED_CONSTANT = 'metadata';
const METAPLEX_METADATA_PUBLIC_KEY =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

import dynamic from 'next/dynamic';
const LightGallery = dynamic(() => import('lightgallery/react'), {
  ssr: false,
});

// import styles
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
// import plugins if you need
import lgThumbnail from 'lightgallery/plugins/thumbnail';

import Link from 'next/link';

import { ArrowRightIcon } from '@heroicons/react/outline';

export default function WalletPage({ collectibles, wallet }) {
  return (
    <div className="min-h-screen p-8 text-white bg-black">
      <div className="min-h-full px-6 py-8 mx-auto rounded-lg max-w-7xl">
        <div className="p-4 rounded-lg bg-dark-tertiary">
          <h1 className="mb-4 text-2xl">Viewing NFTs in: {wallet}</h1>

          <Link href="/">
            <span className="flex items-center cursor-pointer text-solana-purple">
              Do Another Search
              <ArrowRightIcon className="w-5 h-5 ml-1" />
            </span>
          </Link>
        </div>

        <LightGallery
          speed={500}
          plugins={[lgThumbnail]}
          elementClassNames="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
          selector=".item"
          alignThumbnails="right"
        >
          {collectibles?.map((nft) => (
            <div
              className="block w-full overflow-hidden rounded-lg group aspect-w-10 aspect-h-7 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-solana item"
              key={nft.name}
              data-src={nft.image}
              data-sub-html={`
                <h2 class="mb-2 text-2xl font-bold">${nft.name}</h2>
                <p class="text-lg">${nft.description || ''}</p>
              `}
              data-thumb={nft.image}
            >
              <img src={nft.image} className="hidden" alt={nft.name} />

              <Image
                src={`/api/imageproxy?url=${encodeURIComponent(nft.image)}`}
                alt={nft.name}
                width={500}
                height={490}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8//9PPQAJegN7evrihQAAAABJRU5ErkJggg=="
                placeholder="blur"
                className="object-cover transition-all duration-200 pointer-events-none group-hover:opacity-80 group-hover:scale-105"
              />
            </div>
          ))}
        </LightGallery>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { wallet } = context.params;

  let PUBLIC_KEY: PublicKey;

  try {
    PUBLIC_KEY = new PublicKey(wallet);
  } catch (error) {
    return {
      props: {},
    };
  }

  const connection = new Connection(NETWORK);

  const filters: TokenAccountsFilter = {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  };

  const data = await connection.getParsedTokenAccountsByOwner(
    PUBLIC_KEY,
    filters,
  );

  const accountNFTs = data.value.filter((token) => {
    return (
      token.account.data.parsed.info.tokenAmount.amount == 1 &&
      token.account.data.parsed.info.tokenAmount.decimals == 0
    );
  });

  let nfts = await accountNFTs.map(async (token) => {
    const programAddress = await findProgramAddress(
      [
        Buffer.from(METAPLEX_SEED_CONSTANT),
        new PublicKey(METAPLEX_METADATA_PUBLIC_KEY).toBuffer(),
        new PublicKey(token.account.data.parsed.info.mint).toBuffer(),
      ],
      new PublicKey(METAPLEX_METADATA_PUBLIC_KEY),
    );

    const accountInfoData = await connection.getAccountInfo(
      new PublicKey(programAddress[0]),
    );

    const metadata = decodeMetadata(accountInfoData.data);

    const response = await axios.get(metadata.data.uri);
    return Promise.resolve(response.data);
  });

  nfts = await Promise.all(nfts);
  return {
    props: {
      wallet: wallet,
      collectibles: nfts,
    },
  };
};
