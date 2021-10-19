export default function(req, res, next) {
  const paths = ["admin"];

  if (paths.includes(req.originalUrl.split("/")[1])) {
    // Will trigger the "traditional SPA mode"
    res.spa = true;
  }
  next();
}
