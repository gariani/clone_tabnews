import bcryptjs from "bcryptjs";

async function hash(pass) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(pass, rounds);
}

function getNumberOfRounds() {
  if (process.env.APP_ENV == "production") {
    return 14;
  }
  return 1;
}

async function compare(pass, storedPass) {
  return await bcryptjs.compare(pass, storedPass);
}

const password = {
  hash,
  compare,
};

export default password;
