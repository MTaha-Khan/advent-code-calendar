import { readLines } from "../helper";
import { Queue, Stack } from "../lib/structures";

class Path {
    public visited: string[] = [];
    public current: [y: number, x: number] = [0, 0];
    public steps: number = 0;

    constructor (c: [number, number], oldPath: Path | null, steps: number = 1) {
        const i = c[0]; const j = c[1]; 
        
        if (map[i][j] === '>') { c = [i, j + 1]; steps += 1; }
        if (map[i][j] === '<') { c = [i, j - 1]; steps += 1; }
        if (map[i][j] === 'v') { c = [i + 1, j]; steps += 1; }
        if (map[i][j] === '^') { c = [i - 1, j]; steps += 1; }
        this.current = c;
        this.steps = oldPath !== null ? oldPath.steps + steps : steps;
        this.visited = oldPath !== null ? [...oldPath.visited] : [];
        const key: string = `${c[0]},${c[1]}`;
        this.visited.push(key);
    }

    public isValid(y: number, x: number): boolean {
        if (this.current[0] === y && this.current[1] === x) return false;
        if (this.visited.includes(`${y},${x}`)) return false;
        return true;
    }

    public move(y: number, x: number, s: number = 1): void {
        if (this.current[0] !== y || this.current[1] !== x) {
            this.current = [y, x];
            if (!this.visited.includes(`${y},${x}`)) this.visited.push(`${y},${x}`);
            this.steps += s;
        }
    }
}

class Node {
    public name: string = ""
    public node: [number, number] = [0,0]
    public reachable: { [ key: string]: number } = {};

    constructor(n: [number, number]) {
        this.name = `${n[0]},${n[1]}`;
        this.node = n;

        let possibles: [y: number, x: number][] = possibleMoves(this.node, null);

        for (const p of possibles) {
            const newPath = new Path(p, null);
            newPath.visited.push(this.name);
            const path = findNextJunction(newPath);
           
            this.reachable[`${path.current[0]},${path.current[1]}`] = path.steps;
        }
    }

}

export async function part1() {
    console.time("time");
    await extractData();    
    calculatePaths();
    console.log("Furthest scenic distance ", longestRouteSteps);
    console.timeEnd("time");
}

export async function part2() {
    console.time("time");
    await extractData();  
    replaceSlopes();
    // printMap();
    validateMap();
    calculateJunctionPaths();
    //calculatePaths();    
    console.log("Furthest scenic distance ", longestRouteSteps);
    console.timeEnd("time");
}

function replaceSlopes() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (['>', '<', 'v', '^'].includes(map[i][j])) map[i][j] = '.';
        }
    }
}

function calculatePaths() {
    currentPaths.push(new Path(start, null, 0));
    let idx = 0;
    while (currentPaths.size > 0)  {        
        const path = currentPaths.pop();
        if (path) {
            let possible: [y: number, x: number][] = [];
            possible.push(path.current);

            while (possible.length === 1) {                
                path.move(possible[0][0], possible[0][1]);
                const cp = possible[0];
                possible = [];
                if (cp[1] === end[1] && cp[0] === end[0] && path.steps > longestRouteSteps) longestRouteSteps = path.steps;
                else {
                    if (movePossible(cp[0] - 1, cp[1], path)) possible.push([cp[0] - 1, cp[1]])
                    if (movePossible(cp[0] + 1, cp[1], path)) possible.push([cp[0] + 1, cp[1]])
                    if (movePossible(cp[0], cp[1] - 1, path)) possible.push([cp[0], cp[1] - 1])
                    if (movePossible(cp[0], cp[1] + 1, path)) possible.push([cp[0], cp[1] + 1])
                }
            } 

            for (const p of possible) {
                currentPaths.push(new Path(p, path));
            }
            
            // if (idx % 500000 === 0) console.log(idx, currentPaths.size, "Furthest scenic distance ", longestRouteSteps);
        }
        idx++;
    }
}

function calculateJunctionPaths() {
    currentPaths.push(new Path(start, null, 0));
    let idx = 0;
    while (currentPaths.size > 0)  {        
        const path = currentPaths.pop();
        if (path) {
            const node = nodes[`${path.current[0]},${path.current[1]}`]
            if (node) {
                for (const r in node.reachable) {
                    const c = getNodeNumber(r);
                    const steps = path.steps + node.reachable[r];                    
                    if (c[1] === end[1] && c[0] === end[0] && steps > longestRouteSteps) longestRouteSteps = steps;
                    else if (!path.visited.includes(`${c[0]},${c[1]}`)) {
                        currentPaths.push(new Path(c, path, node.reachable[r]));
                    }
                }
            }            
        }
        //if (idx % 250000 === 0) console.log(idx, currentPaths.size, "Furthest scenic distance ", longestRouteSteps);        
        idx++;
    }
}

function getNodeNumber(str: string): [number, number] {
    const splits = str.split(',').map(n => +n);
    if (splits.length !== 2) throw new Error(`String is not correct format for node number ${str}`);
    return [splits[0], splits[1]]
}

function findNextJunction(path: Path) {
    let startR = false;
    let endR = false;
    if (path) {
        let possible: [y: number, x: number][] = [];
        possible.push(path.current);

        while (possible.length === 1 && !startR && !endR) {    
            path.move(possible[0][0], possible[0][1]);
            const cp = possible[0];
            possible = [];
            if (cp[1] === end[1] && cp[0] === end[0]) endR = true;
            else if (cp[1] === start[1] && cp[0] === start[0]) startR = true;
            else {
                if (movePossible(cp[0] - 1, cp[1], path)) possible.push([cp[0] - 1, cp[1]])
                if (movePossible(cp[0] + 1, cp[1], path)) possible.push([cp[0] + 1, cp[1]])
                if (movePossible(cp[0], cp[1] - 1, path)) possible.push([cp[0], cp[1] - 1])
                if (movePossible(cp[0], cp[1] + 1, path)) possible.push([cp[0], cp[1] + 1])
            }
        } 
    }
    return path;
}

function possibleMoves(node: [number, number], path: Path | null): [number, number][] {
    let possible: [y: number, x: number][] = [];
    if (movePossible(node[0] - 1, node[1], path)) possible.push([node[0] - 1, node[1]])
    if (movePossible(node[0] + 1, node[1], path)) possible.push([node[0] + 1, node[1]])
    if (movePossible(node[0], node[1] - 1, path)) possible.push([node[0], node[1] - 1])
    if (movePossible(node[0], node[1] + 1, path)) possible.push([node[0], node[1] + 1])
    return possible;
}

function movePossible(y: number, x: number, p: Path | null): boolean {

    if (y >=0 && y < map.length && x >= 0 && x < map[y].length && map[y][x] !== '#') {
        if (['.', '>', '<', 'v', '^'].includes(map[y][x])) {
            if (map[y][x] === '.' && (p === null || p.isValid(y, x))) return true;
            if (map[y][x] === '>' && (p === null || p.isValid(y, x+1))) return true;
            if (map[y][x] === '<' && (p === null || p.isValid(y, x-1))) return true;
            if (map[y][x] === 'v' && (p === null || p.isValid(y+1, x))) return true;
            if (map[y][x] === '^' && (p === null || p.isValid(y-1, x))) return true;
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
}

function validateMap()
{
    let dots = 0;
    const splits : [number, number][] = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === '>' && map[i][j + 1] !== '.') console.log("Nah Nah", [i,j]); 
            if (map[i][j] === '<' && map[i][j - 1] !== '.') console.log("Nah Nah", [i,j]); 
            if (map[i][j] === 'v' && map[i + 1][j] !== '.') console.log("Nah Nah", [i,j]); 
            if (map[i][j] === '^' && map[i - 1][j] !== '.') console.log("Nah Nah", [i,j]);         
            if (map[i][j] === '.') {
                dots++;
                let connects = 0;
                if (i > 0 && map[i - 1][j] === '.') connects++;
                if (i < map.length - 1 && map[i + 1][j] === '.') connects++;
                if (j > 0 && map[i][j - 1] === '.') connects++;
                if (j < map[i].length - 1 && map[i][j + 1] === '.') connects++;
                if (connects > 2) splits.push([i,j]);
                //if (connects > 3) console.log("found roundabout ", i, j);
            }
        }        
    }

    nodes[`${start[0]},${start[1]}`] = new Node(start);
    nodes[`${end[0]},${end[1]}`] = new Node(end);

    for (const s of splits) nodes[`${s[0]},${s[1]}`] = new Node(s);

    // let nidx = 0; let ridx = 0;
    // for (const n in nodes) { nidx++;
    //     for (const r in nodes[n].reachable) { ridx++;
    //         console.log(`${nodes[n].name} reachable to ${r} in ${nodes[n].reachable[r]} steps`);
    //     }
    // }
    // //console.log("number of dots ", dots);
    // console.log("number of junctions ", splits.length, nidx, ridx, splits);

}

const nodes: { [ key: string ]: Node } = {};
const currentPaths: Stack<Path> = new Stack<Path>();
let longestRouteSteps: number = 0;
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
