import pg from 'pg';
import config from '../config.js';

const client = new pg.Client({
  connectionString: config.postgres.connectionString,
});

export async function init() {
  console.log('postgres init connect');
  const result = await client.connect();
  console.log('postgres end connect');
  return result;
}

export function end() {
  return client.end();
}

export default client;
