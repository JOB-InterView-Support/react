import React, { useEffect, useState, useContext } from "react"; // React 관련 라이브러리
import { AuthContext } from "../../AuthProvider"; // 인증 Context
import styles from "./QnaDetail.module.css"; // CSS 모듈
import { useParams, useNavigate } from "react-router-dom"; // React Router
import InsertButton from "../../components/common/button/InsertButton"; // 버튼 컴포넌트

function QnaDetail() {
    const { qno } = useParams(); // URL에서 qno(질문 번호) 추출
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [qna, setQna] = useState(null); // 질문 데이터를 저장하는 상태
    const [replies, setReplies] = useState([]); // 댓글 데이터를 저장하는 상태
    const [error, setError] = useState(null); // 에러 메시지 저장 상태

    // 인증 관련 정보
    const { isLoggedIn, userid, secureApiRequest } = useContext(AuthContext);

    // 게시글과 댓글 데이터를 가져오는 함수
    useEffect(() => {
    const fetchQnaDetail = async () => {
        console.log("Qna의 qno:", qno); // 디버깅 로그

        try {
            const response = await secureApiRequest(`/qna/detail/${qno}`, {
                method: "GET",
            });
            console.log("API Response 서버 응답 로그 :", response); // 서버 응답 로그
            setQna(response.qna);
            setReplies(response.list);
        } catch (error) {
            setError("게시글 상세 조회 실패!");
            console.error("Error fetching QnA details 게시글 조회 실패시 :", error); // 에러 로그
        }
    };

    if (isLoggedIn) {
        fetchQnaDetail();
    } else {
        setError("로그인이 필요합니다."); // 인증되지 않은 경우 에러 처리
    }
}, [qno, isLoggedIn, secureApiRequest]);


    // 질문 삭제 함수
    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const response = await secureApiRequest(`/qna/${qno}`, {
                    method: "DELETE",
                }); // DELETE 요청
                alert("삭제가 완료되었습니다.");
                navigate("/qna"); // 목록 페이지로 이동
            } catch (error) {
                console.error("Delete error:", error);
                alert("삭제 실패!");
            }
        }
    };

    // 댓글 삭제 함수
    const handleReplyDelete = async (repno) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            try {
                const response = await secureApiRequest(`/reply/${repno}`, {
                    method: "DELETE",
                }); // DELETE 요청
                setReplies((prevReplies) =>
                    prevReplies.filter((reply) => reply.repno !== repno) // 댓글 목록에서 삭제
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
        <div>
            <h2>{qno}번 게시글 상세보기</h2>
            <table border="1">
                <tbody>
                    <tr>
                        <th>번호</th>
                        <td>{qna.qnano}</td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td>{qna.qnatitle}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>{qna.qnawriter}</td>
                    </tr>
                    <tr>
                        <th>등록날짜</th>
                        <td>{qna.qnadate}</td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td>{qna.qnacontent}</td>
                    </tr>
                </tbody>
            </table>
            <div className={styles.buttonGroup}>
                <button onClick={() => navigate(-1)}>이전 페이지로 이동</button>
                {isLoggedIn && userid === qna.qnaWriter && (
                    <>
                        <button onClick={() => navigate(`/qna/update/${qno}`)}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}
            </div>
            <h3>댓글</h3>
            <table>
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
                            <td>{reply.replyDate}</td>
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
        </div>
    );
}

export default QnaDetail;
