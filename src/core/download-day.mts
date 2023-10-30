import 'dotenv/config';
import fs from 'fs';
import Handlebars from 'handlebars';
import open from 'open';

async function downloadDay(year: number, day: number) {

    // format of url is https://adventofcode.com/{year}/day/{day}
    const url = `https://adventofcode.com/${year}/day/${day}`;
    const inputUrl = `${url}/input`;

    const input = await download(inputUrl);

    fs.mkdirSync(`./src/${year}/${day}`, { recursive: true });
    fs.writeFileSync(`./src/${year}/${day}/input.txt`, input);

    const template = Handlebars.compile(fs.readFileSync('./src/core/template.hbs', 'utf-8'));
    const solution1 = template({ year, day, which: '01' });
    const solution2 = template({ year, day, which: '02' });

    fs.writeFileSync(`./src/${year}/${day}/01-solution.ts`, solution1);
    fs.writeFileSync(`./src/${year}/${day}/02-solution.ts`, solution2);

    open(url);
}

async function download(url: string) {
    const cookie = `session=${process.env.session}`;

    const response = await fetch(url, {
        headers: {
            cookie
        }
    });

    return await response.text();
}

// examine command line args to get the year and day, 
// and if not present, use the current year and day.
const year = parseInt(process.argv[2] ?? new Date().getFullYear());
const day = parseInt(process.argv[3] ?? new Date().getDate());

void downloadDay(year, day);
