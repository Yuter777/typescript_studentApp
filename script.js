"use strict";
let students = JSON.parse(localStorage.getItem("students") || "[]");
let editingStudentId = null;
const studentTableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const filterDegree = document.getElementById("filterDegree");
const filterSpeciality = document.getElementById("filterSpeciality");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".closeBtn");
const addStudentBtn = document.getElementById("addStudentBtn");
const studentForm = document.getElementById("studentForm");
function renderStudents() {
    studentTableBody.innerHTML = "";
    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            student.surname.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesDegree = filterDegree.value === "" || student.degree === filterDegree.value;
        const matchesSpeciality = filterSpeciality.value === "" ||
            student.speciality === filterSpeciality.value;
        return matchesSearch && matchesDegree && matchesSpeciality;
    });
    filteredStudents.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.surname}</td>
          <td>${student.address}</td>
          <td>${student.dob}</td>
          <td>${student.speciality}</td>
          <td>${student.degree}</td>
          <td>${student.salary}</td>
          <td>${student.married ? "Yes" : "No"}</td>
          <td>
          <button onclick="editStudent(${student.id})" class="edit-icon"><i class="fas fa-edit"></i></button>
          <button onclick="deleteStudent(${student.id})" class="delete-icon"><i class="fas fa-trash"></i></button>
      </td>      `;
        studentTableBody.appendChild(row);
    });
}
function addStudent(event) {
    event.preventDefault();
    const newStudent = {
        id: editingStudentId !== null && editingStudentId !== void 0 ? editingStudentId : Date.now(),
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        address: document.getElementById("address").value,
        dob: document.getElementById("dob").value,
        speciality: document.getElementById("speciality")
            .value,
        degree: document.getElementById("degree").value,
        salary: parseFloat(document.getElementById("salary").value),
        married: document.getElementById("married").checked,
    };
    if (editingStudentId !== null) {
        students = students.map((student) => student.id === editingStudentId ? newStudent : student);
        editingStudentId = null;
    }
    else {
        students.push(newStudent);
    }
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
    closeModal();
}
function editStudent(id) {
    const student = students.find((student) => student.id === id);
    if (student) {
        document.getElementById("name").value = student.name;
        document.getElementById("surname").value =
            student.surname;
        document.getElementById("address").value =
            student.address;
        document.getElementById("dob").value = student.dob;
        document.getElementById("speciality").value =
            student.speciality;
        document.getElementById("degree").value =
            student.degree;
        document.getElementById("salary").value =
            student.salary.toString();
        document.getElementById("married").checked =
            student.married;
        editingStudentId = student.id;
        openModal("Edit Student");
    }
}
function deleteStudent(id) {
    students = students.filter((student) => student.id !== id);
    localStorage.setItem("students", JSON.stringify(students));
    renderStudents();
}
function openModal(title) {
    document.getElementById("modalTitle").innerText =
        title;
    modal.style.display = "flex";
}
function closeModal() {
    modal.style.display = "none";
}
searchInput.addEventListener("input", renderStudents);
filterDegree.addEventListener("change", renderStudents);
filterSpeciality.addEventListener("change", renderStudents);
studentForm.addEventListener("submit", addStudent);
closeBtn.addEventListener("click", closeModal);
addStudentBtn.addEventListener("click", () => openModal("Add Student"));
renderStudents();
