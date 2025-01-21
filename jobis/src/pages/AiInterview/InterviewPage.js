import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./InterviewPage.module.css";

function InterviewPage() {
  const { secureApiRequest } = useContext(AuthContext);
  const [interviewData, setInterviewData] = useState(null);
  const [questionSet, setQuestionSet] = useState([]);
  const { intro_no, round } = useParams();


    

  return (
    <div className={styles.container}>
      <h1>AI 모의면접 결과</h1>

      </div>
  );
}

export default InterviewPage;
