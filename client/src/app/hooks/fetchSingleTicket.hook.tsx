import { useEffect, useState } from "react";
import { Ticket } from "@acme/shared-models";

const fetchSingleTicket = (
  id: string | undefined,
  isLoadingSet: boolean,
  isLoadingMark: boolean,
  isLoadingUnmark: boolean,
  isLoadingUnassign: boolean
): [Ticket | null, boolean] => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  useEffect(() => {
    async function fetchTicket() {
      setIsLoadingTicket(true);
      try {
        const response = await fetch(`/api/tickets/${id}`);
        const data: Ticket = await response.json();
        setTicket(data);
      } catch (error) {
        setIsLoadingTicket(false);
        console.log(error);
      } finally {
        setIsLoadingTicket(false);
      }
    }

    fetchTicket();
  }, [isLoadingSet, isLoadingMark, isLoadingUnmark, isLoadingUnassign]);
  return [ticket, isLoadingTicket];
};

export default fetchSingleTicket;
