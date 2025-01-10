import React, { useState, useEffect, useRef } from "react";
import styles from "./AiInterviewResultDetail.module.css";
import { useParams, useLocation } from "react-router-dom";
import BackButton from "../../components/common/button/BackButton";

function AiInterviewResultDetail() {
  const { interviewId } = useParams();
  const location = useLocation();
  const { introTitle, interviewRound } = location.state || {}; // 전달된 state 값

  const [isVideoLoading, setIsVideoLoading] = useState(true); // 비디오 로딩 상태

  const handleVideoLoaded = () => {
    setIsVideoLoading(false); // 비디오 로드 완료 시 로딩 상태 업데이트
  };

  const [videoPath, setVideoPath] = useState(null);
  const [audioPath, setAudioPath] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [ivId, setIvId] = useState(null);
  const [angry, setAngry] = useState(null);
  const [disgust, setDisgust] = useState(null);
  const [fear, setFear] = useState(null);
  const [happy, setHappy] = useState(null);
  const [sad, setSad] = useState(null);
  const [surprised, setSurprised] = useState(null);
  const [neutrality, setNeutrality] = useState(null);
  const [gazeData, setGazeData] = useState({
    IVG_AVG: null,
    IVG_MIN: null,
    IVG_MAX: null,
  });
  const [positionData, setPositionData] = useState({
    IVP_GOODPOSE: null,
    IVP_BEDNECK: null,
    IVP_BEDSHOULDER: null,
    IVP_BADPOSE: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Video Path API 호출
        const videoResponse = await fetch(
          "http://127.0.0.1:8000/aiInterviewResultDetail/getResultVideo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ interviewId }),
          }
        );
        const videoData = await videoResponse.json();
        if (videoResponse.ok) {
          setVideoPath(videoData.iv_path);
        } else {
          throw new Error(videoData.detail || "Failed to fetch video path");
        }

        // Audio Path API 호출
        const audioResponse = await fetch(
          "http://127.0.0.1:8000/aiInterviewResultDetail/getResultAudio",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ interviewId }),
          }
        );
        const audioData = await audioResponse.json();
        if (audioResponse.ok) {
          setAudioPath(audioData.audio_path);
        } else {
          throw new Error(audioData.detail || "Failed to fetch audio path");
        }

        // IV ID API 호출
        const ivIdResponse = await fetch(
          "http://127.0.0.1:8000/aiInterviewResultDetail/getIvId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ interviewId }),
          }
        );
        const ivIdData = await ivIdResponse.json();
        if (ivIdResponse.ok) {
          const ivId = ivIdData.iv_id;
          setIvId(ivId);

          // 감정 분석 데이터 호출
          const feelingsResponse = await fetch(
            "http://127.0.0.1:8000/aiInterviewResultDetail/getFeelings",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ iv_id: ivId }),
            }
          );
          const feelingsData = await feelingsResponse.json();
          if (feelingsResponse.ok) {
            setAngry(feelingsData.angry);
            setDisgust(feelingsData.disgust);
            setFear(feelingsData.fear);
            setHappy(feelingsData.happy);
            setSad(feelingsData.sad);
            setSurprised(feelingsData.surprised);
            setNeutrality(feelingsData.neutrality);
          } else {
            throw new Error("Failed to fetch feelings details");
          }

          // Gaze 데이터 호출
          const gazeResponse = await fetch(
            "http://127.0.0.1:8000/aiInterviewResultDetail/getGaze",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ iv_id: ivId }),
            }
          );
          const gazeData = await gazeResponse.json();
          if (gazeResponse.ok) {
            setGazeData(gazeData);
          } else {
            throw new Error("Failed to fetch gaze details");
          }

          // Position 데이터 호출
          const positionResponse = await fetch(
            "http://127.0.0.1:8000/aiInterviewResultDetail/getPosition",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ iv_id: ivId }),
            }
          );
          const positionData = await positionResponse.json();
          if (positionResponse.ok) {
            setPositionData(positionData);
          } else {
            throw new Error("Failed to fetch position details");
          }
        } else {
          throw new Error(ivIdData.detail || "Failed to fetch IV ID");
        }
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData(); // 데이터 호출 함수 실행
  }, []); // 빈 배열을 전달하여 단 한 번만 실행

  const handlePlayBoth = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video && audio) {
      const videoDuration = video.duration;
      const audioDuration = audio.duration;
      video.playbackRate = videoDuration / audioDuration;
      video.play();
      audio.play();
    }
  };

  const handleStopBoth = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video && audio) {
      video.pause();
      audio.pause();
    }
  };

  return (
    <div>
      <h1>
        '{introTitle}' 자기소개서 {interviewRound}회차 결과
      </h1>
      <div className={styles.container}>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.videoaudioContainer}>
          {videoPath && (
            <div className={styles.videoContainer}>
              {isVideoLoading && (
                <p className={styles.loadingMessage}>로딩중...</p>
              )}
              <video
                ref={videoRef}
                className={styles.videoPlayer}
                onLoadedData={handleVideoLoaded} // 비디오 로드 완료 시 호출
                style={{ display: isVideoLoading ? "none" : "block" }} // 로딩 중일 때 숨김
              >
                <source
                  src={`http://127.0.0.1:8000/video/static/${videoPath}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {audioPath && (
            <div className={styles.audioContainer}>
              <audio ref={audioRef} className={styles.audioPlayer}>
                <source
                  src={`http://127.0.0.1:8000/audio/static/${audioPath}`}
                  type="audio/mp3"
                />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
          
          <div className={styles.btnClass}>
            <button onClick={handlePlayBoth} className={styles.reproductionBtn}>
              재생
            </button>
            <button onClick={handleStopBoth} className={styles.pauseBtn}>
              정지
            </button>
           
          </div>
          <BackButton/>
        </div>

        <div className={styles.aiAnalysisResults}>
          <div className={styles.feelingResult}>
            <table className={styles.feelingTable}>
              <thead>
                <tr>
                  <th colSpan="2" className={styles.tableHeader}>
                    감정 분석 결과
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>행복함</td>
                  <td>{happy || "로딩중"}</td>
                </tr>
                <tr>
                  <td>중립</td>
                  <td>{neutrality || "로딩중"}</td>
                </tr>
                <tr>
                  <td>놀라움</td>
                  <td>{surprised || "로딩중"}</td>
                </tr>
                <tr>
                  <td>화남</td>
                  <td>{angry || "로딩중"}</td>
                </tr>
                <tr>
                  <td>두려움</td>
                  <td>{fear || "로딩중"}</td>
                </tr>
                <tr>
                  <td>슬픔</td>
                  <td>{sad || "로딩중"}</td>
                </tr>
                <tr>
                  <td>혐오</td>
                  <td>{disgust || "로딩중"}</td>
                </tr>
              </tbody>
            </table>
          </div>{" "}
          {/*feelingResult*/}
          <div className={styles.gazeResult}>
            <table className={styles.gazeTable}>
              <thead>
                <tr>
                  <th colSpan="2" className={styles.tableHeader}>
                    시선 분석 결과
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>평균 시선</td>
                  <td>{gazeData.IVG_AVG || "로딩중"}</td>
                </tr>
                <tr>
                  <td>최소 시선</td>
                  <td>{gazeData.IVG_MIN || "로딩중"}</td>
                </tr>
                <tr>
                  <td>최대 시선</td>
                  <td>{gazeData.IVG_MAX || "로딩중"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.positionResult}>
            <table className={styles.positionTable}>
              <thead>
                <tr>
                  <th colSpan="2" className={styles.tableHeader}>
                    포지션 분석 결과
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>좋은 자세</td>
                  <td>{positionData.IVP_GOODPOSE || "로딩중"}</td>
                </tr>
                <tr>
                  <td>나쁜 목 자세</td>
                  <td>{positionData.IVP_BEDNECK || "로딩중"}</td>
                </tr>
                <tr>
                  <td>나쁜 어깨 자세</td>
                  <td>{positionData.IVP_BEDSHOULDER || "로딩중"}</td>
                </tr>
                <tr>
                  <td>나쁜 자세</td>
                  <td>{positionData.IVP_BADPOSE || "로딩중"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {!videoPath && !audioPath && <p>Loading media...</p>}
      </div>
    </div>
  );
}

export default AiInterviewResultDetail;
