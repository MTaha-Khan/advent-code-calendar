import { readLines } from "../helper";

const numbers: number[][] = []; // [[0, 3, 6, 9, 12, 15], [1, 3, 6, 10, 15, 21], [10, 13, 16, 21, 30, 45]];
const nextvalues: number[] = [];
const previousvalues: number[] = [];

export async function part1() {
    await extractData();    
    for (const num of numbers) nextvalues.push(getNextValue(num));

    let sum = 0;
    for (const num of nextvalues) sum += num;
    console.log("total sum of next values", sum);   
}

export async function part2() {
    await extractData();    
    for (const num of numbers) previousvalues.push(getPreviousValue(num));

    let sum = 0;
    for (const num of previousvalues) sum += num;
    console.log("total sum of previous values", sum); 

}


async function extractData() {
    const lines = await readLines('../input/input9.txt');
    for (const line of lines) {
        numbers.push(line.split(' ').map(n => +n));
    }    
}

function getNextValue(num: number[]): number
{
    if (num.every(n => n === 0) || num.length === 0) return 0;
    const diff: number[] = [];
    for (let i = 0; i < num.length - 1; i++) {
        diff.push(num[i + 1] - num[i]);
    }

    if (diff.every(n => n === 0)) return num[num.length - 1];

    return num[num.length - 1] + getNextValue(diff);
}

function getPreviousValue(num: number[]): number
{
    if (num.every(n => n === 0) || num.length === 0) return 0;
    const diff: number[] = [];
    for (let i = 0; i < num.length - 1; i++) {
        diff.push(num[i + 1] - num[i]);
    }

    if (diff.every(n => n === 0)) return num[0];

    return num[0] - getPreviousValue(diff);
}
