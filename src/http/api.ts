// Creating a single file to organise all API endpoints for better maintainability and readability.

import { api } from "./client";

// Fetch Comments
export const fetchComments = async () => {
  return api.get("/comments");
};

// Auth
export const login = async () => {
  return api.get("/users/1");
};
