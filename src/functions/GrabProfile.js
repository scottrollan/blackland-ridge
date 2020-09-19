import { Client } from '../api/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import $ from 'jquery';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};
let nameGP;
let phoneGP;
let emailGP;
let photoURLGP;
let imageRefGP;
let addressGP = 'Select Your Address';
let directoryGP;
let notificationsGP;

const GrabProfile = async (thisUser) => {
  try {
    if (thisUser.name) {
      const myName = thisUser.name;
      nameGP = myName;
      photoURLGP = `https://robohash.org/${myName}.png?bgset=bg2`;
    }

    if (thisUser.email) {
      emailGP = thisUser.email;
    }
    if (thisUser.phone) {
      phoneGP = thisUser.phone;
    }
    switch (true) {
      case 'asset' in thisUser.image && thisUser.image.asset._ref !== '':
        const extractedURL = urlFor(thisUser.image).url();
        photoURLGP = extractedURL;
        imageRefGP = thisUser.image.asset._ref;
        break;
      case thisUser.photoURL && thisUser.photoURL !== '':
        const photoURL = thisUser.photoURL;
        photoURLGP = photoURL;
        let blob;
        let response = await fetch(photoURL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          blob = await response.blob();
        }
        const imageRes = await Client.assets.upload('image', blob);
        photoURLGP = imageRes.url;
        const newImageRef = imageRes._id;
        imageRefGP = newImageRef;

        break;
      default:
        console.log('image fields check out');
        break;
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
      photoURLGP,
      imageRefGP,
      addressGP,
      directoryGP,
      notificationsGP,
    ];
  }
};
export default GrabProfile;
