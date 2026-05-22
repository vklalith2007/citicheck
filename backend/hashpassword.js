import bcrypt from 'bcryptjs';

const password = 'lallu'; // ← change this to your actual password

const hash = await bcrypt.hash(password, 10);
console.log('\n✅ Your hashed password:\n');
console.log(hash);
console.log('\nCopy the above hash and paste it as the password field in MongoDB.\n');
