export as namespace cookieboss;

export = CookieBoss;

declare class CookieBoss {
    constructor();
    
    toJSON(): { [domain: string]: string[] };
    parse(cookieStr: string): { [key: string]: string };
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
