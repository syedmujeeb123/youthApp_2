import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportWithStatusToExcel = (submitted, pending, fields, filename = "Export") => {
  const combinedData = [];

  // Submitted students
  submitted.forEach((student) => {
    const row = {
      Name: student.name,
      Status: "Submitted",
      SubmittedAt: student.submittedAt?.toLocaleString() || "-",
    };
    fields.forEach((field) => {
      row[field.replace(/_/g, " ")] = student.formData?.[field]?.value || "-";
    });
    combinedData.push(row);
  });

  // Pending students
  pending.forEach((student) => {
    const row = {
      Name: student.name,
      Status: "Pending",
      SubmittedAt: "-",
    };
    fields.forEach((field) => {
      row[field.replace(/_/g, " ")] = "-";
    });
    combinedData.push(row);
  });

  // Create worksheet and workbook
  const ws = XLSX.utils.json_to_sheet(combinedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Summary");

  // Highlight pending rows (Status === "Pending") in red
  const redFill = {
    patternType: "solid",
    fgColor: { rgb: "FFCCCC" },
  };

  combinedData.forEach((row, i) => {
    if (row.Status === "Pending") {
      const excelRowIndex = i + 2; // +2 because Excel rows start from 1 and row 1 is headers
      const colRange = Object.keys(row).length;
      for (let j = 0; j < colRange; j++) {
        const colLetter = String.fromCharCode(65 + j);
        const cell = ws[`${colLetter}${excelRowIndex}`];
        if (!cell.s) cell.s = {};
        cell.s.fill = redFill;
      }
    }
  });

  // Enable styles (this only works if you use xlsx-style — optional advanced setup)
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true, // optional and not always supported
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${filename}.xlsx`);
};




// utils/exportUtils.js
export const exportSingleUserToExcel = (entry, name) => {
  const XLSX = require("xlsx");

  const rows = [];
  ["today", "yesterday"].forEach((day) => {
    const data = entry[day];
    if (data && data.formData) {
      const row = { Day: day.toUpperCase(), ...Object.fromEntries(
        Object.entries(data.formData).map(([k, v]) => [k, v.value || "-"])
      ) };
      row["Submitted At"] = data.submittedAt?.toDate?.().toLocaleString() || "-";
      rows.push(row);
    }
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Summary");
  XLSX.writeFile(wb, `${name}_summary.xlsx`);
};

// export const exportSingleStudentToExcel = (uid, name, todayData, yesterdayData) => {
//   const XLSX = require("xlsx");

//   const rows = [];

//   if (todayData) {
//     const row = { Day: "Today" };
//     for (const field of formFields) {
//       row[field] = todayData.formData?.[field]?.value || "-";
//     }
//     row["Submitted At"] = todayData.submittedAt?.toLocaleTimeString() || "-";
//     rows.push(row);
//   }

//   if (yesterdayData) {
//     const row = { Day: "Yesterday" };
//     for (const field of formFields) {
//       row[field] = yesterdayData.formData?.[field]?.value || "-";
//     }
//     row["Submitted At"] = yesterdayData.submittedAt?.toLocaleTimeString() || "-";
//     rows.push(row);
//   }

//   const ws = XLSX.utils.json_to_sheet(rows);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Summary");

//   XLSX.writeFile(wb, `${name}_summary.xlsx`);
// };


export const exportSingleStudentToExcel = (data, fields, studentName = "Student") => {
  const sheetData = data.map((entry) => {
    const row = {
      Date: entry.date,
      "Submitted At": entry.submittedAt || "-",
    };

    fields.forEach((field) => {
      row[field.replace(/_/g, " ")] = entry.formData?.[field]?.value || "-";
    });

    return row;
  });

  import("xlsx").then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(sheetData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Summary");
    xlsx.writeFile(workbook, `${studentName}_Summary.xlsx`);
  });
};









// src/utils/exportUtils.js
// import * as XLSX from "xlsx";

export const exportWeeklyStatusToExcel = (users, summaryMap, dates) => {
  const sheetData = [];

  // Header
  const header = ["Name", ...dates];
  sheetData.push(header);

  // Rows
  users.forEach((user) => {
    const row = [user.name];
    dates.forEach((date) => {
      const status = summaryMap[user.uid][date] ? "✅" : "❌";
      row.push(status);
    });
    sheetData.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Add red style to ❌
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = 1; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellRef];
      if (cell?.v === "❌") {
        cell.s = {
          font: { color: { rgb: "FF0000" }, bold: true },
        };
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Weekly Summary");
  XLSX.writeFile(wb, "Weekly_Summary.xlsx");
};
