const mock400Error = (req, res, ctx) =>
  res.once(ctx.status(400), ctx.json({ message: "an error has occurred" }));

export default mock400Error;