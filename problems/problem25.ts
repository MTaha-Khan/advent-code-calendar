import { readLines } from "../helper";

export async function part1() {
    await extractData();    
   
}

export async function part2() {
    await extractData();    

}

async function extractData() {
    let lines = [];
    
    if (sample) lines = await readLines('../input/input25.txt');
    else lines = sampleInput.split('\n')

    for (const line of lines) {
                
    }    
}

const sample = true;
const sampleInput = ``;
