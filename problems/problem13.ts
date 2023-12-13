import { readLines } from "../helper";

const grids: string[][][] = [];


export async function part1() {
    await extractData();    
    findReflections();
   
}

export async function part2() {
    await extractData();    

}

function findReflections() {
    console.log(grids.length);

    const grid = grids[0];
    //for(const line of grid) console.log(line.join(''))

    for (const grid of grids) {
        for (let i = 0; i < grid.length - 1; i++) {
            if (grid[i].join('') === grid[i + 1].join('')) {
                console.log(`grid line match index ${i}`);
                break;
            }

        }
    }
}

async function extractData() {
    const lines = await readLines('../input/input13.txt', true);
    let temp: string[][] = [];
    for (const line of lines) {
        if(!line.trim()) {
            grids.push(temp);
            temp = [];
        }
        temp.push(line.split(''));
    }   
}
