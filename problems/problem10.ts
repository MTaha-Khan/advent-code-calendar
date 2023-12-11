import { Console } from "console";
import { readLines } from "../helper";

const map: string[][] = [];
const bin: string[][] = [];
let start: [number, number] = [0, 0];
let current: [number, number] = [0, 0];
let distance = 0;


export async function part1() {
    await extractData();    

    console.log("Total distance: ", distance, distance / 2);
}

export async function part2() {
    await extractData();    
    flood();
    replaceMapNodes();
    checkBound();
    printMap();
    
    console.log("Total nests: ", countNests());
}

function findBoundary() {
    current = start;
    let loop: boolean = false;
    let dir: "UP" | "DOWN" | "LEFT" | "RIGHT" = "UP";

    if (moveCheck("RIGHT", current)) { current = [current[0] + 1, current[1]]; dir = "RIGHT"; }
    else if (moveCheck("LEFT", current)) { current = [current[0] - 1, current[1]]; dir = "LEFT"; }
    else if (moveCheck("DOWN", current)) { current = [current[0], current[1] + 1]; dir = "DOWN"; }
    else if (moveCheck("UP", current)) { current = [current[0], current[1] - 1]; dir = "UP"; }


    while (!loop && distance < (140 * 140)) // (140 * 140)
    {
        const c = map[current[1]][current[0]];
        let x = current[0];
        let y = current[1];

        if (c === '|' && dir === "DOWN")
            y = y + 1;
        else if (c === '|' && dir === "UP")
            y = y - 1;
        else if (c === 'F' && dir === "UP") { x = x + 1; dir = "RIGHT"; }
        else if (c === 'F' && dir === "LEFT") { y = y + 1; dir = "DOWN"; }
        else if (c === '7' && dir === "UP") { x = x - 1; dir = "LEFT"; }
        else if (c === '7' && dir === "RIGHT") { y = y + 1; dir = "DOWN"; }
        else if (c === 'J' && dir === "DOWN") { x = x - 1; dir = "LEFT"; }
        else if (c === 'J' && dir === "RIGHT") { y = y - 1; dir = "UP"; }
        else if (c === 'L' && dir === "DOWN") { x = x + 1; dir = "RIGHT"; }
        else if (c === 'L' && dir === "LEFT") { y = y - 1; dir = "UP"; }
        else if (c === '-' && dir === "RIGHT")
            x = x + 1;
        else if (c === '-' && dir === "LEFT")
            x = x - 1;
        else if (c === 'S')
            loop = true;
        else
            throw new Error(`Wrong directions ${dir}  , ${c},  ${current}`);

        current = [x, y];
        bin[y][x] = "B";
        if (current === start) loop = true;
        distance++;
    }
}

function moveCheck(dir: "UP" | "DOWN" | "LEFT" | "RIGHT", node: [number, number]): boolean {
    const x = dir === "LEFT" ? node[0] - 1 : (dir === "RIGHT" ? node[0] + 1 : node[0]);
    const y = dir === "UP" ? node[1] - 1 : (dir === "DOWN" ? node[1] + 1 : node[1]);
    const next = map[y][x];
    switch (dir)
    {
        case "LEFT":
            if (x >= 0 && (next === '-' || next === 'L' || next === 'F')) return true;
            return false;
        case "RIGHT":
            if (x < map.length && (next === '-' || next === 'J' || next === '7')) return true;
            return false;
        case "UP":
            if (y >= 0 && (next === '|' || next === '7' || next === 'F')) return true;
            return false;
        case "DOWN":
            if (y < map.length && (next === '|' || next === 'L' || next === 'J')) return true;
            return false;
    }
}

async function extractData() {
    const lines = await readLines('../input/input10.txt');
    let idx = 0;
    for (const line of lines) {
        const mapline: string[] = [];
        line.split('').map(s => mapline.push(s));
        if (mapline.indexOf('S') > -1) start = [mapline.indexOf('S'), idx];
        map.push(mapline);
        idx++;
    }  
        
    for (let i = 0; i < map.length; i++)
    {
        const n = [];
        for (let j = 0; j < map.length; j++) n.push(".");
        bin.push(n);
    }
    
    bin[start[1]][start[0]] = "B";

    findBoundary();
}

function printMap() {
    const nodes = bin;

    for (let i = 0; i < nodes.length; i++) console.log(nodes[i].join(''));
}


function flood() {
    const nodes: [number, number][] = [];

    nodes.push([0, 0]);

    while(nodes.length > 0)
    {
        const n = nodes.pop();

        if (n && bin[n[1]][n[0]] !== " " && bin[n[1]][n[0]] !== "B") {        
            bin[n[1]][n[0]] = " ";
            if (n[1] > 0) nodes.push([n[0], n[1] - 1]);
            if (n[1] < bin.length - 1) nodes.push([n[0], n[1] + 1]);
            if (n[0] > 0) nodes.push([n[0] - 1, n[1]]);
            if (n[0] < bin.length - 1) nodes.push([n[0] + 1, n[1]]);
            if (n[1] > 0 && n[0] > 1) nodes.push([n[0] - 1, n[1] - 1]);
            if (n[1] < bin.length - 1 && n[0] > 1) nodes.push([n[0] - 1, n[1] + 1]);
            if (n[1] > 0 && n[0] < bin.length - 1) nodes.push([n[0] + 1, n[1] - 1]);
            if (n[1] < bin.length - 1 && n[0] < bin.length - 1) nodes.push([n[0] + 1, n[1] + 1]);
        }
    }
}

function replaceMapNodes() {

    for (let i = 0; i < bin.length; i++)
    {
        for (let j = 0; j < bin.length; j++) {
            if (bin[i][j] === 'B') bin[i][j] = map[i][j];
        }
    }
}

function countNests() : number {

    let nests = 0;
    for (let i = 0; i < bin.length; i++)
    {
        let lineCount = 0;
        const binline = bin[i];
        for (let j = 0; j < binline.length; j++) {
            if (binline[j] === '.') lineCount++;
        }
        nests = nests + lineCount;
        //console.log(i, lineCount, nests);
    }
    return nests;
}

function checkBound() {

    for (let i = 0; i < bin.length; i++)
    {
        for (let j = 0; j < bin[i].length; j++) {
            if (bin[i][j] === '.') { 
                if (bin[i][j-1] === 'J' || bin[i][j-1] === '7') bin[i][j] = ' '
                else if (bin[i-1][j] === 'J' || bin[i-1][j] === 'L') bin[i][j] = ' '
                else if (bin[i][j+1] === 'F' || bin[i][j+1] === 'L') bin[i][j] = ' '
                else if (bin[i+1][j] === 'F' || bin[i+1][j] === '7') bin[i][j] = ' '
                // console.log(i, j ,bin[i][j], bin[i-1][j], bin[i][j-1],bin[i+1][j],bin[i][j+1])
            }
        }
    }
}

