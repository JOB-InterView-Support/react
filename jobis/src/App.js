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
      <AppRouter setResultData={setResultData} />
      {resultData && (
        <ResultFooter
          filename={resultData.filename}
          introNo={resultData.intro_no}
          roundId={resultData.round_id}
          intId={resultData.int_id}
        />
      )}
      <Footer />
    </>
  );
}

export default App;
