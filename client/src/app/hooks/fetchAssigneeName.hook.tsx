import { useEffect, useState } from "react";
import { Ticket, User } from "@acme/shared-models";

const fetchAssigneeName = (
  ticket: Ticket | null,
  isLoadingSet: boolean
): [User | null, boolean] => {
  const [assigneeName, setAssigneeName] = useState<User | null>(null);
  const [isLoadingAssigneeName, setIsLoadingAssigneeName] = useState(false);
  useEffect(() => {
    async function fetchAssigneeName() {
      setIsLoadingAssigneeName(true);
      try {
        if (ticket) {
          const response = await fetch(`/api/users/${ticket?.assigneeId}`);
          const data: User = await response.json();
          setAssigneeName(data);
        }
      } catch (error) {
        setIsLoadingAssigneeName(false);
        console.log(error);
      } finally {
        setIsLoadingAssigneeName(false);
      }
    }

    fetchAssigneeName();
  }, [ticket]);
  return [assigneeName, isLoadingAssigneeName];
};

export default fetchAssigneeName;
