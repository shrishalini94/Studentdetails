import React, { useState, useEffect } from "react";
import "./studentdeatils.css";
import studentsData from "./studentsData.json";

const Studentdetails = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    email: "",
    date_of_birth: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [validationError, setValidationError] = useState(null);
  useEffect(() => {
    setStudents(studentsData);
  }, []);

  const validateForm = () => {
    if (!newStudent.name.trim() || !newStudent.age.trim() || !newStudent.email.trim() || !newStudent.date_of_birth.trim()) {
      setValidationError("Please fill out all fields.");
      return false;
    }
    if (isNaN(newStudent.age) || parseInt(newStudent.age) <= 0) {
      setValidationError("Age must be a valid number greater than 0.");
      return false;
    }
    if (!validateEmail(newStudent.email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    const dob = new Date(newStudent.date_of_birth);
    if (isNaN(dob.getTime())) {
      setValidationError("Date of Birth must be a valid date.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const validateEmail = (email) => {
    // Regular expression for validating email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addStudent = () => {
    if (!validateForm()) return;

    const id = students.length > 0 ? students[students.length - 1].id + 1 : 1;
    setStudents([...students, { id, ...newStudent }]);
    setNewStudent({ name: "", age: "", email: "", date_of_birth: "" });
    setIsFormOpen(false);
  };

  const editStudent = () => {
    if (!validateForm()) return;

    const index = students.findIndex(student => student.id === editingStudentId);
    const updatedStudents = [...students];
    updatedStudents[index] = { id: editingStudentId, ...newStudent };
    setStudents(updatedStudents);
    setNewStudent({ name: "", age: "", email: "", date_of_birth: "" });
    setIsFormOpen(false);
    setIsEditing(false);
    setEditingStudentId(null);
  };

  const deleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const startEdit = (id, student) => {
    setNewStudent({ ...student });
    setIsFormOpen(true);
    setIsEditing(true);
    setEditingStudentId(id);
  };

  return (
    <div className="student-details-container">
      <h2>Student Details</h2>
      <button className="create-student-btn" onClick={() => setIsFormOpen(!isFormOpen)}>
        {isEditing ? "Cancel Edit" : "Create Student"}
      </button>

      {isFormOpen && (
        <div className="form-container">
          <h2>{isEditing ? "Edit Student" : "Add Student"}</h2>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Age"
              value={newStudent.age}
              onChange={(e) =>
                setNewStudent({ ...newStudent, age: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={newStudent.date_of_birth}
              onChange={(e) =>
                setNewStudent({ ...newStudent, date_of_birth: e.target.value })
              }
            />
            {validationError && <div className="error-message">{validationError}</div>}
            {isEditing ? (
              <button className="edit-btn" onClick={editStudent}>Save</button>
            ) : (
              <button className="delete-btn" onClick={addStudent}>Add Student</button>
            )}
          </div>
        </div>
      )}

      <table className="student-details-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.email}</td>
                <td>{student.date_of_birth}</td>
                <td>
                  <button className="delbutton" onClick={() => deleteStudent(student.id)}>
                    Delete
                  </button>
                  <button className="editbutton" onClick={() => startEdit(student.id, student)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No student data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Studentdetails
