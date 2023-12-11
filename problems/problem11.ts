import { readLines } from "../helper";
import { manhattanDistance as mandis } from "../lib/path";

const map : string[][] = [];
const galaxies: [y: number, x: number][] = [];
let gam = 1000000 - 1;  // galaxy multiplier

export async function part1() {
    gam = 1;
    await extractData();    
    console.log("Total distance: ", await findPathInGalaxies())
}

export async function part2() {
    gam = 1000000 - 1;
    await extractData();       
    console.log("Total distance: ", await findPathInGalaxies())
}

async function findPathInGalaxies(): Promise<number> {
    let totalD = 0;
    while (galaxies.length > 0) {
        const cg = galaxies.pop();
        if (cg) {
            for (const ga of galaxies) totalD += mandis({ row: cg[1], col: cg[0]}, { row: ga[1], col: ga[0]})
        }
    }
    return totalD;
}

async function extractData() {
    const lines = await readLines('../input/input11.txt');
    for (const line of lines) map.push(line.split(''))

    const eYl: number[] = [];
    for (let i = 0; i < map.length; i++)    
    {
        let ey: boolean = true;
        for (let j = 0; j < map.length; j++) if (map[i][j] !== '.') ey = false;
        if (ey) eYl.push(i);
    }

    const eXl: number[] = [];
    for (let i = 0; i < map.length; i++)    
    {
        let ex: boolean = true;
        for (let j = 0; j < map.length; j++) if (map[j][i] !== '.') ex = false;
        if (ex) eXl.push(i);
    }

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '#') {
                let mi = 0; let mj = 0;
                for (const n of eYl) { if (n < i) mi++; }
                for (const n of eXl) { if (n < j) mj++; }
                galaxies.push([j + (mj * gam), i + (mi * gam)]);
            }
        }
    }
}
