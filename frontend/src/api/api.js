const API_URL = "https://cross-platform-mt.vercel.app/api/users";

const handleResponse = async (response) => {
  const raw = await response.text();
  let parsed;

  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch (err) {
    parsed = raw;
  }

  if (!response.ok) {
    const message = parsed?.message || parsed || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return parsed;
};

export const getUsers = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

export const addUser = async (formData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
};

export const updateUser = async (id, formData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
  return handleResponse(response);
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export { API_URL };
