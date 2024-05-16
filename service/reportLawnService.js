const ExcelJS = require('exceljs');
const reportModel = require('../models/lawncareModel');

function createReport(data) {
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
function filterByYear(arr, year) {
    return arr.filter(function(obj) {
        const date = new Date(obj.date);
        const year_d = date.getFullYear();
        return year_d==year
    });
  }

function filterByMonth(arr, year, month) {
    return arr.filter(function(obj) {
        const date = new Date(obj.date);
        const year_d = date.getFullYear();
        const month_d = date.getMonth() + 1;
        return year_d==year&&month_d==month
    });
  }


async function createExcel(req, res) {
    try {
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
    const arr = await findAllReports();
    console.log(arr);
    let reports=arr
    
    if(req.query?.year){
       reports= filterByYear(arr,req.query.year)
    }
    if(req.query?.month){
        const year=String(req.query.month).split('-')[0]
        const month=String(req.query.month).split('-')[1]
        reports= filterByMonth(arr,year,month)
    }
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
    catch (error) {
       console.log(error) 
    }
}

module.exports = {
    createReport,
    createExcel
}