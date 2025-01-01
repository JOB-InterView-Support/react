import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthProvider";
import styles from "./QnaDetail.module.css";
import { useParams, useNavigate } from "react-router-dom";
import DeleteModal from "../../components/common/DeleteModal";

function QnaDetail() {
    const { qno } = useParams();
    const navigate = useNavigate();
    const [qna, setQna] = useState(null);
    const [replies, setReplies] = useState([]);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newReply, setNewReply] = useState("");
    const [isReplySubmitting, setReplySubmitting] = useState(false);

    const { isLoggedIn, userid, username, role, secureApiRequest } = useContext(AuthContext);

    useEffect(() => {
        const fetchQnaDetail = async () => {
            try {
                const response = await secureApiRequest(`/qna/detail/${qno}`, {
                    method: "GET",
                });

                console.log("API 응답 데이터:", response.data); // 전체 응답 데이터 확인

                if (response.data?.qna) {
                    setQna(response.data.qna);
                    setReplies(response.data.replies || []); // 댓글 데이터 설정
                    console.log("댓글 데이터 설정 완료:", response.data.replies || []);
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

        if (isLoggedIn) {
            fetchQnaDetail();
        } else {
            setError("로그인이 필요합니다.");
        }
    }, [qno, isLoggedIn, secureApiRequest]);

    const handleDelete = async () => {
        try {
            await secureApiRequest(`/qna/${qno}/delete`, {
                method: "PUT",
            });
            alert("삭제가 완료되었습니다.");
            navigate("/qna");
        } catch (error) {
            console.error("Delete error:", error);
            alert("삭제 실패!");
        }
    };

    const handleReplyDelete = async (repno) => {
        console.log("삭제 요청 repno:", repno); // 로그로 repno 확인
        if (!repno) {
            alert("삭제할 댓글 정보가 없습니다.");
            return;
        }

        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const refreshToken = localStorage.getItem("refreshToken");

                if (!accessToken || !refreshToken) {
                    alert("로그인이 필요합니다.");
                    return;
                }

                const response = await axios.put(
                    `http://localhost:8080/reply/${repno}/delete`,
                    null, // PUT 요청에는 요청 본문이 없으므로 null 전달
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            refreshToken: `Bearer ${refreshToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    alert("댓글이 삭제되었습니다.");
                    setReplies((prevReplies) =>
                        prevReplies.filter((reply) => reply.repno !== repno)
                    );
                }
            } catch (error) {
                console.error("Reply delete error:", error);
                alert("댓글 삭제 실패!");
            }
        }
    };

    const handleReplySubmit = async () => {
        if (!newReply.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userid = localStorage.getItem("userId");
        const username = localStorage.getItem("userName");

        if (!accessToken || !refreshToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!userid || !username) {
            alert("사용자 정보가 없습니다. 다시 로그인 해주세요.");
            return;
        }

        const requestData = {
            replyContent: newReply,
            uuid: userid,
            replyWriter: username,
        };

        console.log("댓글 요청 데이터:", requestData);

        setReplySubmitting(true);
        try {
            const response = await axios.post(
                `http://localhost:8080/reply/${qno}`, // API URL
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        refreshToken: `Bearer ${refreshToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("댓글 등록 응답:", response);

            if (response.status === 201) {
                alert("댓글이 등록되었습니다.");
                setReplies((prevReplies) => [...prevReplies, response.data]);
                setNewReply("");
            }
        } catch (error) {
            console.error("댓글 등록 실패:", error);
            if (error.response?.data) {
                alert(`댓글 등록 실패: ${error.response.data.message}`);
            } else {
                alert("댓글 등록에 실패했습니다. 다시 시도해주세요.");
            }
        } finally {
            setReplySubmitting(false);
        }
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
                {isLoggedIn && userid === qna.qWriter && (
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
            <table className={styles.qnaTable}>
                <tbody>
                    <tr>
                        <th>내용</th>
                        <td>{qna.qcontent}</td>
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
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {replies.map((reply) => (
                                <tr key={reply.repno}>
                                    <td>{reply.repwriter || "작성자 없음"}</td>
                                    <td>{reply.repcontent || "내용 없음"}</td>
                                    <td>{new Date(reply.repdate).toLocaleString() || "날짜 없음"}</td>
                                    <td>
                                        {isLoggedIn && (userid === reply.repwriter || role === "ADMIN") && (
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
                ) : (
                    <div className={styles.noComments}>댓글이 없습니다.</div>
                )}
                {(role === "ADMIN" || replies.length === 0) && (
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
