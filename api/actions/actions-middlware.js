// add middlewares here related to actions
const { get } = require("./actions-model");

const logger = (req, res, next) => {
  console.log("METHOD: ", req.method);
  next();
};

const validateActionId = async (req, res, next) => {
  try {
    const action = await get(req.params.id);
    if (action) {
      req.action = action;
      next();
    } else {
      next({
        status: 404,
        message: `No action with the ID of ${req.params.id} was found`,
      });
    }
  } catch (err) {
    next;
  }
};

const validateAction = (req, res, next) => {
  const { notes, description, project_id } = req.body;
  if (!notes || !description || !project_id) {
    next({
      status: 400,
      message: "missing required fields",
    });
  } else {
    next();
  }
};

module.exports = {
  logger,
  validateActionId,
  validateAction,
};
