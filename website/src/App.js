import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import axios from "axios";
import "./App.css";

const User = (props) => {
  const {user} = props;
  return (
    <div className="user">
      <div>Name: {user.username}</div>
      <div>Email: {user.email}</div>
    </div>
  );
};

const UsersList = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/')
      .then((response) => {
        console.log(response);
        // Timeout to accentuate loading time
        setTimeout(() => {
          setUsers(response.data);
        }, 500);
      })
      .catch(() => {
        setUsers(null);
      });
  }, []);

  return (
    <div className="user-list">
      <h2>Users</h2>
      {users === undefined
        ? "FETCHING"
        : users && users.map((user) => <User key={user.url} user={user}/>)}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <UsersList />
    </div>
  );
}

export default App;
