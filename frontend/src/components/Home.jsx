import React from "react";
import Chathead from "./Chathead";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Sidebar from "./Sidebar";
import { useRef } from "react";
import gsap from "gsap";
import TypingLoader from "./Loader";
import { useGSAP } from "@gsap/react";
import {
  setChats,
  selectChat,
  addAiMessage,
  addUserMessage,
  newChat,
} from "../store/Reducers";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats);
  const activeChatId = useSelector((state) => state.chats.activeChatId);
  const [messages, setmessages] = useState([]);
  const [socket, setsocket] = useState(null);
  const [loading, setloading] = useState(false);

  const [isBoolean, setisBoolean] = useState(false);
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const getMessageHandler = async (chatId) => {
    if (chats.chats.length > 0 && chatId) {
      try {
        const response = await axios.get(
          `https://novachat-tclo.onrender.com/messages/${chatId}`,
          { withCredentials: true }
        );
        setmessages(
          response.data.messages.map((m) => ({
            type: m.role === "user" ? "user" : "ai",
            content: m.content,
          }))
        );
        setTimeout(scrollToBottom, 0);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const newChatCreator = async () => {
    let title = prompt("Enter chat name:");
    if (title) title = title.trim();
    if (!title) return;
    try {
      const response = await axios.post(
        "https://novachat-tclo.onrender.com/chat",
        { title },
        {
          withCredentials: true,
        }
      );
      if (response.data.chat) {
        dispatch(newChat(response.data.chat));
      }
      getMessageHandler(response.data.chat._id);
    } catch (error) {
      console.error("Error creating new chat:", error);
      alert("Failed to create new chat. Please try again.");
    }
  };
  const getAllChats = async () => {
    try {
      var response = await axios.get(
        "https://novachat-tclo.onrender.com/getchats",
        {
          withCredentials: true,
        }
      );
      dispatch(setChats(response.data.chats.reverse()));
      dispatch(selectChat(response?.data?.chats[0]?._id));
      if (!activeChatId) return;
      else getMessageHandler(activeChatId);
    } catch (error) {
      console.log(error);
    }
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getMessageHandler(activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    getAllChats();
    const server = io("https://novachat-tclo.onrender.com", {
      withCredentials: true,
    });
    setsocket(server);
    server.on("ai-response", (messagepayload) => {
      setmessages((prev) => [...prev, { type: "ai", content: messagepayload }]);
      dispatch(addAiMessage(activeChatId, messagepayload));
      setloading(false);
    });

    return () => {
      console.log("socket disconnected");
      server.disconnect();
    };
  }, []);

  const sendMessageHandler = async (message) => {
    const prevmessage = [
      ...messages,
      {
        type: "user",
        content: message.message,
      },
    ];
    setmessages(prevmessage);

    reset();
    dispatch(addUserMessage(activeChatId, message.message));
    getMessageHandler(activeChatId);

    socket.emit("ai-message", {
      chat: activeChatId,
      content: message.message,
    });
    setTimeout(scrollToBottom, 0);
    setloading(true);
  };
  const hiddenbar = useRef(null);
  const childref = useRef(null);
  const sideOpener = () => {
    const ref2 = childref.current;

    if (childref.current) {
      gsap.to(ref2, { left: 0 });
    }
    if (hiddenbar.current) {
      gsap.to(hiddenbar.current, {
        display: "flex",
      });
    }
  };
  const sideCloser = () => {
    if (childref.current) {
      gsap.to(childref.current, { left: "-350px" });
    }
    if (hiddenbar.current) {
      gsap.to(hiddenbar.current, {
        display: "none",
      });
    }
  };

  const newchat =
    chats?.chats?.length > 0 && messages?.length > 0 ? (
      messages?.map((message) => {
        return (
          <div
            key={message.id}
            className={
              message.type === "user"
                ? `w-full flex flex-col gap-1 justify-start items-end  mb-4 md:text-[15px]`
                : `w-full flex flex-col gap-1 justify-end  items-start  mb-4 md:text-[15px]`
            }
          >
            {message.type === "ai" ? <div ref={messagesEndRef} /> : <div></div>}
            <span
              className={
                message.type === "user"
                  ? `bg-[#28263B] rounded-t-xl rounded-bl-xl p-6 md:p-3 max-w-[80%]  text-white py-3 md:py-1.5 flex items-center justify-center`
                  : `bg-[#560FAB] rounded-t-xl rounded-br-xl p-6 md:p-3 max-w-[80%]  text-white py-3 md:py-1.5 flex items-center justify-center`
              }
            >
              {message.content}
            </span>
            <h1 className="text-[#BE86FF] text-sm">
              {message.type === "user" ? "user" : "NovaChat"}
            </h1>

            {message.type === "user" ? (
              <div ref={messagesEndRef} />
            ) : (
              <div></div>
            )}
          </div>
        );
      })
    ) : chats?.chats?.length > 0 ? (
      <div className="w-full flex  h-[82%] text-4xl items-center justify-center">
        <h1 className="text-center text-white font-semibold">
          Hello , How can i Help you?
        </h1>
      </div>
    ) : (
      <div className="w-full flex  h-[82%] text-4xl items-center justify-center">
        <h1 className="text-center text-white font-semibold">
          No chats found. Create one!{" "}
          <h5 className="text-xl">
            Click the icon in the right corner to start a new chat.{" "}
            <i className="ri-arrow-right-up-line text-[#BE86FF] text-2xl"></i>
          </h5>
        </h1>
      </div>
    );

  return (
    <div className=" w-screen h-screen bg-[#020018] flex md:mr-0 md:ml-auto items-center justify-center flex-col">
      <Sidebar ref={childref} />
      <div
        onClick={sideCloser}
        ref={hiddenbar}
        className="w-full h-screen absolute bg-black opacity-20 hidden z-10"
      ></div>

      <div className="w-full md:w-[40%] h-[8%]  bg-[#020018]  flex items-center justify-between py-10 md:py-8 px-4 text-2xl text-white">
        <i
          onClick={sideOpener}
          className="ri-menu-2-line bg-[#31224D] p-2 rounded-md"
        ></i>
        <h1 className="text-[#BE86FF] text-3xl font-bold">NovaChat</h1>

        <i
          onClick={newChatCreator}
          className="ri-edit-box-line bg-[#31224D] p-2 rounded-md"
        ></i>
      </div>
      <div className=" w-full md:w-[40%] h-[82%] p-4 text-2xl gap-3 flex flex-col overflow-auto hide-scrollbar overflow-y-scroll ">
        {newchat}
        {chats?.chats?.length > 0 ? newChat : ""}
        {loading && <TypingLoader />}
      </div>
      {chats?.chats.length > 0 ? (
        <div className="w-full md:w-[50%]   flex flex-col justify-end  p-3 md:p-3 ">
          <form
            onSubmit={handleSubmit(sendMessageHandler)}
            className="flex items-center bg-[#28263B] rounded-xl  self-center justify-center w-full md:w-[80%] p-1 sm:pt-2"
          >
            <input
              {...register("message", { required: true })}
              className="p-2 w-full  bg-[#28263B] text-2xl md:text-[15px] font-semibold rounded-4xl outline-0 text-[#BE86FF] focus:bg-transparent focus:outline-none focus:ring-0"
              type="text"
              id=""
              placeholder="Ask Anything...."
            />
            {errors?.message && alert("field is empty")}
            <button
              type="submit"
              className="w-14 md:w-8 md:h-8 h-12 bg-[#560FAB] rounded-full text-2xl md:text-sm  p-2 md:p-1 m-1 md:flex md:items-center md:justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M10.3009 13.6949L20.102 3.89742M10.5795 14.1355L12.8019 18.5804C13.339 19.6545 13.6075 20.1916 13.9458 20.3356C14.2394 20.4606 14.575 20.4379 14.8492 20.2747C15.1651 20.0866 15.3591 19.5183 15.7472 18.3818L19.9463 6.08434C20.2845 5.09409 20.4535 4.59896 20.3378 4.27142C20.2371 3.98648 20.013 3.76234 19.7281 3.66167C19.4005 3.54595 18.9054 3.71502 17.9151 4.05315L5.61763 8.2523C4.48114 8.64037 3.91289 8.83441 3.72478 9.15032C3.56153 9.42447 3.53891 9.76007 3.66389 10.0536C3.80791 10.3919 4.34498 10.6605 5.41912 11.1975L9.86397 13.42C10.041 13.5085 10.1295 13.5527 10.2061 13.6118C10.2742 13.6643 10.3352 13.7253 10.3876 13.7933C10.4468 13.87 10.491 13.9585 10.5795 14.1355Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full p-11"></div>
      )}
    </div>
  );
};

export default Home;
