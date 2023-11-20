import csrfFetch from "./api";

const createLeads = (userData) => {
  return csrfFetch("/api/leads", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export { createLeads };