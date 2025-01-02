import React from "react";
import styles from "./MainPage.module.css";
import main1 from "../../assets/images/main1.png";
import mainSecondAiSelfIntroduction from "../../assets/images/mainSecondAISelfIntroduction.png";
import mainSecondAIMockInterview from "../../assets/images/mainSecondAIMockInterview.png";
import mainSecondAIExpectedQuestions from "../../assets/images/mainSecondAIExpectedQuestions.png";
import selfIntroductionLogo from "../../assets/images/SelfIntroductionLogo.png";
import mockInterviewLogo from "../../assets/images/MockInterviewLogo.png";
import expectedQuestionsLogo from "../../assets/images/ExpectedQuestionsLogo.png";

function MainPage() {
  return (
    <div>
      <div>
        <img src={main1} alt="Site Logo" className={styles.logo} />
      </div>
      <div className={styles.secondContainer}>
        <div className={styles.secondTop}>
          차세대 AI 면접 도우미,
          <br />
          최고의 기술과 서비스를 제공합니다.
        </div>
        <div className={styles.secondMiddleContainer}>
          <div className={styles.secondMiddleBar}>
            <div className={styles.secondMiddleCenterBar}>
              <div className={styles.secondMiddleThree}>
                <div className={styles.secondImg}>
                  <img
                    src={mainSecondAiSelfIntroduction}
                    className={styles.secondImage}
                  />
                </div>
                <div className={styles.secondText}>
                  <div className={styles.secondTextImg}>
                    <img
                      src={selfIntroductionLogo}
                      className={styles.secondImageLogo}
                    />
                  </div>
                  <div>
                    <div className={styles.secondTextTitle}>AI 자기소개서</div>
                    AI가 사용자의 요구에 따라 자기소개서를 개선 및 수정합니다.
                  </div>
                </div>
              </div>
              <div className={styles.secondMiddleThree}>
                {" "}
                <div className={styles.secondImg}>
                  <img
                    src={mainSecondAIMockInterview}
                    className={styles.secondImage}
                  />
                </div>
                <div className={styles.secondText}>
                  <div className={styles.secondTextImg}>
                    <img
                      src={mockInterviewLogo}
                      className={styles.secondImageLogo}
                    />
                  </div>
                  <div>
                    <div className={styles.secondTextTitle}>AI 모의면접</div>
                    AI 모의 면접 시물레이션을 통해 자세, 시선처리등을 피드백 해줍니다.
                  </div>
                </div>
              </div>
              <div className={styles.secondMiddleThree}>
                <div className={styles.secondImg}>
                  <img
                    src={mainSecondAIExpectedQuestions}
                    className={styles.secondImage}
                  />
                </div>
                <div className={styles.secondText}>
                  <div className={styles.secondTextImg}>
                    <img
                      src={expectedQuestionsLogo}
                      className={styles.secondImageLogo}
                    />
                  </div>
                  <div>
                    <div className={styles.secondTextTitle}>AI 면접 예상 질문</div>
                    AI 면접 예상 질문 기능은 지원자의 직무와 관련된 질문을 자동으로 생성하여 준비 시간을 단축해줍니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
