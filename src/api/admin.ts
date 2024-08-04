import axiosInstance from ".";

export async function GetAllTeacherStatus() {
  try {
    const response = await axiosInstance.get("/api/v1/admin/all-teacher-status", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function ApproveTeacher(teacherId: string) {
  try {
    const response = await axiosInstance.patch(`/api/v1/admin/approve/${teacherId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error approving teacher:', error);
    throw error;
  }
}

export async function RejectTeacher(teacherId: string) {
  try {
    const response = await axiosInstance.patch(`/api/v1/admin/reject/${teacherId}`, {}, 
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error rejecting teacher:', error);
    throw error;
  }
}
