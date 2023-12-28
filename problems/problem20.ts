import { readAll, readAllSync, readLines } from "../helper";

let hiPulse = 0;
let loPulse = 0;

type state = { n: string, p: "low" | "high", s: string };
let current: state[] = [];

class Module {
    public name: string = ""
    public type: 'F' | 'C' | 'B' | 'U' = "B";
    public status: boolean = false;
    public output: string[] = [];
    public input: { n: string, p: "low" | "high" }[] = [];
    public indx: number = 1;

    constructor(n: string, t: 'F' | 'C' | 'B', o: string[]) {
        this.name = n;
        this.type = t;        
        this.output = [...o];
        if (this.type === 'C') { conModules.push(n); }        
    }

    public send(pulse: "low" | "high", sender: string): state[] {
       
        const ret: state[] = [];
        if (this.type === "F") { 
            if (pulse === "low") {
                this.status = !this.status;            
                pulse = this.status ? "high" : "low";    
                this.output.map(o => ret.push({n: o, p: pulse, s: this.name}));        
            }
        }
        else if (this.type === "C") {           
            for (const l of this.input) {   if (l.n === sender) { l.p = pulse; break;  } }     
            //console.log("input", this.input, sender, pulse)       
            pulse = this.input.some(l => l.p === "low") ? "high" : "low"
            this.output.map(o => ret.push({n: o, p: pulse, s: this.name}));
        }
        else if (this.type !== "U") {               
            this.output.map(o => ret.push({n: o, p: pulse, s: this.name}));
        }
        return ret;
    }
}

const modules : { [key: string] : Module } = {};
const conModules: string[] = [];

export async function part1() {
    await extractData();    

    let cycles = 1000;
    for (let i = 0; i < cycles; i++) pressButton();
    console.log("Pulsimeter ", hiPulse, loPulse, hiPulse * loPulse);   
}

function pressButton(cycles: number = 0): boolean {
    current = [];
    current.push({ n: "broadcaster", p: "low", s: "button"});
    let idx = 0;
    let found = false;
    while (current.length > 0) {
        let newCurrent: state[] = [];
        for (const c of current) {
            if (c.n === "rx" && c.p === "low") { console.log(" found ", c); found = true };
            if (rxInputModules.includes(c.s) && c.p === "high" && rxInputs[c.s] === 0) { rxInputs[c.s] = cycles + 1; rxInputsFound++; }
            if (c.p === "low") loPulse += 1; else hiPulse += 1;
            if (modules[c.n]) newCurrent.push(...modules[c.n].send(c.p, c.s));            
        }
        current = newCurrent;
        idx++;
    }

    return found;
}

export async function part2() {
    console.time("time");
    await extractData();    
    for (const k in rxInputs) rxInputModules.push(k);
    const rxInputsPresent = rxInputModules.length;
    let cycles = 0;
    let found = false;
    while(!found) {
        found = pressButton(cycles);
        if (!found) {
            if (rxInputsFound === rxInputsPresent) found = true;
        }
        cycles++;
    }

    const values = Object.values(rxInputs);
    const rxPresses = values.length > 0 ? values.reduce(lcm) : 1;
    console.log("minimum press button ", rxPresses);
    console.timeEnd("time");
}

async function extractData() {
    let lines = [];
    
    if (sample) lines = sampleInput.split('\n')
    else lines = await readLines('../input/input20.txt');

    for (const line of lines) {
        const sp = line.split(" -> ");
        const li = sp[1].split(', ').map(m => m);
        if (sp[0] === "broadcaster") modules[sp[0]] = new Module(sp[0], "B", li)
        else if (sp[0].startsWith("%")) modules[sp[0].slice(1, sp[0].length)] = new Module(sp[0].slice(1, sp[0].length), "F", li)
        else if (sp[0].startsWith("&")) modules[sp[0].slice(1, sp[0].length)] = new Module(sp[0].slice(1, sp[0].length), "C", li)
    }    

    let idx = 0;
    for (const n in modules) {
        idx++;
        for (const c of conModules) {
            if (modules[n].output.includes(c)) {
                modules[c].input.push({n, p: "low"});
            }
        }       
        if (modules[n].output.includes("rx")) {            
            for (const i of modules[n].input) rxInputs[i.n] = 0;
        }
    }
}

const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

let rxInputsFound = 0;
const rxInputModules: string[] = [];
const rxInputs: { [key: string]: number } = {};

const sample = false;
const sampleInput = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const sampleInput1 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;
