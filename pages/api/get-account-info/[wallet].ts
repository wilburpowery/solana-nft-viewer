import axios from 'axios';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  TokenAccountsFilter,
} from '@solana/web3.js';

import { findProgramAddress } from '../../../utils/utils';
import { decodeMetadata, Metadata } from '../../../utils/types';
import Redis from '../../../libs/redis';

const NETWORK = clusterApiUrl('mainnet-beta');
const METAPLEX_SEED_CONSTANT = 'metadata';
const METAPLEX_METADATA_PUBLIC_KEY =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

export default async function handler(req, res) {
  const { wallet } = req.query;

  Redis.set('foo', 'bar');

  return res.status(200).json({ foo: 'bar', wallet: wallet, nfts: nfts });
}
