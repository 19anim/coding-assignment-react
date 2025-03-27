import { Ticket } from "@acme/shared-models";
import { User } from "@acme/shared-models";
import { Skeleton, Tag, Table, Button, Modal, Input, message, Select } from "antd";
import { Link } from "react-router-dom";
import styles from "./tickets.module.css";
import { useEffect, useState } from "react";

export interface TicketsProps {
  users: User[];
}

const columns = [
  {
    title: "No",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Ticket Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Assignee",
    dataIndex: "assigneeName",
    key: "assigneeName",
  },
  {
    title: "Completed",
    dataIndex: "completed",
    key: "completed",
    render: (completed: boolean) => (
      <Tag color={completed ? "green" : "volcano"}>{completed ? "Done" : "In progress"}</Tag>
    ),
  },
  {
    title: "Detail",
    dataIndex: "id",
    render: (id: number) => (
      <Button type="primary">
        <Link to={`${id}`}>To Detail</Link>
      </Button>
    ),
  },
];

export function Tickets(props: TicketsProps) {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<number>();

  const onSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Create new task successfully",
    });
  };

  const onError = () => {
    messageApi.open({
      type: "error",
      content: "Error in creating. Please try again",
    });
  };

  const filteredTickets = tickets
    .filter((ticket) => (statusFilter ? ticket.completed.toString() === statusFilter : true))
    .filter((ticket) => (assigneeFilter ? ticket.assigneeId === assigneeFilter : true))
    .map((ticket) => {
      const user = props.users.find((user) => user.id === ticket.assigneeId);
      return { ...ticket, assigneeName: user ? user.name : "Not yet assigned" };
    });

  useEffect(() => {
    async function fetchTickets() {
      setIsLoadingTickets(true);
      const data = await fetch("/api/tickets");
      const response = await data.json();
      let tempTickets: Ticket[] = response;

      if (statusFilter) {
        tempTickets = tickets.filter((ticket) => {
          return ticket.completed.toString() === statusFilter;
        });
      }

      if (assigneeFilter) {
        tempTickets = tempTickets.filter((ticket) => {
          return ticket.assigneeId === assigneeFilter;
        });
      }

      setTickets(tempTickets);
      try {
      } catch (error) {
        setIsLoadingTickets(false);
        console.log(error);
      } finally {
        setIsLoadingTickets(false);
      }
    }

    fetchTickets();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      if (newTicketDescription !== "") {
        const response = await fetch("/api/tickets", {
          method: "POST",
          body: JSON.stringify({ description: newTicketDescription }),
        });
        const data = await response.json();
        setTickets([
          ...tickets,
          {
            ...data,
            description: newTicketDescription,
          },
        ]);
        onSuccess();
      } else {
        onError();
      }
    } catch (error) {
      onError();
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputOnChange = (e: any) => {
    setNewTicketDescription(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleAssigneeFilterChange = (value: number) => {
    setAssigneeFilter(value);
  };

  return (
    <div className={styles["tickets"]}>
      {contextHolder}
      <h2>Tickets</h2>
      {!isLoadingTickets ? (
        <>
          <Button style={{ marginBottom: 10 }} onClick={showModal} type="primary">
            Add new task
          </Button>
          <div className={styles["modal-row-custom"]}>
            <h3>Filter: </h3>
            <Select
              placeholder="Status"
              style={{ width: 120 }}
              onChange={handleStatusFilterChange}
              options={[
                { value: "", label: "None" },
                { value: "true", label: "Done" },
                { value: "false", label: "In progress" },
              ]}
            />
            <Select
              placeholder="Assignee"
              style={{ width: 120 }}
              onChange={handleAssigneeFilterChange}
              options={[
                { value: "", label: "None" },
                ...props.users.map((user) => {
                  return { value: user.id, label: user.name };
                }),
              ]}
            />
          </div>
          <Table dataSource={filteredTickets} columns={columns} rowKey="id" />
          <Modal title="Create task" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div>
              <div className={styles["modal-row-custom"]}>
                <h5>New task description: </h5>
                <Input
                  onChange={handleInputOnChange}
                  placeholder="Here is a new task to do something"
                />
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

export default Tickets;
