

export class Grid<T> 
{
    private grid: T[][] = [];
    private ingrid: T[][] = [];

    private columnLength: number = 0;

    constructor(lines: string[]) {
        for (const line of lines) {
            this.grid.push(line.split('').map(c => c as T));
            if (line.length > this.columnLength) this.columnLength = line.length;
        }

        for (let i = 0; i < this.columns; i++) {
            this.ingrid.push(this.grid.map((row) => row[i]));
        }
    }

    public get rows() : number {
        return this.grid.length;
    }

    public get columns() : number {
        return this.columnLength;
    }

    public row(index: number) {
        if (index < 0 || index >= this.grid.length) throw new Error(`grid index out of bounds ${index}, grid length ${this.grid.length}`);
        return this.grid[index];
    }

    public column(index: number) {
        if (index < 0 || index >= this.columnLength) throw new Error(`grid index out of bounds ${index}, grid length ${this.columnLength}`);
        return this.ingrid[index];
    }

    public rowAsString = (index: number) => this.row(index).join('');

    public colAsString = (index: number) => this.column(index).join('');
}


export class Position 
{
    public y: number = 0;
    public x: number = 0;    

    constructor(y1: number, x1: number) {
        this.y = y1; this.x = x1; 
    }

    public get left(): Position { return new Position(this.y, this.x - 1); }
    public get right(): Position { return new Position(this.y, this.x + 1); }
    public get up(): Position { return new Position(this.y - 1, this.x); }
    public get down(): Position { return new Position(this.y + 1, this.x); }

    public get leftStr(): string { return [this.y, this.x - 1].toString(); }
    public get rightStr(): string { return [this.y, this.x + 1].toString(); }
    public get upStr(): string { return [this.y - 1, this.x].toString(); }
    public get downStr(): string { return [this.y + 1, this.x].toString(); }
}
