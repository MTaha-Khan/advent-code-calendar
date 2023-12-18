import { readLines } from "../helper";

const directions: Array<"R" | "L"> = [];
const map: { [node: string]: [left: string, right: string] } = {};

const startNodesA: string[] = [];
const endNodesZ: string[] = [];

const nodes: Record<string, { L: string; R: string }> = {};
const visitedNodes: string[][] = [];

export async function part1() {
    await extractData();    
    console.log("steps ", getSteps());   
}

export async function part2() {
    await extractData();    
    console.log("steps ", ghostTraverseAll());  
}

function getSteps(): number {
    
    const startNode: string = 'AAA';
    const endNode: string   = 'ZZZ';

    let steps = 0;
    let dindx = 0;

    let currectNode = startNode;

    while (currectNode !== endNode)
    {   
        if (directions[dindx] === 'L') currectNode = map[currectNode][0]
        if (directions[dindx] === 'R') currectNode = map[currectNode][1]

        steps = steps + 1;
        dindx = dindx + 1;
        if (dindx >= directions.length) dindx = 0;
    }
    
    return steps;
}

function ghostTraverse(): number {
    
    let steps = 0;
    let dindx = 0;
    let found = false;

    let currentNodes: string[] = [];

    currentNodes = [...startNodesA];
    visitedNodes.push(startNodesA);

    while (!found)
    {   
        const copyCurrent = [...currentNodes];
        //console.log(steps, currentNodes, visitedNodes);
        currentNodes = [];
        const di = (directions[dindx] === 'L') ? 0 : 1;

        for (const n of copyCurrent) currentNodes.push(map[n][di]);

        if (currentNodes.filter(n => n.endsWith('Z')).length === currentNodes.length) found = true;

        dindx = dindx + 1;
        steps = steps + 1;       
        if (dindx >= directions.length) { dindx = 0; }
    }
    
    return steps;
}

function nodesToString(nodes: string[]) { return nodes.sort().join(''); }

function ghostTraverseAll(): number {
    
    const starts = [];
    for (const key in nodes) {
      if (Object.prototype.hasOwnProperty.call(nodes, key) && key[2] === "A") {
        starts.push(key);
      }
    }
  
    const lengths = starts.map((start) => {
      let steps = 0;
      let curr = start;
      for (let i = 0; curr[2] !== "Z"; i = (i + 1) % directions.length) {
        steps++;
        curr = nodes[curr][directions[i]];
      }
      return steps;
    });
  
    const gcd = (a: number, b: number) => {
      while (b > 0) [a, b] = [b, a % b];
      return a;
    };
    const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
    return lengths.reduce((n, x) => lcm(x, n), 1);
}

async function extractData() {
    const lines = await readLines('../input/input8.txt');

    let index: number = 0;

    for (const line of lines) {
        if (index === 0) line.split('').forEach(d => directions.push(d as "R" | "L"));

        if (line.indexOf('=') > 0) {
            const sp = line.split(' = ')
            if (sp.length !== 2) throw new Error(`node direction format not correct: ${line}`)
            const spe = sp[1].substring(1, sp[1].length - 1).split(', ')
            if (spe.length !== 2) throw new Error(`node direction does not have left right directions: ${line}`)
            map[sp[0]] = [spe[0], spe[1]];
            if (sp[0].endsWith('A')) startNodesA.push(sp[0]);
            if (sp[0].endsWith('Z')) endNodesZ.push(sp[0]);

            nodes[line.substring(0, 3)] = {
                L: line.substring(7, 10),
                R: line.substring(12, 15),
              };
        }

        index++;
    }    
}
