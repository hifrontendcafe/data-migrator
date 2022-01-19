import sanityClient from '../loaders/sanity.js';

/** @typedef {import('..').DiscordUsers} DiscordUsers */
/** @typedef {import('..').People} People */

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
 * @param {DiscordUsers} users
 * @param {People} people
 */
function buildPatches(users, people) {
  /** @type {any[]} */
  const peopleWithIds = [];

  /** @type {Map<string, string>} */
  const idToUsernames = new Map();
  users.forEach(({ username2, id }) => {
    idToUsernames.set(username2, id);
  });

  people.map((person) => {
    if (idToUsernames.has(person.username) && !person.discordID?.current) {
      peopleWithIds.push({
        id: person._id,
        patch: {
          set: { discordID: { _type: 'slug', current: idToUsernames.get(person.username) } },
          unset: ['discordId'],
          // this will cause the transaction to fail if the documents has been
          // modified since it was fetched.
          ifRevisionID: person._rev,
        },
      });
    }
  });

  return peopleWithIds;
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
 * @param {DiscordUsers} users
 * @param {People} people
 * @returns {Promise<void>}
 */
async function migrate(users, people) {
  const patches = buildPatches(users, people);

  const transaction = createTransaction(patches);
  await transaction.commit();
}

/**
 * @param {DiscordUsers} users
 * @param {People} people
 */
export function execMigration(users, people) {
  migrate(users, people).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}
