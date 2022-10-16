const pkg = require('./index');

// pkg.isInternetAvailable({authority: 'http://localhost'}).then(console.log)

const service = new pkg.InternetAvailabilityService({ rate: 1000 });
service.on('checking', () => console.log('checking connection'));
service.on('status', (value) => console.log('connection status changed to', value));

(async () => {
  const TIMEOUT = 1;
  const isInternetAvailableWithTimeout = await pkg.isInternetAvailable({
    timeout: TIMEOUT,
  })

  if (isInternetAvailableWithTimeout === true) {
    throw new Error(
      `The connection test with \
timeout should have returned false. \
It is unlikely that it has connected in ${TIMEOUT}ms`
    )
  }
})()
