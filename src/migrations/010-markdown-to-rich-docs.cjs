const { readFile } = require('fs/promises');
const blockTools = require('@sanity/block-tools');
const Schema = require('@sanity/schema').default;
const { JSDOM } = require('jsdom');

const schema = Schema.compile({
  name: 'Docs',
  types: [
    {
      type: 'object',
      name: 'doc',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [{ type: 'block' }],
        },
      ],
    },
  ],
});

const blockContentType = schema.get('doc').fields.find(
  /** @param {{ name: string }} field */
  (field) => field.name === 'body',
).type;

/** @typedef {import('..').Doc} Doc */

/**
 * @param {Doc[]} docs
 */
const buildPatches = async (docs) => {
  const { unified } = await import('unified');
  const markdown = (await import('remark-parse')).default;
  const html = (await import('remark-html')).default;

  const newDocs = await Promise.all(
    docs.map(async (doc) => {
      const HTML = await unified().use(markdown).use(html).process(doc.content);

      const blocks = blockTools.htmlToBlocks(HTML.value, blockContentType, {
        /**
         * @param {string} html
         */
        parseHtml: (html) => new JSDOM(html).window.document,
      });

      return {
        ...doc,
        body: blocks,
      };
    }),
  );

  return newDocs;
};

/**
 * @param {{ _id: string, body: any }[]} operations
 */
async function createTransaction(operations) {
  const client = (await import('../loaders/sanity.js')).client;

  const transaction = client.transaction();

  operations.forEach((operation) => {
    transaction.patch(operation._id, {
      set: {
        body: operation.body,
      },
    });
  });

  return transaction;
}

/**
 * @param {Doc[]} docs
 */
async function migrate(docs) {
  const patches = await buildPatches(docs);

  const transaction = await createTransaction(patches);

  await transaction.commit({ autoGenerateArrayKeys: true });
}

/**
 * @param {Doc[]} docs
 */
function execMigration(docs) {
  migrate(docs).catch((err) => {
    console.log(err);
    process.exit(1);
  });
}

async function main() {
  const config = (await import('../config.js')).default;

  const docsText = await readFile(`${config.datasetsDir}/raw/docs.json`);

  /** @type {Doc[]}  */
  const docs = JSON.parse(docsText.toString());

  execMigration(docs);
}

main();
