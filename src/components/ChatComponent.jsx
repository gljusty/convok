import React from "react";
import styled from "styled-components";
import firebase from "firebase/compat/app";
import "animate.css";
import { v4 as uuidv4 } from "uuid";

import ChatMessage from "./ChatMessage";
import ConvoSelector from "./ConvoSelector";

const StyledChatDisplay = styled.div`
  @media only screen and (max-width: 1024px) {
    width: 100vw;
  }
  scroll-behavior: smooth;
  scrollbar-width: none;
  border-radius: 8px;
  width: 35vw;
  height: 50vh;
  margin: 10vh auto 1vh auto;
  overflow-x: auto;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
`;
const StyledChatInput = styled.input`
  margin-top: 10px;
  padding: 2px;
  font-family: "Courier";
  border-radius: 8px;
  width: 35vw;
`;

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.msgRef = React.createRef();
    this.scrollanchor = React.createRef();
    this.state = {
      currentConversation: ``,
      messages: [],
      submittable: false,
      listenerActive: {},
    };
  }

  toggleSubscription = () => {
    //Sets up listener so that new messages automatically get added to state messages array which drives the chat display.
    //Automatically deletes last listener if one exists.
    try {
      this.state.listenerActive();
    } catch (e) {
      // do nothing
    }
    const subscription = this.props.store
      .collection("conversations")
      .doc(this.state.currentConversation.trim())
      .onSnapshot((doc) => {
        if (doc.data().messages) {
          this.setState({ messages: [...doc.data().messages] })
        }
        setTimeout(()=>{
          this.scrollanchor.current.scrollIntoView();
        }, 25)
      });
    this.setState({ listenerActive: subscription });
  };

  updateConversation = (e) => {
    e.preventDefault()
    if (e.type ==="click") {
      this.setState({ currentConversation: e.target.id })
    } else {
      this.setState({ currentConversation: e.target.firstChild.value })
    }
    this.setState({ messages: [] });
    let freshConvoData = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      messages: [],
    };
    //Creates conversation w/ given id if none exists; otherwise references conversation.
    this.props.store
      .collection("conversations")
      .doc(this.state.currentConversation.trim())
      .get()
      .then((results) => {
        if (!results.exists) {
          this.props.store
            .collection("conversations")
            .doc(this.state.currentConversation.trim())
            .set(freshConvoData);
        }
        this.toggleSubscription();
      });
  };

  convoCallback = () => {
    this.setState({ submittable: false });
  };

  updateMessages = () => {
    const messageData = {
      sender: this.props.user.uid,
      photoURL: this.props.user.photoURL,
      text: this.msgRef.current.value,
      id: uuidv4(),
    };
    const currentConvoRef = this.props.store
      .collection("conversations")
      .doc(this.state.currentConversation.trim());
    currentConvoRef
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(messageData),
      })
      .then(() => {
        this.msgRef.current.value = "";
        this.scrollanchor.current.scrollIntoView();
      });
  };

  remoteSetState = (obj) => {
    this.setState(obj);
  };

  handleConvoSubmit = (e) => {
    e.preventDefault();
    this.updateConversation(e);
    this.setState({ submittable: true });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.submittable === true) {
      this.updateMessages();
    }
  };
  render() {
    return (
      <div id="_chat_component">
        <ConvoSelector
          updateConversation={this.updateConversation}
          remoteSetState={this.remoteSetState}
          parentCallback={this.convoCallback}
          handleConvoSubmit={this.handleConvoSubmit}
          currentConversation={this.state.currentConversation}
        />
        <StyledChatDisplay
          id="_chatdisplay"
          className="animate__animated animate__fadeIn"
        >
          <span ref={this.scrollanchor} />
          {
            //scroll anchor is at the top because the entire chat display is reversed and then flipped upside down.
            //This is the only way I could get the demo scroll behavior to work the way I wanted.
            this.state.messages.reverse().map((message) => {
              return (
                <ChatMessage
                  user={this.props.user}
                  message={message}
                  key={message.id}
                />
              );
            })
          }
        </StyledChatDisplay>
        <form onSubmit={this.handleSubmit}>
          <StyledChatInput
            ref={this.msgRef}
            placeholder="send a message!"
          />
        </form>
      </div>
    );
  }
}

export default ChatComponent;
