// The response-shaping half of "consistent JSON response/error shape" —
// same convention as the support desk case study's utils/response.js: a
// small set of plain functions every controller calls instead of each
// inventing its own `res.json(...)` shape. The error side of the same
// convention lives in middleware/errorHandler.js.

// A single resource — GET /welcome, GET /something/:id, POST /something, etc.
export const sendResource = (res, data, status = 200) => res.status(status).json({ data });

// A list of resources — GET /something. `meta` is omitted entirely for
// endpoints that don't paginate, rather than sent as `null`/`{}`.
export const sendCollection = (res, data, meta) =>
  res.status(200).json(meta ? { data, meta } : { data });
