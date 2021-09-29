import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
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

export default function WalletPage() {
  const router = useRouter();

  const { wallet } = router.query;

  const [collectibles, setCollectibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (router.isReady && collectibles.length == 0) {
      axios
        .get(`/api/get-account-info/${wallet}`)
        .then((response) => {
          setError(false);
          setCollectibles(response.data.nfts);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
        });
    }
  });

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

        {loading ? (
          <div className="flex items-center justify-center w-full mt-32 animate-spin">
            <svg
              className="w-10 h-10 mx-auto mr-3 -ml-1 text-white animate-spin"
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

        <LightGallery
          licenseKey="AAC7666D-D0114A77-8C96F80F-E927E68C"
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

// export const getServerSideProps: GetServerSideProps = async (context) => {

//   return {
//     props: {
//       wallet: wallet,
//       collectibles: nfts,
//     },
//   };
// };
