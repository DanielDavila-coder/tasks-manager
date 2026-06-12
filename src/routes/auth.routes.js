import { Router } from "express";
import {
  login,
  register,
  logout,
  profile,
  verifyToken,
  updateUsername,
  updateEmail,
  updatePassword,
  deleteAccount,
  updateAvatar,
} from "../controllers/auth.controllers.js";
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
  registerSchemas,
  loginSchemas,
  updateUsernameSchema,
  updateEmailSchema,
  updatePasswordSchema,
} from "../schemas/auth.schema.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/register", validateSchema(registerSchemas), register);

router.post("/login", validateSchema(loginSchemas), login);

router.post("/logout", logout);

router.get("/verify", verifyToken);

router.get("/profile", authRequired, profile);

router.put(
  "/profile/username",
  authRequired,
  validateSchema(updateUsernameSchema),
  updateUsername,
);

router.put(
  "/profile/email",
  authRequired,
  validateSchema(updateEmailSchema),
  updateEmail,
);

router.put(
  "/profile/password",
  authRequired,
  validateSchema(updatePasswordSchema),
  updatePassword,
);

router.delete("/profile/account", authRequired, deleteAccount);

router.put(
  "/profile/avatar",
  authRequired,
  upload.single("avatar"),
  updateAvatar,
);

export default router;
