import { Client } from './sanityClient';
import { randomAvatar } from '../functions/CreateRandomAvatar';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(Client);

const urlFor = (source) => {
  return builder.image(source);
};
const sanityLogin = async (user) => {
  const firebaseUID = user.uid;
  let returnedUser;
  try {
    //see if a user with that firebase login id exists in Sanity
    let response = await Client.fetch(
      `*[_type == "profile" && "${firebaseUID}" in uid]{
        _id,
        name,
        email,
        phone,
        address,
        receiveNotifications,
        includeInDirectory,
        image,
        "imageURL": image.asset->url
      }`
    );
    if (response.length === 0) {
      //if user not in Sanity cms
      let uidArray = [firebaseUID];
      //below fields would come from firebase login
      let name = 'Neighbor';
      if (user.displayName) {
        name = user.displayName;
      } else if (user.email) {
        const emailName = user.email.split('@')[0];
        name = emailName;
      }
      let email = '';
      if (user.email) {
        email = user.email;
      }
      let phone = '';
      if (user.phoneNumber) {
        phone = user.phoneNumber;
      }
      let imageRef;
      if (user.photoURL) {
        let response = await fetch(user.photoURL);
        let blob = await response.blob();
        let userImage = blob;
        let imageResponse = await Client.assets.upload('image', userImage);
        console.log(imageResponse);
        imageRef = imageResponse._id;
      }

      returnedUser = {
        uid: uidArray,
        _id: firebaseUID,
        _type: 'profile',
        name,
        email,
        phone,
        image: {
          _type: 'image',
          asset: {
            _ref: imageRef,
            _type: 'reference',
          },
        },
        includeInDirectory: false,
        receiveNotifications: false,
        address: '',
      };
      try {
        response = await Client.create(returnedUser);
      } catch (error) {
        console.log('Create Failed: ', error.message);
      }
      //add values not used in Sanity
      returnedUser['isNewUser'] = true;
      returnedUser['isAnonymous'] = false;
      returnedUser['profileComplete'] = false;
      return returnedUser;
    } else {
      const u = { ...response[0] }; //response.length is NOT 0 (a user exists in Sanity)
      let imageRef;
      if (u.image) {
        imageRef = u.image.asset._ref;
      }
      returnedUser = {
        isNewUser: false,
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        image: {
          _type: 'image',
          asset: {
            _ref: imageRef,
            _type: 'reference',
          },
        },
        includeInDirectory: u.includeInDirectory,
        receiveNotifications: u.receiveNotifications,
        address: u.address,
      };
    }
  } catch (error) {
    console.log(error.message);
  }
  return returnedUser;
};

export default sanityLogin;
