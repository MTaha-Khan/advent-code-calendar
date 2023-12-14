import { readLines } from "../helper";

const mapString = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

const map: string[][] = [];

export async function part1() {
    await extractData();    
    tilt("north");

    console.log("total load ", calculateLoad());
}

export async function part2() {
    await extractData();    

    //const circles = 1000000000;
    const circles = 1000;

    for (let i = 0; i < circles; i++) doCircle();

    console.log("total load ", calculateLoad());
}

function doCircle() {
    tilt("north")
    tilt("west")
    tilt("south")
    tilt("east")
}

function tilt(dir: "north" | "south" | "east" | "west") {
    if (dir === "north" || dir === "west") {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if(map[i][j] === 'O') moveStone(dir, i, j)
            }
        }
    }
    if (dir === "south" || dir === "east") {
        for (let i = map.length - 1; i >= 0; i--) {
            for (let j = map[i].length - 1; j >=0 ; j--) {
                if(map[i][j] === 'O') moveStone(dir, i, j)
            }
        }
    }
}

function moveStone(dir: "north" | "south" | "east" | "west", a: number, b: number) {
    if (map[a][b] !== 'O') return;
    if (dir === 'north') {
        while (a - 1 >= 0 && map[a - 1][b] === '.') {
            map[a][b] = '.';
            map[a - 1][b] = 'O';
            a = a - 1;
        }
    }
    if (dir === 'south') {
        while (a + 1 < map.length && map[a + 1][b] === '.') {
            map[a][b] = '.';
            map[a + 1][b] = 'O';
            a = a + 1;
        }
    }
    if (dir === 'east') {
        while (b + 1 < map.length && map[a][b + 1] === '.') {
            map[a][b] = '.';
            map[a][b + 1] = 'O';
            b = b + 1;
        }
    }
    if (dir === 'west') {
        while (b - 1 >= 0 && map[a][b - 1] === '.') {
            map[a][b] = '.';
            map[a][b - 1] = 'O';
            b = b - 1;
        }
    }
}

function calculateLoad(): number {
    let load = 0;
    let row = 1;
    for (let i = map.length - 1; i >=0; i--) {
        for (let j = 0; j < map[i].length; j++) {
            if(map[i][j] === 'O') load += row;
        }
        row++;
    }
    return load;
}

async function extractData() {
    const lines = await readLines('../input/input14.txt'); // mapString.split('\n'); //
    for (const line of lines) {
        map.push(line.split(''));
    }    
}
