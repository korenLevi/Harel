import { getTickets, createTicket, updateTicket } from "./service.js";
let ticketsState = [];
let originalTickets = [];

async function init(filters = {}) {
  try {
    ticketsState = await getTickets(filters);
    console.log('ticketsState',ticketsState);
    
    originalTickets = JSON.parse(JSON.stringify(ticketsState));
    document.getElementById("save-table-changes").hidden = true;
    renderTickets(ticketsState);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
  }
}

function renderTickets(ticketsState) {
  const tableBody = document.querySelector(".table-body");
  tableBody.innerHTML = "";
  ticketsState.forEach((ticket) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${ticket.title}</td>
            <td>${ticket.description}</td>
            <td>
                <select data-id="${ticket.id}" data-field="priority">
                    <option value="low"    ${ticket.priority === "low" ? "selected" : ""}>Low</option>
                    <option value="medium" ${ticket.priority === "medium" ? "selected" : ""}>Medium</option>
                    <option value="high"   ${ticket.priority === "high" ? "selected" : ""}>High</option>
                </select>
            </td>
            <td>
                <select data-id="${ticket.id}" data-field="status">
                    <option value="open"        ${ticket.status === "open" ? "selected" : ""}>Open</option>
                    <option value="in_progress" ${ticket.status === "in_progress" ? "selected" : ""}>In Progress</option>
                    <option value="closed"      ${ticket.status === "closed" ? "selected" : ""}>Closed</option>
                </select>
            </td>
<td>
    ${
      ticket.assigned_user_id
        ? ticket.assigned_user_id
        : `<input 
                type="number" 
                min="1"
                data-id="${ticket.id}" 
                data-field="assigned_user_id" 
                placeholder="Assign user ID"
           />`
    }
</td>        `;
    tableBody.appendChild(row);
  });

  tableBody.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", (e) => {
      handleFieldChange(
        e.target.dataset.id,
        e.target.dataset.field,
        e.target.value,
      );
    });
  });

  // inputs
  tableBody.querySelectorAll("input[data-field]").forEach((input) => {
    input.addEventListener("input", (e) => {
      handleFieldChange(
        e.target.dataset.id,
        e.target.dataset.field,
        e.target.value ? e.target.value : null,
      );
    });
  });
}

function handleFieldChange(id, field, value) {
  const ticket = ticketsState.find((ticket) => ticket.id == id);

  if (ticket) ticket[field] = value;

  document.getElementById("save-table-changes").hidden = _.isEqual(
    ticketsState,
    originalTickets,
  );
}

document
  .getElementById("create-ticket-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const payload = {
      title: form.title.value,
      description: form.description.value,
      priority: form.priority.value,
      assigned_user_id: form.assigned_user_id.value,
      status: form.status.value,
    };
    const data = await createTicket(payload);
    form.reset();
    init();
    console.log("data", data);
  });

document
  .getElementById("save-table-changes")
  .addEventListener("click", async () => {
    await updateTicket(ticketsState);
    init();
  });
document
  .getElementById("filter-tickets")
  .addEventListener("click", async () => {
    const fields = ["status", "priority", "assigned_user_id"];
    const filters = {};

    fields.forEach((field) => {
      const value = document.getElementById(field + "_filter").value;
      if (value) filters[field] = value;
    });

    init(filters);
  });

init();
