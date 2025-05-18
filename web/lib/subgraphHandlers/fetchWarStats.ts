export const fetchWarStats = async (warId: string) => {
  const response = await fetch(`http://localhost:4000/warstats?id=${warId}`);
  const data = await response.json();
  console.log("War stats", data);
  return data;
};
