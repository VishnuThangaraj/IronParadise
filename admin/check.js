const fs = require('fs');
const path = require('path');
const file = fs.readFileSync('e:/Personal Project/IronParadise/admin/src/features/attendance/pages/Attendance.jsx', 'utf8');
try {
  new Function(file);
  console.log("No syntax error (or uncatchable by Function)");
} catch(e) {
  console.error("Error parsing file:", e.message);
}
