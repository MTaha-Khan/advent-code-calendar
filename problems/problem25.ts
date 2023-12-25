import { readLines } from "../helper";
import "regenerator-runtime/runtime";
const graphAlgorithms  = require("@graph-algorithm/minimum-cut");
 
class Graph {
    public vertices: string[] = [];
    public edges: [string, string][] = [];
    public nodes: { [key: string]: string[] } = {};

    public ins: string[] = [];

    public get totalVertices() { return this.vertices.length; }
    public get totalEdges() { return this.edges.length; }

    public addEdge(e1: string, e2: string) {
        if (!this.vertices.includes(e1)) this.vertices.push(e1);
        if (!this.vertices.includes(e2)) this.vertices.push(e2);
        if (!this.ins.includes(`${e1},${e2}`) && !this.ins.includes(`${e2},${e1}`)) {
            this.ins.push(`${e1},${e2}`);
            this.edges.push([e1, e2]);
            if (!this.nodes[e1]) this.nodes[e1] = [];
            if (!this.nodes[e2]) this.nodes[e2] = [];
            if (!this.nodes[e1].includes(e2)) this.nodes[e1].push(e2);
            if (!this.nodes[e2].includes(e1)) this.nodes[e2].push(e1); 
        }
    }

    public removeEdge(edge: [e1: string, e2: string]) {
        if (this.ins.includes(`${edge[0]},${edge[1]}`) || this.ins.includes(`${edge[1]},${edge[0]}`)) {
            this.removeItem(this.ins, `${edge[0]},${edge[1]}`);
            this.removeItem(this.ins, `${edge[1]},${edge[0]}`);
            this.removeFromEdges(edge);
            this.removeItem(this.nodes[edge[0]], edge[1]);
            this.removeItem(this.nodes[edge[1]], edge[0]);
        }
    }

    public getEdge(i: number) {
        return this.edges[i];
    }

    private removeItem(arr: string[], key: string) {
        const index = arr.indexOf(key);
        if (index > -1) arr.splice(index, 1);
    }

    private removeFromEdges(edge: [e1: string, e2: string]) {
        this.edges = this.edges.filter(obj => (obj[0] !== edge[0] && obj[1] !== edge[1]) || obj[0] !== edge[1] && obj[1] !== edge[0])
    }

    public getGroups() {
        const groups: string[][] = [];
        const visited = new Set<string>();

        for (const v of this.vertices) {
            if (visited.has(v)) continue;

            const group: string[] = [];
            const queue = [v];

            while (queue.length > 0) {
                const cv = queue.pop();

                if (cv) 
                {
                    if (visited.has(cv)) continue;
                    visited.add(cv);

                    group.push(cv);
                    queue.push(...this.nodes[cv]);
                }
                else continue;
            }

            groups.push(group);
        }

        return groups;
    }
}

const graph: Graph = new Graph();

export async function part1() {
    await extractData();    
    for (const c of graphAlgorithms.mincut(graph.edges)) {
        //console.log("karger min cuts ", c);
        graph.removeEdge(c);
    }

    const grps = graph.getGroups();
    console.log("Graph connected groups measure ", grps[0].length * grps[1].length);
}

export async function part2() {
    await extractData();    

}

async function extractData() {
    let lines = [];
    
    if (!sample) lines = await readLines('../input/input25.txt');
    else lines = sampleInput.split('\n')

    for (const line of lines) {
        const sp = line.split(": ");
        const n = sp[0].trim();
        const os = sp[1].split(' ').map(o => o.trim())
        
        for (const o of os) graph.addEdge(n, o);
    }    

    //console.log(graph.totalVertices, graph.totalEdges, graph.vertices);
}

const sample = false;
const sampleInput = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`;

