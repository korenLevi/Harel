const API_BASE = "http://127.0.0.1:8000/api";

export const getTickets = async (filters = {}) => {
  const response = await fetch(
    `${API_BASE}/tickets?${new URLSearchParams(filters).toString()}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const createTicket = async (payload) => {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message || data?.error || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const updateTicket = async (payload) => {
  const response = await fetch(`${API_BASE}/tickets`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message || data?.error || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  if (data.cantUpdateTickets.length > 0) {
    alert(`Cannot update tickets: ${data.cantUpdateTickets.join(", ")}`);
  }

  return data;
};
