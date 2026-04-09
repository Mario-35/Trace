/**
 * Constants
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */


export const _TYPES = ["Boues", "Eau", "Invertébrés", "Sol cultivé", "Sol forestier", "Prairie", "Sol"];

export const CORS = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

export const EConstant = Object.freeze({
    appName: "Trace",
    repository: "https://github.com/Mario-35/Trace",
    branch: "main",
    columnSeparator: "@|@",
    doubleQuotedComa: '",\n"',
    simpleQuotedComa: "',\n'",
    newline: "\r\n",
    tab: "\t",
    return: "\n",
    host: "127.0.0.1",   
    pg: "postgres",
    port: 5432,
    voidSql: "SELECT 1=1",
    version: "1.0",
    date: "15-02-2026",
});

export let _CONFIG = {};

export function setConfig(input: any) {
    _CONFIG = input;
}