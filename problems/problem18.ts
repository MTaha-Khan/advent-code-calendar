import { readLines } from "../helper";
import { hexToDecimal } from "../lib/string";

type direction = "U" | "D" | "L" | "R";

const dirs: direction[] = ['R', 'D', 'L', 'U'];

let mapX = 0;
let mapY = 0;

let negX = 0;
let negY = 0;

const map: string[] = [];

class Path 
{
    public dir: direction = "U";
    public move: number = 0;

    constructor(d: direction, m: number, c: string, u: boolean) {
        if (!u) {
            this.dir = d;
            this.move = m;
        } else {
            this.dir = dirs[+c.substring(7, 8)];
            this.move = hexToDecimal(c.slice(2, 7), false);
            //console.log(c, hexToDecimal(c.slice(2, 7), false), c.substring(7, 8), dirs[+c.substring(7, 8)])
        }
    }
    
}

const paths: Path[] = [];

export async function part1() {
    await extractData();    
    calculateDims();
    populateMap();
    flood();
    printMap();
    console.log("lagoon area ", calculateBlocks());

}

export async function part2() {
    await extractData(true);    
    calculateDims();
    //populateMap();
    ///flood();
    //printMap();
    //console.log("lagoon area ", calculateBlocks());
}

function calculateBlocks(): number {
    let total = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] !== ' ') total += 1;
        }
    }
    return total;
}

function calculateDims() {
    let curX = 0; let curY = 0;
    for (const p of paths) {
        switch(p.dir) {
            case "R":
                curX += p.move;
                if (curX > mapX) mapX = curX;
                break;
            case "L":
                curX -= p.move;
                if (curX < 0) { 
                    if (curX < negX) negX = curX;
                    if (p.move > mapX) mapX = p.move;
                }
                break;
            case "D":
                curY += p.move;
                if (curY > mapY) mapY = curY;
                break;
            case "U":
                curY -= p.move;
                if (curY < 0) { 
                    if (curY < negY) negY = curY;
                    if (p.move > mapY) mapY = p.move;
                }
                break;
        }
    }

    console.log(mapX, negX, mapY, negX);
    for (let i = 0; i < mapY + Math.abs(negY) + 3; i++) {
        let m = "";
        for (let j = 0; j < mapX + Math.abs(negX) + 3; j++) m += ".";
        map.push(m);
    }
}


function flood() {
    const nodes: [number, number][] = [];

    nodes.push([0, 0]);

    while(nodes.length > 0)
    {
        const n = nodes.pop();

        if (n && map[n[1]][n[0]] === ".") { 
            map[n[1]] = setChar(map[n[1]], ' ', n[0]);       
            if (n[1] > 0) nodes.push([n[0], n[1] - 1]);
            if (n[1] < map.length - 1) nodes.push([n[0], n[1] + 1]);
            if (n[0] > 0) nodes.push([n[0] - 1, n[1]]);
            if (n[0] < map[n[1]].length - 1) nodes.push([n[0] + 1, n[1]]);
            if (n[1] > 0 && n[0] > 1) nodes.push([n[0] - 1, n[1] - 1]);
            if (n[1] < map.length - 1 && n[0] > 1) nodes.push([n[0] - 1, n[1] + 1]);
            if (n[1] > 0 && n[0] < map[n[1]].length - 1) nodes.push([n[0] + 1, n[1] - 1]);
            if (n[1] < map.length - 1 && n[0] < map[n[1]].length - 1) nodes.push([n[0] + 1, n[1] + 1]);
        }
    }
}

function populateMap() {
    const currNode: { x: number, y: number } = { x: Math.abs(negX) + 1, y: Math.abs(negY) + 1 }
    for (const p of paths) {
        let move = p.move;    
        while (move > 0){
            map[currNode.y] = setChar(map[currNode.y], '#', currNode.x);
            switch(p.dir) {
                case "R":                
                    currNode.x += 1;
                    break;
                case "L":
                    currNode.x -= 1;
                    break;
                case "D":
                    currNode.y += 1;
                    break;
                case "U":
                    currNode.y -= 1;
                    break;
            }
            move--;
        }
    }
}

function setChar(str: string, newChar: string, index: number): string {
    return str.slice(0, index) + newChar + str.slice(index + 1);
}

function printMap() {
    for (let i = 0; i < map.length; i++) {
        console.log(map[i]);
    }
}

async function extractData(useHex: boolean = false) {
    const lines = mapString.split('\n') // await readLines('../input/input18.txt'); // 
    for (const line of lines) {
        const splits = line.split(' ')
        paths.push(new Path(splits[0] as direction, +splits[1], splits[2], useHex))
    }    
}


const mapString = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`;