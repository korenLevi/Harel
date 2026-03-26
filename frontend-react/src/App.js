import logo from "./logo.svg";
import "./App.css";
import { getTickets } from "./service";
import { useState, useEffect } from "react";
import { TicketsTable } from "./components/TicketsTable";
import { TicketForm } from "./components/TicketForm";
import { TicketFilter } from "./components/TicketFilter";
function App() {
  const [tickets, setTickets] = useState([]); 
  const [originalTickets, setOriginalTickets] = useState([]);
  const getTicketsData = async (filters = {}) => {
    const data = await getTickets(filters);
    setTickets(data);
    setOriginalTickets(data);
  };

  useEffect(() => {
    getTicketsData();
  }, []);

  return (
    <div className="App">
      <TicketForm getTicketsData={getTicketsData}/>
      <TicketFilter
        getTicketsData={getTicketsData}
      />
      <TicketsTable tickets={tickets} setTickets={setTickets} originalTickets={originalTickets} getTicketsData={getTicketsData} />  
    </div>
  );
}

export default App;
