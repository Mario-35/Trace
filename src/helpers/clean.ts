import { executeSql } from '../db';

export async function clean() {
      await executeSql(`DELETE FROM "echantillons" WHERE etat = 'Supprimer'`).then(() => {
        return true;
      })
}
