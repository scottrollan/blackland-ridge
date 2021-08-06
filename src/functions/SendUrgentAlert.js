import { profilesCollection, urgentAlertsCollection } from '../firestore/index';

require('dotenv').config();

export const sendUrgentAlert = async (data) => {
  let emails = 'blackland.ridge.notifications@gmail.com';
  let phones = "'+14048405408'";
  profilesCollection
    .where('receiveNotifications', '==', true)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const profile = doc.data();
        emails = emails.concat(', ', profile.email);
        if (profile.textUrgentAlerts) {
          const phoneNo = profile.phone;
          const noNonNumbers = phoneNo.replace(/\D/g, '');
          if (noNonNumbers.length === 10) {
            phones = phones.concat(`, '+1${noNonNumbers}'`);
          }
        }
      });

      let document = {
        emails: emails,
        phones: phones,
        urgentMessage: data.plainTextMessage,
        poster: data.me,
        title: data.title,
      };
      //add document to urgentMessages so the cloud function triggers
      try {
        urgentAlertsCollection.doc().set({ ...document });
      } catch (error) {
        console.log(error);
      }
    });
};
