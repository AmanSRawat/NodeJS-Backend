// console.log(arguments);
// console.log(require("module").wrapper);

//module.exports
const C = require('./test-module-1');

const calc = new C()
console.log(calc.add(2,5));

//exports
const calc2 = require('./test-module-2');

console.log(calc2.multiply(2,5));

//caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();