import sanityClient from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';

/** @typedef {import('..').Person} Person */
/** @typedef {import('..').Profile} Profile */

/**
 * @typedef {{
 *   _id: string;
 *   _rev: string;
 *   username: string;
 *   id: string | undefined;
 * }} PersonMutationData
 */

/** @typedef {PersonMutationData[]} PeopleMutationData */

/**
 * @param {{ person: Person, profile: Profile }[]} profilesWithPerson
 */
function buildPatches(profilesWithPerson) {
  /** @type {any[]} */
  const patches = [];
  profilesWithPerson.forEach(({ person, profile }) => {
    patches.push({
      id: person._id,
      patch: {
        set: {
          email: profile.email,
          twitter: profile.twitter,
          github: profile.github,
          portfolio: profile.portfolio,
          linkedin: profile.linkedin,
        },
        // this will cause the transaction to fail if the documents has been
        // modified since it was fetched.
        ifRevisionID: person._rev,
      },
    });

    patches.push({
      id: profile.id,
      patch: {
        set: { person: { _type: 'reference', _ref: person._id } },
      },
    });
  });
  return patches;
}

/**
 * @param {ReturnType<buildPatches>} patches
 * @returns
 */
const createTransaction = (patches) => {
  const tx = sanityClient.transaction();

  patches.forEach((patch) => {
    tx.patch(patch.id, patch.patch);
  });

  return tx;
};

/**
 * @param {{ person: Person, profile: Profile }[]} profilesWithPerson
 * @returns {Promise<void>}
 */
async function migrate(profilesWithPerson) {
  const patches = buildPatches(profilesWithPerson);

  const transaction = createTransaction(patches);
  await transaction.commit();
}

/**
 * @param {{ person: Person, profile: Profile }[]} profilesWithPerson
 */
export function execMigration(profilesWithPerson) {
  migrate(profilesWithPerson).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const profilesText = await readFile(`${config.datasetsDir}/derived/profiles-to-person.json`);
  const profiles = JSON.parse(profilesText.toString());
  console.log(profiles);
  execMigration(profiles);
}

main();
