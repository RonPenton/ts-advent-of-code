// https://adventofcode.com/2023/day/7

import { readLines, notEmpty, unique } from "../../utils";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const faces = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;
type Face = typeof faces[number];

const handTypes = ['five', 'four', 'full', 'three', 'twopair', 'onepair', 'high'] as const;
type HandType = typeof handTypes[number];

type Hand = [Face, Face, Face, Face, Face];

const classifiers: Record<HandType, (hand: Hand) => boolean> = {
    five: hand => iter(unique(hand).values()).some(f => hand.filter(x => x == f).length === 5),
    four: hand => iter(unique(hand).values()).some(f => hand.filter(x => x == f).length === 4),
    full: hand => {
        const threes = iter(unique(hand).values()).filter(f => hand.filter(x => x == f).length === 3);
        if (threes.count() !== 1) return false;
        const rest = iter(hand).except(threes);
        return rest.unique().some(f => hand.filter(x => x == f).length === 2);
    },
    three: hand => iter(unique(hand).values()).some(f => hand.filter(x => x == f).length === 3),
    twopair: hand => iter(unique(hand).values()).filter(f => hand.filter(x => x == f).length === 2).count() === 2,
    onepair: hand => iter(unique(hand).values()).some(f => hand.filter(x => x == f).length === 2),
    high: () => true
}

const rankHand = (hand: Hand) => handTypes.findIndex(h => classifiers[h](hand));
const rankCard = (face: Face) => faces.findIndex(f => f === face);

const compareHands = (a: Hand, b: Hand) => {
    const aRank = rankHand(a);
    const bRank = rankHand(b);
    if(aRank !== bRank) return bRank - aRank;
    for(let i = 0; i < a.length; i++) {
        const aCard = rankCard(a[i]);
        const bCard = rankCard(b[i]);
        if(aCard !== bCard) return bCard - aCard;
    }

    return 0;
}

type Play = {
    hand: Hand;
    bid: number;
}

const parseLine = (line: string): Play => {
    const [hand, bid] = line.split(' ');
    return { hand: [...hand] as Hand, bid: Number(bid) };
}

const plays = lines.map(parseLine);
const sorted = plays.sort((a, b) => compareHands(a.hand, b.hand));

const winnings = sorted.reduce((acc, play, i) => acc += play.bid * (i + 1), 0);

console.log(winnings);

