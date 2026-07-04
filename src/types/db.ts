/**
 * database Interface
 *
 * @copyright 2026-present Inrae
 * @review 29-06-2026
 * @author mario.adam@inrae.fr
 *
 */

import { Itable } from "./table";

export interface Idb {
    [key: string]: Itable;
}
