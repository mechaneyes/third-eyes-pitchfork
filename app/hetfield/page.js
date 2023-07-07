"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { MessageList } from "react-chat-elements";
import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";
import VerticalLinearStepper from "/components/Steppers/VerticalLinearStepper";

import "../styles/styles.scss";

export default function Hetfield() {
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [displayTimer, setDisplayTimer] = useState("");
  const [firstInput, setFirstInput] = useState(true);
  const [messageListData, setMessageListData] = useState([
    {
      position: "left",
      type: "text",
      title: "Third Eyes",
      text: "Welcome. What's on your mind?",
      date: new Date(),
    },
  ]);
  const formRef = useRef(null);
  const bottomOfPage = true;

  let promptFormProps = {
    placeholderVisible,
    promptSubmitted,
    spinnerVisible,
    formRef,
    displayTimer,
    bottomOfPage,
  };

  function handleNewMessage(theMessage, position) {
    let title;
    position === "left" ? (title = "Third Eyes") : (title = "Yoo");

    const newMessage = {
      position: position,
      title: title,
      type: "text",
      text: theMessage,
      date: new Date(),
    };

    setMessageListData((prevMessageListData) => [
      ...prevMessageListData,
      newMessage,
    ]);
    console.log("messageListData", messageListData);
  }

  // o————————————————————————————————————o form height —>
  //
  // height of prompt form grows as user types. using a css
  // variable this pushes the chat responses down
  //
  useEffect(() => {
    const root = document.documentElement;
    const promptForm = document.querySelector(".prompt-form");

    function updateResponseContainerHeight() {
      const promptFormHeight = promptForm.offsetHeight;
      root.style.setProperty("--prompt-form-height", `${promptFormHeight}px`);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        updateResponseContainerHeight();
      }
    });
    resizeObserver.observe(formRef.current);

    updateResponseContainerHeight();
  }, []);

  // o————————————————————————————————————o query timer —>
  //
  let totalSeconds = 0;

  const setTime = () => {
    ++totalSeconds;
  };

  // o————————————————————————————————————o placeholder —>
  //
  // typewriter animation on load
  //
  useEffect(() => {
    let i = 0;
    const copy = "start your exploration here: ";
    const speed = 50;
    function writeTyper() {
      if (i < copy.length) {
        document.querySelector(".hello__typewriter").innerHTML +=
          copy.charAt(i);
        i++;
        setTimeout(writeTyper, speed);
      }
    }
    writeTyper();
  }, []);

  // o————————————————————————————————————o focus —>
  //
  // focus on input first keypress & || header click
  //
  const handlePromptFocus = (event) => {
    setPlaceholderVisible(false);
    const focusOnMe = document.querySelector(".prompt-form__inner");
    focusOnMe.focus();

    removeEventListener("keydown", handlePromptFocus);
    document
      .querySelector(".prompt-form__centered")
      .removeEventListener("click", handlePromptFocus);
  };

  useEffect(() => {
    if (firstInput) {
      addEventListener("keydown", handlePromptFocus);
      document
        .querySelector(".prompt-form__centered")
        .addEventListener("click", handlePromptFocus);

      setFirstInput(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // o————————————————————————————————————o api, waves hands —>
  //
  const makeRequest = () => {
    setSpinnerVisible(true);
    setPromptSubmitted(true);
    removeEventListener("keydown", handlePromptFocus);

    const responseTimer = setInterval(setTime, 1000);

    const inputElement =
      document.getElementsByClassName("prompt-form__inner")[0];
    inputElement.blur();

    handleNewMessage(inputElement.innerHTML, "right");

    const newPrompt = {
      prompt: inputElement.innerHTML,
    };

    console.log(inputElement.innerHTML);

    axios
      // .post("http://127.0.0.1:5000/image", newPrompt, {
      //   .post("http://localhost:3001/chat", newPrompt, {
      // .post("https://thirdeyes-flask-dev.vercel.app/chat", newPrompt, {
      .post("https://third-eyes-flask.vercel.app/chat", newPrompt, {
        timeout: 90000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSpinnerVisible(false);
        setPromptSubmitted(false);
        handleNewMessage(response.data, "left");
      })
      .then(() => {
        setDisplayTimer(totalSeconds + "s");
        clearInterval(responseTimer);
        totalSeconds = 0;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // o————————————————————————————————————o trigger request —>
  //
  useEffect(() => {
    const inputElement =
      document.getElementsByClassName("prompt-form__inner")[0];
    if (inputElement) {
      const submitHandler = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          e.preventDefault();
          makeRequest();

          inputElement.removeEventListener("keydown", submitHandler);
          inputElement.innerHTML = "";
          inputElement.focus();
        }
        inputElement.addEventListener("keydown", submitHandler);
      };
      inputElement.addEventListener("keydown", submitHandler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="thirdeyes thirdeyes--chat flex min-h-screen flex-col items-center p-8">
      <section className="chat-container">
        <MessageList dataSource={messageListData} />
        <VerticalLinearStepper />
        <p className="chat-info">
          This is currently a simple chat interface between you and GPT-3.5.
          Coming soon your conversation will be localized around the factually
          correct music info baked into the app.
        </p>
        <Header page="chat" />
      </section>

      <PromptForm {...promptFormProps} />
    </main>
  );
}
