import * as sdk from "node-appwrite";

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client.
    setEndpoint('http://cloud.appwrite.io/v1').
    setProject('66d88f9d00392386ea65').
    setKey('standard_499c584d3dbd86f3bd809ac0011d49391176e0deb7d249c9c8ec47f0376fdba8a7fbe3788ba2a1ef1ad796098b848b00c4dc6dc3df83f023542982a90f4b0cd7c233326338cf81e2c2aefe3cf76c4afb8d055edba9118faf9685537ccbf005f504cdbeb73be62c186b7dbc09989b655cb32eb417f9e1e8923c56c12bc25a205a');

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);