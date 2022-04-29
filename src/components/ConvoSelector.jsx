import React, { useState } from "react";
import styled from "styled-components";
import "animate.css";

const StyledConvoSelector = styled.div`
  scrollbar-width: none;
  height: fit-content;
  overflow: scroll;
  position: relative;
  margin: auto auto;
  width: 25vw;
`;

const StyledConvoForm = styled.form`
  width: 20vw;
  margin: auto auto;
`;

const StyledConvoInput = styled.input`
  border-radius: 8px;
  padding: 2px;
`;

const StyledConvoBadgeContainer = styled.div`
  margin: auto auto;
  padding: 5px;
  display: inline-flex;
  min-height: 20px;
`;

const StyledRecentConvoBadge = styled.div`
  color: whitesmoke;
  background-color: slategrey;
  padding: 2px;
  border-radius: 8px;
  width: fit-content;
  margin: 2px;
  cursor: pointer;
`;

const ConvoSelector = (props) => {
  const [recentConversations, setRecentConversations] = useState([]);
  return (
    <StyledConvoSelector>
      <StyledConvoForm
        onSubmit={(e) => {
          const re = [...recentConversations, props.currentConversation.trim()];
          const cl = new Set(re);
          const arr = [...cl];
          setRecentConversations(arr);
          props.handleConvoSubmit(e);
        }}
      >
        <p
          style={{
            color: "whitesmoke",
            padding: 0,
          }}
        >
          Convo ID: <span id="_convoid">{props.currentConversation}</span>
        </p>
        <StyledConvoInput
          value={props.currentConversation}
          onChange={(e) => props.parentCallback(e)}
          placeholder="Enter a conversation ID"
        />
      </StyledConvoForm>
      <StyledConvoBadgeContainer>
        {recentConversations.map((id, index) => {
          return (
            <StyledRecentConvoBadge
              onClick={(e) => {
                const elmnt = document.getElementById("_convoid");
                elmnt.classList.add(
                  "animate__animated",
                  "animate__fadeInUpBig"
                );
                elmnt.addEventListener("animationend", () => {
                  elmnt.classList.remove(
                    "animate__animated",
                    "animate__fadeInUpBig"
                  );
                });
                props.remoteSetState({ currentConversation: id });
                props.updateConversation();
                e.preventDefault();
              }}
              key={index}
            >
              {id}
            </StyledRecentConvoBadge>
          );
        })}
      </StyledConvoBadgeContainer>
    </StyledConvoSelector>
  );
};

export default ConvoSelector;
