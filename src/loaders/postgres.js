import pg from "pg";
import config from "../config.js";

const client = new pg.Client({
  connectionString: config.postgres.connectionString,
});

client.connect();

export default client;
