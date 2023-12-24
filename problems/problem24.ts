import { readLines } from "../helper";

export async function part1() {
    await extractData();    
   
}

export async function part2() {
    await extractData();    

}


async function extractData() {
    let lines = [];
    
    if (!sample) lines = await readLines('../input/input24.txt');
    else lines = sampleInput.split('\n')

    for (const line of lines) {
        
    }    
}

const sample = true;
const sampleInput = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;
