export const fetchWarStats = async (warId: string) => {
  const response = await fetch(
    `https://clash-of-lens.onrender.com/warstats?id=${warId}`
  );
  const data = await response.json();
  console.log("War stats", data);
  return data;
};
