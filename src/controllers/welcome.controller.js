import { sendResource } from '../utils/response.js';

// Written async even though it doesn't need to be yet, so every controller
// in this project follows the same shape from day one — swap in a real
// service call here once your own case study has something to fetch.
export const getWelcome = async (req, res) => {
  sendResource(res, { message: 'Hello world!' });
};
