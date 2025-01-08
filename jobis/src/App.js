import React, { useState } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AppRouter from "./routers/router";
import ResultFooter from "./components/common/ResultFooter";

function App() {
  const [resultData, setResultData] = useState(null);

  return (
    <>
      <Header />
      <AppRouter setResultData={setResultData} resultData={resultData} />
      {resultData ? (
        <ResultFooter
          filename={resultData?.filename || { audio: "", video: "" }}
          introNo={resultData?.intro_no || ""}
          roundId={resultData?.round_id || ""}
          intId={resultData?.int_id || ""}
          setResultData={setResultData} // 이 부분이 제대로 추가되어야 함
        />
      ) : null}
      <Footer />
    </>
  );
}

export default App;
