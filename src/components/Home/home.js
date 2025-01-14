import { useNavigate } from "react-router-dom";
import "./home.css";

import { GrLinkNext } from "react-icons/gr";

const Home = () => {
  const navigate = useNavigate();

  const onGetStartedToDo = () => {
    navigate("/todolist");
  };

  return (
    <div className="home-main-cont">
      <div className="lower-cont">
        <h2>
          <span>To-Do List</span>
        </h2>
        <h4>Simple tool to organize everything</h4> <br />
        <p>
          One of the most important reasons you should use a to do list is that
          it will help you stay organised. When you write all your tasks in a
          list, they seem more manageable.
        </p>
        <div className="two-btn">
          <div>
            <button onClick={onGetStartedToDo} className="startbtn mr-2">
              Get Started
              <GrLinkNext className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      <div className="right-cont">
        <div className=" left-blank"></div>
      </div>
    </div>
  );
};

export default Home;
