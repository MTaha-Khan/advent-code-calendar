import { readLines } from "../helper";

const numbers: [label: string, destination: number, source: number, length: number][] = [];
const iterations: string[] = [];
const seeds: number[] = [];

export async function part1() {
    await extractData();    
    let min = minlocation(seeds);
    console.log("min", min);
}

export async function part2() {
    await extractData();    
    let min = 9999999999999999999999999999;
    let index = 0;
    let seedsRange: number[] = [];
    for (let i = index; i < seeds.length; i+=2)
    {
        const sourceS = seeds[i];
        const sourceE = seeds[i] + seeds[i + 1];
        //console.log(sourceS, sourceE);
        let processE = sourceS;
        for (let j = sourceS; (j + 20000) < sourceE; j = (j + 20000)) 
        {
            seedsRange = [];
            for (let k = j; k < (j + 20000); k += 1) seedsRange.push(k);
            const nmin = minlocation(seedsRange);
            //console.log(min, nmin, sourceS, sourceE, j, j + 19999);
            if (nmin < min) min = nmin;
            processE = j;
        }
        seedsRange = [];
        for (let k = processE; k < sourceE; k += 1) seedsRange.push(k);
        const nmin = minlocation(seedsRange);
        //console.log(min, nmin, sourceS, sourceE, j, j + 19999);
        if (nmin < min) min = nmin;
    }
    
    console.log("min", min);
}

async function extractData() {
    const lines = await readLines('../input/input5.txt');
    let label = "";
    for (const line of lines) {
        if (line.indexOf("seeds: ") > -1)
            line.substring("seeds: ".length).split(' ').map(n => seeds.push(+n));
        else if (line.indexOf(" map:") > -1)
            label = line.substring(0, line.indexOf(" map:")).trim();
        else {
            const splits = line.split(' ').map(s => s);
            if (splits.length !== 3)
                throw new Error(`correct numbers not found on line ${line}`);
            numbers.push([label, +splits[0], +splits[1], +splits[2]]);
        }
    }
    for (const n of numbers)
        if (!iterations.includes(n[0]))
            iterations.push(n[0]);

    const minimiseIterations: [s1: string, s2: string, t: string][] = [];
    
    minimiseIterations.push(["temperature-to-humidity", "humidity-to-location", "temperature-to-location"]);
    minimiseIterations.push(["light-to-temperature", "temperature-to-location", "light-to-location"]); 
    minimiseIterations.push(["water-to-light", "light-to-location", "water-to-location"]); 
    minimiseIterations.push(["fertilizer-to-water", "water-to-location", "fertilizer-to-location"]); 
    minimiseIterations.push(["soil-to-fertilizer", "fertilizer-to-location", "soil-to-location"]); 
    minimiseIterations.push(["seed-to-soil", "soil-to-location", "seed-to-location"]); 

    for (const miteration of minimiseIterations)
    {
        const source = numbers.filter(n => n[0] === miteration[0]);
        const target = numbers.filter(n => n[0] === miteration[1]);
        
        removeItemsWithName(miteration[0]);
        removeItemsWithName(miteration[1]);
        for (const s of source)
        {
            const s1 = s[2]; const s2 = s[2] + s[3];
            for (const t of target)
            {
                const t1 = t[2]; const t2 = t[2] + t[3];
            }
            console.log(s[0], s[1], s[2], s[3] , s[1] + s[3]);   
        }
        console.log(miteration[0], miteration[1], miteration[2]);
    }
}

function minlocation(seeds: number[]): number{
    for (const iteration of iterations) {
        for (let i = 0; i < seeds.length; i++) {
            let cs = seeds[i];
            for (const en of numbers.filter(n => n[0] === iteration)) {
                if (cs >= en[2] && cs < (en[2] + en[3])) {
                    // found
                    seeds[i] = en[1] + (cs - en[2]);
                    continue;
                }
            }
        }
    }
    return Math.min(...seeds);
}

function removeItemsWithName(name: string): void {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i][0] === name) {
            numbers.splice(i--, 1);
        }
    }
}