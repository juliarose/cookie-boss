export as namespace cookieboss;

export = CookieBoss;

type Cookie = {
    expires: Date,
    httponly: boolean,
    secure: boolean,
    path: string,
    domain: string,
    name: string,
    value: string,
    pathReg: RegExp
}

type CookieJSON = {
    [domain: string]: string | string[]
}

declare class CookieBoss {
    constructor();
    
    toJSON(): CookieJSON;
    fromJSON(json: CookieJSON): void;
    getCookies(): Cookie[];
    parse(cookieStr: string): CookieJSON;
    serialize(name: string, value: string, options: {
        domain?: string,
        encode?: (str: string) => string,
        expires?: Date,
        httpOnly?: boolean,
        maxAge?: number,
        sameSite?: true | false | 'lax' | 'none' | 'strict',
        secure?: number
    }): string;
    store(url: string, cookieStr: string | string[]): void;
    prepare(url: string): string;
}
