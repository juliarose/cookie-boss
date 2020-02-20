const SimpleCookie = require('simple-cookie');
const CookieManager = require('cookie-manager');
const Cookie = require('cookie');
const util = require('util');

function CookieBoss() {
    // it doesn't take any arguments
    CookieManager.call(this);
}

CookieBoss.prototype.toJSON = function() {
    const extractCookies = (obj) => {
        // is a cookie
        if (obj.name) {
            /*
            {
                expires: 2027-10-28T05:00:39.000Z,
                httponly: false,
                secure: false,
                path: '/',
                domain: 'example.com',
                name: 'example',
                value: 'xxxxxxx',
                pathReg: /^\//
            }
            */
            return obj;
        } else {
            // is an object full of more cookies
            return Object.values(obj).map(extractCookies);
        }
    };
    const reduceFlatten = (total, current) => {
        if (Array.isArray(current)) {
            return total.concat(current.reduce(reduceFlatten, []));
        }
        
        return total.concat(current);
    };
    
    // build an array of all cookies from this.list
    return Object.values(this.list)
        // this will create an array of cookies
        // which can also include arrays of cookies as values
        .map(extractCookies)
        // flatten them down
        .reduce(reduceFlatten, [])
        // filter out expired cookies
        .filter((cookie) => {
            return Boolean(
                // cookie never expires
                !cookie.expires ||
                // cookie expires date is before now
                new Date().getTime() < cookie.expires
            );
        })
        // reduce them by domain
        .reduce((json, cookie) => {
            if (!json[cookie.domain]) {
                // create a new array for domain
                // so that we can add to it
                json[cookie.domain] = [];
            }
            
            // push stringified cookie to array
            json[cookie.domain].push(
                SimpleCookie.stringify(cookie)
            );
            
            return json;
        }, {});
};

CookieBoss.parse = Cookie.parse;
CookieBoss.serialize = Cookie.serialize;
CookieBoss.prototype.parse = Cookie.parse;
CookieBoss.prototype.serialize = Cookie.serialize;

util.inherits(CookieBoss, CookieManager);

module.exports = CookieBoss;