import { readLines } from "../helper";

export async function part1() {
    const lines = await readLines('../input/input1.txt');

    let total = 0;

    for (const line of lines)
    {
        let s = "";
        for (let i = 0; i < line.length; i++) { if (line[i] >= '0' && line[i] <= '9')  { s += line[i]; break; } }
        for (let i = line.length - 1; i >=0; i--) { if (line[i] >= '0' && line[i] <= '9') { s += line[i]; break; } }

        if (s.length !== 2) throw new Error(`Numbers not found in line ${line} found ${s}`);

        total += (+s);
    }

    console.log(total);
}

export async function part2() {
    const lines = await readLines('../input/input1.txt');

    let total = 0;

    for (const line of lines)
    {
        let s = "";
        for (let i = 0; i < line.length; i++) { if (line[i] >= '0' && line[i] <= '9')  { s += line[i]; break; } }
        for (let i = line.length - 1; i >=0; i--) { if (line[i] >= '0' && line[i] <= '9') { s += line[i]; break; } }

        if (s.length !== 2) throw new Error(`Numbers not found in line ${line} found ${s}`);

        total += (+s);
    }

    console.log(total);
}