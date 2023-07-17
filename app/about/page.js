"use client";

import { useEffect, useRef } from "react";

import PromptForm from "/components/PromptForm/PromptForm";
import Header from "/components/Header/Header";

import "../styles/styles.scss";

export default function Page() {
  const formRef = useRef(null);

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

  return (
    <main className="thirdeyes thirdeyes--about flex min-h-screen flex-col items-center p-8">
      <PromptForm formRef={formRef} />
      <Header page="about" />

      <section className="introduction introduction--visible">
        <div className="introduction__description">
          <p>
            Welcome. I&apos;m Ray Weitzenberg. Aframe is my first experiment
            utilizing AI to generate music-focused information.
          </p>
          <p>
            While I may not hold the title of data scientist (yet!), the journey
            of creating Aframe has allowed me to gain invaluable experience
            with a number of technologies in the ecosystem. I&apos;m currently
            immersed in the world of Python, and I&apos;m eager to delve deeper
            into data science once I&apos;ve tamed the snake.
          </p>
          <p>
            Some technologies employed here include OpenAI&apos;s GPT-4, GPT-3.5
            and Embeddings models, Langchain, the Stability.ai API, Pinecone,
            Next.js and Material Design.
          </p>
          <p>
            The content generated in Aframe stems from a{" "}
            <a href="https://www.kaggle.com/datasets/nolanbconaway/pitchfork-data">
              dataset of 18,393 Pitchfork reviews
            </a>{" "}
            and was built during the winter of 2016-2017. Although it might not
            be the most current data, it&apos;s been a fantastic starting point
            for this project. Under construction is a dataset incorporating even
            more, more varied, and the most recent data to leverage in Third
            Eyes.
          </p>
          {/* <p>
            For a bit of a technical deep dive into the making of Aframe,
            check out{"  "}
            <a href="https://winterwerk.one/posts/thirdeyes-mvp">
              this post on WinterWerk
            </a>
            .
          </p> */}
          <p>
            Any and all feedback is welcome:{" "}
            <a href="mailto:ray@mechaneyes.com">ray@mechaneyes.com</a>
          </p>
        </div>
      </section>
    </main>
  );
}
