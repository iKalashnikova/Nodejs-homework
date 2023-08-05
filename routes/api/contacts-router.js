import express from "express";

import contactsController from "../../controller/contactController.js";

import isValidId from "../../middlewars/isValidId.js";

import authenticate from '../../middlewars/authenticate.js';

import upload from "../../middlewars/upload.js";


const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll );

contactsRouter.get("/:id", isValidId,  contactsController.getById);

contactsRouter.post("/", upload.single("poster"), contactsController.add);

contactsRouter.delete("/:id", isValidId, contactsController.deleteById);

contactsRouter.put("/:id", isValidId, contactsController.updateById);

contactsRouter.patch("/:id/favorite", isValidId, contactsController.updateStatusContact);

export default contactsRouter;
