/**
 * Create DB
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { admin, executeSql } from ".";
import { dataBase } from "./base";
import { asyncForEach } from "../helpers/asyncForEach";
import { populate } from "./populate";
import { _TYPES } from "../constant";
import { toTitleCase } from "../helpers/toTitleCase";

/**
 * 
 * @param adminPass postgres admin password
 * @returns JSON infos
 */

export async function createDB(adminPass: string): Promise<Record<string, string>> {
  // JSON result
  const result: Record<string, string> = {};
    // kill all process api
  const create = await admin(adminPass).unsafe("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = 'trace';").then(async res => {
    // drop database
    return await admin(adminPass).unsafe("DROP DATABASE trace").then(async res => {
      result["DROP DATABASE"] = "Ok";
      // create blank database
      return await admin(adminPass).unsafe("CREATE DATABASE trace").then(async res => {
        result["CREATE DATABASE"] = "Ok";
        return true;
      }).catch(error => {
         result["CREATE DATABASE"] = "Error";
        return false;
      }); 
    }).catch(async error => {
      return await admin(adminPass).unsafe("CREATE DATABASE trace").then(async res => {
        result["CREATE DATABASE"] = "Ok";
        return true;
      }).catch(error => {
         result["CREATE DATABASE"] = "Error";
        return false;
      }); 
    }); 
  });

  // if crete database false exit
  if (create === false) return result;

  // store all queries
  const queries:string[] = [];

  // loop on tables
  Object.keys(dataBase).forEach(tableName => {
    // store posgresSql column create syntax
    const pgCols:string[] = [];
    // can create 
    if (dataBase[tableName].create === true) {
      // loop on columns
      Object.keys(dataBase[tableName].columns).forEach((columnName: string) => {
        if (String(dataBase[tableName as keyof object].columns[columnName as keyof object]["create" as keyof object]).trim() !== "")
         pgCols.push(columnName + " " + dataBase[tableName as keyof object].columns[columnName as keyof object]["create" as keyof object]);  
      });
      // loop on constaints
      dataBase[tableName as keyof object].constraints.forEach(e => pgCols.push(e)); 
      // add to queries
      queries.push(`CREATE TABLE ${tableName} (${pgCols.join()})${ tableName === "echantillons" ? ' PARTITION BY LIST(type)':''};`);
    }
  });
  // Execute queries
  await executeSql(queries).then(async res => {
    result["CREATE Tables"] = "Ok";
  }).catch(error => {
    console.error(error);    
    result["CREATE Tables"] = "Error";
  });

  // Loop to create partition tables
  await asyncForEach(_TYPES, async (name) => {
    await executeSql(`CREATE TABLE IF NOT EXISTS "echantillon_${name.replaceAll(" ","").toLowerCase()}" PARTITION OF echantillons FOR VALUES IN ('${toTitleCase(name)}');`).then(() => {
      result["CREATE TABLE partitionned " + name] = "Ok";
    })
  });
  
  // populate tables with datas in import directory
  await populate().then(() => {
    result["Populate Tables"] = "Ok";
  }).catch((error) => {
     console.error(error);
    result["Populate Tables"] = "Error";
  });

  return result; 
}
