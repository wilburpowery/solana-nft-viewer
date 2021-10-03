import ImgixClient from '@imgix/js-core';

const client = new ImgixClient({
  domain: 'solnftgallery.imgix.net',
  secureURLToken: 'H4wKB5qxqp9EvP6M',
  useHTTPS: true,
});

// client.buildURL('/path/to/image.png', {
//   w: 400,
//   h: 300,
// });

export const proxyImageUrl = (
  imageUrl: string,
  w: number = 500,
  q: number = 75,
) => {
  const url = client.buildURL(imageUrl, {
    w,
    q,
  });
  return url;
};
