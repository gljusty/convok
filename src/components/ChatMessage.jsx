import React from "react";
import styled from "styled-components";
import "animate.css";

const StyledChatMessage = styled.p`
  position: relative;
  text-align: left;
  padding: 2px 1vw;
  margin: 2px 1vw;
  border-radius: 8px;
  color: whitesmoke;
  background-color: black;
  width: fit-content;
  max-width: 250px;
  min-height: 20px;
  height: fit-content;
  line-height: 20px;
  overflow-wrap: break-word;
`;

const StyledUserAvatar = styled.img`
  @media only screen and (max-width: 1024px) {
    width: 16px;
    height: 16px;
    position: relative;
    float: right;
    left: 7px;
  }
  display: flex;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  float: right;
  left: 25px;
  top: -5px;
`;

const ChatMessage = (props) => {
  const { text, sender, id, photoURL } = props.message;
  const messageClass = sender === props.user.uid ? "sent" : "received";
  return (
    <div
      style={{ width: `inherit` }}
      className={`message ${messageClass} animate__animated animate__fadeIn`}
      id={id}
    >
      <StyledChatMessage>
        <StyledUserAvatar src={photoURL} title={props.user.displayName} referrerPolicy="no-referrer" />{" "}
        {text}{" "}
      </StyledChatMessage>
    </div>
  );
};

export default ChatMessage;
