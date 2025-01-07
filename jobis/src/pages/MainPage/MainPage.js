import React, { useEffect, useRef } from "react";
import styles from "./MainPage.module.css";

import main1 from "../../assets/images/main1.png";
import mainSecondAiSelfIntroduction from "../../assets/images/mainSecondAISelfIntroduction.png";
import mainSecondAIMockInterview from "../../assets/images/mainSecondAIMockInterview.png";
import mainSecondAIExpectedQuestions from "../../assets/images/mainSecondAIExpectedQuestions.png";
import selfIntroductionLogo from "../../assets/images/SelfIntroductionLogo.png";
import mockInterviewLogo from "../../assets/images/MockInterviewLogo.png";
import expectedQuestionsLogo from "../../assets/images/ExpectedQuestionsLogo.png";

import img1 from "../../assets/images/slied1.png";
import img2 from "../../assets/images/slied2.png";
import img3 from "../../assets/images/slied3.webp";
import img4 from "../../assets/images/slied4.png";
import img5 from "../../assets/images/slied5.webp";
import img6 from "../../assets/images/slied6.jpg";
import img7 from "../../assets/images/slied7.jpg";
import img8 from "../../assets/images/slied8.jpg";
import img9 from "../../assets/images/wellcometohell.webp";

function MainPage() {
  const images = [img9, img1, img2, img3, img4, img5, img6, img7, img8];
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const totalWidth = slider.scrollWidth / 2; // 슬라이더 전체 길이의 절반 (복제 포함)
    slider.style.setProperty("--total-width", `${totalWidth}px`);
  }, []);

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
                    AI 모의 면접 시뮬레이션을 통해 자세, 시선처리 등을 피드백
                    해줍니다.
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
                    <div className={styles.secondTextTitle}>
                      AI 면접 예상 질문
                    </div>
                    AI 면접 예상 질문 기능은 지원자의 직무와 관련된 질문을
                    자동으로 생성하여 준비 시간을 단축해줍니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.thirdContainer}>
        <div className={styles.thirdTopText}>*실제 체험 및 후기 내용입니다.</div>
        <div className={styles.thirdContainerWrapper}>
          <div className={styles.thirdContainerBoxs} ref={sliderRef}>
            {images.map((image, index) => (
              <div className={styles.thirdBox} key={index}>
                <img src={image} alt={`Slide ${index + 1}`} className={styles.boxImage} />
              </div>
            ))}
            {images.map((image, index) => (
              <div className={styles.thirdBox} key={`copy-${index}`}>
                <img src={image} alt={`Slide Copy ${index + 1}`} className={styles.boxImage} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.thirdBottom}>
          <div className={styles.thirdBottomTextTop}>
            서류 작성부터 면접 대비까지 미리 경험하세요!
          </div>
          <div className={styles.thirdBottomTextBottom}>맞춤형 취업 지원 서비스, JOBIS</div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
