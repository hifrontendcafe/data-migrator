import postgresClient from '../../loaders/postgres.js';

export async function getProfiles() {
  const result = await postgresClient.query('SELECT * FROM "Profile"');
  return result.rows;
}

export async function getTechnologies() {
  const result = await postgresClient.query('SELECT * FROM "Technology"');
  return result.rows;
}
