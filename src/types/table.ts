import { Icolumn } from "./column";


export interface Itable {
    save: boolean;
    columns: { [key: string]: Icolumn };
    constraints: string[];
}
