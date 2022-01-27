import { saveQueries } from './exportDatasets.js';
import { end as endDiscordClient, init as initDiscordClient } from './loaders/discord.js';
import { end as endPostgresClient, init as initPostgresClient } from './loaders/postgres.js';

async function init() {
  return Promise.all([initDiscordClient(), initPostgresClient()]);
}

async function end() {
  return Promise.all([endDiscordClient(), endPostgresClient()]);
}

async function main() {
  try {
    const loaders = await init();
    console.log('loaders connected', loaders);
  } catch (error) {
    throw new Error('failed to init loaders');
  }

  await saveQueries();

  try {
    await end();
  } catch (error) {
    throw new Error('failed to disconnect loaders');
  }
}

main();
