import { readLines } from "../helper";

const parts: Part[] = [];

type range = Record<string, [number, number]>;

class Part {
    private x: number = 0;
    private m: number = 0;
    private a: number = 0;
    private s: number = 0;

    public get total() { return this.x + this.m + this.a + this.s; }

    constructor(str: string) {
        const splits = str.split(',');

        for (const sp of splits) {
            const eq = sp.indexOf("=");
            const symbol = sp.slice(0, eq);
            const number = sp.slice(eq + 1, sp.length);
            switch (symbol) {
                case 'x':
                    this.x = +number;
                    break;
                case 'm':
                    this.m = +number;
                    break;
                case 'a':
                    this.a = +number;
                    break;
                case 's':
                    this.s = +number;
                    break;
            }
        }
    }

    public check(prop: string, op: '>' | '<', thres: number) {
        switch (prop) {
            case 'x':
                return op === '>' ? this.x > thres : this.x < thres;
            case 'm':
                return op === '>' ? this.m > thres : this.m < thres;
            case 'a':
                return op === '>' ? this.a > thres : this.a < thres;
            case 's':
                return op === '>' ? this.s > thres : this.s < thres;
        }
        return true;
    }
}

const workflows: { [key: string] : Workflow } = {};

class Workflow {

    public conditions: { prop: string, op: '>' | '<', thr: number, res: string }[] = [];
    public last: string = "";
    constructor(str: string) {
        const splits = str.split(',');
        for (const sp of splits) {
            const col = sp.indexOf(':');
            if (col !== -1) {
                this.conditions.push({ prop: sp[0], op: sp[1] as '>' | '<', thr: +sp.slice(2, col), res: sp.slice(col + 1, sp.length)});
            } else this.last = sp;
        }

        //if (this.last !== 'A' && this.last !== 'R') throw new Error(`Wrong last condition ${this.last} from workflow ${str}`);
    }

    public eval(p: Part): string {

        for (const c of this.conditions) {
            if (p.check(c.prop, c.op, c.thr)) return c.res;
        }

        return this.last;
    }

    public possible(set: range): range[] {
        const ranges: range[] = [];
        for (const c of this.conditions) {    
            const cet = copySet(set);
            const ci = c.op === '<' ? 1: 0;    
            const si = c.op === '<' ? 0: 1;    
            cet[c.prop][ci] = c.op === '<' ? c.thr - 1: c.thr + 1;    
            set[c.prop][si] = c.thr;
            if (c.res === 'A') ranges.push(cet);
            else if (c.res !== 'R') ranges.push(...workflows[c.res].possible(copySet(cet)));
        }
        if (this.last === 'A') ranges.push(set);
        else if (this.last !== 'R') ranges.push(...workflows[this.last].possible(copySet(set)));

        return ranges;
    }
}

const copySet = (set: range) => JSON.parse(JSON.stringify(set));

export async function part1() {
    await extractData();    

    let total = 0;

    for (const p of parts) {
        if (partEval(p)) total += p.total;
    }
   
    console.log(" Total of parts ", total);
}


export async function part2() {
    await extractData();    

    const set: range =  { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] };
    const first = "in";

    const sets = workflows[first].possible(set);



    const total = sets.map((range) => Object.values(range).reduce((acc, [min, max]) => acc * (max - min + 1), 1))
                                                    .reduce((acc: number, v: number) => acc + v, 0);

    console.log(" Total number of possible acceptance parts ", total);
}

function partEval(p: Part) : boolean {

    let result = "in";
    while (!['A', 'R'].includes(result)) result = workflows[result].eval(p);
    return result === 'A';
}


async function extractData() {
    let lines = [];
    
    if (!sample) lines = await readLines('../input/input19.txt');
    else lines = sampleInput.split('\n')

    for (const line of lines) {
        if (line.trim()) {
            if (line.startsWith("{") && line.endsWith("}")) {
                parts.push(new Part(line.slice(1, line.length - 1)))
            }
            else
            {
                const ws = line.indexOf("{")                
                workflows[line.slice(0, ws)] = new Workflow(line.slice(ws + 1, line.length - 1));
            }
        }
    }    
}

const sample = false;
const sampleInput = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;
