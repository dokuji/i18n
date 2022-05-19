import { LocaleCode } from './locales'

export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  } : T

export interface Dictionary extends Record<string, string | Dictionary> {}

export type Dictionaries<T = Dictionary> = {
  // eslint-disable-next-line no-unused-vars
  [k in LocaleCode]: T
}

// Dotted path type
// https://stackoverflow.com/questions/47057649/typescript-string-dot-notation-of-nested-object

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type BadChars = '~' | '`' | '!' | '@' | '#' | '%' | '^' | '&' | '*' | '(' | ')' | '-' | '+'
| '=' | '{' | '}' | ';' | ':' | '\'' | '"' | '<' | '>' | ',' | '.' | '/' | '?'

type ExtractDottable<K extends PropertyKey> =
  K extends string ? string extends K ? never :
    // eslint-disable-next-line no-unused-vars
    K extends `${Digit}${infer _}` | `${infer _}${BadChars}${infer _}` ? never :
      K
    : never

type DottablePaths<T, P extends Prev[number] = 10> = [] | ([P] extends [never] ? never :
  T extends readonly any[] ? never :
    T extends object ? {
      [K in ExtractDottable<keyof T>]: [K, ...DottablePaths<T[K], Prev[P]>]
    }[ExtractDottable<keyof T>] : never)

type Join<T extends string[], D extends string> =
    T extends [] ? never :
      T extends [infer F] ? F :
        T extends [infer F, ...infer R] ?
          F extends string ? string extends F ? string : `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string

export type DottedPaths<T> = Join<Extract<DottablePaths<T>, string[]>, '.'>
