
import { readLines, notEmpty, iterateRegex, difference } from "../../utils";

const lines = readLines(`${__dirname}\\input.txt`);

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'] as const;
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

const isValidPassport = (passport: Passport) => {
    const missing = difference(required, Object.keys(passport));
    return missing.size == 0;
}


const passports = [...parseInput(lines)];
const valid = passports.filter(isValidPassport);

console.log(valid.length);
