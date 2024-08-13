interface Student {
  id: number;
  name: string;
  surname: string;
  address: string;
  dob: string;
  speciality: string;
  degree: string;
  salary: number;
  married: boolean;
}

let students: Student[] = JSON.parse(localStorage.getItem("students") || "[]");
let editingStudentId: number | null = null;

const studentTableBody = document.getElementById("studentTableBody")!;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const filterDegree = document.getElementById(
  "filterDegree"
) as HTMLSelectElement;
const filterSpeciality = document.getElementById(
  "filterSpeciality"
) as HTMLSelectElement;
const modal = document.getElementById("modal")!;
const closeBtn = document.querySelector(".closeBtn")!;
const addStudentBtn = document.getElementById("addStudentBtn")!;
const studentForm = document.getElementById("studentForm") as HTMLFormElement;

function renderStudents() {
  studentTableBody.innerHTML = "";

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchInput.value.toLowerCase());
    const matchesDegree =
      filterDegree.value === "" || student.degree === filterDegree.value;
    const matchesSpeciality =
      filterSpeciality.value === "" ||
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
          <button onclick="editStudent(${
            student.id
          })" class="edit-icon"><i class="fas fa-edit"></i></button>
          <button onclick="deleteStudent(${
            student.id
          })" class="delete-icon"><i class="fas fa-trash"></i></button>
      </td>      `;
    studentTableBody.appendChild(row);
  });
}

function addStudent(event: Event) {
  event.preventDefault();

  const newStudent: Student = {
    id: editingStudentId ?? Date.now(),
    name: (document.getElementById("name") as HTMLInputElement).value,
    surname: (document.getElementById("surname") as HTMLInputElement).value,
    address: (document.getElementById("address") as HTMLInputElement).value,
    dob: (document.getElementById("dob") as HTMLInputElement).value,
    speciality: (document.getElementById("speciality") as HTMLSelectElement)
      .value,
    degree: (document.getElementById("degree") as HTMLSelectElement).value,
    salary: parseFloat(
      (document.getElementById("salary") as HTMLInputElement).value
    ),
    married: (document.getElementById("married") as HTMLInputElement).checked,
  };

  if (editingStudentId !== null) {
    students = students.map((student) =>
      student.id === editingStudentId ? newStudent : student
    );
    editingStudentId = null;
  } else {
    students.push(newStudent);
  }

  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
  closeModal();
}

function editStudent(id: number) {
  const student = students.find((student) => student.id === id);
  if (student) {
    (document.getElementById("name") as HTMLInputElement).value = student.name;
    (document.getElementById("surname") as HTMLInputElement).value =
      student.surname;
    (document.getElementById("address") as HTMLInputElement).value =
      student.address;
    (document.getElementById("dob") as HTMLInputElement).value = student.dob;
    (document.getElementById("speciality") as HTMLSelectElement).value =
      student.speciality;
    (document.getElementById("degree") as HTMLSelectElement).value =
      student.degree;
    (document.getElementById("salary") as HTMLInputElement).value =
      student.salary.toString();
    (document.getElementById("married") as HTMLInputElement).checked =
      student.married;

    editingStudentId = student.id;
    openModal("Edit Student");
  }
}

function deleteStudent(id: number) {
  students = students.filter((student) => student.id !== id);
  localStorage.setItem("students", JSON.stringify(students));
  renderStudents();
}

function openModal(title: string) {
  (document.getElementById("modalTitle") as HTMLHeadingElement).innerText =
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
