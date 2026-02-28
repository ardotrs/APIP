const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const db = require('../config/db');

const loadAssignments = () =>
  db.query(
    `SELECT letter_number, activity_name, location, start_date, end_date, team_name, status
     FROM assignments
     ORDER BY start_date DESC`
  );

const exportExcel = async (req, res, next) => {
  try {
    const { rows } = await loadAssignments();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Penugasan');

    sheet.columns = [
      { header: 'Nomor Surat', key: 'letter_number', width: 20 },
      { header: 'Kegiatan', key: 'activity_name', width: 30 },
      { header: 'Lokasi', key: 'location', width: 20 },
      { header: 'Mulai', key: 'start_date', width: 15 },
      { header: 'Selesai', key: 'end_date', width: 15 },
      { header: 'Tim', key: 'team_name', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
    ];

    rows.forEach((row) => sheet.addRow(row));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="penugasan.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

const exportPdf = async (req, res, next) => {
  try {
    const { rows } = await loadAssignments();
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="penugasan.pdf"');
    doc.pipe(res);

    doc.fontSize(16).text('Laporan Penugasan SIP-PEDAS', { align: 'center' });
    doc.moveDown();

    rows.forEach((row, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${row.letter_number} | ${row.activity_name} | ${row.location} | ${row.start_date.toISOString().split('T')[0]} - ${row.end_date.toISOString().split('T')[0]} | ${row.status}`
        );
      doc.moveDown(0.3);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportExcel,
  exportPdf,
};
