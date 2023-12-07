import { readLines } from "../helper";

const time: number[] = [];
const distance: number[] = [];
const numbers: number[] = [];

export async function part1() {
    await extractData1();    
    let multiply = numbersPossible();
    console.log("multiply", multiply);
}



export async function part2() {
    await extractData2();    
    let multiply = numbersPossible();
    console.log("multiply", multiply);
}

function numbersPossible() {
    for (let i = 0; i < time.length; i++) {
        const d = distance[i];
        const t = time[i];
        let n = 0;
        for (let i = 1; i < t; i++) {
            if (((t - i) * i) > d) n++;
        }
        numbers[i] = n;
    }

    let multiply = 1;
    for (const n of numbers) { if (n > 0) { multiply = multiply * n; } }
    return multiply;
}

async function extractData1() {
    const lines = await readLines('../input/input6.txt');
    let label = "";
    for (const line of lines) {
        if (line.indexOf("Time: ") > -1)
            line.substring("Time: ".length).split(' ').filter(f => f.trim() !== "").map(n => time.push(+n));
        else if (line.indexOf("Distance: ") > -1)
            line.substring("Distance: ".length).split(' ').filter(f => f.trim() !== "").map(n => distance.push(+n));   
    }    

    time.forEach(t => numbers.push(0));    
}

async function extractData2() {
    const lines = await readLines('../input/input6.txt');
    let label = "";
    for (const line of lines) {
        if (line.indexOf("Time: ") > -1)
            line.substring("Time: ".length).replace(/ /g, '').split(' ').map(n => time.push(+n));
        else if (line.indexOf("Distance: ") > -1)
            line.substring("Distance: ".length).replace(/ /g, '').split(' ').map(n => distance.push(+n));   
    }    

    time.forEach(t => numbers.push(0));    
}

