import { createTicket } from "../service";

export const TicketForm = ({ getTicketsData }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      status: formData.get("status"),
      assigned_user_id: formData.get("assigned_user_id"),
    };
    
    await createTicket(payload);
    e.target.reset();
    getTicketsData();
  };
  return (
    <div>
      <h1>Ticket Form</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required/>
        <input type="text" name="description" placeholder="Description" required/>
        <select name="priority" id="priority" required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select name="status" id="status" required>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <input
          type="number"
          name="assigned_user_id"
          placeholder="Assigned User ID"
          min={1}
        />
        <button type="submit">Create Ticket</button>
      </form>
    </div>
  );
};
