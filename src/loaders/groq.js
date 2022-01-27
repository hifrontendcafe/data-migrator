import { parse, evaluate } from 'groq-js';

/**
 * @param {any} dataset
 * @param {string} queryString
 */
export async function query(dataset, queryString) {
  const ast = await parse(queryString);
  const response = await evaluate(ast, { dataset });

  return response.get();
}
