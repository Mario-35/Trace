/**
 * table Interface
 *
 * @copyright 2026-present Inrae
 * @review 29-06-2026
 * @author mario.adam@inrae.fr
 *
 */

import { Icolumn } from "./column";

export interface Itable {
    save: boolean; // can export
    name: string; // table name
    singular: string; // singular name
    create: boolean; // can create table
    import: boolean; // can import excel
    columns: { [key: string]: Icolumn }; // list of columns
    constraints: string[]; // constraints of the table
}
