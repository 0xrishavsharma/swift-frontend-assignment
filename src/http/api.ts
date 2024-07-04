// Creating a single file to organise all API endpoints for better maintainability and readability.

import { api } from "./client";

// Fetch Comments
export const fetchComments = async () => {
  return api.get("/posts/1/comments");
};

// Fetch User
export const fetchUser = async () => {
  return api.get("/user");
};
