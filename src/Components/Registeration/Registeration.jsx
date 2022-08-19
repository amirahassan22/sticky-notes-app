import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import registerStyles from "./registeration.module.scss";
import { useNavigate } from "react-router-dom";
import { Slide } from "react-awesome-reveal";
import { ToastContainer, toast } from "react-toastify";

export default function Registeration() {
  let [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    password: "",
  });
  let navigate = useNavigate();
  let [btnDisabled, setBtnDisabled] = useState(true);
  let [alertMsg, setAlertMsg] = useState("");
  let [waiting, setWaiting] = useState(false);
  let [validateRegData, setValidateRegData] = useState([]);

  function validateData() {
    let schema = Joi.object({
      first_name: Joi.string()
        .pattern(new RegExp(/^[A-z]{3,}$/))
        .min(3)
        .max(10)
        .required(),
      last_name: Joi.string()
        .pattern(new RegExp(/^[A-z]{3,}$/))
        .min(3)
        .max(10)
        .required(),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      age: Joi.number().min(14).max(90),
      password: Joi.string().pattern(new RegExp(/[A-z0-9]{7}/)),
    });
    return schema.validate(user, { abortEarly: false });
  }

  async function SubmitRegisterData(e) {
    e.preventDefault();
    setWaiting(true);
    waiting ? setBtnDisabled(false) : setBtnDisabled(true);
    let { data } = await axios.post(
      "https://route-egypt-api.herokuapp.com/signup",
      user
    );
    setAlertMsg(data.message);
    if (data.message === "success") {
      setWaiting(false);
      navigate("/login");
    } else {
      setWaiting(false);
    }
  }
  function getRegisterData(e) {
    let myUser = { ...user };
    myUser[e.target.name] = e.target.value;
    setUser(myUser);
    setBtnDisabled(false);
    if (validateData().error) {
      setBtnDisabled(true);
      setValidateRegData(validateData().error.details);
    } else {
      setBtnDisabled(false);
      toast.success(`Success`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  function showValidationError(e) {
    if (validateData().error) {
      let tar = validateRegData.filter((msg) => {
        return e.target.name === msg.context.label;
      });
      toast.error(`Invalid ${tar[0].context.label}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.success(`Entered Data is Validated`, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function showAlert() {
    if (alertMsg === "") {
      return "";
    } else if (alertMsg === "success") {
      return <div className="alert alert-success mt-3">{alertMsg}</div>;
    } else {
      return <div className="alert alert-danger mt-3">{alertMsg}</div>;
    }
  }

  return (
    <>
      <ToastContainer className="mt-5" />
      <Slide>
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <form
            onSubmit={SubmitRegisterData}
            className={`${registerStyles.regForm} m-auto p-5 bg-white text-center rounded-3`}
          >
            <h2 className="fw-bold py-3">Sign Up</h2>
            <div className={`row m-auto ${registerStyles.formFields}`}>
              <div className="col-md-6">
                <input
                  onChange={getRegisterData}
                  onBlur={showValidationError}
                  type="text"
                  className="form-control mt-3"
                  name="first_name"
                  placeholder="Enter First Name"
                />
              </div>
              <div className="col-md-6">
                <input
                  onChange={getRegisterData}
                  onBlur={showValidationError}
                  type="text"
                  className="form-control mt-3"
                  name="last_name"
                  placeholder="Enter Last Name"
                />
              </div>
              <div className="col-12">
                <input
                  onChange={getRegisterData}
                  onBlur={showValidationError}
                  type="email"
                  className="form-control mt-3"
                  name="email"
                  placeholder="Enter Email"
                />
              </div>
              <div className="col-12">
                <input
                  onChange={getRegisterData}
                  onBlur={showValidationError}
                  type="number"
                  className="form-control mt-3"
                  name="age"
                  placeholder="Enter Age"
                />
              </div>
              <div className="col-12">
                <input
                  onChange={getRegisterData}
                  onBlur={showValidationError}
                  type="password"
                  className="form-control mt-3"
                  name="password"
                  placeholder="Enter Password"
                />
              </div>
              <div className="text-center">{showAlert()}</div>
              <div className="mt-3">
                <button
                  disabled={btnDisabled}
                  className={`${registerStyles.regBtn} mt-3 w-100 rounded-pill py-2 `}
                >
                  {waiting ? (
                    <div className={registerStyles.spinner}>
                      <div className={registerStyles.rect1}></div>
                      <div className={registerStyles.rect2}></div>
                      <div className={registerStyles.rect3}></div>
                      <div className={registerStyles.rect4}></div>
                      <div className={registerStyles.rect5}></div>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Slide>
    </>
  );
}
