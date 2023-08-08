const ExcelJS = require('exceljs');
const reportModel = require('../models/lawncareModel');

function createReport(data) {
    console.log(data)
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    data.createdAt = now;
    data.updatedAt = now;
    return new Promise((res, rej) => {
        reportModel
        .create(data)
        .then(report => res(report))
        .catch(err => rej('DB ERROR', err));
    });
}

function findAllReports() {
    return new Promise((res, rej) => {
        reportModel
        .findAll()
        .then(report => res(report))
        .catch(err => rej(report))
    });
}

async function createExcel(req, res) {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet("Reports");
    worksheet.columns = [
        { header: "Id", key: "id", width: 5 },
        { header: "Contractor", key: "contractor", width: 25 },
        { header: "Location", key: "location", width: 50 },
        { header: "Date", key: "date", width: 50 },
        { header: "Mowed Grass", key: "mowed", width: 15 },
        { header: "Used Blower", key: "blowed", width: 15 },
        { header: "Weedeated", key: "weedeated", width: 15 },
        { header: "Weed Control", key: "weedControl", width: 15 },
    ];
    const reports = await findAllReports();
    worksheet.addRows(reports);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "LawnCareReports.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}

module.exports = {
    createReport,
    createExcel
}