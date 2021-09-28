import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// The Firebase Admin SDK to access Firestore.
admin.initializeApp();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

enum collectionsEnum {
  messages = "messages"
}

const db = admin.firestore();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {
    structuredData: true,
  });
  response.send("Hello from Firebase!");
});

export const addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;

  const writeResult =
    await db.collection(collectionsEnum.messages).add({
      original: original,
    });

  res.json({
    result: `Message with ID: ${writeResult.id} added.`,
  });
});

export const makeUppercase =
  functions.firestore.document(`/${collectionsEnum.messages}/{documentId}`)
      .onCreate((snap, context) => {
        const original = snap.data().original;
        functions.logger.log("Uppercasing", context.params.documentId, original);
        const upperCase = original.toUpperCase();

        return snap.ref.set({upperCase}, {merge: true});
      });

export const getMessages = functions.https.onRequest(async (req, res) => {
  const result = await db.collection(collectionsEnum.messages).get();
  res.json(result);
});

export const updateMessage = functions.https.onRequest(async (req, res) => {
  const messageId = req.query.id as string;
  const result = await db.collection(collectionsEnum.messages).doc(messageId).set({
    original: "valueUpdated",
  });
  res.json(result);
});
