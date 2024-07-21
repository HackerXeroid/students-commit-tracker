import axiosInstance from ".";

async function GetDateSpecificLeaderboard(date: Date) {
  try {
    const fullYear = date.getFullYear().toString().padStart(4, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${fullYear}-${month}-${day}`;

    const response = await axiosInstance.get("/api/v1/leaderboard", {
      params: {
        date: formattedDate,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function GetAllTimeLeaderboard() {
  try {
    const response = await axiosInstance.get("/api/v1/leaderboard/all-time");
    return response.data;
  } catch (err) {
    throw err;
  }
}

export { GetDateSpecificLeaderboard, GetAllTimeLeaderboard };
