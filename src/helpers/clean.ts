/**
 * Clean DB routes
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { readId } from '../controller';
import { executeSql } from '../db';
import { dataBase } from '../db/base';

const accentsTidy = function(s: string){
    var r = s.toLowerCase();
    const non_asciis:Record<any, string> = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
    for (const i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
    return r;
};


export async function clean() {
  const queries = [`DELETE FROM "echantillons" WHERE UPPER(unaccent(etat)) LIKE'SUPPRIM%'`,];
    return readId(dataBase.configuration.name, 1)
      .then(async (configuration: any) => {
        configuration[0].etats[0].split(",").forEach((e: string) => {
          queries.push(`UPDATE echantillons SET etat = '${e}' WHERE UPPER(unaccent(etat)) LIKE '${accentsTidy(e).toLocaleUpperCase().slice(0, -1)}%'`);          
        });
        queries.push(`UPDATE echantillons SET Region = (SELECT Region FROM sites WHERE sites.latitude = latitude AND sites.longitude = longitude limit 1) WHERE Region = 'Region'`);
        console.log(queries);
        
        return await executeSql(queries).then(() => { return true;});
      })
      .catch((error) => {
        console.error(error)
      })
}