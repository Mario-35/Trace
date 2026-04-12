import { Icolumn } from "./column";


export interface Itable {
    save: boolean; // can export
    create: boolean; // can create table
    import: boolean; // can import excel
    columns: { [key: string]: Icolumn };
    constraints: string[];
}
