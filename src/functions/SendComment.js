import {
  timeStamp,
  messagesCollection,
  profilesCollection,
} from '../firestore/index';
import {
  sendResponseWithNotification,
  sendResponseWithoutNotification,
} from './SendResponseNotification';
import { sendUrgentAlert } from './SendUrgentAlert';
import { createRandomString } from './CreateRandomString';

export const sendComment = async (
  thisUser,
  attachedImages,
  message,
  plainTextMessage,
  messageType,
  newThread,
  title,
  lastNotificationDate,
  responseTriggerInfo,
  authorID,
  messageID
) => {
  const me = thisUser.displayName;
  const myEmail = thisUser.email;
  const authorImageURL = thisUser.photoURL;
  const nowDate = new Date();
  const now = timeStamp.fromDate(nowDate);
  const dayOne = new Date('1970-01-01');
  const wayBack = timeStamp.fromDate(dayOne);
  const newID = createRandomString(20);
  const authorRef = thisUser.ref;
  let comment = {
    attachedImages,
    authorRef: authorRef,
    authorImageURL,
    createdAt: now,
    id: newID,
    message,
    plainTextMessage,
    messageType: messageType,
    name: me,
  };
  if (newThread) {
    let recipientList = 'blackland.ridge.notifications@gmail.com';
    //if starting a new thread, (newThread comes from props)
    profilesCollection
      .where('receiveNotifications', '==', true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const thisEmail = data.email;
          recipientList = recipientList.concat(`, ${thisEmail}`);
        });
        comment['authorEmail'] = myEmail;
        comment['category'] = messageType;
        comment['title'] = title;
        comment['newThread'] = true;
        comment['updatedAt'] = now;
        comment['responses'] = [];
        comment['recipients'] = recipientList;
        try {
          messagesCollection.doc(newID).set({ ...comment });
        } catch (error) {
          console.log(error);
        }
      });
  } else {
    comment['responderEmail'] = myEmail;
    //if comment is a ~RESPONSE~ to a new thread (!newThread from props)//
    if (nowDate - lastNotificationDate > 43200000) {
      //last notification for this message was under 12 hours ago
      try {
        //get author info
        profilesCollection
          .doc(authorID) //authorId comes from props via useEffect
          .get()
          .then((doc) => {
            const data = { ...doc.data() };
            if (doc.exists) {
              const authorNotifications = data.receiveNotifications; //author receives notificaions true/flase?
              const lastNotificationSent = data.lastNotified ?? wayBack;
              if (
                authorNotifications &&
                nowDate - lastNotificationSent.toDate() > 43200000 //(> 12 hours)
              ) {
                sendResponseWithNotification(
                  comment,
                  responseTriggerInfo,
                  authorID,
                  messageID
                );
              } else {
                console.log('Running update without notification');
                sendResponseWithoutNotification(comment, messageID);
              }
            } else {
              console.log('Profile not found.');
            }
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Didn't meet any of the IF's criteria");
      sendResponseWithoutNotification(comment, messageID);
    }
  }
  if (messageType === 'Urgent') {
    const urgentData = { me, plainTextMessage, title };
    sendUrgentAlert(urgentData);
  }
};
