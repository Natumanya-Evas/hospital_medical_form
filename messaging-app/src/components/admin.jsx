import { HealthCross } from "@carbon/icons-react";
import { Button, Column, Form, Grid, Stack, TextInput, ToastNotification } from "@carbon/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Admin = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [account, setAccount] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Auto-hide Toast after 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => setAdmin({ ...admin, [e.target.name]: e.target.value });
  const handleChangeLog = (e) => setLogin({ ...login, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(admin),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create account.");

      setNotification({
        kind: "success",
        title: "Account Created",
        subtitle: "Your admin account has been successfully created!",
      });
      setAdmin({ name: "", email: "", username: "", password: "" });
      setAccount(false);
    } catch (error) {
      setNotification({ kind: "error", title: "Error", subtitle: error.message });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid username or password.");
      

      localStorage.setItem("admin", JSON.stringify(data));

      setNotification({
        kind: "success",
        title: "Login Successful",
        subtitle: `Welcome back, ${data.name}!`,
      });

      navigate("/dashboard");
      setLogin({ username: "", password: "" });
    } catch (error) {
      setNotification({ kind: "error", title: "Login Failed", subtitle: error.message });
    }
  };

  const handleAccount = () => setAccount(!account);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "1rem",
          backgroundColor: "#ffffff",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        {notification && (
          <ToastNotification
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.subtitle}
            timeout={5000}
            onClose={() => setNotification(null)}
          />
        )}
        <center   >
        <HealthCross size={30} className="m-5" style={{border:"red solid 1px", borderRadius:"100%",  margin:"5px"}} />
        </center>

        {!account ? (
          <Form onSubmit={handleLogin}>
            <Stack  gap={5} >
            <TextInput
              id="username"
              labelText=""
              placeholder="Enter User Name"
              value={login.username}
              name="username"
              onChange={handleChangeLog}
            />
            <TextInput
              id="password"
              labelText=""
              placeholder="Enter Password"
              type="password"
              value={login.password}
              name="password"
              onChange={handleChangeLog}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <Button type="submit">Sign In</Button>
              <Button kind="ghost" onClick={handleAccount}>
                Create Account
              </Button>
            </div>
            </Stack>
          </Form>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Stack  gap={5} >
            <TextInput
              id="name"
              labelText=""
              name="name"
              value={admin.name}
              placeholder="Enter your name"
              onChange={handleChange}
            />
            <TextInput
              id="email"
              labelText=""
              name="email"
              value={admin.email}
              placeholder="Enter your email"
              onChange={handleChange}
            />
            <TextInput
              id="username"
              labelText=""
              name="username"
              value={admin.username}
              placeholder="Enter your username"
              onChange={handleChange}
            />
            <TextInput
              id="password"
              labelText=""
              name="password"
              type="password"
              value={admin.password}
              placeholder="Enter your password"
              onChange={handleChange}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              <Button type="submit">Create</Button>
              <Button kind="ghost" onClick={handleAccount}>
                Back to Login
              </Button>
            </div>
            </Stack>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Admin;
