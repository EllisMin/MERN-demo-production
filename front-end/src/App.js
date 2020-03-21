import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";

import User from "./user";
import UserAddForm from "./user-add-form";
import "./App.css";

const App = () => {
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    createSocketConnection();
  }, []);

  const createSocketConnection = () => {
    // Socket Connection
    const socket = openSocket(process.env.REACT_APP_FETCH_URL);
    socket.on("user event", data => {
      if (data.action === "add") {
        setUsers(prevUsers => [data.user, ...prevUsers]);
      } else if (data.action === "delete") {
        setUsers(prevUsers =>
          prevUsers.filter(user => user._id !== data.userId)
        );
      }
    });
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_FETCH_URL + "/user", {
        method: "GET"
      });
      if (res.status !== 200) {
        throw new Error("Fetching user failed");
      }
      const resData = await res.json();
      setUsers(resData.users);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async formData => {
    setAddLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_FETCH_URL + "/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          age: formData.age,
          occupation: formData.occupation
        })
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Adding user failed");
      }
      const resData = await res.json();
      const updatedUsers = [resData.user, ...users];
      setUsers(updatedUsers);
    } catch (err) {
      console.log(err);
    }
    setAddLoading(false);
  };

  const handleDelete = async userId => {
    setDeleteLoading(true);
    try {
      const res = await fetch(
        process.env.REACT_APP_FETCH_URL + "/user/" + userId,
        {
          method: "DELETE"
        }
      );
      if (res.status !== 200) {
        throw new Error("Deleting user failed");
      }
      await res.json();
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
    } catch (err) {
      console.log(err); ///
    }
    setDeleteLoading(false);
  };

  return (
    <div className="App">
      <header>
        <h1>MERN Stack App Demo</h1>
        <hr />
      </header>
      <main>
        <h2>Add User:</h2>
        <UserAddForm loading={addLoading} handleAdd={handleAdd} />
        <hr />
        <h2>Users:</h2>
        <ul className="user-list">
          <User name={"Name"} age={"Age"} occupation={"Occupation"} attr />
          {users.length > 0 ? (
            <>
              {users.map(user => (
                <User
                  key={user._id}
                  id={user._id}
                  name={user.name}
                  age={user.age}
                  occupation={user.occupation}
                  handleDelete={handleDelete}
                  loading={deleteLoading}
                />
              ))}
            </>
          ) : null}
        </ul>
      </main>
    </div>
  );
};

export default App;
