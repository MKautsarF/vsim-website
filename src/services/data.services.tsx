import services from ".";

export const getLatestResults = async () => {
  const res = await services.get("/Results");
  return res.data;
};

export const getAllResults = async () => {
  const res = await services.get("/AllResults");
  return res.data;
};

export const getPerResult = async (id: number | string) => {
  const res = await services.get(`/Results/${id}`);
  return res.data;
};
