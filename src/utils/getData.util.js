const axios = require('axios');
const { getAsync, setAsync } = require('../redis.provider');

const makeRequest = url => axios(url, {
  headers: {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'sec-ch-ua': '"Google Chrome";v="87", "\\"Not;A\\\\Brand";v="99", "Chromium";v="87"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    cookie: '_ga=GA1.2.1805788162.1607073179; _gid=GA1.2.1633323158.1607073179; session=53616c7465645f5f27325eab8dfd328402f95eaf5fc4354393873125e9492afab770f36cf7cdd515ace8ba530579d440',
  },
  referrerPolicy: 'strict-origin-when-cross-origin',
  body: null,
  method: 'GET',
  mode: 'cors',
})
  .then(res => res.data);

module.exports = url => getAsync(url)
  .then(async data => {
    if (!data) {
      const responseData = await makeRequest(url);
      await setAsync(url, responseData);
      return responseData;
    }
    return data;
  });
