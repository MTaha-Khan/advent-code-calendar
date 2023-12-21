import { readLines } from "../helper";
import { Grid } from "../lib/grid";

const testMap = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

const grids: Grid<string>[] = [];

const reflections: { grid: number, index: number, dir: "H" | "V" } [] = [];



export async function part1() {
    await extractData();    
    findReflections();
    
    let total = 0;
    for (const r of reflections) {
        total += (r.dir === "H") ? (100 * (r.index + 1)) : (r.index + 1);         
    }

    console.log("Sum: ", total);
   
}

export async function part2() {
    await extractData();    
    findSmudgeReflections();
    
    let total = 0;
    for (const r of reflections) {
        total += (r.dir === "H") ? (100 * (r.index + 1)) : (r.index + 1);         
    }

    console.log("Sum: ", total);

}

function findReflections() {

    let gridIdx = 0;
    
    for (const grid of grids) {
        gridIdx++;
        // horizontal match found        
        let horizontalIndex: number[] = [];        
        for (let i = 0; i < grid.rows - 1; i++) {
            if (grid.rowAsString(i) === grid.rowAsString(i + 1)) horizontalIndex.push(i);
        }
        //console.log(gridIdx, "H", horizontalIndex.length);
        
        // find vertical match
        let verticalIndex: number[] = [];
        for (let i = 0; i < grid.columns - 1; i++) {
            if (grid.colAsString(i) === grid.colAsString(i + 1)) verticalIndex.push(i);
        }
        //console.log(gridIdx, "V", verticalIndex.length);

        let dir: "H" | "V" = "H";
        let index = 0;
        if (horizontalIndex.length > 0) {           
            for (const hi of horizontalIndex)
            {
                if(checkHorizontal(grid, hi)) {
                    index = hi;
                    dir = "H";
                    break;
                }
            }
        }
        if (verticalIndex.length > 0) {            
            for (const vi of verticalIndex)
            {
                if(checkVertical(grid, vi)) {                    
                    index = vi;
                    dir = "V";
                    break;
                }
            }
        }

        //console.log(`grid ${gridIdx} line ${dir} match index ${index}`);
        reflections.push({ grid: gridIdx, index, dir });
    }
}

function checkHorizontal(grid: Grid<string>, index: number): boolean {
    for (let i = index, j = index + 1; i >= 0 && j < grid.rows; i--, j++) {
        if (grid.rowAsString(i) !== grid.rowAsString(j)) return false;
    }
    return true;
}

function checkVertical(grid: Grid<string>, index: number): boolean {
    for (let i = index, j = index + 1; i >= 0 && j < grid.columns; i--, j++) {
        if (grid.colAsString(i) !== grid.colAsString(j)) return false;
    }
    return true;
}


function findSmudgeReflections() {

    let gridIdx = 0;
    
    for (const grid of grids) {
        gridIdx++;

        let dir: "H" | "V" = "H";
        let index = 0;

        // horizontal match found        
        for (let h = 0; h < grid.rows; h++) {
            let check = smudgeHorizontal(grid, h);
            if (check)  {
                dir = "H";
                index = h;
                // console.log(`grid ${gridIdx} : horizontal location ${h}`);
            }
        }
        
        // find vertical match
        for (let v = 0; v < grid.columns - 1; v++) {
            let check = smudgeVertical(grid, v);
            if (check)  {
                dir = "V";
                index = v;
                // console.log(`grid ${gridIdx} : vertical location ${v}`);
            }
        }
        
        //console.log(`grid ${gridIdx} line ${dir} match index ${index}`);
        reflections.push({ grid: gridIdx, index, dir });
    }
}

function smudgeHorizontal(grid: Grid<string>, index: number): boolean {
    let found: boolean = false;
    for (let i = index, j = index + 1; i >= 0 && j < grid.rows; i--, j++) {
        const ri = grid.row(i), rj = grid.row(j);
        for (let k = 0; k < ri.length; k++) {
            if (ri[k] !== rj[k]) {
                if (found) return false;
                else {
                    found = true;
                }
            }
        }
    }
    return found;
}

function smudgeVertical(grid: Grid<string>, index: number): boolean {
    let found: boolean = false;
    for (let i = index, j = index + 1; i >= 0 && j < grid.columns; i--, j++) {
        const ci = grid.column(i), cj = grid.column(j);
        for (let k = 0; k < ci.length; k++) {
            if (ci[k] !== cj[k]) {
                if (found) return false;
                else {
                    found = true;
                }
            }
        }
    }
    return found;
}

async function extractData() {
    const lines = await readLines('../input/input13.txt', true); // testMap.split('\n'); //  
    let temp: string[] = [];
    for (const line of lines) {
        if(!line.trim()) {
            grids.push(new Grid<string>(temp));
            temp = [];
        } else temp.push(line);
    }   
    console.log(grids.length);
}


