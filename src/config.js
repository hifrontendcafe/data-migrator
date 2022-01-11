import dotenv from 'dotenv';

const envs = dotenv.config();

if (!envs) {
  throw new Error("Cant't find env file");
}

/**
 * @param {string} name
 */
function getEnvVar(name) {
  const envVar = process.env[name];

  if (!envVar) {
    throw new Error(`${name} env var must be defined`);
  }

  return envVar;
}

export default {
  sanity: {
    dataset: getEnvVar('SANITY_DATASET'),
    projectId: getEnvVar('SANITY_PROJECT_ID'),
    token: getEnvVar('SANITY_TOKEN'),
    useCdn: false,
    apiVersion: '2022-01-08',
  },
  postgres: {
    connectionString: getEnvVar('DATABASE_URL'),
  },
  discord: {
    token: getEnvVar('DISCORD_TOKEN'),
    guildId: '594363964499165194',
  },
};
