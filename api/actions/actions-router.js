const express = require("express");
const {
  logger,
  validateActionId,
  validateAction,
} = require("./actions-middlware");
const Actions = require("./actions-model");
const router = express.Router();

router.get("/", logger, async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({ message: "Actions get an error" });
    next();
  }
});

router.get("/:id", (req, res) => {
  Actions.get(req.params.id)
    .then((action) => {
      if (!action) {
        res.status(404).json({
          message: "Action given with the specific id does not exist",
        });
      } else {
        res.status(200).json(action);
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Actions get an id error" });
    });
});

router.post("/", (req, res) => {
  if (!req.body.description || !req.body.notes || !req.body.project_id) {
    res.status(400).json({
      message: "Notes and description and associated project id are required",
    });
  } else {
    Actions.insert(req.body)
      .then((newAction) => {
        res.status(201).json(newAction);
      })
      .catch(() => {
        res.status(500).json({ message: "Actions post error" });
      });
  }
});

router.put(
  "/:id",
  logger,
  validateActionId,
  validateAction,
  async (req, res, next) => {
    const { completed } = req.body;
    try {
      if (
        typeof completed !== "The action with the specified id does not exist"
      ) {
        await Actions.update(req.params.id, req.body);
        res.status(200).json(req.body);
      } else {
        res.status(400).json({
          message: "Action returned an error",
        });
      }
    } catch (err) {
      next();
    }
  }
);

router.delete("/:id", logger, validateActionId, async (req, res, next) => {
  try {
    await Actions.remove(req.params.id);
    res.status(200).json({
      message: "Project deleted.",
    });
  } catch (err) {
    next();
  }
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "Bad things happened",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
