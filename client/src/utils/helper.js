import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) {
    return "";
  }
  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";
  const [integerPart, fractionPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fractionPart
    ? `${formattedInteger}.${fractionPart}`
    : formattedInteger;
};

// export const prepareExpenseBarChartData = (data = []) => {
//   console.log(data);

//   const chartData = data.map((item) => ({
//     category: item.category,
//     amount: item.amount,
//   }));
//   return chartData;
// };

// export const prepareIncomeBarChartData = (data = []) => {
//   const sortedData = [...data].sort(
//     (a, b) => new Date(a.date) - new Date(b.date)
//   );
//   const chartData = sortedData.map((item) => ({
//     month: moment(item.date).format("Do MM"),
//     amount: item.amount,
//     source: item.source,
//   }));
//   return chartData;
// };

export const prepareExpenseBarChartData = (data = []) => {
  // Sort by date for a cleaner timeline
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Group by category (sum up category totals)
  const categoryMap = {};
  sortedData.forEach((item) => {
    const category = item.category || "Uncategorized";
    categoryMap[category] = (categoryMap[category] || 0) + item.amount;
  });

  const chartData = Object.entries(categoryMap).map(([category, amount]) => ({
    label: category,
    amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const chartData = sortedData.map((item) => ({
    label: moment(item.date).format("Do MMM"),
    amount: item.amount,
    source: item.source,
  }));
  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MM"),
    amount: item?.amount,
    category: item?.category,
  }));
  return chartData;
};
