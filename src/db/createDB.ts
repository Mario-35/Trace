import { admin, createDetaultDatas, executeSql } from ".";
import { dataBase } from "./base";
import { asyncForEach } from "../helpers/asyncForEach";
import { populate } from "./populate";
import { _TYPES } from "../constant";
import { toTitleCase } from "../helpers/toTitleCase";
import { error } from "node:console";


export async function createDB(adminPass: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const create = await admin(adminPass).unsafe("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = 'trace';").then(async res => {
    return await admin(adminPass).unsafe("DROP DATABASE trace").then(async res => {
      result["DROP DATABASE"] = "Ok";
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

  if (create === false) return result;

  const query:string[] = [];
  Object.keys(dataBase).forEach(tableName => {
    const cols:string[] = [];
    if(dataBase[tableName].create === true) {
      Object.keys(dataBase[tableName].columns).forEach((columnName: string) => {
        if (String(dataBase[tableName as keyof object].columns[columnName as keyof object]["create" as keyof object]).trim() !== "")
         cols.push(columnName + " " + dataBase[tableName as keyof object].columns[columnName as keyof object]["create" as keyof object]);  
      });
      dataBase[tableName as keyof object].constraints.forEach(e => cols.push(e)); 
      query.push(`CREATE TABLE ${tableName} (${cols.join()})${ tableName === "echantillons" ? ' PARTITION BY LIST(type)':''};`);
    }
  });
  
  await executeSql(query).then(async res => {
    result["CREATE Tables"] = "Ok";
    // await createDetaultDatas();
    // result["CREATE Default datas"] = "Ok";
  }).catch(error => {
    result["CREATE Tables"] = "Error";
  });

  await asyncForEach(_TYPES, async (name) => {
    await executeSql(`CREATE TABLE IF NOT EXISTS "echantillon_${name.replaceAll(" ","").toLowerCase()}" PARTITION OF echantillons FOR VALUES IN ('${toTitleCase(name)}');`).then(() => {
      result["CREATE TABLE partitionned " + name] = "Ok";
    })
  });
  
  await populate().then(() => {
    result["Populate"] = "Ok";
  }).catch((error) => {
     console.error(error);
  });

  return result; 
}
