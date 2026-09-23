// Centralised error handler — the single place that turns a thrown/forwarded
// error into a JSON response, instead of a try/catch in every controller.
// Must be registered last, after all routes and other middleware.
//
// Every error response this API sends has the same
// `{ error: { message, details? } }` envelope. Extend this (e.g. to handle
// Prisma error codes, as the support desk case study does) once your own
// case study has a database in front of it.
export default (err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message;

  // An error nothing above recognised is a bug, not a client mistake — log
  // the real thing so it doesn't disappear, but never let its raw message
  // (which might describe internal file paths, stack traces, etc.) reach
  // the client.
  if (status === 500) {
    console.error(err);
    message = 'Internal Server Error';
  }

  const body = { error: { message } };
  if (err.details) {
    body.error.details = err.details;
  }

  res.status(status).json(body);
};
