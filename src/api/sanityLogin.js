import { Client } from './sanityClient';

const sanityLogin = async (user) => {
  const firebaseUID = user.uid;
  let returnedUser;
  try {
    //see if a user with that firebase login id exists in Sanity
    let response = await Client.fetch(
      `*[_type == "profile" && "${firebaseUID}" in uid]`
    );
    if (response.length === 0) {
      //if user not in Sanity cms
      let uidArray = [];
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
      let photoURL = '';
      if (user.photoURL) {
        photoURL = user.photoURL;
      }

      returnedUser = {
        uid: uidArray,
        _id: firebaseUID,
        _type: 'profile',
        name,
        email,
        phone,
        photoURL,
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
    }
    const u = { ...response[0] }; //response.length is NOT 0 (a user exists in Sanity)

    returnedUser = {
      isNewUser: false,
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      photoURL: u.photoURL,
      image: { ...u.image },
      includeInDirectory: u.includeInDirectory,
      receiveNotifications: u.receiveNotifications,
      address: u.address,
    };
  } catch (error) {
    console.log(error.message);
  }
  return returnedUser;
};

export default sanityLogin;
