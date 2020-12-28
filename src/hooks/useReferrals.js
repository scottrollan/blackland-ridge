import React, { useState } from 'react';
import { referralsCollection } from '../firestore/index';

const useReferrals = () => {
  const [theseReferrals, setTheseReferrals] = useState('');
  // const [newThreads, setNewThreads] = useState('');

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
        setTheseReferrals(allReferrals);
      }
    };
    getReferrals();
    console.log(theseReferrals);
  }, []);
  return theseReferrals;
};

export default useReferrals;
