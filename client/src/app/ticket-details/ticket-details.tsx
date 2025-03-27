import { useEffect, useState } from "react";
import styles from "./ticket-details.module.css";
import { useParams } from "react-router-dom";
import { Ticket } from "@acme/shared-models";
import { User } from "@acme/shared-models";
import { Card, Tag, Button, Select, Skeleton } from "antd";
import fetchSingleTicket from "../hooks/fetchSingleTicket.hook";
import fetchAssigneeName from "../hooks/fetchAssigneeName.hook";

/* eslint-disable-next-line */
export interface TicketDetailsProps {
  users: User[];
}

export function TicketDetails(props: TicketDetailsProps) {
  const { id } = useParams();
  const [selectedAssignee, setSelectedAssignee] = useState<number | null | undefined>();
  const [isLoadingSet, setIsLoadingSet] = useState<boolean>(false);
  const [isLoadingUnassign, setIsLoadingUnassign] = useState<boolean>(false);
  const [isLoadingMark, setIsLoadingMark] = useState<boolean>(false);
  const [isLoadingUnmark, setIsLoadingUnmark] = useState<boolean>(false);
  const [ticket, isLoadingTicket] = fetchSingleTicket(
    id,
    isLoadingSet,
    isLoadingMark,
    isLoadingUnmark,
    isLoadingUnassign
  );
  const [assigneeName, setAssigneeName] = useState<string | undefined>();

  useEffect(() => {
    const userName = props.users.find((user) => user.id === ticket?.assigneeId);
    if (userName) {
      setAssigneeName(userName.name);
    }
  }, [props.users, ticket]);

  // useEffect(() => {
  //   setSelectedAssignee(ticket?.assigneeId);
  // }, [ticket]);

  const handleAssignUser = (value: number) => {
    setSelectedAssignee(value);
  };

  const handleSetNewAssignee = async () => {
    setIsLoadingSet(true);
    try {
      if (selectedAssignee !== ticket?.assigneeId) {
        const response = await fetch(`/api/tickets/${ticket?.id}/assign/${selectedAssignee}`, {
          method: "PUT",
        });
      }
    } catch (error) {
      setIsLoadingSet(false);
      console.log(error);
    } finally {
      setIsLoadingSet(false);
    }
  };

  const handlerUnassign = async () => {
    setIsLoadingUnassign(true);
    try {
      const response = await fetch(`/api/tickets/${ticket?.id}/unassign`, {
        method: "PUT",
      });
      setAssigneeName("");
    } catch (error) {
      setIsLoadingUnassign(false);
      console.log(error);
    } finally {
      setIsLoadingUnassign(false);
    }
  };

  const handleMarkCompleteTicket = async () => {
    setIsLoadingMark(true);
    try {
      const response = await fetch(`/api/tickets/${ticket?.id}/complete`, {
        method: "PUT",
      });
    } catch (error) {
      setIsLoadingMark(false);
      console.log(error);
    } finally {
      setIsLoadingMark(false);
    }
  };

  const handleMarkUnCompleteTicket = async () => {
    setIsLoadingUnmark(true);
    try {
      const response = await fetch(`/api/tickets/${ticket?.id}/complete`, {
        method: "DELETE",
      });
    } catch (error) {
      setIsLoadingUnmark(false);
      console.log(error);
    } finally {
      setIsLoadingUnmark(false);
    }
  };

  return ticket ? (
    <div className={styles["container"]}>
      <Card
        title={`#${ticket?.id} ${ticket?.description}`}
        extra={
          <Tag color={ticket?.completed ? "green" : "volcano"}>
            {ticket?.completed ? "Done" : "In progress"}
          </Tag>
        }
        style={{
          width: 500,
        }}
      >
        <>
          <div className={styles["card-row-custom"]}>
            <h3>Current assignee: </h3>
            <p>{assigneeName}</p>
          </div>

          <div className={styles["card-row-custom"]}>
            <h3>Assign to another</h3>
            <Select
              defaultValue={ticket?.assigneeId}
              style={{ width: 120 }}
              onChange={handleAssignUser}
              options={props.users.map((user) => {
                return { value: user.id, label: user.name };
              })}
            />
            <Button
              onClick={handleSetNewAssignee}
              disabled={selectedAssignee === ticket?.assigneeId}
              loading={isLoadingSet}
              type="primary"
            >
              Assign
            </Button>
          </div>

          <div className={styles["card-row-custom"]}>
            <h3>Unassign ticket</h3>
            <Button
              onClick={handlerUnassign}
              disabled={ticket?.assigneeId === null}
              loading={isLoadingUnassign}
              color="danger"
              variant="solid"
            >
              Unassign
            </Button>
          </div>

          <div className={styles["card-row-custom"]}>
            <Button
              onClick={handleMarkCompleteTicket}
              disabled={ticket?.completed}
              loading={isLoadingMark}
              type="primary"
            >
              Mark as completed
            </Button>
            <Button
              onClick={handleMarkUnCompleteTicket}
              disabled={!ticket?.completed}
              loading={isLoadingUnmark}
              type="primary"
            >
              Mark as uncompleted
            </Button>
          </div>
        </>
      </Card>
    </div>
  ) : (
    <Skeleton paragraph={{ rows: 4 }} />
  );
}

export default TicketDetails;
