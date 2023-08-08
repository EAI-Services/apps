let anc = false, dc = false, alc = false, dlc = false
const base_url="http://localhost:8000"
$.get(`${base_url}/snow`)

//Page 1
$('#submit1').on('click', (e) => {
  e.preventDefault();
  let pw = document.getElementById("password").value;
  $.get(`${base_url}/snow/login/${pw}`, function (data) {
    if (data === 'success') {
      $('#page1').addClass('d-none')
      $('#page2').removeClass('d-none')
    }
    else {
      $('#failure').removeClass('d-none')
      setTimeout(hide, 2000)
    }
  });
})

function hide() {
  $('#failure').addClass('d-none')
}

//Page 2
$('#snow').on('click', () => {
  $('#page2').addClass('d-none')
  $('#page4').removeClass('d-none')
})
$('#lawn').on('click', () => {
  $('#page2').addClass('d-none')
  $('#page3').removeClass('d-none')
})

//Page 3
$('#currentData').on('click', () => {
  $.get(`${base_url}/lawn/printCurrent`, (data) => {
    var w = window.open();

    var html = "<!DOCTYPE HTML>";
    html += '<html lang="en-us">';
    html += '<head><title>Current Job Data</title><style></style></head>';
    html += "<body>";
    html += "<h1 align='center'>Current Job Data</h1>"
    html += "<h4 align='center'>Locations appearing on this list have NOT been serviced yet this week.</h4>"
    for (var [k, v] of Object.entries(data)) {
      html += k + '</br><br>'
      for (var [z, x] of Object.entries(v))
        html += z + ' : ' + x + '</br><br>'
    }

    html += "</body>";
    w.document.write(html);
    w.document.close();
  })
});
$('#mainData').on('click', () => {
  $.get(`${base_url}/lawn/printMain`, (data) => {
    var w = window.open();

    var html = "<!DOCTYPE HTML>";
    html += '<html lang="en-us">';
    html += '<head><title>Master Job Data</title><style></style></head>';
    html += "<body>";
    html += "<h1 align='center'>Master Data</h1>"
    html += "<h4 align='center'>This is the complete list of all locations pushed out every week.</h4>"
    for (var [k, v] of Object.entries(data)) {
      html += k + '</br><br>'
      for (var [z, x] of Object.entries(v))
        html += z + ' : ' + x + '</br><br>'
    }

    html += "</body>";
    w.document.write(html);
    w.document.close();
  })
});
$('#addNewContractor').on('click', () => {
  if (anc) {
    anc = false;
    $('#newContractorForm').addClass('d-none');
  } else {
    anc = true;
    $('#newContractorForm').removeClass('d-none');
  } 
});
$('#deleteContractor').on('click', () => {
  if (dc) {
    dc = false;
    $('#deleteContractorForm').addClass('d-none');
  } else {
    dc = true;
    $('#deleteContractorForm').removeClass('d-none');
  } 
})
$('#addLocation').on('click', () => {
  if (alc) {
    alc = false;
    $('#addLocationForm').addClass('d-none');
  } else {
    alc = true;
    $('#addLocationForm').removeClass('d-none');
  } 
})
$('#deleteLocation').on('click', () => {
  if (dlc) {
    dlc = false;
    $('#deleteLocationForm').addClass('d-none');
  } else {
    dlc = true;
    $('#deleteLocationForm').removeClass('d-none');
  } 
})

//Page 4
$('#snowData').on('click', () => {
  $.get(`${base_url}/snow/printData`, (data) => {
    var w = window.open();

    var html = "<!DOCTYPE HTML>";
    html += '<html lang="en-us">';
    html += '<head><title>Current Job Data</title><style></style></head>';
    html += "<body>";
    html += "<h1 align='center'>Snow Removal Data</h1>"
    html += "<h4 align='center'>This is the data for the EAI Mobile Snow Removal application.</h4>"
    for (var [k, v] of Object.entries(data)) {
      html += k + '</br><br>'
      for (var [z, x] of Object.entries(v))
        html += z + ' : ' + x + '</br><br>'
    }

    html += "</body>";
    w.document.write(html);
    w.document.close();
  })
});

$('#addNewContractor2').on('click', () => {
  if (anc) {
    anc = false;
    $('#newContractorForm2').addClass('d-none');
  } else {
    anc = true;
    $('#newContractorForm2').removeClass('d-none');
  } 
});
$('#deleteContractor2').on('click', () => {
  if (dc) {
    dc = false;
    $('#deleteContractorForm2').addClass('d-none');
  } else {
    dc = true;
    $('#deleteContractorForm2').removeClass('d-none');
  } 
})
$('#addLocation2').on('click', () => {
  if (alc) {
    alc = false;
    $('#addLocationForm2').addClass('d-none');
  } else {
    alc = true;
    $('#addLocationForm2').removeClass('d-none');
  } 
})
$('#deleteLocation2').on('click', () => {
  if (dlc) {
    dlc = false;
    $('#deleteLocationForm2').addClass('d-none');
  } else {
    dlc = true;
    $('#deleteLocationForm2').removeClass('d-none');
  } 
})
$('#resetData').on('click', () => {
  $.get(`${base_url}/lawn/manual`)
  alert("Data Reset")
})
module.exports = base_url;
