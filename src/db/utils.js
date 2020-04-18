/* eslint-disable no-console */
const db = require('./pgAdaptor');

/**
 * Utility for checking if a table exists in the database.
 * @param {int} tableName The name of the table
 */
const tableExists = async (tableName) => {
  try {
    const result = await db.any(`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE  schemaname = 'public'
        AND tablename = $1
      );
    `, [tableName]);
    return result[0].exists;
  } catch (e) {
    console.log('Error while checking table: ' + e);
  }
  return false;
};

module.exports = tableExists;