import { readLines } from "../helper";
import { init } from "z3-solver";

class HailStone {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    public vx: number = 0;
    public vy: number = 0;
    public vz: number = 0;

    public m: number = 0;

    constructor(x1: number, y1: number, z1: number, vx1: number, vy1: number, vz1: number, m1: number) {
        this.x = x1; this.y = y1; this.z = z1;
        this.vx = vx1; this.vy = vy1; this.vz = vz1;
        this.m = m1;
    }
}

const hailStones: HailStone[] = [];

export async function part1() {
    await extractData();    

    console.log("Number of intersections ", getIntersections(200000000000000, 400000000000000));
   
}

export async function part2() {
    await extractData();    
    
    console.log("Starting coordinates ", await getStartingCoordinates());
}


async function extractData() {
    let lines = [];
    
    if (!sample) lines = await readLines('../input/input24.txt');
    else lines = sampleInput.split('\n')

    for (const line of lines) {
        const [x, y, z] = line.split("@")[0].split(",").map(Number);
        const [vx, vy, vz] = line.split("@")[1].split(",").map(Number);
        hailStones.push(new HailStone(x, y, z, vx, vy, vz, vy / vx));
    }    
}

const sample = false;
const sampleInput = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;



function isInArea(x: number, y: number, minP: number, maxP: number) {
    return x >= minP && x <= maxP && y >= minP && y <= maxP;
}

function getIntersections(minP: number, maxP: number): number {

    let inTestArea = 0;

    for (let i = 0; i < hailStones.length - 1; i++) {
        const stoneA = hailStones[i];
        for (let j = i + 1; j < hailStones.length; j++) {
        const stoneB = hailStones[j];

        const interSection =
            (stoneA.m * stoneA.x - stoneB.m * stoneB.x + stoneB.y - stoneA.y) /
            (stoneA.m - stoneB.m);
        const x = interSection;
        const y = stoneA.m * (interSection - stoneA.x) + stoneA.y;

        const tA = (x - stoneA.x) / stoneA.vx;
        const tB = (x - stoneB.x) / stoneB.vx;

        const inFuture = tA > 0 && tB > 0;

        let inArea = isInArea(x, y, minP, maxP);

        if (inArea && inFuture) {
            inTestArea++;
        }
        }
    }

    return inTestArea;
};

async function getStartingCoordinates()
{ 
    const { Context } = await init();
    const Z3 = Context("main");

    const x = Z3.Real.const("x");
    const y = Z3.Real.const("y");
    const z = Z3.Real.const("z");

    const vx = Z3.Real.const("vx");
    const vy = Z3.Real.const("vy");
    const vz = Z3.Real.const("vz");

    const solver = new Z3.Solver();

    for (let i = 0; i < hailStones.length; i++) {
        const stone = hailStones[i];
        const t = Z3.Real.const(`t${i}`);

        solver.add(t.ge(0));
        solver.add(x.add(vx.mul(t)).eq(t.mul(stone.vx).add(stone.x)));
        solver.add(y.add(vy.mul(t)).eq(t.mul(stone.vy).add(stone.y)));
        solver.add(z.add(vz.mul(t)).eq(t.mul(stone.vz).add(stone.z)));
    }

    const isSat = await solver.check();

    if (isSat !== "sat") return -1;

    const model = solver.model();
    const rx = Number(model.eval(x));
    const ry = Number(model.eval(y));
    const rz = Number(model.eval(z));

    return rx + ry + rz;
};
