import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaDetail.module.css";
import { useParams, useNavigate } from "react-router-dom";
import DeleteModal from "../../components/common/DeleteModal";

function QnaDetail() {
    // useParams를 사용하여 URL에서 qno(게시글 번호) 파라미터를 가져옴
    const { qno } = useParams();
    
    // useNavigate로 페이지 이동 제어
    const navigate = useNavigate();

    // 상태값 초기화: qna(게시글 정보), replies(댓글 목록), error(오류 메시지),
    // isDeleteModalOpen(삭제 모달 상태), newReply(새 댓글 내용), isReplySubmitting(댓글 등록 상태)
    const [qna, setQna] = useState(null);
    const [replies, setReplies] = useState([]);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newReply, setNewReply] = useState("");
    const [isReplySubmitting, setReplySubmitting] = useState(false);

    // AuthContext에서 사용자 관련 정보를 가져옴
    const { isLoggedIn, userid, username, role, secureApiRequest } = useContext(AuthContext);

    // QnA 상세 정보 가져오기
    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                // 서버에서 QnA 상세 정보를 가져옴
                const response = await secureApiRequest(`/qna/detail/${qno}`, {
                    method: "GET",
                });

                console.log("API 응답 데이터:", response.data); // 응답 데이터 로그 출력

                if (response.data?.qna) {
                    setQna(response.data.qna); // QnA 정보 설정
                    setReplies(response.data.replies || []); // 댓글 목록 설정
                    console.log("댓글 데이터 설정 완료:", response.data.replies || []);
                } else {
                    setError("존재하지 않는 게시글입니다."); // 오류 메시지 설정
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

        if (isLoggedIn) {
            fetchQnaDetail(); // 로그인이 되어 있으면 상세 정보 요청 실행
        } else {
            setError("로그인이 필요합니다.");
        }
    }, [qno, isLoggedIn, secureApiRequest]); // 의존성 배열로 qno, 로그인 상태, secureApiRequest 변경 감지

    // QnA 삭제 요청 처리
    const handleDelete = async () => {
        try {
            await secureApiRequest(`/qna/${qno}/delete`, {
                method: "PUT",
            });
            alert("삭제가 완료되었습니다.");
            navigate("/qna"); // 삭제 후 QnA 목록으로 이동
        } catch (error) {
            console.error("Delete error:", error);
            alert("삭제 실패!");
        }
    };

    // 댓글 삭제 요청 처리
    const handleReplyDelete = async (repno) => {
        console.log("삭제 요청 repno:", repno); // 삭제할 댓글 번호 확인 로그 출력

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
                setReplies((prevReplies) => prevReplies.filter((reply) => reply.repno !== repno));
            } catch (error) {
                console.error("Reply delete error:", error);
                alert("댓글 삭제 실패!");
            }
        }
    };

    // 댓글 등록 요청 처리
    const handleReplySubmit = async () => {
        if (!newReply.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const requestData = {
            replyContent: newReply,
            uuid: userid,
            replyWriter: username,
        };

        console.log("댓글 요청 데이터:", requestData); // 등록할 댓글 데이터 확인

        setReplySubmitting(true);
        try {
            const response = await secureApiRequest(`/reply/${qno}`, {
                method: "POST",
                data: requestData,
            });

            console.log("댓글 등록 응답:", response);

            if (response.status === 201) {
                alert("댓글이 등록되었습니다.");
                setReplies((prevReplies) => [...prevReplies, response.data]); // 댓글 목록 업데이트
                setNewReply("");
            }
        } catch (error) {
            console.error("댓글 등록 실패:", error);
            alert("댓글 등록 실패: " + (error.response?.data?.message || "서버 오류"));
        } finally {
            setReplySubmitting(false);
        }
    };

    // 로딩 상태 처리
    if (!qna && !error) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    // 오류 메시지 렌더링
    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    // 첨부파일 URL 확인 및 렌더링
    const fileUrl = qna?.qattachmentTitle
        ? `/qna/attachments/${qna.qattachmentTitle}`
        : null;
    console.log("첨부파일 URL:", fileUrl);

    return (
        <div className={styles.qnaDetailContainer}>
            {/* 삭제 모달 */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    setDeleteModalOpen(false);
                    handleDelete();
                }}
            />

            {/* 제목 */}
            <h1 className={styles.qnaTitle}>{qna.qtitle}</h1>

            {/* 버튼 그룹 */}
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
            </div>

            {/* QnA 상세 정보 */}
            <table className={styles.qnaTable}>
                <tbody>
                    <tr>
                        <th>내용</th>
                        <td>{qna.qcontent}</td>
                    </tr>
                    {fileUrl && (
                        <tr>
                            <th>첨부파일</th>
                            <td>
                                {fileUrl.endsWith(".png") || fileUrl.endsWith(".jpg") || fileUrl.endsWith(".jpeg") ? (
                                    <img
                                        src={fileUrl}
                                        alt="기존 첨부 이미지"
                                        className={styles.previewImage}
                                        style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                                    />
                                ) : (
                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                        파일 다운로드
                                    </a>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* 댓글 */}
            <div>
                <h3>댓글</h3>
                {replies.length > 0 ? (
                    <table className={styles.commentsTable}>
                        <thead>
                            <tr>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>작성일</th>
                                {(role === "ADMIN" || username === qna.qwriter) && <th>수정/삭제</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {replies.map((reply) => (
                                <tr key={reply.repno}>
                                    <td>{reply.repwriter || "작성자 없음"}</td>
                                    <td>{reply.repcontent || "내용 없음"}</td>
                                    <td>{new Date(reply.repdate).toLocaleString() || "날짜 없음"}</td>
                                    {(role === "ADMIN" || username === reply.repwriter) && (
                                        <td>
                                            <button onClick={() => alert("수정 기능 미구현")}>수정</button>
                                            <button onClick={() => handleReplyDelete(reply.repno)}>삭제</button>
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
                            placeholder="댓글을 입력하세요"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
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
