beforeAll(() => {
    const year = new Date().getFullYear();
    // we add a year so they'll never expire in our tests
    const cookies = [
        `_octo=GH1.1.1249112545.1582225594; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; Secure`,
        `logged_in=no; Path=/; Domain=github.com; Expires=Sat, 20 Feb ${year + 1} 19:06:34 GMT; HttpOnly; Secure`
    ];
    
    // setup
    cookieboss.store(url, cookies);
});

const CookieBoss = require('../');
const cookieboss = new CookieBoss();
const url = 'https://github.com'

it('Stores properly', () => {
    const prepared = cookieboss.prepare(url);
    
    expect(prepared).toBe('_octo=GH1.1.1249112545.1582225594; logged_in=no');
});

it('Prepares proper JSON', () => {
    const json = cookieboss.toJSON();
    
    expect(Object.keys(json)).toEqual(['github.com']);
    expect(json['github.com'].length).toBe(2);
});

it('Parses a cookie', () => {
    const cookie = '_octo=GH1.1.1249112545.1582225594; logged_in=no';
    const parsed = cookieboss.parse(cookie);
    
    expect(parsed).toEqual({
        _octo: 'GH1.1.1249112545.1582225594',
        logged_in: 'no'
    });
});