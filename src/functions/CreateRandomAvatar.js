let randomAvatar;
let randomStr = '';
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for (let i = 0; i < 8; i++) {
  randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
}
fetch(`https://robohash.org/${randomStr}.png?bgset=bg1`)
  .then((response) => response.blob())
  .then(async (blob) => {
    randomAvatar = blob;
  });

export { randomAvatar };
