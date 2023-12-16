import { readLines } from "../helper";

const groups: [line: string, unknown:number, counts: number[]][] = [];

export async function part1() {
    await extractData();    
    let total = 0;
    
    for (const g of groups) {
        const arr = countA(g);
        total += arr;
    }
   
    console.log(" Total arrangements possible: ", total);
}

export async function part2() {
    await extractData(5);    
    let total = 0;
    
    for (const g of groups.slice(0, 1)) {
        const arr = countA(g);
        //console.log(g, arr);
        total += arr;
    }
   
    console.log(" Total arrangements possible: ", total);
}

// calculate and count arrangements for groups
function countA(group: [line: string, unknown:number, counts: number[]]): number {
    let arrangements = 0;
    const combos = getCombinations(group[1]);
    // combos.forEach((combination, index) => {
    //     let idx = 0;
    //     const newline = group[0].replace(/\?/g, (a, b) => combination.charAt(idx++));
    //     const newCombos = newline.split('.').filter(n => n).map(n => n.length);
    //     if (compare(newCombos, group[2])) arrangements++;
    //     //console.log(`${index + 1}: ${group[0]} : ${combination} : ${newline}`);
    // });
    return arrangements;
}

async function extractData(stuff: number = 1) {
    const lines = await readLines('../input/input12.txt');
    for (const line of lines) {
        const splits = line.split(' ');
        let lineStr = splits[0];
        let countStr = splits[1];
        if (stuff > 1) {
           lineStr = Array(stuff).fill(lineStr).join('?');
           countStr = Array(stuff).fill(countStr).join(',');
        }
        const unknownCounts = (lineStr.match(/\?/g) || []).length;
        const counts = countStr.split(',').map(n => +n);
        groups.push([lineStr, unknownCounts, counts]);
    }    
}

function getCombinations(possible: number): string[] {
    const combinations: string[] = [];

    const allStr: string[] = [];
    for (let i = 0; i < possible; i++) allStr.push('?');
    const str: string = allStr.join('');
    console.log(29, Math.pow(2, possible));
    // Loop through all possible binary combinations (2^n where n is the number of '?')
    for (let i = 0; i < Math.pow(2, possible); i++) {
        let combination = '';

        // Replace each character with '.' or '#' based on the binary representation of the current index
        for (let j = 0; j < str.length; j++) combination += ((i >> j) & 1) ? '.' : '#';

        if (!combinations.includes(combination)) combinations.push(combination);
    }

    return combinations;
}

function compare(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((element, index) => element === b[index]);
}


