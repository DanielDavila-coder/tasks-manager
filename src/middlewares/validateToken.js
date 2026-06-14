// import jwt from "jsonwebtoken";
// import { TOKEN_SECRET } from "../config.js";

// export const authRequired = (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return res.status(401).json({ message: "No token, access denied" });
//   }

//   jwt.verify(token, TOKEN_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     req.user = user;

//     next();
//   });
// };

import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  console.log("========== AUTH REQUIRED ==========");
  console.log("Cookies recibidas:", req.cookies);

  const { token } = req.cookies;

  if (!token) {
    console.log("NO HAY TOKEN");
    return res.status(401).json({ message: "No token, access denied" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("TOKEN INVALIDO");
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("TOKEN VALIDO");

    req.user = user;
    next();
  });
};
