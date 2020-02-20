const CookieBoss = require('../');
const cookieboss = new CookieBoss();
const url = 'https://github.com'
const cookiesToStore = [
    `_octo=GH1.1.1249112545.1582225594; Path=/; Domain=github.com; Expires=Sat, 20 Feb 2021 19:06:34 GMT; Secure`,
    `logged_in=no; Path=/; Domain=github.com; Expires=Sat, 20 Feb 2021 19:06:34 GMT; HttpOnly; Secure`
];

cookieboss.store(url, cookiesToStore);

const prepared = cookieboss.prepare(url);
// '_octo=GH1.1.1249112545.1582225594; logged_in=no'

const parsed = cookieboss.parse(prepared);
// { _octo: 'GH1.1.1249112545.1582225594', logged_in: 'no' }

const json = cookieboss.toJSON();
// {
//     "github.com": [
//         "_octo=GH1.1.1249112545.1582225594; Expires=Sat, 20 Feb 2021 19:06:34 GMT; Max-Age=31611923; Path=/; Domain=github.com; secure",
//         "logged_in=no; Expires=Sat, 20 Feb 2021 19:06:34 GMT; Max-Age=31611923; Path=/; Domain=github.com; secure; HttpOnly"
//     ]
// }