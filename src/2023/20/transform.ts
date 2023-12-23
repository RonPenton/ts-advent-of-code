import fs from 'fs';

const lines = ['digraph {'];

const input = fs.readFileSync('input.txt').toString().split('\n');

for (const line of input) {
    const [from, tos] = line.split(' -> ');
    const to = tos.split(', ');
    for (const t of to) {
        lines.push(`    ${from.replace('%', '').replace('&', '')} -> ${t.trim()};`);
    }
}

lines.push('}');
fs.writeFileSync('output.dot', lines.join('\n'));
