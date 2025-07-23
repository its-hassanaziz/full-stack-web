const bcrypt = require('bcryptjs');

const hash = "$2a$12$HItq/fzqqJdsRgc7liB7BObF.emJ.Wv0SNdX7jID2BDHNmXJPxTjy";
const password = "30322345.Hassan";

bcrypt.compare(password, hash)
  .then(isMatch => {
    if (isMatch) {
      console.log('Password matches!');
    } else {
      console.log('Password does NOT match!');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error comparing password:', err);
    process.exit(1);
  });
