import { BaseModel, LucidRow, ModelQueryBuilderContract } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from 'luxon';

export const softDeleteQuery = (query: ModelQueryBuilderContract<typeof BaseModel>) => {
  query.whereNull('cancelledAt')
}
export const softDelete = async (row: LucidRow, column: string = 'cancelledAt') => {
  if(row[column]) {
    if(row[column].isLuxonDateTime) {
      row[column] = DateTime.local();
    } else {
      row[column] = true;
    }
    await row.save();
  }
}