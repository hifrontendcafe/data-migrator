import postgresClient from '../../loaders/postgres.js';

export async function getProfiles() {
  const result = await postgresClient.query('SELECT * FROM "Profile"');
  return result.rows;
}

export async function getTechnologies() {
  const result = await postgresClient.query('SELECT * FROM "Technology"');
  return result.rows;
}

export async function getRoles() {
  const result = await postgresClient.query('SELECT * FROM "Role"');
  return result.rows;
}

export async function getSeniorities() {
  const result = await postgresClient.query('SELECT * FROM "Seniority"');
  return result.rows;
}

export async function getProfileTecnologies() {
  const result = await postgresClient.query('SELECT * FROM "_ProfileToTechnology"');
  return result.rows;
}
