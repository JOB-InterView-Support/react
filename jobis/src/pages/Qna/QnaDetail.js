import React, { useEffect, useState, useContext } from "react"; // React 관련 라이브러리
import { AuthContext } from "../../AuthProvider"; // 인증 Context
import styles from "./QnaDetail.module.css"; // CSS 모듈
import { useParams, useNavigate } from "react-router-dom"; // React Router
import DeleteModal from "../../components/common/DeleteModal"; // DeleteModal 컴포넌트 추가

function QnaDetail() {
    const { qno } = useParams(); // URL에서 qno(질문 번호) 추출
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [qna, setQna] = useState(null); // 질문 데이터를 저장하는 상태
    const [replies, setReplies] = useState([]); // 댓글 데이터를 저장하는 상태
    const [error, setError] = useState(null); // 에러 메시지 저장 상태
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // 삭제 모달 상태

    // 인증 관련 정보
    const { isLoggedIn, userid, secureApiRequest } = useContext(AuthContext);

    // 게시글과 댓글 데이터를 가져오는 함수
    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                // QnA 상세 데이터를 서버에서 요청
                const response = await secureApiRequest(`/qna/detail/${qno}`, {
                    method: "GET",
                });

                console.log("서버 응답 데이터:", response.data);

                if (response.data?.qna) {
                    setQna(response.data.qna); // QnA 데이터 설정
                } else {
                    setError("존재하지 않는 게시글입니다."); // 서버가 데이터를 반환하지 않은 경우 처리
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setError("존재하지 않는 게시글입니다."); // 404 응답 처리
                } else {
                    setError("서버 오류가 발생했습니다."); // 기타 오류 처리
                }
                console.error("Error fetching QnA details:", error);
            }
        };

        if (isLoggedIn) {
            fetchQnaDetail(); // 로그인 상태에서 데이터 요청
        } else {
            setError("로그인이 필요합니다."); // 인증되지 않은 경우 에러 처리
        }
    }, [qno, isLoggedIn, secureApiRequest]);

    // 질문 삭제 함수
    const handleDelete = async () => {
        try {
            // 서버로 DELETE 대신 PUT 요청 전송
            await secureApiRequest(`/qna/${qno}/delete`, {
                method: "PUT",
            });
            alert("삭제가 완료되었습니다.");
            navigate("/qna"); // 목록 페이지로 이동
        } catch (error) {
            console.error("Delete error:", error);
            alert("삭제 실패!");
        }
    };

    // 댓글 삭제 함수
    const handleReplyDelete = async (repno) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            try {
                // 서버로 DELETE 요청 전송
                await secureApiRequest(`/reply/${repno}`, {
                    method: "DELETE",
                });
                // 댓글 목록에서 삭제된 댓글 필터링
                setReplies((prevReplies) =>
                    prevReplies.filter((reply) => reply.repno !== repno)
                );
                alert("댓글이 삭제되었습니다.");
            } catch (error) {
                console.error("Reply delete error:", error);
                alert("댓글 삭제 실패!");
            }
        }
    };

    // 데이터가 로딩 중일 때 표시
    if (!qna && !error) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    // 에러 발생 시 표시
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
            <h1 className={styles.qnaTitle}>{qna.qtitle}</h1> {/* 제목을 상단에 강조 */}
            <div className={styles.buttonGroup}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>이전 페이지로 이동</button>
                {isLoggedIn && userid === qna.qWriter && (
                    <>
                        <button onClick={() => navigate(`/qna/update/${qno}`)} className={styles.editButton}>수정</button>
                        <button onClick={() => setDeleteModalOpen(true)} className={styles.deleteButton}>삭제</button>
                    </>
                )}
            </div>
            <table className={styles.qnaTable}>
                <tbody>
                    <tr>
                        <th>내용</th>
                        <td>{qna.qcontent}</td> {/* qna 데이터에서 내용 표시 */}
                    </tr>
                    {qna.qattachmenttitle && typeof qna.qattachmenttitle === "string" && (
            <tr>
                <th>첨부 파일</th>
                <td>
                    {qna.qattachmenttitle.endsWith(".png") || qna.qattachmenttitle.endsWith(".jpg") || qna.qattachmenttitle.endsWith(".jpeg") ? (
                        <img
                            src={`/attachments/${qna.qattachmenttitle}`}
                            alt="첨부 이미지"
                            style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                        />
                    ) : (
                        <a
                            href={`/attachments/${qna.qattachmenttitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {qna.qattachmenttitle}
                        </a>
                    )}
                </td>
            </tr>
        )}


                </tbody>
            </table>
            {replies.length > 0 ? ( /* 댓글이 있을 경우에만 표시 */
                <>
                    <h3>댓글</h3>
                    <table className={styles.commentsTable}>
                        <thead>
                            <tr>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {replies.map((reply) => (
                                <tr key={reply.repno}>
                                    <td>{reply.replyWriter}</td>
                                    <td>{reply.replyContent}</td>
                                    <td>{new Date(reply.replyDate).toLocaleDateString()}</td>
                                    <td>
                                        {isLoggedIn && userid === reply.replyWriter && (
                                            <>
                                                <button onClick={() => alert("수정 기능 미구현")}>수정</button>
                                                <button onClick={() => handleReplyDelete(reply.repno)}>삭제</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <div className={styles.noComments}>댓글이 없습니다.</div>
            )}
        </div>
    );
}

export default QnaDetail;
