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
  user-select: none;
`;

const ConvoSelector = (props) => {
  const [recentConversations, setRecentConversations] = useState([]);
  return (
    <StyledConvoSelector>
      <p
          style={{
            color: "whitesmoke",
            padding: 0,
          }}
        >
          Convo ID: <span id="_convoid">{props.currentConversation}</span>
        </p>
      <StyledConvoForm
        onSubmit={(e) => {
          const re = [...recentConversations, e.target.firstChild.value];
          const arr = [...new Set(re)];
          setRecentConversations(arr);
          props.updateConversation(e)
        }}
      >
        <StyledConvoInput
          placeholder="Enter a conversation ID"
        />
      </StyledConvoForm>
      <StyledConvoBadgeContainer>
        {recentConversations.map((id, index) => {
          return (
            <StyledRecentConvoBadge
              onClick={(e) => {
                e.preventDefault();
                props.updateConversation(e)
                }
              }
              key={index}
              id={id}
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
