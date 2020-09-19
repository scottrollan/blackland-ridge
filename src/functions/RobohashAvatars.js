let newAvatar;
let randomString = '';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
const string_length = 6;
for (let i = 0; i < string_length; i++) {
  let rnum = Math.floor(Math.random() * chars.length);
  randomString += chars.substring(rnum, rnum + 1);
}

newAvatar = `https://robohash.org/${randomString}.png?bgset=bg2`;

export { newAvatar };
