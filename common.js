module.exports = function() {
    this.genRandomId = function() {
        return Math.random().toString(36).replace('0.', '');
    };
    this.getRandomArbitrary = function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
  };
  