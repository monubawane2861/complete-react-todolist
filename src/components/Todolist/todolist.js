import React, { useState, useEffect } from "react";
import { ref, set, push, onValue, remove, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import "./todolist.css"; // Optional for styling
import { FaInbox } from "react-icons/fa";
import { MdToday } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { IoTodayOutline } from "react-icons/io5";
import { HiMiniCalendarDays } from "react-icons/hi2";
import { FaBars } from "react-icons/fa";
import { CiBookmarkRemove } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [showInputContainer, setShowInputContainer] = useState(false);
  const [inputFields, setInputFields] = useState({
    title: "",
    description: "",
    priority: "Priority 1",
    date: "",
  });
  const [filter, setFilter] = useState("Inbox");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTodos(currentUser.uid);
      } else {
        setUser(null);
        setTodos([]);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const fetchTodos = (userId) => {
    const todosRef = ref(db, `todos/${userId}`);
    onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTodos = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTodos(loadedTodos);
      } else {
        setTodos([]);
      }
    });
  };

  const handleAddTodo = () => {
    const userId = user.uid;
    const todosRef = ref(db, `todos/${userId}`);
    const newTodoRef = push(todosRef);
    set(newTodoRef, {
      ...inputFields,
      completed: false,
      comments: [],
    });
    setInputFields({
      title: "",
      description: "",
      priority: "Priority 1",
      date: "",
    });
    setShowInputContainer(false);
    if (isSidebarOpen === true) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleDeleteTodo = (id) => {
    const userId = user.uid;
    const todoRef = ref(db, `todos/${userId}/${id}`);
    remove(todoRef);
  };

  const handleEditTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    setInputFields({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      date: todo.date,
    });
    setShowInputContainer(true);
    handleDeleteTodo(id); // Remove old entry before editing
  };

  const handleToggleComplete = (id) => {
    const userId = user.uid;
    const todoRef = ref(db, `todos/${userId}/${id}`);
    const todo = todos.find((t) => t.id === id);
    update(todoRef, { completed: !todo.completed });
  };

  const handleAddComment = (id, comment) => {
    const userId = user.uid;
    const todoRef = ref(db, `todos/${userId}/${id}/comments`);
    const newCommentRef = push(todoRef);
    set(newCommentRef, comment);
  };

  const handleDeleteComment = (todoId, commentId) => {
    const userId = user.uid;
    const commentRef = ref(
      db,
      `todos/${userId}/${todoId}/comments/${commentId}`
    );
    remove(commentRef);
  };

  const filteredTodos = todos
    .filter((todo) => {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date(Date.now() + 86400000)
        .toISOString()
        .split("T")[0];
      if (filter === "Inbox") return !todo.completed;
      if (filter === "Completed") return todo.completed;
      if (filter === "Today") return !todo.completed && todo.date === today;
      if (filter === "Tomorrow")
        return !todo.completed && todo.date === tomorrow;
      if (filter === "Upcoming") {
        if (selectedDate) {
          return todo.date === selectedDate;
        }
        return todo.date > tomorrow;
      }
      return true;
    })
    .filter((todo) =>
      priorityFilter ? todo.priority === priorityFilter : true
    );

  const searchedTasks = filteredTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inboxclick = () => {
    setFilter("Inbox");
    setIsSidebarOpen(!isSidebarOpen);
  };

  const completeclick = () => {
    setFilter("Completed");
    setIsSidebarOpen(!isSidebarOpen);
  };

  const todayclick = () => {
    setFilter("Today");
    setIsSidebarOpen(!isSidebarOpen);
  };

  const tomorrowclick = () => {
    setFilter("Tomorrow");
    setIsSidebarOpen(!isSidebarOpen);
  };

  const upcomingclick = () => {
    setFilter("Upcoming");
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();
  const onBackBtn = () => {
    navigate(-1);
  };
  return (
    <div className="lap-view">
      <div className="todo-main-cont">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className={`sidebar-main-cont ${isSidebarOpen ? "active" : ""}`}>
          <div className="add-cont">
            <div className="top-guest">
              <div className="guest-box"></div>

              <div className="text">Guest</div>
            </div>
            <button
              className="addbtn"
              onClick={() => setShowInputContainer(true)}
            >
              <IoMdAddCircle className="plusAdd mr-1" /> Add task
            </button>
          </div>

          <div className="search-input">
            <input
              type="text"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="m-2 searchinput"
            />
          </div>
          <div className="side-button">
            <div className="side-btn-cont">
              <button onClick={inboxclick}>
                <FaInbox className="icons mr-2 mt-1" />
                Inbox
              </button>
            </div>
            <div className="side-btn-cont">
              <button onClick={completeclick}>
                <MdOutlineTaskAlt className=" icons mr-2 mt-1" /> Completed
              </button>
            </div>
            <div className="side-btn-cont">
              <button onClick={todayclick}>
                <MdToday className="icons mr-2 mt-1" />
                Today
              </button>
            </div>
            <div className="side-btn-cont">
              <button onClick={tomorrowclick}>
                <HiMiniCalendarDays className="icons mr-2 mt-1" />
                Tomorrow
              </button>
            </div>
            <div className="side-btn-cont">
              <button onClick={upcomingclick}>
                <IoTodayOutline className="icons mr-2 mt-1" />
                Upcoming
              </button>
            </div>
          </div>

          <div className="priority-section">
            {filter === "Upcoming" && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
            <select
              onChange={(e) => setPriorityFilter(e.target.value)}
              value={priorityFilter}
            >
              <option value="">All Priorities</option>
              <option value="Priority 1">Priority 1</option>
              <option value="Priority 2">Priority 2</option>
              <option value="Priority 3">Priority 3</option>
              <option value="Priority 4">Priority 4</option>
            </select>
          </div>
        </div>
        <div className="main-cont">
          <div className="add-cont">
            <div className="onback">
              <button className="backBtn" onClick={onBackBtn}>
                <IoArrowBack className="mr-2" /> back
              </button>
            </div>
            <button
              className="addbtn"
              onClick={() => setShowInputContainer(true)}
            >
              <IoMdAddCircle className="plusAdd mr-1" /> Add task
            </button>{" "}
            <br /> <br />
            <h3 className="ml-3">{filter}</h3> <br />
          </div>{" "}
          <br />
          {showInputContainer && (
            <div className="popup-overlay">
              <div className="popup-container">
                <div className="form-container">
                  <input
                    type="text"
                    placeholder="Title"
                    value={inputFields.title}
                    onChange={(e) =>
                      setInputFields({ ...inputFields, title: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    value={inputFields.description}
                    onChange={(e) =>
                      setInputFields({
                        ...inputFields,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                  <div>
                    <select
                      value={inputFields.priority}
                      onChange={(e) =>
                        setInputFields({
                          ...inputFields,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option value="Priority 1">Priority 1</option>
                      <option value="Priority 2">Priority 2</option>
                      <option value="Priority 3">Priority 3</option>
                      <option value="Priority 4">Priority 4</option>
                    </select>
                    <input
                      type="date"
                      value={inputFields.date}
                      onChange={(e) =>
                        setInputFields({ ...inputFields, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="btndiv">
                    <button onClick={handleAddTodo}>Add</button>
                    <button onClick={() => setShowInputContainer(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <ul className="ul-list-cont">
            {searchedTasks.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <div className="save-cont">
                  <div className="title-des-comment-content">
                    <div className="left-cont-check-des">
                      <div className="checkbox-box">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(todo.id)}
                        />
                      </div>
                      <div className="title-des-comment-cont">
                        <p style={{ color: "black" }}>{todo.title}</p>
                        <p>{todo.description}</p>
                        <p>Date: {todo.date}</p>
                        <p>Priority: {todo.priority}</p>
                        <p className="cmnt">
                          Comment:
                          <ul>
                            {todo.comments &&
                              Object.keys(todo.comments).map((commentId) => (
                                <li key={commentId}>
                                  <CiBookmarkRemove
                                    style={{
                                      margin: "8px",
                                      color: "#400947",
                                    }}
                                    onClick={() =>
                                      handleDeleteComment(todo.id, commentId)
                                    }
                                  />
                                  {todo.comments[commentId]}
                                </li>
                              ))}
                          </ul>
                        </p>
                      </div>
                    </div>
                    <div className="functionbtn">
                      <button
                        className="editbtn"
                        onClick={() => handleEditTodo(todo.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        Delete
                      </button>

                      <button
                        className="icon"
                        onClick={() =>
                          handleAddComment(todo.id, prompt("Enter comment:"))
                        }
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
