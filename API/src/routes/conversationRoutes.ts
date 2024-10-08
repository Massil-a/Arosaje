import express from "express";

import Middleware from "../middleware";
import postValidator from "../validator/postValidator";

import convController from "../controller/conversationsController"

const router = express.Router();

router.post(
  "/add",
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  convController.add
);

router.get(
  "/readAll",
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["admin"] }),
  convController.read
)

router.get(
  "/read",
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  postValidator.checkIdParam(),
  convController.readByUser
);

router.delete(
  "/delete/:id",
  Middleware.handleValidationError,
  Middleware.authMiddleware({ roles: ["utilisateur"] }),
  postValidator.checkIdParam(),
  convController.delete
)

export default router;
