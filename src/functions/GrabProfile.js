// import { Client } from '../api/sanityClient';
// import imageUrlBuilder from '@sanity/image-url';
import $ from 'jquery';

// const builder = imageUrlBuilder(Client);

// const urlFor = (source) => {
//   return builder.image(source);
// };
let nameGP;
let phoneGP;
let emailGP;
let imageRefGP;
let addressGP = 'Select Your Address';
let directoryGP;
let notificationsGP;

const GrabProfile = async (thisUser) => {
  try {
    if (thisUser.name) {
      nameGP = thisUser.name;
    } else if (thisUser.email) {
      const userEmail = thisUser.email;
      nameGP = userEmail.split('@')[0];
    }

    if (thisUser.email) {
      emailGP = thisUser.email;
    }
    if (thisUser.phone) {
      phoneGP = thisUser.phone;
    }

    if (thisUser.image.asset) {
      imageRefGP = thisUser.image.asset._ref;
    }

    if (thisUser.address) {
      addressGP = thisUser.address;
    }
    if (thisUser.receiveNotifications) {
      notificationsGP = true;
      $('#receiveNotifications').prop('checked', true);
    } else {
      $('#receiveNotifications').prop('checked', false);
    }
    if (thisUser.includeInDirectory) {
      directoryGP = true;
      $('#includeInDirectory').prop('checked', true);
    } else {
      $('#includeInDirectory').prop('checked', false);
    }
  } catch (error) {
    console.error(error);
  } finally {
    return [
      nameGP,
      phoneGP,
      emailGP,
      imageRefGP,
      addressGP,
      directoryGP,
      notificationsGP,
    ];
  }
};
export default GrabProfile;
