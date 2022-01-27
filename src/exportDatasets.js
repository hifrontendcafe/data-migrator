import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import config from './config.js';

import {
  getCmykParticipants,
  getMentors,
  getPersons,
  getPersonsWithoutIds,
  getReactGroupsParticipants,
} from './api/queries/sanity.js';
import { getProfiles, getTechnologies } from './api/queries/postgres.js';
import { getDiscordUsers } from './api/queries/discord.js';

export const queries = [
  { fetch: getMentors, file: `${config.datasetsDir}/raw/mentors.json` },
  { fetch: getPersons, file: `${config.datasetsDir}/raw/people.json` },
  { fetch: getPersonsWithoutIds, file: `${config.datasetsDir}/raw/people-without-id.json` },
  { fetch: getCmykParticipants, file: `${config.datasetsDir}/raw/cmyk-participant.json` },
  { fetch: getReactGroupsParticipants, file: `${config.datasetsDir}/raw/react-groups-participants.json` },
  { fetch: getDiscordUsers, file: `${config.datasetsDir}/raw/discord-users.json` },
  { fetch: getProfiles, file: `${config.datasetsDir}/raw/pg-profiles.json` },
  { fetch: getTechnologies, file: `${config.datasetsDir}/raw/pg-techonologies.json` },
];

export async function saveQueries() {
  console.info('init queries');
  const rawPath = `${config.datasetsDir}/raw`;

  if (!existsSync(rawPath)) {
    mkdirSync(rawPath);
  }

  for (const query of queries) {
    console.log(`Start Query: ${query.fetch.name}`);
    await query.fetch().then(async (data) => {
      console.log(`writing ${query.file}`);
      await writeFile(query.file, JSON.stringify(data, null, 2));
    });
    console.log(`End Query: ${query.fetch.name}`);
  }
}
