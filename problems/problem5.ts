import { readAll, readLines } from "../helper";

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
    console.log("min", await seedRangeLocation());
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

async function seedRangeLocation() {
    const input = await readAll('../input/input5.txt');
    const { seeds, mapMatrix } = parseInput(input);
    const validSeed = (seed: number) => {
      for (let i = 0; i < seeds.length; i += 2) {
        if (seed >= seeds[i] && seed < seeds[i] + seeds[i + 1]) return true;
      }
      return false;
    };
    // Lowest location will correspond to some endpoint boundary
    const candidateSeeds = seeds
      .filter((_, i) => i % 2 === 0) // Add seed endpoints
      .concat(
        mapMatrix.flatMap((mappings, i) =>
          mappings.flatMap((m) => [
            // For each [a, b] range in each mapping, map [a, b+1] to their seed values
            lookupSeed(mapMatrix.slice(0, i + 1), m.destStart),
            lookupSeed(mapMatrix.slice(0, i + 1), m.destEnd) + 1,
          ])
        )
      )
      .filter(validSeed);
  
    return Math.min(...candidateSeeds.map((s) => lookupLocation(mapMatrix, s)));
}


interface Mapping {
    destStart: number;
    destEnd: number;
    srcStart: number;
    srcEnd: number;
}

let mapMatrix: Mapping[][];
  
function parseInput(input: string): {
    seeds: number[];
    mapMatrix: Mapping[][];
  } {
    const lines = input.split("\n\n");
    const seeds = lines.shift()!.split(":")[1].trim().split(" ").map(Number);
    const mapMatrix = lines.map((line) =>
      line
        .split("\n")
        .slice(1)
        .map((s) => s.split(" ").map(Number))
        .map(([destStart, srcStart, length]) => ({
          destStart,
          destEnd: destStart + length - 1,
          srcStart,
          srcEnd: srcStart + length - 1,
        }))
    );
    return { seeds, mapMatrix };
}
  
function lookupLocation(mapMatrix: Mapping[][], val: number) {
    return mapMatrix.reduce((curr, mappings) => {
      for (let i = 0; i < mappings.length; i++) {
        const m = mappings[i];
        if (curr >= m.srcStart && curr <= m.srcEnd) {
          return m.destStart + (curr - m.srcStart);
        }
      }
      return curr; // No mapping, same number
    }, val);
}
  
function lookupSeed(mapMatrix: Mapping[][], val: number) {
    // Backwards lookup
    return mapMatrix.reduceRight((curr, mappings) => {
      for (let i = 0; i < mappings.length; i++) {
        const m = mappings[i];
        if (curr >= m.destStart && curr <= m.destEnd) {
          return m.srcStart + (curr - m.destStart);
        }
      }
      return curr; // No mapping, same number
    }, val);
}
  