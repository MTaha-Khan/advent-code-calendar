import { readLines } from "../helper";
import { Position } from "../lib/grid";

let currentStep = 0;
let currentPositions: Position[] = [];
let searchPositions: string[] = [];

export async function part1() {
    await extractData();    

    currentPositions.push(start);
    searchPositions = [];

    for (let i = currentStep; i < steps; i++) {
        let newPositions: Position[] = [];
       
        for (const c of currentPositions) {
            if (movePossible(c.y - 1, c.x) && !searchPositions.includes(c.upStr)) { newPositions.push(c.up); searchPositions.push(c.upStr); }
            if (movePossible(c.y + 1, c.x) && !searchPositions.includes(c.downStr)) { newPositions.push(c.down); searchPositions.push(c.downStr); }
            if (movePossible(c.y, c.x - 1) && !searchPositions.includes(c.leftStr)) { newPositions.push(c.left); searchPositions.push(c.leftStr); }
            if (movePossible(c.y, c.x + 1) && !searchPositions.includes(c.rightStr)) { newPositions.push(c.right); searchPositions.push(c.rightStr); }
        }

        currentPositions = newPositions;
        //console.log(i, currentPositions)
    }

    console.log("step positions possible ", currentPositions.length);
   
}

function movePossible(y: number, x: number) : boolean {
    if (x >= 0 && y >= 0 && y < map.length && x < map[y].length) {
        if (map[y][x] === '.' || map[y][x] === 'S') {           
            return true;
        }
    }
    return false;
}

function movePossibleInfinite(y: number, x: number) : boolean {
    let nx = x; let ny = y;

    if (y < 0 || y > map.length - 1) ny = mod(y, map.length);    
    if (x < 0 || x > map[ny].length - 1) nx = mod(x, map[ny].length);
    
    if (map[ny][nx] === '.' || map[ny][nx] === 'S') return true;
    return false;
}

function mod(d1: number, d2: number) : number {
    return ((d1 % d2) + d2) % d2;
}

export async function part2() {
    await extractData();    

    console.time("total time")
    currentPositions.push(start);

    for (let i = currentStep; i < steps; i++) {
        let newPositions: Position[] = [];
        searchPositions = [];

        for (const c of currentPositions) {            
            if (movePossibleInfinite(c.y - 1, c.x) && !searchPositions.includes(c.upStr)) { newPositions.push(c.up); searchPositions.push(c.upStr); }
            if (movePossibleInfinite(c.y + 1, c.x) && !searchPositions.includes(c.downStr)) { newPositions.push(c.down); searchPositions.push(c.downStr); }
            if (movePossibleInfinite(c.y, c.x - 1) && !searchPositions.includes(c.leftStr)) { newPositions.push(c.left); searchPositions.push(c.leftStr); }
            if (movePossibleInfinite(c.y, c.x + 1) && !searchPositions.includes(c.rightStr)) { newPositions.push(c.right); searchPositions.push(c.rightStr); }
        }

        currentPositions = newPositions;
        if (i % 10000 == 0) console.log(i, currentPositions.length)
    }

    console.log("step positions possible ", currentPositions.length);
    console.timeEnd("total time")
}

async function extractData() {
    let lines = [];
    
    if (sample) lines = sampleInput.split('\n')
    else lines = await readLines('../input/input21.txt');

    let idx = 0;
    for (const line of lines) {
        const mapline = line.split('');
        if (mapline.indexOf('S') > -1) start = new Position(idx , mapline.indexOf('S'));
        map.push(mapline);
        idx++;
    }    
}

let start: Position = new Position(0 , 0);
const map: string[][] =[];
const steps = 200;
const sample = true;
const sampleInput = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;
