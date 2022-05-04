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
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MSGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASURE_ID
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const StyledSignInOut = styled.button`
  border-radius: 8px;
  position: absolute;
  right: 1%;
  top: 1%;
  background-color: black;
  color: whitesmoke;
  padding: 5px;
  cursor: pointer;
`;

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
