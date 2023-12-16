

export class Grid 
{
    private grid: string[][] = [];
    private ingrid: string[][] = [];

    private columnLength: number = 0;

    constructor(lines: string[]) {
        for (const line of lines) {
            this.grid.push(line.split(''));
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