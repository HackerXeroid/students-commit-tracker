import axiosInstance from ".";

async function GetAssignmentsData() {
  try {
    const response = await axiosInstance.get("/api/v1/assignments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

export { GetAssignmentsData };
