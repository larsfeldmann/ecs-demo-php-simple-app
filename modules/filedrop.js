const recache = require('recache');
 
const cache = recache('./', (cache) => {
    console.log('Cache ready !!!');
 
    console.log(cache.list()); 
});

module.exports = cache;
 
