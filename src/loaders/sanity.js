import createClient from "@sanity/client";
import config from "../config.js";

export const client = createClient(config.sanity);

export default client;
