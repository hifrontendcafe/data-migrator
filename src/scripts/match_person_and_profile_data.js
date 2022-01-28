import { readFile, writeFile } from 'fs/promises';
import config from '../config.js';

async function main() {
  const profilesText = await (await readFile(`${config.datasetsDir}/raw/pg-profiles.json`)).toString();
  /** @type {import('..').Profiles} */
  const profiles = JSON.parse(profilesText);

  const peopleText = await (await readFile(`${config.datasetsDir}/raw/people.json`)).toString();
  /** @type {import('..').People} */
  const people = JSON.parse(peopleText);

  /** @type {{ person: import('..').Person, profile: import('..').Profile}[]} */
  const profilesWithPerson = [];

  /** @type {import('..').Profile[]} */
  const profilesWithoutPerson = [];

  profiles.forEach((profile) => {
    const person = people.find((person) => person.discordID?.current === profile.discordId);
    if (person) {
      profilesWithPerson.push({ profile, person });
    } else {
      profilesWithoutPerson.push(profile);
    }
  });

  await writeFile(`${config.datasetsDir}/derived/profiles-with-person.json`, JSON.stringify(profilesWithPerson));
  await writeFile(`${config.datasetsDir}/derived/profiles-without-person.json`, JSON.stringify(profilesWithoutPerson));
}

main();
