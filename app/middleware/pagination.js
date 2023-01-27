const { campgroundService } = require("../services");
module.exports = async function pagination(req, res, next) {
  try {
    const startIndex = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 4;
    paginatedResult = await campgroundService.paginate(startIndex, limit);
    res.paginatedResult = paginatedResult;
    next();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
