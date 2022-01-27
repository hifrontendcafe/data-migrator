import sanityClient from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';

/**
 * @typedef {{ id: string; name: string; }} Seniority
 */

/** @typedef {Seniority[]} Seniorities */

/**
 * @param {Seniorities} seniorities
 * @returns
 */
function buildPatches(seniorities) {
  /** @type {{ _type: "seniority", name: string }[]} */
  const patches = seniorities.map((seniority) => ({
    _type: 'seniority',
    _id: seniority.id,
    name: seniority.name,
  }));

  return patches;
}

/**
 * @param {ReturnType<buildPatches>} patches
 * @returns
 */
const createTransaction = (patches) => {
  const tx = sanityClient.transaction();

  patches.forEach((patch) => {
    tx.create(patch);
  });

  return tx;
};

/**
 * @param {Seniorities} technologies
 * @returns {Promise<void>}
 */
async function migrate(technologies) {
  const patches = buildPatches(technologies);

  const transaction = createTransaction(patches);
  await transaction.commit();
}

/**
 * @param {Seniorities} technologies
 */
export function execMigration(technologies) {
  migrate(technologies).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const rolesText = await readFile(`${config.datasetsDir}/raw/pg-seniorities.json`);
  const roles = JSON.parse(rolesText.toString());
  console.log(roles);
  execMigration(roles);
}

main();
