import axios from 'axios';
import Redis from '../../../libs/redis';

import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  MemcmpFilter,
  TokenAccountsFilter,
  ParsedAccountData,
} from '@solana/web3.js';

import { findProgramAddress } from '../../../utils/utils';
import { decodeMetadata, Metadata } from '../../../utils/types';

const NETWORK = clusterApiUrl('mainnet-beta');
const METAPLEX_SEED_CONSTANT = 'metadata';
const METAPLEX_METADATA_PUBLIC_KEY =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

export default async function handler(req, res) {
  const { wallet } = req.query;
  let PUBLIC_KEY: PublicKey;

  const cacheStore = await Redis.hgetall(wallet);

  try {
    PUBLIC_KEY = new PublicKey(wallet);
  } catch (error) {
    return res.status(422).json({ message: 'Invalid wallet address' });
  }

  const connection = new Connection(NETWORK);

  const filters: TokenAccountsFilter = {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  };

  const data = await connection.getParsedTokenAccountsByOwner(
    PUBLIC_KEY,
    filters,
  );
  const collectibles = [];

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

    if (cacheStore[programAddress[0]]) {
      console.log(`Using cache for ${programAddress[0]}`);
      return Promise.resolve(JSON.parse(cacheStore[programAddress[0]]));
    }

    const accountInfoData = await connection.getAccountInfo(
      new PublicKey(programAddress[0]),
    );

    const metadata = decodeMetadata(accountInfoData.data);

    const response = await axios.get(metadata.data.uri);

    const redisPayload = response.data;
    redisPayload.programAddress = programAddress[0];
    Redis.hset(wallet, programAddress[0], JSON.stringify(redisPayload));

    return Promise.resolve(response.data);
  });

  nfts = await Promise.all(nfts);

  return res.status(200).json({ foo: 'bar', wallet: wallet, nfts: nfts });
}
