import sanityClient from '../loaders/sanity.js';
import { readFile } from 'fs/promises';
import config from '../config.js';

/**
 * @typedef {{ id: string; name: string; }} Technology
 */

/** @typedef {Technology[]} Technologies */

/**
 * @param {Technologies} technologies
 * @returns
 */
function buildPatches(technologies) {
  /** @type {{ _type: "technology", name: string }[]} */
  const patches = technologies.map((technology) => ({
    _type: 'technology',
    _id: technology.id,
    name: technology.name,
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
 * @param {Technologies} technologies
 * @returns {Promise<void>}
 */
async function migrate(technologies) {
  const patches = buildPatches(technologies);

  const transaction = createTransaction(patches);
  await transaction.commit();
}

/**
 * @param {Technologies} technologies
 */
export function execMigration(technologies) {
  migrate(technologies).catch((/** @type {unknown} */ err) => {
    console.error(err);
    process.exit(1);
  });
}

async function main() {
  const technologiesText = await readFile(`${config.datasetsDir}/raw/pg-techonologies.json`);
  const technologies = JSON.parse(technologiesText.toString());
  console.log(technologies);
  execMigration(technologies);
}

main();
