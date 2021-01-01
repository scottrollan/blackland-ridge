import { petsRef, itemsForSaleRef, wildlifeRef } from '../firestore/index';

export const photoAlbums = [
  {
    name: 'Pets',
    ref: petsRef,
  },
  // {
  //   name: 'For Sale',
  //   ref: itemsForSaleRef,
  // },
  {
    name: 'Wildlife',
    ref: wildlifeRef,
  },
];
