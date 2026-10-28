const KEY = "attendanceTrackerData";
let students = [];
try { students = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { students = []; }

const today = new Date().toISOString().slice(0, 10);
const $ = (id) => document.getElementById(id);

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(students)); } catch (e) {}
}

function mark(index, status) {
  students[index].records[today] = status;
  save();
  render();
}

function removeStudent(index) {
  students.splice(index, 1);
  save();
  render();
}

function render() {
  const rows = $("studentRows");
  rows.innerHTML = "";
  let present = 0, absent = 0, totalMarks = 0, presentMarks = 0;

  students.forEach((s, i) => {
    const status = s.records[today];
    if (status === "Present") present++;
    if (status === "Absent") absent++;
    Object.values(s.records).forEach((v) => {
      totalMarks++;
      if (v === "Present") presentMarks++;
    });
    const tr = document.createElement("tr");
    tr.innerHTML =
      "<td></td><td></td><td></td>" +
      "<td class='" + (status ? "tag-" + status.toLowerCase() : "") + "'>" + (status || "Not marked") + "</td>" +
      "<td><button class='present'>Present</button><button class='absent'>Absent</button><button class='remove'>Delete</button></td>";
    tr.children[0].textContent = s.name;
    tr.children[1].textContent = s.id;
    tr.children[2].textContent = s.department;
    tr.querySelector(".present").onclick = () => mark(i, "Present");
    tr.querySelector(".absent").onclick = () => mark(i, "Absent");
    tr.querySelector(".remove").onclick = () => removeStudent(i);
    rows.appendChild(tr);
  });

  $("totalStudents").textContent = students.length;
  $("presentToday").textContent = present;
  $("absentToday").textContent = absent;
  $("overallPercent").textContent = (totalMarks ? Math.round((presentMarks / totalMarks) * 100) : 0) + "%";

  const list = $("attendanceList");
  list.innerHTML = "<h3>Today's Attendance (" + today + ")</h3>";
  students.forEach((s) => {
    if (s.records[today]) {
      const d = document.createElement("div");
      d.textContent = s.name + " (" + s.id + ") - " + s.records[today];
      list.appendChild(d);
    }
  });
}

$("studentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("studentId").value.trim();
  if (students.some((s) => s.id === id)) { alert("Student ID already exists."); return; }
  students.push({ name: $("studentName").value.trim(), id, department: $("department").value.trim(), records: {} });
  save();
  e.target.reset();
  render();
});

render();
