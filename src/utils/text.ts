import { delay } from ".";

function roulette(): number {
    return Math.floor(Math.random() * 38)
}

function isRed(n: number): boolean {
    return n > 1 && n % 2 == 0;
}

let cash = 100;
let bet = 0;

async function go() {


    for (let i = 0; i < 100; i++) {

        if(bet == 0) {
            bet = cash / 10;
        }

        if(bet >= cash) {
            bet = cash / 10;
        }

        cash -= bet;

        if (isRed(roulette())) {
            cash += (2 * bet);
            console.log(`Won: $${2 * bet}, cash: $${cash}`);
            bet = 0;
        }
        else {
            console.log(`Lost: $${bet}, cash: $${cash}`);
        }

        await delay(700);
    }
}

void go();