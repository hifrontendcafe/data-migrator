import { Client } from '@notionhq/client';
import config from '../config.js';

export const client = new Client({ auth: config.notion.token });
