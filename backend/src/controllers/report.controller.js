const PDFDocument = require("pdfkit");

const Student = require("../models/Student");
const Tutor = require("../models/Tutor");
const Course = require("../models/Course");
const Batch = require("../models/Batch");
const TimeTable = require("../models/TimeTable");

exports.downloadReport = async (req, res) => {
  try {
    const { type } = req.params;

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}-report.pdf`
    );

    doc.pipe(res);

    // ===== HEADER =====
    doc.fontSize(18).text("COACHING MANAGEMENT SYSTEM", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(10).text(
      `Generated On: ${new Date().toLocaleString()}`
    );
    doc.moveDown(2);

    let data = [];

    // ================= STUDENTS =================
    if (type === "students") {
      data = await Student.find().populate("course");

      doc.fontSize(14).text("Students Report", { align: "center" });
      doc.moveDown(2);

      drawTableHeader(doc, [
        "Name",
        "Email",
        "Mobile",
        "Course",
        "Admission Date",
        "Status",
      ]);

      data.forEach((s) => {
        checkPageBreak(doc);
        drawTableRow(doc, [
          s.name,
          s.email,
          s.mobile,
          s.course?.name || "",
          new Date(s.admissionDate).toLocaleDateString(),
          s.status,
        ]);
      });
    }

    // ================= TUTORS =================
    else if (type === "tutors") {
      data = await Tutor.find().populate("courses");

      doc.fontSize(14).text("Tutors Report", { align: "center" });
      doc.moveDown(2);

      drawTableHeader(doc, [
        "Name",
        "Email",
        "Mobile",
        "Courses",
        "Joining Date",
        "Status",
      ]);

      data.forEach((t) => {
        checkPageBreak(doc);
        drawTableRow(doc, [
          t.name,
          t.email,
          t.mobile,
          t.courses?.map((c) => c.name).join(", "),
          new Date(t.joiningDate).toLocaleDateString(),
          t.status,
        ]);
      });
    }

    // ================= COURSES =================
    else if (type === "courses") {
      data = await Course.find();

      doc.fontSize(14).text("Courses Report", { align: "center" });
      doc.moveDown(2);

      drawTableHeader(doc, [
        "Course Name",
        "Duration",
        "Fees",
        "Status",
      ]);

      data.forEach((c) => {
        checkPageBreak(doc);
        drawTableRow(doc, [
          c.name,
          c.duration,
          c.fees,
          c.status,
        ]);
      });
    }

    // ================= BATCHES =================
    else if (type === "batches") {
      data = await Batch.find().populate("course tutor");

      doc.fontSize(14).text("Batches Report", { align: "center" });
      doc.moveDown(2);

      drawTableHeader(doc, [
        "Batch Name",
        "Course",
        "Tutor",
        "Status",
      ]);

      data.forEach((b) => {
        checkPageBreak(doc);
        drawTableRow(doc, [
          b.name,
          b.course?.name || "",
          b.tutor?.name || "",
          b.status,
        ]);
      });
    }

    // ================= TIMETABLE =================
    else if (type === "timetables") {
      data = await TimeTable.find()
        .populate("course batch tutor");

      doc.fontSize(14).text("Timetable Report", { align: "center" });
      doc.moveDown(2);

      drawTableHeader(doc, [
        "Course",
        "Batch",
        "Tutor",
        "Days",
        "Start",
        "End",
      ]);

      data.forEach((tt) => {
        checkPageBreak(doc);
        drawTableRow(doc, [
          tt.course?.name || "",
          tt.batch?.name || "",
          tt.tutor?.name || "",
          tt.days.join(", "),
          tt.startTime,
          tt.endTime,
        ]);
      });
    }

    else {
      doc.text("Invalid Report Type");
    }

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// ================= TABLE HEADER =================
function drawTableHeader(doc, headers) {
  const startX = 30;
  const colWidth = 85;
  const rowHeight = 25;

  const y = doc.y;

  headers.forEach((header, i) => {
    doc
      .rect(startX + i * colWidth, y, colWidth, rowHeight)
      .stroke();

    doc.fontSize(10).text(
      header,
      startX + i * colWidth + 5,
      y + 8,
      { width: colWidth - 10 }
    );
  });

  doc.y = y + rowHeight;
}


// ================= TABLE ROW =================
function drawTableRow(doc, row) {
  const startX = 30;
  const colWidth = 85;
  const rowHeight = 25;

  const y = doc.y;

  row.forEach((cell, i) => {
    doc
      .rect(startX + i * colWidth, y, colWidth, rowHeight)
      .stroke();

    doc.fontSize(9).text(
      String(cell || ""),
      startX + i * colWidth + 5,
      y + 8,
      { width: colWidth - 10 }
    );
  });

  doc.y = y + rowHeight;
}


// ================= PAGE BREAK CHECK =================
function checkPageBreak(doc) {
  if (doc.y > 750) {
    doc.addPage();
    doc.y = 50;
  }
}
