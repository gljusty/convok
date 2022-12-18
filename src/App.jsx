import React from "react";
import "./App.css";
import styled from "styled-components";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/analytics";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatComponent from "./components/ChatComponent";

firebase.initializeApp({
  apiKey: "AIzaSyCSVtPTWq0fR6K3vDBdLm5uYQYY1O8Qw8Q",
  authDomain: "glassy-outcome-346301.firebaseapp.com",
  projectId: "glassy-outcome-346301",
  storageBucket: "glassy-outcome-346301.appspot.com",
  messagingSenderId: "312850964340",
  appId: "1:312850964340:web:c95423fbf4f0143c199621",
  measurementId: "G-H3014VMSDV"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const StyledSignInOut = styled.button`
  border-radius: 8px;
  position: absolute;
  right: 1%;
  top: 1%;
  background-color: aquamarine;
  color: black;
  font-weight: bold;
  padding: 5px;
  cursor: pointer;
`

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((results) => {
      const user = results.user;
      let docData = {
        username: user.displayName,
        email: user.email
      };

      //add user to db only if user doesnt already exist
      firestore
        .collection("users")
        .doc(results.user.uid)
        .get()
        .then((results) => {
          if (!results.exists) {
            firestore
              .collection("users")
              .doc(user.uid)
              .set(docData)
              .catch((e) => console.log(`error: `, e));
          }
        });
    });
  };
  return (
    <>
      <StyledSignInOut onClick={signInWithGoogle}>
        Sign in with Google
      </StyledSignInOut>
    </>
  );
};

const SignOut = () => {
  return (
    auth.currentUser && (
      <StyledSignInOut
        className="sign-out"
        onClick={() => {
          auth.signOut();
        }}
      >
        Sign Out
      </StyledSignInOut>
    )
  );
};

const ToggleShowChatButton = () => {
  const toggleRef = React.createRef(true);
  return (
      <button style={{height: `20px`, width: `60px`,}} onClick={()=>{
          const d = document.querySelector('#_chat_component')
          if (toggleRef.current === false) {
            d.style.display = ""
            toggleRef.current = true;
          }
          else {
            d.style.display = "none"
            toggleRef.current = false;
          }
    }}>toggle</button>
    )
  }
    


const App = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
        <h1
          style={{
            color: `whitesmoke`,
            float: `left`,
            left: `1vw`,
            top: `1vh`,
            fontSize: `4em`,
            position: `absolute`,
          }}
        >
          Convok
        </h1>
        <SignOut user={user} />
        <ToggleShowChatButton />
      <section>
        {user ? <ChatComponent user={user} store={firestore} /> : <SignIn />}
      </section>
    </div>
  );
};

export default App;
