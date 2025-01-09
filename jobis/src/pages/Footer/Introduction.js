import React, { useEffect } from "react";
import styles from "./Introduction.module.css";
import img1 from "../../assets/images/introduction/22.jpg";
import img2 from "../../assets/images/introduction/06.jpg";
import img3 from "../../assets/images/introduction/02.jpg";

function Introduction() {
  // 페이지가 열릴 때 최상단으로 스크롤 이동
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  // 특정 섹션으로 부드럽게 스크롤 이동하는 함수
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start", // 섹션의 상단으로 스크롤
      });
    }
  };

  // 맨 위로 이동하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      {/* 네비게이션 탭 */}
      <nav className={styles.nav}>
        <button onClick={scrollToTop} className={styles.scrollToTopButton}>
          맨 위로
        </button>
        <button onClick={() => scrollToSection("company")} className={styles.navItem}>
          회사소개
        </button>
        <button onClick={() => scrollToSection("appearance")} className={styles.navItem}>
          회사모습
        </button>
        <button onClick={() => scrollToSection("business")} className={styles.navItem}>
          주요업무
        </button>
        <button onClick={() => scrollToSection("location")} className={styles.navItem}>
          찾아오시는 길
        </button>
      </nav>

      {/* 회사 소개 섹션 */}
      <section id="company" className={styles.section}>
        <h1>회사소개</h1>
        <p>
          취업 준비생을 위한 AI 모의면접 서비스로 여러분의 미래를 설계합니다.
          우리의 기술은 단순한 도구가 아닌, 성공으로 가는 길을 열어주는 열쇠입니다.
          지금까지 수많은 지원자들이 우리의 서비스를 통해 꿈을 이뤘습니다.
        </p>
        <img src={img1} alt="회사 모습 이미지" className={styles.image} />
      </section>

      {/* 회사 모습 섹션 */}
      <section id="appearance" className={styles.section}>
        <h1>회사모습</h1>
        <p>
          창의력과 혁신이 살아 숨쉬는 공간. 우리의 사무실은 팀원들이 자유롭게
          아이디어를 교환하고, 더 나은 미래를 꿈꾸는 곳입니다. 함께하는 즐거움이
          가득한 공간을 확인해보세요.
        </p>
        <img src={img2} alt="회사 모습 이미지" className={styles.image} />
      </section>

      {/* 주요 업무 섹션 */}
      <section id="business" className={styles.section}>
        <h1>주요업무</h1>
        <p>
          단순한 면접 준비를 넘어, 최고의 결과를 낼 수 있는 완벽한 솔루션을
          제공합니다. 우리 서비스는 사용자 맞춤형으로 설계되어, 누구나 자신감을
          얻고 성공할 수 있도록 도와줍니다.
        </p>
        <div className={styles.businessList}>
          <div className={styles.businessItem}>
            <h3>자기소개서 첨삭</h3>
            <p>완벽한 자기소개서를 작성할 수 있도록 AI가 섬세하게 도와드립니다.</p>
          </div>
          <div className={styles.businessItem}>
            <h3>AI 모의면접</h3>
            <p>실제 면접과 유사한 환경에서 반복 연습하며 자신감을 키우세요.</p>
          </div>
          <div className={styles.businessItem}>
            <h3>AI 면접 예상질문</h3>
            <p>지원 직무에 최적화된 질문을 통해 어떤 상황에도 대비하세요.</p>
          </div>
        </div>
        <img src={img3} alt="회사 모습 이미지" className={styles.image} />
      </section>

      {/* 찾아오시는 길 섹션 */}
      <section id="location" className={styles.section}>
        <h1>찾아오시는 길</h1>
        <p>
          서울 서초구 강남구 서초대로 77길 41 4층에 위치한 우리의 사무실은 창의적인
          분위기로 가득 찬 공간입니다. 언제든 방문해 함께 이야기를 나눠보세요!
        </p>
        <button
          onClick={() => window.open("https://naver.me/FA2fHIZ5", "_blank")}
          className={styles.mapButton}
        >
          지도 보기
        </button>
      </section>
    </div>
  );
}

export default Introduction;
