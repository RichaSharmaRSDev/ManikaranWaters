const IST = { timeZone: "Asia/Kolkata" };

export const todayIST = () =>
  new Date().toLocaleDateString("en-CA", IST);

export const yesterdayIST = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA", IST);
};

export const tomorrowIST = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-CA", IST);
};

export const dateToIST = (date) =>
  new Date(date).toLocaleDateString("en-CA", IST);
