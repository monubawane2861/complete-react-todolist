import "./signup.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import loginImage from "../../assets/login1.png";

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmEmail, setConfirmemail] = useState("");

  const [confirmPassword, setConfirmpassword] = useState("");

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [error2, setError2] = useState("");

  const onSubmitUserData = async (e) => {
    e.preventDefault();

    if (email !== confirmEmail) {
      setError("(Email do not match)");
      return;
    } else {
      setError("");
    }

    if (password !== confirmPassword) {
      setError2("(Password do not match)");
      return;
    } else {
      setError2("");
    }

    if (password.length < 6) {
      setError2("(Minimun 6 characters.)");
    } else {
      try {
        createUserWithEmailAndPassword(auth, email, password);

        navigate("/");
        setSuccess("");
        setError("");
        setError2("");
      } catch (error) {
        alert("Email Already Used!!!");
      }
    }
  };

  useEffect(() => {
    const unLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home");
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
          <h3 className="heading2"> Signup </h3>

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

            <div className="form-group">
              <label htmlFor="exampleInputEmail2">
                Confirm Email{" "}
                {error && <span style={{ color: "red" }}>{error}</span>}{" "}
              </label>

              <input
                onChange={(e) => setConfirmemail(e.target.value)}
                type="email"
                value={confirmEmail}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                required
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="exampleInputPassword2">
                {" "}
                Confirm Password{" "}
                {error2 && <span style={{ color: "red" }}>{error2}</span>}
              </label>
              <input
                onChange={(e) => setConfirmpassword(e.target.value)}
                type="password"
                value={confirmPassword}
                className="form-control"
                id="exampleInputPassword1"
                required
              />
            </div>
          </div>
          <p className="text-danger"> {error} </p>
          <br />
          <button type="submit" className="btn  w-100">
            Login
          </button>
          <br />
          <br />
          <p className="mylogin">
            {" "}
            already register <Link to={"/"}> SignUp </Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
