import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion"
import { JackInTheBox,Bounce } from "react-awesome-reveal";
import homeStyles from './Home.module.css';
import  Joi  from 'joi';

export default function Home() {
  let token = localStorage.getItem("token");
  let userID = jwtDecode(token)._id;
  let baseUrl = "https://route-egypt-api.herokuapp.com/";
  let [allNotes, setAllNotes] = useState([]);
  let [addnote, setAddnote] = useState({
    title: "",
    desc: "",
    token,
    userID,
  });
// useEffect(() => {
//  ()
// }, [allNotes])
  // get user notes

  function validateNote(){
    let schema = Joi.object({
      title:Joi.string().min(1) ,
      desc:Joi.string().min(1) 
    })
    let {title,desc} = {...addnote};
    let myNote = {title,desc}
    return schema.validate(myNote,{abortEarly:false});
  }

  async function getUserNotes() {
    let { data } = await axios.get(baseUrl + "getUserNotes", {
      headers: {
        token,
        userID,
      },
    });
    if (data.message === "success") {
      setAllNotes(data.Notes);
    }
    console.log(allNotes);
  }

  useEffect(() => {
    getUserNotes()
  }, []);
  

  async function addNotes(e) {
    e.preventDefault();
    // console.log(validateNote());
    if(validateNote().error){
      toast.error('Note Can not be empty!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    else{
      let { data } = await axios.post(baseUrl + "addNote", addnote);
      if (data.message === "success") {
        document.getElementById("add-form").reset(); 
        getUserNotes();
        toast.success("🦄 New Note Was Added!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // console.log(getUserNotes());
      }
    }
    
  }

  function getNoteDetails({ target }) {
    let myNote = { ...addnote };
    myNote[target.name] = target.value;
    setAddnote(myNote);
  }

  async function deleteNote(NoteID) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(baseUrl + "deleteNote", {
            data: {
              token,
              NoteID
            }
          })
          .then((response) => {
            console.log(response);
            if (response.data.message === "deleted") {
              getUserNotes();
              console.log(getUserNotes())
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          });
      }
    });

    // console.log(data);
  }

  function getNoteID(noteIndex) {
    console.log(allNotes[noteIndex]);
    document.querySelector("#update-note input").value =
      allNotes[noteIndex].title;
    document.querySelector("#update-note textarea").value =
      allNotes[noteIndex].desc;
    setAddnote({
      ...addnote,
      title: allNotes[noteIndex].title,
      desc: allNotes[noteIndex].desc,
      NoteID: allNotes[noteIndex]._id,
    });
  }
  async function editNote(e) {
    e.preventDefault();
    let { data } = await axios.put(baseUrl + "updateNote", addnote);
    console.log(data);
    if (data.message === "updated") {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Updated!", "", "success");
          getUserNotes();
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }
  return (
    <div>
      <div className="add-note pt-5 text-end">
        <motion.button
          className={`btn text-white fw-bold m-auto mt-5 rounded-pill ${homeStyles.addbtn}`}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          whileHover={{
            scale: 1.2,
            transition: { duration: 1 },
          }}
          whileTap={{ scale: 0.9 }}
        >
          Add Note
          <i className="fa-solid fa-file-circle-plus ms-4"></i>
        </motion.button>

        {/* <!-- add Modal --> */}
        <div
          className="modal fade mt-5"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Title
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form id="add-form" onSubmit={addNotes}>
                <div className="modal-body">
                  <input
                    onChange={getNoteDetails}
                    type="text"
                    className="form-control mt-2"
                    placeholder="Title"
                    name="title"
                  />
                  <textarea
                    onChange={getNoteDetails}
                    name="desc"
                    className="form-control mt-2"
                    placeholder="Type your note"
                    rows="10"
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className={`btn ${homeStyles.addbtn} text-white`}
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-plus me-3"></i>
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-xmark me-3"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* update modal */}
      <div
        className="modal fade mt-5"
        id="exampleModalUpdate"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={editNote} id="update-note">
              <div className="modal-body">
                <input
                  onChange={getNoteDetails}
                  type="text"
                  className="form-control mt-2"
                  placeholder="Title"
                  name="title"
                />
                <textarea
                  onChange={getNoteDetails}
                  name="desc"
                  className="form-control mt-2"
                  placeholder="Type your note"
                  rows="10"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  id="update"
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  <i className="fa-regular fa-pen-to-square me-3"></i>
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  <i className="fa-solid fa-xmark me-3"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* add notes */}
      <div className="row g-5 py-5">
        {allNotes !== null ? (
          allNotes.map((note, index) => {
            return (
              <div key={index} className="col-md-4 text-center">
                <JackInTheBox>
                <div className={`${homeStyles.bgColor} px-3 py-4 rounded-3 position-relative`}>
                  <div className={`position-absolute translate-middle ${homeStyles.stampNote}`}><i className="fa-brands fa-creative-commons-sampling rounded-circle p-3 fs-2"></i></div>
                  <div className={`dropstart pe-3`}>
                    <div
                      className="float-end"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-ellipsis-vertical text-white"></i>
                    </div>
                    <div className="clearfix"></div>
                    <Bounce>
                    <ul className={`dropdown-menu ${homeStyles.btnsList}`}>
                      <li className={homeStyles.edit}>
                        <Link
                          onClick={() => {
                            getNoteID(index);
                          }}
                          className="dropdown-item d-flex justify-content-between"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalUpdate"
                          to="#"
                        >
                         <span>Edit</span>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </Link>
                      </li>
                      <li className={homeStyles.delete}>
                        <Link
                          onClick={() => {
                            deleteNote(note._id);
                          }}
                          className="dropdown-item d-flex justify-content-between"
                          to="#"
                        >
                          <span>Delete</span>
                          <i className="fa-regular fa-trash-can"></i>
                        </Link>
                      </li>
                    </ul>
                    </Bounce>
                    
                  </div>
                  <h2>{note.title}</h2>
                  <p className="overflow-hidden">{note.desc}</p>
                </div>
                </JackInTheBox>
                
              </div>
            );
          })
        ) : (
          <div className="text-center w-100 py-4 mt-5 bg-info text-white fw-bold fs-3 rounded-3">
            No Notes Found
          </div>
        )}
      </div>

      {/* toastify */}
      <div>
        <ToastContainer
          className='mt-5'
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}
