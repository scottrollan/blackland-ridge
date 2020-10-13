import { createRandomString } from './CreateRandomString';

export const prepareParagraphs = (textArray) => {
  let thisMessageObj = [];

  textArray.forEach((p) => {
    const parentKey = createRandomString(12);
    const childKey = createRandomString(12);
    const paragraphObj = {
      _key: parentKey,
      _type: 'block',
      children: [
        {
          _key: childKey,
          _type: 'span',
          marks: [],
          text: p,
        },
      ],
      markDefs: [],
      style: 'normal',
    };
    thisMessageObj = [...thisMessageObj, paragraphObj];
  });
  return thisMessageObj;
};
