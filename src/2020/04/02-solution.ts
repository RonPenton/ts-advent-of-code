
import { readLines, notEmpty, iterateRegex, difference } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'] as const;
type RequiredType = typeof required[number];
type Passport = Record<string, string>;

function* parseInput(lines: string[]) {
    let passport: Passport | undefined = undefined; 
    for(const line of lines) {
        if(line.length == 0) {
            if(passport) yield passport;
            passport = undefined;
        }
        else {
            if(!passport) passport = {};
            const fields = [...iterateRegex(/(\w+):(\S+)/g, line)];
            const pairs = fields.map(x => [x[1], x[2]]);
            passport = { ...passport, ...Object.fromEntries(pairs) };
        }
    }
    if(passport) yield passport;
}

const validTypes: Record<Exclude<RequiredType, 'cid'>, (value: string) => boolean> = {
    'byr': (value) => {
        const year = Number(value);
        return value.length == 4 && year >= 1920 && year <= 2002;
    },
    'iyr': (value) => {
        const year = Number(value);
        return value.length == 4 && year >= 2010 && year <= 2020;
    },
    'eyr': (value) => {
        const year = Number(value);
        return value.length == 4 && year >= 2020 && year <= 2030;
    },
    'hgt': (value) => {
        const match = /^(\d+)(cm|in)$/.exec(value);
        if(!match) return false;
        const [_, height, unit] = match;
        const h = Number(height);
        if(unit == 'cm') return h >= 150 && h <= 193;
        if(unit == 'in') return h >= 59 && h <= 76;
        return false;
    },
    'hcl': (value) => /^#[0-9a-f]{6}$/.test(value),
    'ecl': (value) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value),
    'pid': (value) => /^\d{9}$/.test(value),
}

const isValidPassport = (passport: Passport) => {
    const missing = difference(required, Object.keys(passport));
    if(missing.size > 0)
        return false;

    const keys = Object.keys(passport) as RequiredType[];
    for(const key of keys) {
        const value = passport[key];
        if(validTypes[key] && !validTypes[key](value))
            return false;
    }
    return true;
}

const passports = [...parseInput(lines)];
const valid = passports.filter(isValidPassport);

console.log(valid.length);
