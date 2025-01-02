import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaDetail.module.css";
import DeleteModal from "../../components/common/DeleteModal";
import axios from "axios";

function QnaDetail() {
  const { qno } = useParams(); // URL에서 QnA 번호 추출
  const navigate = useNavigate();
  const [qna, setQna] = useState(null); // QnA 데이터 상태
  const [replies, setReplies] = useState([]); // 댓글 목록 상태
  const [error, setError] = useState(null); // 오류 메시지 상태
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // 삭제 모달 상태
  const [newReply, setNewReply] = useState(""); // 새 댓글 상태
  const [isReplySubmitting, setReplySubmitting] = useState(false); // 댓글 등록 진행 상태
  const [filePreview, setFilePreview] = useState(null); // 첨부파일 미리보기 상태

  const { isLoggedIn, userid, username, role, secureApiRequest } =
    useContext(AuthContext);

  // QnA 상세 정보를 가져오는 함수
  const fetchQnaDetail = async () => {
    try {
      const response = await secureApiRequest(`/qna/detail/${qno}`, {
        method: "GET",
      });

      if (response.data?.qna) {
        setQna(response.data.qna);
        setReplies(response.data.replies || []);

        // 첨부파일 미리보기 설정
        if (response.data.qna.qattachmentTitle) {
          const previewUrl = await fetchImage(
            `/qna/attachments/${response.data.qna.qattachmentTitle}`
          );
          setFilePreview(previewUrl);
        }
      } else {
        setError("존재하지 않는 게시글입니다.");
      }
    } catch (error) {
      console.error("API 호출 실패:", error);
      if (error.response?.status === 404) {
        setError("존재하지 않는 게시글입니다.");
      } else {
        setError("서버 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchQnaDetail(); // 로그인된 상태에서 데이터 요청
    } else {
      setError("로그인이 필요합니다.");
    }
  }, [qno, isLoggedIn]);

  // 이미지 URL을 가져오는 함수
  const fetchImage = async (url) => {
    try {
      const response = await fetch(`http://localhost:8080${url}`);
      if (!response.ok) throw new Error("이미지 로드 실패");
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("이미지 로드 오류:", error);
      return null;
    }
  };

  // QnA 삭제 처리 함수
  const handleDelete = async () => {
    try {
      await secureApiRequest(`/qna/${qno}/delete`, {
        method: "PUT",
      });
      alert("삭제가 완료되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 실패!");
    }
  };

  // 댓글 삭제 처리 함수
  const handleReplyDelete = async (repno) => {
    if (!repno) {
      alert("삭제할 댓글 정보가 없습니다.");
      return;
    }

    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await secureApiRequest(`/reply/${repno}/delete`, {
          method: "PUT",
        });
        alert("댓글이 삭제되었습니다.");
        // 댓글 목록 업데이트
        fetchQnaDetail(); // 댓글 등록 후 데이터 새로고침
      } catch (error) {
        console.error("Reply delete error:", error);
        alert("댓글 삭제 실패!");
      }
      fetchQnaDetail(); // 댓글 등록 후 데이터 새로고침
    }
  };

  // 댓글 등록 처리 함수
  const handleReplySubmit = async () => {
    if (!newReply.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const uuid = localStorage.getItem("uuid");


    const requestData = {
      replyContent: newReply,
      uuid,
      replyWriter: username,
    };

    setReplySubmitting(true);
    try {
      await axios.post(`http://localhost:8080/reply/${qno}`, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          refreshToken: `Bearer ${refreshToken}`,
        },
      });
      alert("댓글이 등록되었습니다.");
      setNewReply("");
      fetchQnaDetail(); // 댓글 등록 후 데이터 새로고침
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleReplyChange = (e) => {
    const value = e.target.value;
    if (value.length > 30) {
      alert("댓글은 최대 30글자까지 입력 가능합니다.");
      return;
    }
    setNewReply(value);
  };

  if (!qna && !error) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.qnaDetailContainer}>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          handleDelete();
        }}
      />
      <h1 className={styles.qnaTitle}>{qna.qtitle}</h1>
      <div className={styles.buttonGroup}>
    <button onClick={() => navigate(-1)} className={styles.backButton}>
        이전 페이지로 이동
    </button>
    {isLoggedIn && (username === qna.qwriter || role === "ADMIN") && (
        <>
            <button
                onClick={() => navigate(`/qna/update/${qno}`)}
                className={styles.editButton}
            >
                수정
            </button>
            <button
                onClick={() => setDeleteModalOpen(true)}
                className={styles.deleteButton}
            >
                삭제
            </button>
        </>
    )}
    {/* 선 추가 */}
    <div className={styles.divider}></div>
</div>


      <table className={styles.qnaTable}>
        <tbody>
          <tr>
            <th>내용</th>
            <td>
              {/* 첨부파일 미리보기 */}
              {filePreview && (
                <div className={styles.attachmentPreview}>
                  <img
                    src={filePreview}
                    alt="첨부파일 미리보기"
                    className={styles.previewImage}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      marginBottom: "10px",
                    }}
                  />
                </div>
              )}
              {/* QnA 내용 */}
              <div className={styles.qnaContent}>{qna.qcontent}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <h3>댓글</h3>
        {replies.length > 0 ? (
          <table className={styles.commentsTable}>
            <thead>
              <tr>
                <th>작성자</th>
                <th>내용</th>
                <th>작성일</th>
                {role === "ADMIN" && <th>삭제</th>}
              </tr>
            </thead>
            <tbody>
              {replies.map((reply) => (
                <tr key={reply.repno}>
                  <td>{reply.repwriter || "작성자 없음"}</td>
                  <td>{reply.repcontent || "내용 없음"}</td>
                  <td>
                    {new Date(reply.repdate).toLocaleString() || "날짜 없음"}
                  </td>
                  {(role === "ADMIN" || username === reply.repwriter) && (
                    <td>
                      <button
                        onClick={() => handleReplyDelete(reply.repno)}
                        className={styles.deleteButton}
                      >
                        삭제
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.noComments}>댓글이 없습니다.</div>
        )}
        {role === "ADMIN" && (
          <div className={styles.replyForm}>
            <textarea
              placeholder="댓글을 입력하세요 (최대 30글자)"
              value={newReply}
              onChange={handleReplyChange}
            />
            <button onClick={handleReplySubmit} disabled={isReplySubmitting}>
              댓글 작성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QnaDetail;
