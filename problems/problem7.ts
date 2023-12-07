import { readLines } from "../helper";

const hands: [hand: string, num: number][] = [];
const cards1: string[] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
const cards2: string[] = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];

let cards: string[] = cards1;

let play = 1;

const sortHands = (h1: [hand: string, num: number], h2: [hand: string, num: number]) : number => {

    const c1 = diverseCharsLength(h1[0]);
    const c2 = diverseCharsLength(h2[0]);

    if (c1[0] > c2[0]) return -1;
    if (c1[0] < c2[0]) return 1;

    if (c1[1] > c2[1]) return -1;
    if (c1[1] < c2[1]) return 1;

    // same
    for (let i = 0; i < 5; i++) {
        if (h1[0][i] !== h2[0][i]) {
            const i1 = cards.indexOf(h1[0][i]);
            const i2 = cards.indexOf(h2[0][i]);
            if (i1 > i2) return 1;
            if (i1 < i2) return -1;
        }
    }
    return 0;
};

export async function part1() {
    await extractData();        

    const sortedHands = hands.sort(sortHands);

    let winnings = 0;
    for (let i = 0; i < sortedHands.length; i++)  winnings += ((i + 1) * sortedHands[i][1]);
    
    console.log("winnings :",  winnings);
}

export async function part2() {
    await extractData();        
    
    cards = cards2;
    play = 2;
    
    const sortedHands = hands.sort(sortHands);

    let winnings = 0;
    for (let i = 0; i < sortedHands.length; i++)  winnings += ((i + 1) * sortedHands[i][1]);
    
    console.log("winnings :",  winnings);
}


async function extractData() {
    const lines = await readLines('../input/input7.txt');
    for (const line of lines) {
        const splits = line.trim().split(' ');
        if (splits.length !== 2) throw new Error(`Incorrect format at line ${line}`)
        hands.push([splits[0], +splits[1]]);
    }    
}


function diverseCharsLength(hand: string) : [chars: number, score: number]
{
    if (hand.length !== 5) throw new Error(`hand length not correct ${hand}`);

    const charsArr: { [ char: string ] : number } = {};
    for (const c of [...hand]) {        
        if (!charsArr[c]) {
            charsArr[c] = 1;             
        } else charsArr[c] += 1;
    }

    let length = 0;
    for (const c in charsArr) length += 1;

    if (play == 2 && charsArr["J"] && length > 1) {
        const j = charsArr["J"];
        delete charsArr["J"];
        length = length - 1;
        let max = 0;
        let maxc = "";
        for (const c in charsArr) {
            if (charsArr[c] > max) {
                max = charsArr[c];
                maxc = c;
            } else if (charsArr[c] === max && cards.indexOf(c) > cards.indexOf(maxc)) maxc = c;
        }
        charsArr[maxc] += j;
    } 

    let m = 1;
    for (const c in charsArr) m *= (charsArr[c] * charsArr[c]);
    
    return [length, m];
}
