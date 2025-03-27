import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Ticket, User } from "@acme/shared-models";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

import styles from "./app.module.css";
import Tickets from "./tickets/tickets";
import TicketDetails from "./ticket-details/ticket-details";

const App = () => {
  const [users, setUsers] = useState([] as User[]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false as boolean);
  const location = useLocation();

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoadingUsers(true);
        const data = await fetch("/api/users").then();
        setUsers(await data.json());
      } catch (error) {
        setIsLoadingUsers(false);
        console.log(error);
      } finally {
        setIsLoadingUsers(false);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className={styles["app"]}>
      <div className={styles["container"]}>
        <Link to="/">
          <HomeOutlined style={{ fontSize: "2em" }} />
        </Link>
        <h1>Ticketing App</h1>
      </div>
      <Routes key={location.pathname}>
        <Route path="/" element={<Tickets users={users} />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/:id" element={<TicketDetails users={users} />} />
      </Routes>
    </div>
  );
};

export default App;
