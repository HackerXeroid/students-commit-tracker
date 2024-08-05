import axiosInstance from ".";

async function GetAllAssignments() {
  try {
    const response = await axiosInstance.get("/api/v1/assignment", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function CreateAssignment(title: string, description: string, dueDate: string, totalScore: number) {
  try {
    const response = await axiosInstance.post("/api/v1/assignment", {
      title,
      description,
      dueDate,
      totalScore
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

interface AssignmentObj {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  totalScore?: number;
}

async function EditAssignment(assignmentObj: AssignmentObj) {
  try {
    const response = await axiosInstance.put(`/api/v1/assignment/${assignmentObj.id}`, assignmentObj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export { GetAllAssignments, CreateAssignment, EditAssignment };