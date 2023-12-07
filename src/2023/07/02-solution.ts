// https://adventofcode.com/2023/day/7

import { readLines, notEmpty, unique, difference, identity } from "../../utils";
import { iter } from "../../utils/iter";

const lines = readLines(`${__dirname}\\input.txt`).filter(notEmpty);

const faces = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'] as const;
const facesWithoutJokers = [...difference(faces, ['J'] as const)];
type Face = typeof faces[number];

const handTypes = ['five', 'four', 'full', 'three', 'twopair', 'onepair', 'high'] as const;
type HandType = typeof handTypes[number];

type Hand = [Face, Face, Face, Face, Face];

const groupCounts = (hand: Hand) => iter(hand)
    .groupBy(identity)
    .map(([_, g]) => g.count())
    .filter(c => c > 1);

const classifiers: Record<HandType, (hand: Hand) => boolean> = {
    five: hand => groupCounts(hand).some(c => c === 5),
    four: hand => groupCounts(hand).some(c => c === 4),
    full: hand => groupCounts(hand).some(c => c === 3) && groupCounts(hand).some(c => c === 2),
    three: hand => groupCounts(hand).some(c => c === 3),
    twopair: hand => groupCounts(hand).filter(c => c === 2).count() === 2,
    onepair: hand => groupCounts(hand).some(c => c === 2),
    high: () => true
}

/**
 * 
 * @param hand 
 * @returns 
 */
const permutateHandForJokers = (hand: Hand): Hand[] => {
    const firstJoker = hand.findIndex(x => x === 'J');
    if (firstJoker === -1) return [hand];
    return facesWithoutJokers.flatMap(f => {
        const permutation = [...hand.slice(0, firstJoker), f, ...hand.slice(firstJoker + 1)] as Hand;
        return permutateHandForJokers(permutation);
    });
}

const handKey = (hand: Hand) => hand.join('');
const memos = new Map<string, number>();

const rankHand = (hand: Hand): number => {

    if (memos.has(handKey(hand)))
        return memos.get(handKey(hand))!;

    const rank = () => {
        const jCount = hand.filter(x => x === 'J').length;
        const withoutJ = hand.filter(x => x !== 'J') as Hand;
        const withoutJRank = handTypes.find(h => classifiers[h](withoutJ));

        // 5^13 = 1220703125 lol. NOPE. Do some heuristics.
        switch (jCount) {
            case 5: return handTypes.findIndex(h => h === 'five');
            case 4: return handTypes.findIndex(h => h === 'five');
            case 3:
                if (withoutJRank == 'onepair')
                    return handTypes.findIndex(h => h === 'five');
                return handTypes.findIndex(h => h === 'four');
            case 0:
                return handTypes.findIndex(h => classifiers[h](hand));
        }

        // the rest we can permutate. Lazy and don't feel like finding all the rules for the rest.
        const permutated = permutateHandForJokers(hand);
        const sorted = permutated.sort(compareHands);
        return handTypes.findIndex(h => classifiers[h](sorted.at(-1)!));
    }

    const val = rank();
    memos.set(handKey(hand), val);
    return val;
}

const rankCard = (face: Face) => faces.findIndex(f => f === face);

const compareHands = (a: Hand, b: Hand) => {
    const aRank = rankHand(a);
    const bRank = rankHand(b);
    if (aRank !== bRank) return bRank - aRank;
    for (let i = 0; i < a.length; i++) {
        const aCard = rankCard(a[i]);
        const bCard = rankCard(b[i]);
        if (aCard !== bCard) return bCard - aCard;
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
