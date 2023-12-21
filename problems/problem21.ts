import { readLines } from "../helper";

let currentStep = 0;
let currentPositions: {y: number, x: number}[] = [];

export async function part1() {
    await extractData();    

    currentPositions.push(start);

    for (let i = currentStep; i < steps; i++) {
        let newPositions: {y: number, x: number}[] = [];

        for (const c of currentPositions) {
            if (movePossible(c.y - 1, c.x) && !newPositions.find(n => n.x === c.x && n.y === c.y - 1)) newPositions.push({ y: c.y - 1, x: c.x });
            if (movePossible(c.y + 1, c.x) && !newPositions.find(n => n.x === c.x && n.y === c.y + 1)) newPositions.push({ y: c.y + 1, x: c.x });
            if (movePossible(c.y, c.x - 1) && !newPositions.find(n => n.x === c.x - 1 && n.y === c.y)) newPositions.push({ y: c.y, x: c.x - 1 });
            if (movePossible(c.y, c.x + 1) && !newPositions.find(n => n.x === c.x + 1 && n.y === c.y)) newPositions.push({ y: c.y, x: c.x + 1 });
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


export async function part2() {
    await extractData();    

}

function calculatePositions(): number {
    let total = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === 'O') total += 1;
        }
    }
    return total;
}

async function extractData() {
    let lines = [];
    
    if (sample) lines = sampleInput.split('\n')
    else lines = await readLines('../input/input21.txt');

    let idx = 0;
    for (const line of lines) {
        const mapline = line.split('');
        if (mapline.indexOf('S') > -1) start = { y: idx, x: mapline.indexOf('S')};
        map.push(mapline);
        idx++;
    }    
}

let start: {y: number, x: number} = {y: 0, x: 0};
const map: string[][] =[];
const steps = 64;
const sample = false;
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
