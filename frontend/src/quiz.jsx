import React, { useEffect, useState } from "react";
import Question from "./components/Question";
import logo from '/icon.png';
import toast from "react-hot-toast";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import questions from './components/questions.json';
import { useAnswers } from "./AnswersContext";

function Quiz() {
  const [question, setquestion] = useState(1);
  const { answers, setAnswers } = useAnswers();
  const navigate = useNavigate();

  useEffect(()=>{
    console.log(questions);
  }, [])

  const handleNext = () => {
    if (answers[question - 1]) {
      setquestion((prevquestion) => Math.min(prevquestion + 1, 21));
    } else {
      toast.error('Please select an option');
    }
  };

  const showSideBar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
  };

  const hideSideBar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
  };

  const handlePrev = () => {
    setquestion((prevquestion) => Math.max(prevquestion - 1, 1));
  };

  const chooseAnswer = (value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[question - 1] = value;
      return newAnswers;
    });
  };

  const submitFunc = () => {
    console.log("Submitted answers:", answers); // This will log the answers
    toast.success("Results are submitted!");
    // <Navigate to='/results'/>
    navigate('/results')
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <ul className="sidebar">
          <li><IoMdClose onClick={hideSideBar} className="closemenu" /></li>
          <li><a className="gradient-text" href="/">Home</a></li>
          <li><a className="gradient-text" href="/quiz">Quiz</a></li>
          <li><a className="gradient-text" href="/about">About</a></li>
        </ul>
        <div className="nav-items">
          <Link to='/' className="gradient-text">Home</Link>
          <Link to='/quiz' className="gradient-text">Quiz</Link>
          <Link to='/about' className="gradient-text">About</Link>
        </div>
        <IoMenu onClick={showSideBar} className="mobile-view" />
      </div>

      <div className="question-container-wrapper">
      <div className="question-content">
        {questions.map((q, index) => (
          question==(index+1) && (<div className="slide" key={index}>
            <Question
              handlePrev={handlePrev}
              handleNext={handleNext}
              question={q.title}
              choosenOption={chooseAnswer}
              buttonText={index === questions.length - 1 ? 'Submit' : 'Next'}
              options={q.options}
              answers={answers}
              questionNum={question}
              submitFunc={submitFunc}
            />
          </div>)
        ))}
      </div>
    </div>
    </div>
  );
}

export default Quiz;
