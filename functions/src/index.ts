import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

enum collectionsEnum {
  messages = "messages"
}

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {
    structuredData: true,
  });
  response.send("Hello from Firebase!");
});

export const addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;

  const writeResult =
    await admin.firestore().collection(collectionsEnum.messages).add({
      original: original,
    });

  res.json({
    result: `Message with ID: ${writeResult.id} added.`,
  });
});

export const makeUppercase = functions.firestore.document("")
    .onCreate((snap, context) => {
      const original = snap.data().original;
      functions.logger.log("Uppercasing", context.params.documentId, original);
      const upperCase = original.toUpperCase();

      return snap.ref.set({upperCase}, {merge: true});
    });
