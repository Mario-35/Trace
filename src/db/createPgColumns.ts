import { getColumns } from ".";

export function createPgColumns(tableName: string, values: any) {
      return getColumns(tableName).map(column => values[column]  ? `"${column}"` : '').filter(e => e !== "").join();
}