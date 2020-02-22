const year = new Date().getFullYear();
const CookieBoss = require('../');
const cookieboss = new CookieBoss();

it('Stores properly', () => {
    const cookieboss = new CookieBoss();
    const url = 'https://github.com'
    cookieboss.store(url, [
        `_octo=GH1.1.1249112545.1582225594; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; Secure`,
        `logged_in=no; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; HttpOnly; Secure`
    ]);
    
    const prepared = cookieboss.prepare(url);
    
    expect(prepared).toBe('_octo=GH1.1.1249112545.1582225594; logged_in=no');
});

it('Prepares proper JSON', () => {
    const cookieboss = new CookieBoss();
    const url = 'https://github.com'
    cookieboss.store(url, [
        `_octo=GH1.1.1249112545.1582225594; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; Secure`,
        `logged_in=no; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; HttpOnly; Secure`
    ]);
    const json = cookieboss.toJSON();
    
    expect(Object.keys(json)).toEqual(['github.com']);
    expect(json['github.com'].length).toBe(2);
});

it('Parses a cookie', () => {
    const cookieboss = new CookieBoss();
    const url = 'https://github.com'
    cookieboss.store(url, [
        `_octo=GH1.1.1249112545.1582225594; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; Secure`,
        `logged_in=no; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; HttpOnly; Secure`
    ]);
    const cookie = '_octo=GH1.1.1249112545.1582225594; logged_in=no';
    const parsed = cookieboss.parse(cookie);
    
    expect(parsed).toEqual({
        _octo: 'GH1.1.1249112545.1582225594',
        logged_in: 'no'
    });
});

it('Throws an error when attempting to store a cookie with a given full url', () => {
    const cookieboss = new CookieBoss();
    cookieboss.store('badcookie', ['badcookie=yes; Path=/;']);
    
    expect(cookieboss.prepare('badcookie')).toBe('');
});

it('Stores cookie when domain is given in cookie', () => {
    const cookieboss = new CookieBoss();
    cookieboss.store('badcookie', ['badcookie=no; Path=/; Domain=goodcookie.com; Secure']);
    
    expect(cookieboss.prepare('https://goodcookie.com')).toBe('badcookie=no');
});

it('Stores cookie using cookie domain', () => {
    const cookieboss = new CookieBoss();
    cookieboss.store('.domain.com', [
        `user-id=123; Expires=Wed, 20 May ${year + 1} 18:42:48 GMT; Max-Age=7624700; Path=/; Domain=.domain.com; HttpOnly`
    ]);
    
    expect(cookieboss.prepare('https://domain.com')).toBe('user-id=123');
});

it('Stores cookie using cookies as a string', () => {
    const cookieboss = new CookieBoss();
    cookieboss.store('https://domain.com', `user-id=123; Expires=Wed, 20 May ${year + 1} 18:42:48 GMT; Max-Age=7624700; Path=/; Domain=.domain.com; HttpOnly`);
    
    expect(cookieboss.prepare('https://domain.com')).toBe('user-id=123');
});

it('Ignores empty domain', () => {
    const cookieboss = new CookieBoss();
    cookieboss.store('', [
        `nothing=nothing; Expires=Wed, 20 May ${year + 1} 18:42:48 GMT; Max-Age=7624700; Path=/; Domain=.domain.com; HttpOnly`
    ]);
    
    expect(cookieboss.prepare('')).toBe('');
});

it('Stores from JSON', () => {
    const cookieboss = new CookieBoss();
    
    cookieboss.fromJSON({
        "github.com": [
            `_octo=GH1.1.1249112545.1582225594; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; Max-Age=31467234; Path=/; Domain=github.com; secure`,
            `logged_in=no; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; Max-Age=31467234; Path=/; Domain=github.com; secure; HttpOnly`
        ]
    });
    
    expect(cookieboss.getCookies().length).toBe(2);
});
