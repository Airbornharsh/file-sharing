import { Router } from "express";
import {
  createFileController,
  createUserController,
  giveAccessController,
  joinUserController,
  listAccessedFilesController,
  listCreatedFilesController,
  listFilesController,
  removeAccessController,
} from "./Controllers";

const routes = Router();

routes.get("/", (req, res) => {
  return res.send("Hello World");
});
routes.post("/create-user", createUserController);
routes.post("/join-user", joinUserController);
routes.post("/create-file", createFileController);
routes.post("/give-access", giveAccessController);
routes.post("/remove-access", removeAccessController);
routes.post("/get-files", listFilesController);
routes.post("/get-created-files", listCreatedFilesController);
routes.post("/get-access-files", listAccessedFilesController);

export default routes;
