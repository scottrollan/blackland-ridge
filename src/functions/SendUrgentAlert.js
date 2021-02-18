import { profilesCollection, urgentAlertsCollection } from '../firestore/index';

export const sendUrgentAlert = async (data) => {
  let emails = 'blackland.ridge.notifications@gmail.com';
  profilesCollection
    .where('receiveNotifications', '==', true)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const profile = doc.data();
        emails = emails.concat(', ', profile.email);
      });

      let document = {
        emails: emails,
        urgentMessage: data.message,
        poster: data.me,
        title: data.title,
      };

      console.log(document);
      try {
        urgentAlertsCollection.doc().set({ ...document });
      } catch (error) {
        console.log(error);
      }
    });
};
