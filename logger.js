var DEBUG = false;
var INFO = true;

module.exports = function () {
    this.info = function (...args) {
        if (INFO || DEBUG) {
            console.log(...args);
        }
    };
    this.debug = function (...args) {
        if (DEBUG) {
            console.log(...args);
        }
    }
};