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
import Redis from '../../libs/redis';

const NETWORK = clusterApiUrl('mainnet-beta');
const METAPLEX_SEED_CONSTANT = 'metadata';
const METAPLEX_METADATA_PUBLIC_KEY =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

export default function WalletPage({ collectibles, wallet }) {
  return (
    <div className="min-h-screen p-8 text-white bg-black">
      <div className="min-h-full px-6 py-8 mx-auto rounded-lg max-w-7xl">
        <h1>Address: {wallet}</h1>
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
        Buffer.from('metadata'),
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
