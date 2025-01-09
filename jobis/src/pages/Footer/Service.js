import React from "react";
import PolicyMenu from "./PolicyMenu"; // PolicyMenu 가져오기
import styles from "./Service.module.css";

function Service() {
  return (
    <div>
      <PolicyMenu /> {/* 서브메뉴바 추가 */}
      <div className={styles.container}>
        <h1>이용약관</h1>
        <p>
          본 이용약관은 JOBIS 서비스 이용과 관련하여 필요한 사항을 규정합니다.
        </p>

        <h2>제1조 (목적)</h2>
        <p>
          이 약관은 JOBIS가 제공하는 모든 서비스(이하 "서비스")를 이용함에 있어
          이용자와 회사 간의 권리, 의무 및 책임사항을 규정하는 것을 목적으로
          합니다.
        </p>

        <h2>제2조 (용어 정의)</h2>
        <p>
          1. "회사"란 JOBIS를 운영하는 주체를 의미합니다.
          <br />
          2. "이용자"란 본 약관에 따라 서비스를 이용하는 모든 주체를 말합니다.
        </p>

        <h2>제3조 (회원 가입 및 관리)</h2>
        <p>
          JOBIS는 회원가입 과정에서 이름, 이메일, 비밀번호 등 최소한의 정보를
          수집하며, 회원은 가입 후 제공된 계정을 통해 서비스를 이용할 수
          있습니다.
        </p>

        <h2>제4조 (서비스 이용)</h2>
        <p>
          JOBIS는 다양한 서비스를 제공합니다. 회원은 서비스 이용 시 관련 법령 및
          본 약관을 준수해야 하며, 타인의 권리를 침해해서는 안 됩니다.
        </p>

        <h2>제5조 (개인정보 보호)</h2>
        <p>
          JOBIS는 이용자의 개인정보를 중요하게 생각하며, 개인정보보호법 등
          관련 법령을 준수합니다. 자세한 내용은{" "}
          <a href="/privacy-policy" className={styles.link}>
            개인정보 처리방침
          </a>
          을 참조하세요.
        </p>

        <h2>제6조 (게시물의 관리)</h2>
        <p>
          JOBIS는 회원이 작성한 게시물이 타인의 권리를 침해하거나 관련 법령을
          위반하는 경우 삭제, 비공개 처리할 수 있습니다.
        </p>

        <h2>제7조 (서비스 중단 및 변경)</h2>
        <p>
          JOBIS는 서비스의 안정적인 제공을 위해 노력합니다. 다만, 시스템 점검,
          유지보수 등으로 인해 부득이하게 서비스를 일시 중단할 수 있으며,
          변경사항은 사전에 공지합니다.
        </p>

        <h2>제8조 (이용약관 변경)</h2>
        <p>
          JOBIS는 약관을 개정할 수 있으며, 변경 내용은 사전에 공지합니다. 변경된
          약관에 동의하지 않을 경우, 회원은 이용계약을 해지할 수 있습니다.
        </p>

        <h2>제9조 (기타)</h2>
        <p>
          JOBIS는 본 약관의 내용을 서비스 초기 화면 또는 연결화면을 통해
          제공합니다. 본 약관과 관련하여 궁금한 사항이 있으시면 고객센터로 문의
          바랍니다.
        </p>
      </div>
    </div>
  );
}

export default Service;
