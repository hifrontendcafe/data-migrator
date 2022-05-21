import { saveQueries } from './exportDatasets.js';
import { end as endDiscordClient, init as initDiscordClient } from './loaders/discord.js';
import { end as endPostgresClient, init as initPostgresClient } from './loaders/postgres.js';
import config from './config.js';

const services = [
  {
    name: 'discord',
    init: initDiscordClient,
    end: endDiscordClient,
    enabled: config.discord.enabled,
  },
  {
    name: 'postgres',
    init: initPostgresClient,
    end: endPostgresClient,
    enabled: config.postgres.enabled,
  },
];

const enabledServices = services.filter((service) => service.enabled);

async function init() {
  return Promise.all(enabledServices.map((service) => service.init()));
}

async function end() {
  return Promise.all(enabledServices.map((service) => service.end()));
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
