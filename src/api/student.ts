import axiosInstance from ".";

async function GetAssignments() {
  try {
    const response = await axiosInstance.get("/api/v1/student/assignments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function GetAllStudents() {
  try {
    const response = await axiosInstance.get("/api/v1/student", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    console.log(response, "response");
    return response.data;
  } catch (err) {
    throw err;
  }
}

export { GetAssignments, GetAllStudents };
