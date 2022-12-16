type State = { released: number, valves: Valves };
const search = (valves: Valves, at = 'AA', released = 0, timeLeft = 30): State => {

    if (allOn(valves))
        return { valves, released: released + (timeLeft * rate(valves)) };

    if (timeLeft <= 0)
        return { valves, released };

    released += rate(valves);

    const r = rate(valves);
    let moves: State[] = [];
    if (!valves[at].open && timeLeft > 1) {
        const on = clone(valves);
        on[at].open = true;
        moves = moves.concat(valves[at].tunnels.map(v => search(on, v, r, timeLeft - 2)));
    }

    moves = moves.concat(valves[at].tunnels.map(v => search(valves, v, r, timeLeft - 1)));

    const max = moves.sort((a, b) => b.released - a.released);
    return max[0];
}

const state = search(valves);
console.log(state.released);
