# is-internet-available

Checks if internet is available using http2, node v8.4.0+ only

## description

By default this package relies on www.google.com being available and certificate stores not be broken because it uses http2 connection for the test.

You can use any other URL for the test

Please check changelogs after each release

It has two exports:

### function `isInternetAvailable` ({ authority?: '<https://www.google.com>', options?: undefined })

* returns a Promise that resolves to true or false

### class `InternetAvailabilityService` (rate?: 10 * 1000, authority?: '<https://www.google.com>', options?: undefined )

* emits `'status'` (`true`|`false`) - (only when it changes)
* emits `'checking'` - when starting to run the check

## usage

First add package to project:

```bash
npm install is-internet-available
# or
yarn add is-internet-available
```

Then use it:

```js
const { isInternetAvailable, InternetAvailabilityService } = require('is-internet-available');

isInternetAvailable().then(console.log);
// or
const service = new InternetAvailabilityService();
service.on('status', (status) => {
  if (status) {
    console.log('internet is now connected');
  } else {
    console.log('internet is now disconnected');
  }
});
```

You can also use against a custom Authority:

```js
const { isInternetAvailable, InternetAvailabilityService } = require('is-internet-available');

isInternetAvailable({ authority: 'http://localhost' }).then(console.log);
// or
const service = new InternetAvailabilityService({
  authority: 'http://localhost',
  rate: 1000, // the wait time between checks
  // options: {
    // options that you may want to pass to http2.connect method
  //}
});

service.on('status', (status) => {
  if (status) {
    console.log('localhost is now available');
  } else {
    console.log('localhost is now unavailable');
  }
});

```

## changelog

### version 3.0.0

Breaking changes:

* corrected options naming to match node's http2.connect method
* now accepts options to pass to the http2.connect method

### version 2.1.1

* updated package.json keywords to help find it easier

### version 2.1.0

Features:

* Can use custom url for testing instead of google

### version 2.0.0

Features:

* added service.

breaking changes:

* no longer exports the function by default
  