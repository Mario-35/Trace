/**
 * Clean DB routes
 *
 * @copyright 2026-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { executeSql } from '../db';

export async function clean() {
      await executeSql([
        `DELETE FROM "echantillons" WHERE etat = 'Supprimer'`,
        `DELETE FROM "sites" WHERE UPPER(nom) = 'SUPPRIMER'`,
      ]).then(() => {
        return true;
      })
}
