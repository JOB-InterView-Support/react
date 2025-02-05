import React from "react";
import PolicyMenu from "./PolicyMenu"; // PolicyMenu 가져오기
import styles from "./Privacy.module.css";

function Privacy() {
  return (
    <div>
      <PolicyMenu /> {/* 서브메뉴바 추가 */}
      <div className={styles.container}>
      <h1>개인정보 처리방침</h1>
      <p>
        JOBIS는 이용자의 개인정보를 중요시하며, 개인정보 보호법을 준수하고 있습니다.
        본 방침은 JOBIS가 제공하는 서비스(이하 "서비스")를 이용하는 모든 이용자의
        개인정보 보호와 관련한 정책을 규정합니다.
      </p>

      <h2>제1조 (수집하는 개인정보)</h2>
      <p>
        JOBIS는 회원가입 과정에서 이름, 이메일, 비밀번호 등 최소한의 개인정보만
        수집하며, 서비스 이용 중 필요한 경우 추가 정보를 요청할 수 있습니다.
        <br />
        1. 필수 항목: 이름, 이메일, 비밀번호
        <br />
        2. 선택 항목: 전화번호, 직무 정보
      </p>

      <h2>제2조 (개인정보의 수집 방법)</h2>
      <p>
        JOBIS는 다음과 같은 방법으로 개인정보를 수집합니다.
        <br />
        1. 회원가입 시 이용자가 직접 입력한 정보
        <br />
        2. 고객센터 상담 과정에서 제공된 정보
        <br />
        3. 서비스 이용 과정에서 자동으로 생성 및 수집되는 정보(기기정보 등)
      </p>

      <h2>제3조 (수집한 개인정보의 이용)</h2>
      <p>
        JOBIS는 수집한 개인정보를 다음의 목적을 위해 사용합니다.
        <br />
        1. 회원 관리 및 서비스 제공
        <br />
        2. 서비스 개선 및 신규 서비스 개발
        <br />
        3. 이용자 맞춤형 콘텐츠 및 광고 제공
      </p>

      <h2>제4조 (개인정보의 제공 및 위탁)</h2>
      <p>
        JOBIS는 이용자의 사전 동의 없이 개인정보를 외부에 제공하지 않습니다.
        다만, 관계 법령에 따라 제공 의무가 발생하는 경우에는 해당 법령을 엄격히
        준수합니다.
        <br />
        JOBIS는 서비스 운영에 필요한 일부 업무를 외부 업체에 위탁하며, 위탁받은
        업체가 개인정보를 안전하게 처리하도록 관리/감독합니다.
      </p>

      <h2>제5조 (개인정보의 보관 및 삭제)</h2>
      <p>
        JOBIS는 개인정보의 수집 및 이용 목적이 달성된 후 해당 정보를 안전하게
        삭제합니다. 단, 관계 법령에 따라 일정 기간 동안 보관이 필요한 경우
        해당 기간 동안 안전하게 보관합니다.
      </p>

      <h2>제6조 (이용자 권리 및 행사 방법)</h2>
      <p>
        이용자는 언제든지 자신의 개인정보를 확인하거나 수정, 삭제를 요청할 수
        있습니다. 만 14세 미만 아동의 법정대리인도 동일한 권리를 행사할 수
        있습니다.
      </p>

      <h2>제7조 (개인정보 보호를 위한 노력)</h2>
      <p>
        JOBIS는 개인정보 보호법 등 관계 법령에서 요구하는 수준 이상의 보안
        시스템을 구축하여 개인정보를 안전하게 관리하고 있습니다. 또한,
        이용자의 개인정보 보호를 위해 지속적으로 노력하고 있습니다.
      </p>

      <h2>제8조 (개인정보 처리방침 변경 시 고지)</h2>
      <p>
        JOBIS는 개인정보 처리방침 변경 시 사전에 홈페이지 공지사항을 통해
        변경사항을 고지합니다.
      </p>

        {/* 추가 조항 내용 */}
      </div>
    </div>
  );
}

export default Privacy;
