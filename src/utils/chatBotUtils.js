import { CHATBOT_IDS } from "../constants/chatBotConstants";

export const buildSteps = (stockData) => {
  const steps = [
    {
      id: CHATBOT_IDS.WELCOME_MESSAGE,
      message: "Hello! Welcome to LSEG. I am here to help you",
      trigger: CHATBOT_IDS.SELECT_EXCHANGE,
    },
    {
      id: CHATBOT_IDS.SELECT_EXCHANGE,
      message: "Please select a Stock Exchange",
      trigger: CHATBOT_IDS.SELECT_EXCHANGE_OPTIONS,
    },
    {
      id: CHATBOT_IDS.SELECT_EXCHANGE_OPTIONS,
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
        trigger: CHATBOT_IDS.STOCK_SELECTION,
      })),
    });
  });

  steps.push({
    id: CHATBOT_IDS.STOCK_SELECTION,
    message: ({ previousValue }) => {
      let selectedStock;
      stockData.forEach((exchange) => {
        exchange.topStocks.forEach((stock) => {
          if (stock.code === previousValue) {
            selectedStock = { ...stock };
          }
        });
      });

      if (selectedStock) {
        return `Stock price of ${selectedStock.stockName} is $${selectedStock.price}. Please select an option.`;
      }
      return "Invalid stock selection. Please try again.";
    },
    trigger: CHATBOT_IDS.STOCK_MENU,
  });

  steps.push({
    id: CHATBOT_IDS.STOCK_MENU,
    options: [
      {
        value: "stock",
        label: "Stock Menu",
        trigger: ({ steps }) => {
          let keys = ["NASDAQ", "LSE", "NYSE"];
          let filteredData = Object.entries(steps)
            .filter(([key]) => keys.includes(key))
            .map(([key, value]) => value);
          return filteredData[filteredData.length - 1].id;
        },
      },
      {
        value: "home",
        label: "Home Menu",
        trigger: CHATBOT_IDS.SELECT_EXCHANGE_OPTIONS,
      },
    ],
  });

  return steps;
};
