//  untuk hash password
// jwt

import { SignJWT } from "jose";
const secret = new TextEncoder().encode("RAHASIA");

const generateToken = async (userId) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
};

export { generateToken };