let fetchedAv;
let randomStr = '';
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for (let i = 0; i < 6; i++) {
  randomStr += characters.charAt(Math.floor(Math.random() * 6));
}
fetch(`https://robohash.org/${randomStr}.png?bgset=bg1`)
  .then((response) => response.blob())
  .then(async (blob) => {
    fetchedAv = blob;
  });

export const randomAvatar = fetchedAv;
