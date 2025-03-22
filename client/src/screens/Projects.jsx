import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js";
import axiosinstance from "../config/axios";
import React, { createRef, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

const Projects = () => {
  const location = useLocation();
 
  const [isSidepannelOpen, setisSidepannelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [users, setusers] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [Message, setMessage] = useState('')

  const [project, setproject] = useState(location.state.project);
  const MessageBox= useRef();

  const {user} = useContext(UserContext);

  useEffect(() => {
    initializeSocket(project._id);

    receiveMessage('project-message', (data) => {
      console.log(data);
      apppendIncomingMessage(data);
    });

    
    axiosinstance.get(`/projects/get-project/${project._id}`).then((res)=>{
      setproject(res.data.project)
      
    })

    axiosinstance
      .get("/users/all")
      .then((res) => {
        setusers(res.data.users);
        const userMap = {};
        res.data.users.forEach((user) => {
          userMap[user._id] = user.email;
        });
        setUsersMap(userMap);

        // Initialize project collaborators if they exist
        if (project && project.users && Array.isArray(project.users)) {
          setSelectedUserId(project.users);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const handleSendMessage = () => {
    sendMessage("project-message", { message: Message ,
      sender: user,
    });
    apppendOutgoingMessage({message:Message});

    setMessage("");
  };

  const handleUserSelect = (user) => {
    setTempSelectedUsers((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (selectedUser) => selectedUser._id === user._id
      );

      if (isAlreadySelected) {
        return prevSelected.filter(
          (selectedUser) => selectedUser._id !== user._id
        );
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const handleAddCollaborator = async () => {
    if (tempSelectedUsers.length > 0) {
      // Filter out users that are already collaborators
      const newCollaborators = tempSelectedUsers.filter(
        (user) => !collaborators.some((collab) => collab._id === user._id)
      );

      if (newCollaborators.length > 0) {
        const updatedCollaborators = [...collaborators, ...newCollaborators];
        setCollaborators(updatedCollaborators);

        // Create an array of user IDs for the API
        const userIds = updatedCollaborators.map((user) => user._id);
        setSelectedUserId(userIds);

        try {
          const res = await axiosinstance.put(`/projects/add-user`, {
            projectId: project._id,
            users: userIds, 
          });
          console.log("API response:", res.data);
        } catch (error) {
          console.error("Error adding users:", error);
          console.error("Error response:", error.response?.data);
        }
      }

      setIsModalOpen(false);
      setTempSelectedUsers([]);
    }
  };

  const apppendIncomingMessage = (message) => {
   
   
    const messageEl= document.createElement("div");
    messageEl.classList.add("incomming","message","max-w-56","flex","flex-col","p-2","bg-slate-50","w-fit","rounded-md");
    messageEl.innerHTML=`
    <small class="opacity-65 text-xs">${message.sender.email}</small>
    <p class="text-sm">${message.message}</p>
    `
    MessageBox.current.appendChild(messageEl);
  }

  const apppendOutgoingMessage = (message) => {
    const messageEl= document.createElement("div");
    messageEl.classList.add("outcomming","ml-auto","max-w-56","flex","flex-col","p-2","bg-slate-50","w-fit","rounded-md");
    messageEl.innerHTML=`
    <small class="opacity-65 text-xs">${user.email}</small>
    <p class="text-sm">${message.message}</p>
    `
    MessageBox.current.appendChild(messageEl);
  }

  
  return (
    <>
      <main className="h-screen w-screen flex">
        <section className="left relative h-full min-w-80 flex flex-col bg-slate-300">
          <header className="flex justify-between w-full items-center bg-slate-100 px-4 p-2">
            <button
              className="flex gap-2 items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="ri-add-fill mr-1"></i>
              <p className="text-sm">Add collaborator</p>
            </button>
            <button
              onClick={() => setisSidepannelOpen(!isSidepannelOpen)}
              className="p-2"
            >
              <i className="ri-group-fill"></i>
            </button>
          </header>

          {/* conversations area */}
          <div className="flex-grow flex flex-col">
            {/* message box  */}
            <div
            ref = {MessageBox}
            className="message-box flex-grow flex flex-col gap-2 p-1">
              
            </div>

            {/* input area */}
            <div className="w-full flex">
              <input
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={Message}
                placeholder="enter your message"
                className="p-2 px-2 border-none outline-none flex-grow"
              />
              <button
              onClick={handleSendMessage}
              className=" px-5 bg-slate-900 text-white">
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </div>

          <div
            className={`sidePanel w-full h-full  gap-2 bg-slate-50 flex flex-col 
                     absolute transition-all ${
                       isSidepannelOpen ? "translate-x-0" : "-translate-x-full"
                     } top-0 `}
          >
            <header className="flex justify-between items-center p-2 px-3 bg-slate-200">
              <h1 className="font-medium text-lg">Collaborators</h1>
              <button
                className="p-2"
                onClick={() => setisSidepannelOpen(!isSidepannelOpen)}
              >
                <i className="ri-close-line"></i>
              </button>
            </header>

            {/* users  */}

            <div className="flex flex-col   gap-2 ">
              {project.users && project.users.map((user)=>(
                <div className=" cursor-pointer p-2 flex gap-2 items-center hover:bg-slate-300">
                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 txt-white bg-slate-400 text-white ">
                  <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className="font-medium text-base">{user.email}</h1>
              </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            {/* Close button at top right */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            <div className="max-h-96 overflow-auto ">
              <h2 className="text-lg font-bold mb-4">Select Users</h2>
              <p className="text-sm text-gray-500 mb-2">
                You can select multiple users
              </p>
              <ul className="space-y-2">
                {users.map((user) => (
                  <li
                    key={user._id}
                    className={`p-2 rounded-md cursor-pointer flex items-center ${
                      tempSelectedUsers.some(
                        (selectedUser) => selectedUser._id === user._id
                      )
                        ? "bg-blue-200 hover:bg-blue-300"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center mr-2">
                      <i className="ri-user-fill"></i>
                    </div>
                    <span>{user.email}</span>
                    {tempSelectedUsers.some(
                      (selectedUser) => selectedUser._id === user._id
                    ) && (
                      <i className="ri-check-line ml-auto text-green-600"></i>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex gap-2">
              {tempSelectedUsers.length > 0 ? (
                <button
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={handleAddCollaborator}
                >
                  Add {tempSelectedUsers.length} Collaborator
                  {tempSelectedUsers.length > 1 ? "s" : ""}
                </button>
              ) : (
                <button
                  className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              )}
            </div>

            {/* Show selected users count */}
            {tempSelectedUsers.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {tempSelectedUsers.length} user
                {tempSelectedUsers.length > 1 ? "s" : ""} selected
              </div>
            )}

            {/* Show selected collaborators */}
            {/* {collaborators.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Current Collaborators:</h3>
                <div className="flex flex-wrap gap-2">
                  {collaborators.map((collab) => (
                    <span
                      key={collab._id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                    >
                      {collab.email || usersMap[collab._id] || "Unknown User"}
                      
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
