"use strict";

$(document).ready(function () {
  $("#opt1").on("keyup", function (e) {
    if (e.keyCode == 32) {
      $("#opt1").val("");
    } else if (e.keyCode != 8 && e.keyCode != 46) {
      $("#opt1").val(e.key);
      $("#opt2").focus();
    }
  });
  opt1.onpaste = function (event) {
    let pastedData = event.clipboardData.getData("text/plain");
    pastedData = pastedData.trim();
    console.log(pastedData);
    if (pastedData.length == 6) {
      //copio ogni singolo carattere e lo inserisco in ogni input
      $("#opt1").val(pastedData[0]);
      $("#opt2").val(pastedData[1]);
      $("#opt3").val(pastedData[2]);
      $("#opt4").val(pastedData[3]);
      $("#opt5").val(pastedData[4]);
      $("#opt6").val(pastedData[5]);
      $("#btnSubmit").focus();
    }
    event.preventDefault();
  };

  $("#opt2").on("keyup", function (e) {
    if (e.keyCode == 8) {
      $("#opt1").focus();
    } else if (e.keyCode == 32) {
      $("#opt2").val("");
    } else if (e.keyCode != 46) {
      $("#opt2").val(e.key);
      $("#opt3").focus();
    }
  });
  $("#opt3").on("keyup", function (e) {
    if (e.keyCode == 8) {
      $("#opt2").focus();
    } else if (e.keyCode == 32) {
      $("#opt3").val("");
    } else if (e.keyCode != 46) {
      $("#opt3").val(e.key);
      $("#opt4").focus();
    }
  });
  $("#opt4").on("keyup", function (e) {
    if (e.keyCode == 8) {
      $("#opt3").focus();
    } else if (e.keyCode == 32) {
      $("#opt3").val("");
    } else if (e.keyCode != 46) {
      $("#opt4").val(e.key);
      $("#opt5").focus();
    }
  });
  $("#opt5").on("keyup", function (e) {
    if (e.keyCode == 8) {
      $("#opt4").focus();
    } else if (e.keyCode == 32) {
      $("#opt4").val("");
    } else if (e.keyCode != 46) {
      $("#opt5").val(e.key);
      $("#opt6").focus();
    }
  });
  $("#opt6").on("keyup", function (e) {
    if (e.keyCode == 8) {
      $("#opt5").focus();
    } else if (e.keyCode == 32) {
      $("#opt5").val("");
    } else if (e.keyCode != 46) {
      $("#opt6").val(e.key);
      $("#btnSubmit").focus();
    }
  });
});
