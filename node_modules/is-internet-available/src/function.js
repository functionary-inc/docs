const http2 = require('http2');

/**
 * @param {Object} [options]
 * @param {String} [options.authority]
 * @param {Number} [options.timeout]
 * @param {Object} [options.options]
 */
function isInternetAvailable(options = {
  authority: 'https://www.google.com',
}) {
  if (!options.authority) options.authority = 'https://www.google.com';
  return new Promise((resolve) => {
    const client = http2.connect(options.authority, options.options, () => {
      resolve(true);
      client.destroy();
    });

    if (typeof options.timeout === 'number') {
      client.setTimeout(options.timeout);
      client.on('timeout', () => {
        resolve(false);
        client.destroy();
      });
    }

    client.on('error', () => {
      resolve(false);
      client.destroy();
    });
  });
}

module.exports = isInternetAvailable;
