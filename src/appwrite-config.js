import { Client, Account } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66677c8100109d75b7db');

const account = new Account(client);

export { client, account };
