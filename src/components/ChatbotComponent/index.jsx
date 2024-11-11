import React, { useState, useEffect } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import stock from "../../data/stockData.json";

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
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [steps, setSteps] = useState([]);
  
  useEffect(() => {
    try {
      if (!stock || !stock.stocks || stock.stocks.length === 0) {
        throw new Error("Stock data is empty or invalid.");
      }
      setStockData(stock.stocks);
    } catch (error) {
      console.error("Error loading stock data:", error);
      setStockData([]);
    }
  }, []);

  useEffect(() => {
    const buildSteps = () => {
      if (!stockData || stockData.length === 0) {
        return [{
          id: "1",
          message: "Sorry, no stock data is available at the moment. Please try again later.",
          trigger: "end"
        }];
      }

      const steps = [
        {
          id: "1",
          message: "Please select a stock exchange:",
          trigger: "2",
        },
        {
          id: "2",
          options: stockData.map((item) => ({
            value: item.code,
            label: item.stockExchange,
            trigger: `${item.code}`,
          })),
        },
      ];

      stockData.forEach((exchange) => {
        steps.push({
          id: `${exchange.code}`,
          message: `Please select a stock from ${exchange.stockExchange}:`,
          trigger: `exchange-${exchange.code}`,
        });

        steps.push({
          id: `exchange-${exchange.code}`,
          options: exchange.topStocks.map((stock) => ({
            value: stock.code,
            label: stock.stockName,
            trigger: "4",
          })),
        });
      });

      steps.push({
        id: "4",
        message: ({ previousValue }) => {
          let selectedStock;
          let selectedExchangeData = null;
          stockData.forEach((exchange) => {
            exchange.topStocks.forEach((stock) => {
              if (stock.code === previousValue) {
                selectedStock = { ...stock };
                selectedExchangeData = exchange;
              }
            });
          });

          if (selectedStock) {
            setSelectedExchange(selectedExchangeData);
            return `The price of ${selectedStock.stockName} is $${selectedStock.price}. Please select an option.`;
          }
          return "Invalid stock selection. Please try again.";
        },
        trigger: "5",
      });

      steps.push({
        id: "5",
        options: [
          {
            value: "stock",
            label: "Stock Menu",
            trigger: ({ value, steps }) => {
              try {
                let keys = ["NASDAQ", "LSE", "NYSE"];
                let filteredData = {};
                keys.forEach((key) => {
                  if (steps[key]) {
                    filteredData = steps[key];
                  }
                });
                if (filteredData.id) {
                  return filteredData.id;
                }
                return "2"; 
              } catch (error) {
                console.error("Error selecting stock menu:", error);
                return "2"; 
              }
            },
          },
          {
            value: "home",
            label: "Home Menu",
            trigger: "2",
          },
        ],
      });

      return steps;
    };

    if (stockData && stockData.length > 0) {
      const generatedSteps = buildSteps();
      setSteps(generatedSteps);
    }
  }, [stockData, selectedExchange]);

  return (
    <>
      {steps.length > 0 ? (
        <ThemeProvider theme={theme}>
          <ChatBot
            headerTitle="LSEG Chatbot"
            placeholder="Please select an option"
            hideInput="false"
            width="900px"
            steps={steps}
            onError={(error) => console.error("Chatbot encountered an error:", error)}
          />
        </ThemeProvider>
      ) : (
        <div>Loading chatbot...</div>
      )}
    </>
  );
};
