$("#page2").hide();
$("#page3").hide();
$("#page4").hide();
$("#sub").hide();
$("#uploading").hide();
$("#success").hide();
$("#continue1").hide();
let report = {}, picsTaken = 1;
const base_url="http://localhost:7000/lawn"
// const base_url="https://repl-merge.vercel.app/lawn"
//------******------
//-----PAGE 1-------
//------******------

//page 1 contractor select box
$("#contractor").on("change", function () {
  $("#continue1").show();
  let e = document.getElementById("contractor");
  let subNum = e.options[e.selectedIndex].text;
  report.subNum = subNum * 1

  $.ajax({
    type: "GET",
    url: `${base_url}/subs/${subNum}`, //change according
    dataType: 'json',
    success: function (data) {
      console.log(data)
      report.contractor = data.name;
      if (data.locations.length > 0) {
        data.locations.forEach(function (loc) {
          $("#locations").append(`<option value="${loc}">${loc}</option>`);
        });
        $("#continue1").removeClass('btn-warning').addClass('btn-success').html('Continue').prop('disabled', false);
      } else {
        alert('All Jobs Complete for this week. New Jobs will be available for this contractor on Monday at 12:01am')
        location.reload()
      }
    },
    error: function (data, status, error) {
      console.error(data, status, error)
    },
  });
});

//page 1 continue button
$("#continue1").on("click", function () {
  if (report.contractor) {
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

//page 2 continue btn
$("#continue2").on("click", function () {
  if (report.location) {
    $("#page2").hide();
    $("#page3").fadeIn();
  }
})

//------******------
//-----PAGE 3-------
//------******------

//page 3 continue btn
$("#continue3").on("click", function () {
  console.log('continue 3 clicked')
  $("input:checkbox").each(function () {
    $(this).prop('checked') ? report[$(this).attr("id")] = true : report[$(this).attr("id")] = false
  });
  let date = new Date();
  report.date = date.toString();
  console.log(report)
  if (report.mowed || report.blowed || report.weedeated || report.weedControl) {
    $("#page3").hide();
    $("#page4").fadeIn();
  } else alert("Please Check Work Completed");

})



var requestCount = 0
//page 4 submit button
$("#submit").on("click", function () {
  $.post(`${base_url}/data`, // url
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

function ping() {
  $.ajax({
    url: '',
    success: function (result) {
      alert('reply');
    },
    error: function (result) {
      alert('timeout/error');
    }
  });
}
module.exports = base_url;
