import { readLines } from "../helper";

class Path {
    public visited: { [key: string]: number } = {};
    public current: [y: number, x: number] = [0, 0];
    public steps: number = 0;

    constructor (c: [number, number], oldPath: Path | null) {
        const i = c[0]; const j = c[1]; let s = 1;

        if (c[0] === start[0] && c[1] === start[1]) s = 0;
        if (map[i][j] === '>') { c = [i, j + 1]; s = 2; }
        if (map[i][j] === '<') { c = [i, j - 1]; s = 2; }
        if (map[i][j] === 'v') { c = [i + 1, j]; s = 2; }
        if (map[i][j] === '^') { c = [i - 1, j]; s = 2; }
        this.current = c;
        this.steps = oldPath !== null ? oldPath.steps + s : s;
        this.visited = oldPath !== null ? Object.assign({}, oldPath.visited) : {};
        const key: string = `${c[0]},${c[1]}`;
        this.visited[key] = this.steps;
    }

    public isValid(y: number, x: number): boolean {
        if (this.current[0] === y && this.current[1] === x) return false;
        if (this.visited[`${y},${x}`] !== void 0) return false;
        return true;
    }
}

let currentPaths: Path[] = [];
const finishedPaths: Path[] = [];

export async function part1() {
   await extractData();    
   calculatePaths();
   console.log(finishedPaths.length);
   let furthest = 0;
   for (const f of finishedPaths) {
        console.log(f.steps);
        if (furthest < f.steps) furthest = f.steps; 
   }
   //printMap();
   console.log("Furthest scenic distance ", furthest);
}

export async function part2() {
    await extractData();  
    replaceSlopes();
    calculatePaths();
    console.log(finishedPaths.length);
    let furthest = 0;
    for (const f of finishedPaths) {
        console.log(f.steps);
        if (furthest < f.steps) furthest = f.steps; 
    }
    //printMap();
    console.log("Furthest scenic distance ", furthest);
}

function replaceSlopes() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (['>', '<', 'v', '^'].includes(map[i][j])) map[i][j] = '.';
        }
    }
}

function calculatePaths() {
    currentPaths.push(new Path(start, null));
    let idx = 0;
    while (currentPaths.length > 0) {
        const newPaths : Path[] = [];
        for (const c of currentPaths) {
            const cp = c.current;
            if (c.current[1] === end[1] && c.current[0] === end[0]) finishedPaths.push(c);
            if (movePossible(cp[0] - 1, cp[1], c)) newPaths.push(new Path([cp[0] - 1, cp[1]], c))
            if (movePossible(cp[0] + 1, cp[1], c)) newPaths.push(new Path([cp[0] + 1, cp[1]], c))
            if (movePossible(cp[0], cp[1] - 1, c)) newPaths.push(new Path([cp[0], cp[1] - 1], c))
            if (movePossible(cp[0], cp[1] + 1, c)) newPaths.push(new Path([cp[0], cp[1] + 1], c))
        }
        // if (currentPaths.length > newPaths.length) { 
        //     console.log("old paths")
        //     console.log(currentPaths.length,  currentPaths)
        //     console.log("new paths")
        //     console.log(newPaths.length, newPaths)
        // }
        currentPaths = newPaths;
        //console.log(idx, currentPaths.length);
        idx++;
    }
}

function movePossible(y: number, x: number, p: Path): boolean {

    if (y >=0 && y < map.length && x >= 0 && x < map[y].length && map[y][x] !== '#') {
        if (['.', '>', '<', 'v', '^'].includes(map[y][x])) {
            if (map[y][x] === '.' && p.isValid(y, x)) return true;
            if (map[y][x] === '>' && p.isValid(y, x+1)) return true;
            if (map[y][x] === '<' && p.isValid(y, x-1)) return true;
            if (map[y][x] === 'v' && p.isValid(y+1, x)) return true;
            if (map[y][x] === '^' && p.isValid(y-1, x)) return true;
        }
    }
    return false;
}

function printMap() {
    for (let i = 0; i < map.length; i++) {
        console.log(map[i].join(''));
    }
}

async function extractData() {
    let lines = [];
    
    if (!sample) lines = await readLines('../input/input23.txt');
    else lines = sampleInput.split('\n');

    for (const line of lines) {
        map.push(line.split(''))
    }    

    for (let i = 0; i < map[0].length; i++) {
        if (map[0][i] === '.') start = [0, i];
        if (map[map.length - 1][i] === '.') end = [map.length - 1, i];
    }

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '>' && map[i][j + 1] !== '.') console.log("Nah Nah", [i,j]); 
            if (map[i][j] === '<' && map[i][j - 1] !== '.') console.log("Nah Nah", [i,j]); 
            if (map[i][j] === 'v' && map[i + 1][j] !== '.') console.log("Nah Nah", [i,j]); 
            if (map[i][j] === '^' && map[i - 1][j] !== '.') console.log("Nah Nah", [i,j]);         
        }        
    }

}

const map: string[][] = [];
let start: [number, number] = [0,0];
let end: [number, number] = [0,0];

const sample = false;
const sampleInput = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`;
