const routeNotFound = (req, res) =>
  res.status(404).json({
    message: `sorry"${req.url} does not exist, pls check the route properly`,
  });

module.exports = { routeNotFound };
