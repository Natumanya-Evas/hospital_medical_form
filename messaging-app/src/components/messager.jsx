import { Button, Form, TextArea } from "@carbon/react";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";

const Messager = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState({
    sender: "admin",
    receiver: "",
    content: "",
    customer_id: id,
  });

  const messagesEndRef = useRef(null);

  // Initialize socket
  const socket = io("http://localhost:4000");
  useEffect(() => {
    socket.on("connect", () => console.log("Socket connected"));
    return () => socket.disconnect();
  }, []);

  // Fetch customer info
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await fetch(`http://localhost:4000/customer/${id}`);
        const data = await response.json();
        setPerson(data);
        setMessage((prev) => ({ ...prev, receiver: data.first_name }));
      } catch (error) {
        console.error(error);
        setStatus("Failed to load customer data.");
      }
    };
    fetchPerson();
  }, [id]);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:4000/messages/${id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input
  const handleChange = (e) => {
    setMessage((prev) => ({ ...prev, content: e.target.value }));
  };

  // Send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.content || !message.receiver) return;

    try {
      const response = await fetch("http://localhost:4000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...message, customer_id: Number(id) }),
      });
      if (response.ok) {
        setMessage((prev) => ({ ...prev, content: "" }));
        fetchMessages();
      } else {
        const errorData = await response.json();
        setStatus(errorData.error || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error while sending message.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "80vh",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            backgroundColor: "slateblue",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {person ? `Chat with ${person.first_name} ${person.last_name}` : "Loading..."}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: "1rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.length === 0 && <p style={{ textAlign: "center" }}>No messages yet.</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.sender === "admin" ? "flex-end" : "flex-start",
              }}
            >
              <span
                style={{
                  maxWidth: "70%",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  backgroundColor: msg.sender === "admin" ? "#4b7bec" : "#e0e0e0",
                  color: msg.sender === "admin" ? "white" : "black",
                  wordWrap: "break-word",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Form onSubmit={handleSubmit} style={{ padding: "1rem", borderTop: "1px solid #ddd" }}>
          <TextArea
            value={message.content}
            onChange={handleChange}
            placeholder="Type a message..."
            rows={2}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <Button type="submit" style={{ width: "100%" }}>
            Send
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Messager;
