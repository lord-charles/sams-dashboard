import jwt from "jsonwebtoken";

// Jwt payload and option-> expiresIn

const DEFAULT_SIGN_OPTION = {
  expiresIn: `${process.env.JWT_EXPIRATION_DURATION}m`,
};
export function signJwtAccessToken(payload, options = DEFAULT_SIGN_OPTION) {
  const secret_key = `${process.env.SECRET_KEY}`;
  const token = jwt.sign(payload, secret_key, options);
  return token;
}
export function verifyJwt(token) {
  try {
    const secret_key = `${process.env.SECRET_KEY}`;
    const decoded = jwt.verify(token, secret_key);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
}
