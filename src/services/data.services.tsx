import services from ".";

export const getLatestResults = async () => {
  const res = await services.get("/Results");
  return res.data;
};
