import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";

/* const firebaseConfig = {
  apiKey: "AIzaSyDKe5L6xFJnLBpG9T_uExznyDITwjMitf4",
  authDomain: "chat-app-ec548.firebaseapp.com",
  projectId: "chat-app-ec548",
  storageBucket: "chat-app-ec548.appspot.com",
  messagingSenderId: "551829705138",
  appId: "1:551829705138:web:37659f77549bd9493754ab",
  measurementId: "G-85JPBTSFJ9"
}; */


const firebaseConfig = {
    apiKey: "AIzaSyCvXZ78ok3oioxVk0RbXNxrZILa1KwICxg",
    authDomain: "chat-app-2-7f2da.firebaseapp.com",
    projectId: "chat-app-2-7f2da",
    storageBucket: "chat-app-2-7f2da.appspot.com",
    messagingSenderId: "5321594189",
    appId: "1:5321594189:web:221d1c025ccf676261d304"
};

const app = initializeApp(firebaseConfig);

//const app = initializeApp(firebaseConfig);

export { app };