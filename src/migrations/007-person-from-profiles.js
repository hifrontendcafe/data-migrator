import sanityClient from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';
import { v4 as uuidv4 } from 'uuid';

/** @typedef {import('..').Profile} Profile */

/**
 * @param { Profile[] } profilesWithPerson
 */
function buildPatches(profilesWithPerson) {
  /** @type {{ type: "create" | "patch", data: any }[]} */
  const operations = [];
  profilesWithPerson.forEach((profile) => {
    const personId = uuidv4();

    operations.push({
      type: 'create',
      data: {
        _type: 'person',
        _id: personId,
        discordID: { _type: 'slug', current: profile.discordId },
        username: profile.discord,
        firstName: profile.name,
        email: profile.email,
        twitter: profile.twitter,
        github: profile.github,
        portfolio: profile.portfolio,
        linkedin: profile.linkedin,
        fecTeam: false,
        fromProfile: true,
      },
    });

    operations.push({
      type: 'patch',
      data: {
        id: profile.id,
        patch: {
          set: { person: { _type: 'reference', _ref: personId } },
        },
      },
    });
  });
  return operations;
}

/**
 * @param {ReturnType<buildPatches>} operations
 * @returns
 */
const createTransaction = (operations) => {
  const tx = sanityClient.transaction();
  console.log(`need to process ${operations.length}`);

  operations.forEach((operation, i) => {
    switch (operation.type) {
      case 'create':
        tx.createIfNotExists(operation.data);
        break;
      case 'patch':
        tx.patch(operation.data.id, operation.data.patch);
        break;
    }

    console.log(`processed ${i + 1} operations`);
  });

  return tx;
};

/**
 * @param { Profile[] } profilesWithPerson
 * @returns {Promise<void>}
 */
async function migrate(profilesWithPerson) {
  const patches = buildPatches(profilesWithPerson);

  const transaction = createTransaction(patches);
  await transaction.commit();
}

/**
 * @param { Profile[] } profilesWithPerson
 */
export function execMigration(profilesWithPerson) {
  migrate(profilesWithPerson).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const profilesText = await readFile(`${config.datasetsDir}/derived/profiles-without-person.json`);
  const profiles = JSON.parse(profilesText.toString());
  execMigration(profiles);
}

main();
