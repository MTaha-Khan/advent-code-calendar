import { readLines } from "../helper";

const grid: string[][] = [];
const map: string[][] = [];

let directions: { x: number, y: number, dir: "N" | "S" | "W" | "E", beam: number}[] = [];

export async function part1() {
    await extractData();    
    traverseGrid(0, 0, "E");
    console.log("Total beam coverage ", beamCoverage());
}

export async function part2() {
    await extractData();    

    let coverage = 0;

    for (let i = 0; i < grid.length; i++) {
        const eastc = calculateCoverage(i, 0, "E");
        if (eastc > coverage) coverage = eastc;
        const westc = calculateCoverage(i, grid[i].length - 1, "W");
        if (westc > coverage) coverage = eastc;
    }

   

    for (let i = 0; i < grid[0].length; i++) {
        const southc = calculateCoverage(0, i, "S");
        if (southc > coverage) coverage = southc;
    }

    for (let i = 0; i < grid[grid.length - 1].length; i++) {
        const northc = calculateCoverage(grid.length - 1, i, "N");
        if (northc > coverage) coverage = northc;
    }

    console.log("Largest beam coverage ", coverage);
}

function calculateCoverage(x: number, y: number, dir: "N" | "S" | "W" | "E") : number {
    resetMap();
    traverseGrid(x, y, dir);
    return beamCoverage();
}

function traverseGrid(x: number, y: number, dir: "N" | "S" | "W" | "E") {
    if (x < 0 || x >= grid.length) return;
    if (y < 0 || y >= grid[x].length) return;

    if (directions.find(d => d.x === x && d.y === y && d.dir === dir)) return;

    directions.push({x, y, dir, beam: 1});

    map[x][y] = '#';
    switch (grid[x][y]) {
        case '.':
            moveSame(x, y, dir);
            break;
        case '|':
            if (dir === "N" || dir === "S") moveSame(x, y, dir);
            else moveDiverse(x, y, dir);
            break;
        case '-':
            if (dir === "W" || dir === "E") moveSame(x, y, dir);
            else moveDiverse(x, y, dir);
            break;
        case '\\':
            if (dir === "W" || dir === "E") moveRight(x, y, dir);
            else moveLeft(x, y, dir);
            break;
        case '/':
            if (dir === "N" || dir === "S") moveRight(x, y, dir);
            else moveLeft(x, y, dir);
            break;
    }
}

function moveSame(x: number, y: number, dir: "N" | "S" | "W" | "E") {
    switch (dir)
    {
        case "N":
            traverseGrid(x - 1, y, dir);
            break; 
        case "S":
            traverseGrid(x + 1, y, dir);
            break; 
        case "W":
            traverseGrid(x, y - 1, dir);
            break; 
        case "E":
            traverseGrid(x, y + 1, dir);
            break;    
    }
}

function moveDiverse(x: number, y: number, dir: "N" | "S" | "W" | "E") {
    switch (dir)
    {
        case "N":
        case "S":
            traverseGrid(x, y - 1, "W");
            traverseGrid(x, y + 1, "E");
            break; 
        case "E":
        case "W":
            traverseGrid(x - 1, y, "N");
            traverseGrid(x + 1, y, "S");
            break;    
    }
}

function moveRight(x: number, y: number, dir: "N" | "S" | "W" | "E") {
    switch (dir)
    {
        case "N":
            traverseGrid(x, y + 1, "E");
            break; 
        case "S":
            traverseGrid(x, y - 1, "W");
            break; 
        case "W":
            traverseGrid(x - 1, y, "N");
            break; 
        case "E":
            traverseGrid(x + 1, y, "S");
            break;    
    }
}

function moveLeft(x: number, y: number, dir: "N" | "S" | "W" | "E") {
    switch (dir)
    {
        case "N":
            traverseGrid(x, y - 1, "W");
            break; 
        case "S":
            traverseGrid(x, y + 1, "E");
            break; 
        case "W":
            traverseGrid(x + 1, y, "S");
            break; 
        case "E":
            traverseGrid(x - 1, y, "N");
            break;    
    }
}

function beamCoverage(): number {
    let total = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '#') total += 1;
        }    
    }
    return total;
}

async function extractData() {
    const lines = await readLines('../input/input16.txt'); // mapString.split('\n'); // 
    
    for (const line of lines) {
        grid.push(line.split(''))
        const newl = [];
        for (let i = 0; i < line.length; i++) newl.push('.');
        map.push(newl); 
    }    
}

function printMap() {
    for (let i = 0; i < map.length; i++) {
        console.log(map[i].join(''));
    }
}

function resetMap() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            map[i][j] = '.';
        }
    }
    directions = [];
}

const mapString: string = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;
