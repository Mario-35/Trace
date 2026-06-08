import { Icolumn } from "./column";


export interface Itable {
    save: boolean; // can export
    name: string;
    singular: string;
    create: boolean; // can create table
    import: boolean; // can import excel
    columns: { [key: string]: Icolumn };
    constraints: string[];
}
