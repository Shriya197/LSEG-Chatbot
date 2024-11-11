import React, { useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import stock from "../../data/stockData.json";
import { buildSteps } from "../../utils/chatBotUtils";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Helvetica Neue",
  headerBgColor: "#2c5ed9 ",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#2c5ed9 ",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

export const ChatbotComponent = () => {
  const [stockData, setStockData] = useState(null);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (stock?.stocks?.length) setStockData(stock.stocks);
  }, []);

  useEffect(() => {
    if (stockData?.length) {
      const generatedSteps = buildSteps(stockData);
      setSteps(generatedSteps);
    }
  }, [stockData]);

  return (
    <>
      {steps.length > 0 ? (
        <ThemeProvider theme={theme}>
          <ChatBot
            headerTitle="LSEG Chatbot"
            placeholder="Please select an option"
            hideInput="false"
            width="700px"
            steps={steps}
          />
        </ThemeProvider>
      ) : (
        <></>
      )}
    </>
  );
};
