export const TicketFilter = ({ getTicketsData }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = ["status", "priority", "assigned_user_id"];

    const formData = new FormData(e.target);

    const filters = {};
    fields.forEach((field) => {
      if (formData.get(field)) {
        filters[field] = formData.get(field);
      }
    });

    await getTicketsData(filters);
  };
  return (
    <form onSubmit={handleSubmit} className="ticket-filter-container">
      <select name="status" id="status" >
        <option value="">Select Status</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
      <select name="priority" id="priority">
        <option value="">Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="number"
        name="assigned_user_id"
        id="assigned_user_id"
        placeholder="Assigned User ID"
      />
      <button type="submit">Filter</button>
    </form>
  );
};
