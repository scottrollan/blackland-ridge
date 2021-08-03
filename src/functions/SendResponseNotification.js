import {
  timeStamp,
  messagesCollection,
  fsArrayUnion,
  profilesCollection,
  responseTriggers,
} from '../firestore/index';

export const sendResponseNotification = (
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
