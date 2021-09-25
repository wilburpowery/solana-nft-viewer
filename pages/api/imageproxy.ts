import axios from 'axios';

export default async (req, res) => {
  const readable = await axios({
    url: req.query.url,
    responseType: 'stream',
  });

  await readable.data.pipe(res);
};
