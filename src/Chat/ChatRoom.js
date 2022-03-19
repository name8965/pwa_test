import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;
const ChatRoom = () => {
  const [publicChats, setPublicChats] = useState([]);

  const sockUrl = "https://www.seoultaste.click/ws";
  const [userData, setUserData] = useState({
    sender: "",
    connected: false,
    content: "",
  });
  useEffect(() => {
    console.log("ChatRoomEffect");
    sendMessage();
  }, [userData]);
  const connect = () => {
    let sock = new SockJS(sockUrl);
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError);
    sock.addEventListener("open", () => {
      console.log("Connected to Browser!!!😀");
    });
    sock.addEventListener("message", (message) => {
      console.log("Got this:", message, "😀");
    });
    sock.addEventListener("close", () => {
      console.log("Disconnected to Server😀");
    });
  };
  const userJoin = () => {
    let chatMessage = {
      sender: userData.sender,
      type: "ENTER",
    };
    stompClient.send("/chat/chat.sendMessage", {}, JSON.stringify(chatMessage));
  };
  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(`char`, onMessageReceived, onError);
    userJoin();
  };
  const disConneted = () => {
    stompClient.disconneted(() => {
      console.log("disconnect");
    });
  };
  const onMessageReceived = (payload) => {
    let payloadData = JSON.parse(payload.body);
    console.log("payloadData=", payloadData);
    setPublicChats((prevPublicChats) => [...prevPublicChats, payloadData]);
  };
  const onError = (err) => {
    console.log("Error", err);
  };
  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, content: value });
  };
  const sendMessage = () => {
    console.log(" 메시지 보내기 클릭!");
    if (stompClient) {
      let chatMessage = {
        sender: userData.sender,
        content: userData.content,
        type: "CHAT",
      };
      console.log(" 내가 보낸 메시지 ==", chatMessage);
      stompClient.send(
        "/chat/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
      setUserData({ ...userData, content: "" });
    }
  };
  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, sender: value });
  };

  const registerUser = () => {
    connect();
  };
  return (
    <>
      <div>ChatRoom</div>
      {userData.connected ? (
        <div>
          {publicChats.map((chat, index) => (
            <>
              {chat.type === "JOIN" && <div>{chat.sender}입장</div>}
              {chat.type === "CHAT" && chat.sender !== userData.sender && (
                <div key={index}>
                  <div>
                    <div>{chat.sender}</div>
                    <div>{chat.content}</div>
                  </div>
                </div>
              )}
              {chat.type === "CHAT" && chat.sender === userData.sender && (
                <div key={index}>
                  <div>
                    <div>{chat.sender}</div>
                    <div>{chat.content}</div>
                  </div>
                </div>
              )}
              {chat.type === "LEAVE" && <div>{chat.sender} 나가셨습니다</div>}
            </>
          ))}
          <div>
            <input
              type="text"
              placeholder="enter the message"
              value={userData.message}
              onChange={handleMessage}
            />
            <button onClick={sendMessage}>send</button>
          </div>
        </div>
      ) : (
        <div className="register">
          <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.sender}
            onChange={handleUsername}
          />
          <button type="button" onClick={registerUser}>
            connect
          </button>
          <button type="button" onClick={disConneted}>
            disconnect
          </button>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
