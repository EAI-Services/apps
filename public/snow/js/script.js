$("#page2").hide();
$("#page3").hide();
$("#page4").hide();
$("#sub").hide();
$("#uploading").hide();
$("#success").hide();
$("#continue1").hide()
let report = {}, picsTaken = 1;
// const base_url="http://localhost:7000/snow"
const base_url="http://eaievv.com"
// const base_url="https://repl-merge.vercel.app/snow"

//------******------
//-----PAGE 1-------
//------******------

//page 1 visit btns
$("#newVisit").on("click", function () {
  report.visit = "New Visit";
  console.log(report.visit)
  $(".btns").removeClass("btn-success");
  $("#newVisit").addClass("btn-success");
});
$("#returnVisit").on("click", function () {
  report.visit = "Return Visit";
  console.log(report.visit)
  $(".btns").removeClass("btn-success");
  $("#returnVisit").addClass("btn-success");
});

//page 1 contractor select box
$("#contractor").on("change", function () {
  $("#continue1").show();
  let e = document.getElementById("contractor");
  let subNum = e.options[e.selectedIndex].text;
  console.log('Num==>',subNum)

  $.ajax({
    type: "GET",
    url: `${base_url}/subs/${subNum}`, //change according
    dataType: 'json',
    success: function (data) {
      console.log(data)
      report.contractor = data.name;
      data.locations.forEach(function (loc) {
        $("#locations").append(`<option value="${loc}">${loc}</option>`);
      });
      $("#continue1").removeClass('btn-warning').addClass('btn-success').html('Continue').prop('disabled', false);
    },
    error: function (data, status, error) {
      console.error(data, status, error)
    },
  });
});

//page 1 continue button
$("#continue1").on("click", function () {
  console.log(report)
  if (report.contractor && report.visit) {
    $("#page1").hide();
    $("#page2").fadeIn();
  }
});

//------******------
//-----PAGE 2-------
//------******------

//page 2 locations select box
$("#locations").on("change", function () {
  let e = document.getElementById("locations");
  let locationName = e.options[e.selectedIndex].text;
  report.location = locationName;
  console.log(report);
});

//page 2 snow amount select box
$("#snow").on("change", function () {
  let e = document.getElementById("snow");
  let snowAmt = e.options[e.selectedIndex].text;
  report.snow = snowAmt;
  console.log(report);
});

//page 2 continue btn
$("#continue2").on("click", function () {
  $("input:checkbox").each(function () {
    $(this).prop('checked') ? report[$(this).attr("id")] = true : report[$(this).attr("id")] = false
  });
  let date = new Date();
  report.date = date.toString();
  console.log(report)
  if (report.saltedParkingLot || report.saltedSidewalks || report.shoveledSidewalks || report.plowedParkingLot) {
    $("#page2").hide();
    $("#page3").fadeIn();
  } else alert("Please Check Work Completed");
})

//page 3 continue btn
$("#continue3").on("click", function () {
  if (report.snow && report.location) {
    $("#page3").hide();
    $("#page4").fadeIn();
  }
})

//------******------
//-----PAGE 3-------
//------******------

var requestCount = 0
//page 3 submit button
$("#submit").on("click", function () {
  $.post(
      `${base_url}/data`, // url
      report, // data to be submit
      function (data, status, jqXHR) {
        console.log(data, status, jqXHR);
      }
    );

  $("#page4").hide();
  $('#logo').hide();
  $("#uploading").fadeIn();

  setTimeout(function () {
    $("#uploading").fadeOut();
  }, 5000);

  setTimeout(function () {
    $("#success").fadeIn()
    var request = new XMLHttpRequest();
    request.open("GET", `${base_url}/mail`);
    request.send();
  }, 5500);

  setTimeout(function () {
    location.reload();
  }, 6500);

});



function readURL(input) {

  var fd = new FormData();
  var image = event.target.files[0];

  var output = document.getElementById(`pic${picsTaken}`);
  fileURI = URL.createObjectURL(image);
  output.src = fileURI
  fd.append('file', image);

  var request = new XMLHttpRequest();
  request.open("POST", `${base_url}/uploadFiles`);
  request.send(fd);
  console.log('uploading picture...')
  requestCount++

  output.onload = function () {
    URL.revokeObjectURL(output.src) // free memory
  }

  picsTaken += 1
  if (picsTaken === 5) $('#sub').fadeIn()
}

$("#imgUpload").change(function () {
  readURL(this);
});

$('.picBlock, #yourBtn').on('click', function () {
  if (picsTaken < 5) document.getElementById('imgUpload').click()
})
module.exports = base_url;
