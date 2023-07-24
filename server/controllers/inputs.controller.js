const { validationResult } = require("express-validator");
module.exports = {
  returnInputsRequirementErrors: (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  },
  uniquenessRequired: async (Model, filter, msg, param, res) => {
    let exist = await Model.findOne(filter);
    if (exist) {
      return res.status(400).json({
        errors: [{ msg: msg, param: param }],
      });
    }
  },
};
