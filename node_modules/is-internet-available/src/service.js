const { EventEmitter } = require('events');
const isInternetAvailable = require('./function.js');

class InternetAvailabilityService extends EventEmitter {
  /**
   * @param {Object} [options]
   * @param {String} [options.authority] - a string that starts with http:// or https://
   * @param {Number} [options.rate] - number in milliseconds
   * @param {Object} [options.options]
   */
  constructor(options = {
    authority: 'https://www.google.com',
    rate: 10 * 1000,
  }) {
    super();
    if (!options.rate) options.rate = 10 * 1000;
    if (!options.authority) options.authority = 'https://www.google.com';
    this.isInternetAvailable = false;
    const checkForever = async () => {
      this.emit('checking');
      const result = await isInternetAvailable(options);
      if (result !== this.isInternetAvailable) {
        this.isInternetAvailable = result;
        this.emit('status', result);
      }
      setTimeout(checkForever, options.rate);
    };
    setImmediate(checkForever);
  }
}

module.exports = InternetAvailabilityService;
