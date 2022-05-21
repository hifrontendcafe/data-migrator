import {
  getCmykParticipants,
  getDocs,
  getMentors,
  getPersons,
  getPersonsWithoutIds,
  getReactGroupsParticipants,
} from './api/queries/sanity.js';
import {
  getProfiles,
  getRoles,
  getSeniorities,
  getTechnologies,
  getProfileTecnologies,
} from './api/queries/postgres.js';

import { getDiscordUsers } from './api/queries/discord.js';
import config from './config.js';

/**
 * @type {{
 *   fetch: () => Promise<any>;
 *   file: string;
 *   type: "sanity" | "discord" | "postgres"
 * }[]}
 */
const allQueries = [
  {
    fetch: getMentors,
    file: `${config.datasetsDir}/raw/mentors.json`,
    type: 'sanity',
  },
  {
    fetch: getPersons,
    file: `${config.datasetsDir}/raw/people.json`,
    type: 'sanity',
  },
  {
    fetch: getPersonsWithoutIds,
    file: `${config.datasetsDir}/raw/people-without-id.json`,
    type: 'sanity',
  },
  {
    fetch: getCmykParticipants,
    file: `${config.datasetsDir}/raw/cmyk-participant.json`,
    type: 'sanity',
  },
  {
    fetch: getReactGroupsParticipants,
    file: `${config.datasetsDir}/raw/react-groups-participants.json`,
    type: 'sanity',
  },
  {
    fetch: getDiscordUsers,
    file: `${config.datasetsDir}/raw/discord-users.json`,
    type: 'discord',
  },
  {
    fetch: getProfiles,
    file: `${config.datasetsDir}/raw/pg-profiles.json`,
    type: 'postgres',
  },
  {
    fetch: getTechnologies,
    file: `${config.datasetsDir}/raw/pg-techonologies.json`,
    type: 'postgres',
  },
  {
    fetch: getRoles,
    file: `${config.datasetsDir}/raw/pg-roles.json`,
    type: 'postgres',
  },
  {
    fetch: getSeniorities,
    file: `${config.datasetsDir}/raw/pg-seniorities.json`,
    type: 'postgres',
  },
  {
    fetch: getProfileTecnologies,
    file: `${config.datasetsDir}/raw/pg-profile-technologies.json`,
    type: 'postgres',
  },
  {
    fetch: getDocs,
    file: `${config.datasetsDir}/raw/docs.json`,
    type: 'sanity',
  },
];

const enabledQueries = allQueries.filter((query) => {
  switch (query.type) {
    case 'sanity':
      return config.sanity.enabled;
    case 'discord':
      return config.discord.enabled;
    case 'postgres':
      return config.postgres.enabled;
    default:
      throw new Error('invalid query type');
  }
});

export default enabledQueries;
