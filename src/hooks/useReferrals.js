import React, { useState } from 'react';
import { referralsCollection } from '../firestore/index';

const useReferrals = () => {
  const [theseReferrals, setTheseReferrals] = useState('');

  React.useEffect(() => {
    let allReferrals = [];
    let thisReferral = {};
    const getReferrals = async () => {
      try {
        await referralsCollection.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            thisReferral = { ...doc.data(), id: doc.id };
            allReferrals = [...allReferrals, thisReferral];
          });
        });
      } catch (error) {
        console.log(error);
      } finally {
        setTheseReferrals([...allReferrals]);
      }
    };
    getReferrals();
  }, []);
  return theseReferrals;
};

export default useReferrals;
