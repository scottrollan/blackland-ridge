//These functions are for updating the messages collection when a new response is added to a message document, with and without alerting the original author of such updates

import {
  timeStamp,
  messagesCollection,
  fsArrayUnion,
  profilesCollection,
  responseTriggers,
} from '../firestore/index';

//update messages collection with new response and send origingal author a notification
export const sendResponseWithNotification = (
  comment,
  responseTriggerInfo,
  authorID,
  messageID
) => {
  //runs if !newThread && > 24hrs since last message notification && receiveNotifications = true
  console.log(`sendResponseNotification triggered with ${responseTriggerInfo}`);

  const nowDate = new Date();
  const now = timeStamp.fromDate(nowDate);
  try {
    //adds a doc to responseTriggers
    responseTriggers.doc().set({ ...responseTriggerInfo });
    //upadate orginal author profile with new lastNotified timestamp
    profilesCollection.doc(authorID).update({ lastNotified: now });
    //update message with reply in responses array, new timestamps
    messagesCollection.doc(`${messageID}`).update({
      responses: fsArrayUnion({ ...comment }),
      updatedAt: now,
      lastResponseNotification: now,
    });
  } catch (error) {
    console.log(error);
  }
};

//update messages collection with new response without notifiying original author
export const sendResponseWithoutNotification = (comment, messageID) => {
  console.log(
    `Updating timestamp for "updatedAt" on message document ${messageID}`
  );

  const nowDate = new Date();
  const now = timeStamp.fromDate(nowDate);
  try {
    //update message with reply AND new updatedAt timestamp
    messagesCollection.doc(`${messageID}`).update({
      responses: fsArrayUnion(comment),
      updatedAt: now,
    });
  } catch (error) {
    console.log(error);
  }
};
