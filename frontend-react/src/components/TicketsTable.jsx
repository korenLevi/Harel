import React from "react";
import _ from "lodash";
import { updateTickets } from "../service";
export const TicketsTable = ({
  tickets,
  setTickets,
  originalTickets,
  getTicketsData,
}) => {
  const handleUpdateTicket = async (id, field, value) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, [field]: value } : ticket,
      ),
    );
  };
  const handleSaveChanges = async () => {
    await updateTickets(tickets);
    await getTicketsData();
  };
  return (
    <div className="tickets-table-container">
      <button
        onClick={() => handleSaveChanges()}
        disabled={_.isEqual(tickets, originalTickets)}
      >
        Save Changes
      </button>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned User ID</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.description}</td>
              <td>
                <select
                  name="priority"
                  id="priority"
                  value={ticket.priority}
                  onChange={(e) =>
                    handleUpdateTicket(ticket.id, "priority", e.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </td>
              <td>
                <select
                  name="status"
                  id="status"
                  value={ticket.status}
                  onChange={(e) =>
                    handleUpdateTicket(ticket.id, "status", e.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={!!ticket.assigned_user_id  ? ticket.assigned_user_id : ""}
                  placeholder="Assign user ID"
                  onChange={(e) =>
                    handleUpdateTicket(
                      ticket.id,
                      "assigned_user_id",
                      e.target.value,
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
