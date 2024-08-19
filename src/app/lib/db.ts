import { Client } from "@vercel/postgres";

let client: Client;

export const getClient = async () => {
  if (!client) {
    client = new Client();
    await client.connect();
  }
  return client;
};
