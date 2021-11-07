const studentSubmitForm = window["student-submit-form"]; // get form for student submission
const examSuccessForm = window["exam-success-form"]; // get form for exam result submission
const modal = window["modal-field"]; // get the modal
const studentsTable = window["students-table-body"]; // get table body
const resultsTable = window["results-table-body"]; // get table body
const closeBtn = window["close-btn"]; // get close button
const closeSpan = window["close-span"]; // get the <span> element that closes the modal

const students = []; // empty array for students
let examResultsList = []; // empty array for exam results

// Function to create a new Student object and save it in an array
const createStudent = (fullName) => {
  const check = students.find((student) => student.fullName === fullName);
  if (check) {
    alert("Bu adda tələbə siyahıda mövcuddur");
    return;
  }
  students.push({
    fullName,
    examList: [],
    bestPerformance: "",
    lowestPerformance: "",
    avarage: "",
  });
};

// Function to create a row in the table for each student
const createTableRow = (student) => {
  tableRow = document.createElement("tr");
  numberCell = document.createElement("td");
  numberCell.textContent = students.indexOf(student) + 1;
  tableRow.append(numberCell);
  for (const key in student) {
    const tableCell = document.createElement("td");
    if (key == "examList") {
      anchor = document.createElement("a");
      anchor.textContent = "Exam Results";
      anchor.setAttribute("class", "text-info");
      anchor.addEventListener("click", () => {
        modal.style.display = "block";
        const studentId = students.indexOf(student);
        closeBtn.setAttribute("value", studentId);
        closeSpan.setAttribute("value", studentId);
        modal.setAttribute("value", studentId);
        if (student.examList) {
          examResultsList = student.examList;
          updateResultsTable();
        }
      });
      tableCell.append(anchor);
    } else {
      tableCell.textContent = student[key];
    }
    tableRow.append(tableCell);
  }
  studentsTable.append(tableRow);
};

// Function to create a row in the table for each exam result
const createResultsTableRow = (result) => {
  tableRow = document.createElement("tr");
  numberCell = document.createElement("td");
  numberCell.textContent = examResultsList.indexOf(result) + 1;
  tableRow.append(numberCell);
  for (const key in result) {
    const tableCell = document.createElement("td");
    tableCell.textContent = result[key];
    tableRow.append(tableCell);
  }
  resultsTable.append(tableRow);
};

// Function to Update Students Table
const updateTable = () => {
  studentsTable.innerHTML = "";
  students.forEach((student) => createTableRow(student));
};

// Function to Update Exam Results Table
const updateResultsTable = () => {
  resultsTable.innerHTML = "";
  examResultsList.forEach((result) => createResultsTableRow(result));
};

// Students Form Submit Event
studentSubmitForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = e.currentTarget.elements.name.value.trim();
  if (name) {
    createStudent(name);
    updateTable();
    studentSubmitForm.reset();
  } else {
    alert("Tələbənin ad və soyadını daxil edin");
  }
});

// Exam Results Form Submit
examSuccessForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const subject = e.currentTarget.subject.value;
  const result = e.currentTarget.result.value;
  const check = examResultsList.find((exam) => exam.subject === subject);
  if (check) {
    examResultsList[examResultsList.indexOf(check)]["result"] = result;
  } else {
    examResultsList.push({
      subject,
      result,
    });
  }
  updateResultsTable();
  examSuccessForm.reset();
});

// Avarage exam result
const average = arr => Math.round((arr.reduce((a, b) => { return a + b; }, 0) / arr.length))  || "";
// Add exam results to student object
const closeModal = (index) => {
  if (examResultsList) {
    students[index]["examList"] = examResultsList;
    const resultArr = [];
    for (const exam in examResultsList) {
      resultArr.push(parseInt(examResultsList[exam]["result"]));
    }
    resultArr.sort((a,b) => {return a-b});
    students[index]["bestPerformance"] = resultArr[0];
    students[index]["lowestPerformance"] = resultArr[resultArr.length - 1];
    students[index]["avarage"] = average(resultArr);
    updateTable();
  }
  examResultsList = [];
  modal.style.display = "none";
};

// Close Exam List Modal page
closeBtn.addEventListener("click", () => closeModal(closeBtn.value));

// When the user clicks on <span> (x), close the modal
closeSpan.addEventListener("click", () =>
  closeModal(closeSpan.getAttribute("value"))
);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == modal) closeModal(modal.getAttribute("value"));
});
