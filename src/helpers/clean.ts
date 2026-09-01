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
        `DELETE FROM "echantillons" WHERE etat = 'Supprimé'`,
        `DELETE FROM "sites" WHERE UPPER(nom) = 'SUPPRIMER'`,
        `UPDATE echantillons SET etat = 'Crée' WHERE etat = 'Créer'`,
        `UPDATE echantillons SET Region = (SELECT Region FROM sites WHERE sites.latitude = latitude AND sites.longitude = longitude limit 1) WHERE Region = 'Region'` ]).then(() => { return true;
      });
}
