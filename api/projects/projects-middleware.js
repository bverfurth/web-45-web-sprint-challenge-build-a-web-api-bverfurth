const { get } = require("./projects-model");

const logger = (req, res, next) => {
  console.log("METHOD: ", req.method);
  next();
};

const validateProjectId = async (req, res, next) => {
  try {
    const project = await get(req.params.id);
    if (project) {
      req.project = project;
      next();
    } else {
      next({
        status: 404,
        message: `No project with ID of ${req.params.id} was found`,
      });
    }
  } catch (err) {
    next;
  }
};

const validateProject = (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) {
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
  validateProjectId,
  validateProject,
};
