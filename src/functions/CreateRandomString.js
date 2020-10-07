export const createRandomString = (length) => {
  let randomStr = ''; //prepare a new element in the original thread's ref array
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    randomStr += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomStr;
};
