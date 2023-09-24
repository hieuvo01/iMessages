const groupController = require('../../components/group/groupController');
const middlewareController = require('../../components/middlewares/middleware');
const router = require('express').Router();

router.get("/get-all", middlewareController.verifyToken, groupController.getAll);
router.post("/", middlewareController.verifyToken, groupController.createGroup);
router.post("/:groupId/join", middlewareController.verifyToken, groupController.joinGroup);
router.post("/:groupId/leave", middlewareController.verifyToken, groupController.leaveGroup);
router.post("/:groupId/messages", middlewareController.verifyToken, groupController.sendMessage);
router.post("/messages", middlewareController.verifyToken, groupController.sendMessageOne);

module.exports = router;