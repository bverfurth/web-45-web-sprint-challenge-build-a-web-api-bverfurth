const express = require("express");
const {
  logger,
  validateActionId,
  validateAction,
} = require("./actions-middlware");
const Actions = require("./actions-model");
const router = express.Router();

// - [ ] `[GET] /api/actions`
//   - Returns an array of actions (or an empty array) as the body of the response.
router.get("/", logger, async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({ message: "Actions get an error" });
    next();
  }
});

// - [ ] `[GET] /api/actions/:id`
//   - Returns an action with the given `id` as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
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

// - [ ] `[POST] /api/actions`
//   - Returns the newly created action as the body of the response.
//   - If the request body is missing any of the required fields it responds with a status code 400.
//   - When adding an action make sure the `project_id` provided belongs to an existing `project`.
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
// - [ ] `[PUT] /api/actions/:id`
//   - Returns the updated action as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.
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

// - [ ] `[DELETE] /api/actions/:id`
//   - Returns no response body.
//   - If there is no action with the given `id` it responds with a status code 404.
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

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "Bad things happened",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
