import { createPgUpdates } from ".";

export function createPgUpdate(tableName: string, values: any) {
      return `UPDATE ${tableName} SET ${createPgUpdates(tableName, values)}`;
}