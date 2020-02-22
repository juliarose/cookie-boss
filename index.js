const SimpleCookie = require('simple-cookie');
const CookieManager = require('cookie-manager');
const Cookie = require('cookie');
const util = require('util');
const urlParse = require('url');

function CookieBoss() {
    // it doesn't take any arguments
    CookieManager.call(this);
}

util.inherits(CookieBoss, CookieManager);

CookieBoss.parse = Cookie.parse;
CookieBoss.serialize = Cookie.serialize;
CookieBoss.prototype.parse = Cookie.parse;
CookieBoss.prototype.serialize = Cookie.serialize;

CookieBoss.prototype.getCookies = function() {
    const getDomainCookies = (obj) => {
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
        return Object.values(obj);
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
        .map(getDomainCookies)
        // flatten them down
        .reduce(reduceFlatten, []);
};

CookieBoss.prototype.toJSON = function() {
    return this.getCookies()
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

CookieBoss.prototype.fromJSON = function(json) {
    Object.entries(json).forEach(([domain, cookies]) => {
        this.store(domain, cookies);
    });
};

CookieBoss.prototype.store = function(url, cookieStrs) {
    if (typeof cookieStrs === 'string') {
        cookieStrs = [cookieStrs];
    }
    
    if (!url || !Array.isArray(cookieStrs)) {
        return;
    }
    
    const { pathname, hostname } = urlParse.parse(url);
    
    Object.values(cookieStrs)
        // map the strings into cookie objects
        .map((cookieStr) => {
            // this will work with either full ur;'s or just the domain name
            const cookie = SimpleCookie.parse(cookieStr, pathname, hostname || url);
            
            cookie.pathReg = new RegExp('^' + cookie.path);
            
            return cookie;
        })
        // then assign each cookie to the manager
        .forEach((cookie) => {
            // domain for this cookie already exists
            if (this.domains.includes(cookie.domain)) {
                this.list[cookie.domain][cookie.name] = cookie;
            } else{
                this.list[cookie.domain] = {};
                this.list[cookie.domain][cookie.name] = cookie;
                
                const pattern = new RegExp(
                    cookie.domain.match(/^\./) ?
                        cookie.domain + '$' :
                        '^' + cookie.domain + '$'
                );
                
                this.domainReg.push(pattern);
                this.domains.push(cookie.domain);
            }
        });
    
    // calculate length
    this.length = this.getCookies().length;
};

module.exports = CookieBoss;