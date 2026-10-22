/**
 * column Interface
 *
 * @copyright 2026-present Inrae
 * @review 29-06-2026
 * @author mario.adam@inrae.fr
 *
 */

export interface Icolumn {
    type: String; // type
    title: String; // title for UI
    create: String; // postgresSql format column create
    searchType?: String; // serachType
    list : boolean; // is the column visible in list UI
    infos? : string; // is the column is infos of column name
    excel? : boolean; // can be import in sxcel importation
    etiquette? : String; // can be printed in sticker
    calculate? : String; // is a calculate column instead of real coulmn in postgresSql
}