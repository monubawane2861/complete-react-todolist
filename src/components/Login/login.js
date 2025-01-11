import "./login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import loginImage from "../../assets/login1.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const onSubmitUserData = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("Please Enter Valid Email And Password.");
    }
  };

  useEffect(() => {
    const unLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
      } else {
        navigate("/");
      }
    });

    return () => unLogin();
  }, [navigate]);

  return (
    <div className="login-cont">
      <div className="login-img">
        <img src={loginImage} alt="" />
      </div>

      <div className="login-form">
        <form onSubmit={onSubmitUserData}>
          <h3 className="heading2"> Login </h3>

          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              value={email}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              value={password}
              className="form-control"
              id="exampleInputPassword1"
              required
            />
          </div>
          <p className="text-danger"> {error} </p>
          <br />
          <button type="submit" className="btn  w-100">
            {" "}
            Login{" "}
          </button>
          <br />
          <br />
          <p className="mylogin">
            {" "}
            Don't have an account? <Link to={"/signup"}> SignUp </Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
