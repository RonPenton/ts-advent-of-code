import 'dotenv/config';
import fs from 'fs';
import Handlebars from 'handlebars';
import open from 'open';

// examine command line args to get the year and day, 
// and if not present, use the current year and day.
const puzzle = parseInt(process.argv[2]) ?? 1;
const input = parseInt(process.argv[3]) ?? 'input.txt';
const year = parseInt(process.argv[4] ?? new Date().getFullYear());
const day = parseInt(process.argv[5] ?? new Date().getDate());

