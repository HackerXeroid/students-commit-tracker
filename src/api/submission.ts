import axiosInstance from ".";

async function GetAllSubmissions() {
  try {
    const res = await axiosInstance.get("/api/v1/submission/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}

interface Submission {
  assignmentId: string;
  studentId: string;
  githubLink: string;
}

async function CreateAndGradeSubmission(submission: Submission) {
  try {
    const res = await axiosInstance.post(
      "/api/v1/submission/create-and-grade",
      submission,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}

async function GradeSubmission(submission: {
  submissionId: string;
  githubLink: string;
}) {
  try {
    const res = await axiosInstance.post(
      "/api/v1/submission/grade",
      submission,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}

export { GetAllSubmissions, CreateAndGradeSubmission, GradeSubmission };
