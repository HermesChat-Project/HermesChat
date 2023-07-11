"use strict";

$(document).ready(function() {
    let ausEmail = 0;
    let ausName = 0;
    let ausSurname = 0;
    let ausNickname = 0;
    let ausPassword = 0;
    let ausPasswordAck = 0;
    $("#txtEmail").on("keyup", function() {
        if($("#txtEmail").val() != "") {
            ausEmail = 1;
        }
        else {
            ausEmail = 0;
        }
        $("#progressBar").css("width", (ausEmail+ausName+ausSurname+ausNickname+ausPassword+ausPasswordAck)*16.666666666667+"%");
    })


    $("#txtName").on("keyup", function() {
        if($("#txtName").val() != "") {
            ausName = 1;
        }
        else {
            ausName = 0;
        }
        $("#progressBar").css("width", (ausEmail+ausName+ausSurname+ausNickname+ausPassword+ausPasswordAck)*16.666666666667+"%");
    })

    $("#txtSurname").on("keyup", function() {
        if($("#txtSurname").val() != "") {
            ausSurname = 1;
        }
        else {
            ausSurname = 0;
        }
        $("#progressBar").css("width", (ausEmail+ausName+ausSurname+ausNickname+ausPassword+ausPasswordAck)*16.666666666667+"%");
    })
    $("#txtNickname").on("keyup", function() {
        if($("#txtNickname").val() != "") {
            ausNickname = 1;
        }
        else {
            ausNickname = 0;
        }
        $("#progressBar").css("width", (ausEmail+ausName+ausSurname+ausNickname+ausPassword+ausPasswordAck)*16.666666666667+"%");
    })
    $("#txtPassword").on("keyup", function() {
        if($("#txtPassword").val() != "") {
            ausPassword = 1;
        }
        else {
            ausPassword = 0;
        }
        $("#progressBar").css("width", (ausEmail+ausName+ausSurname+ausNickname+ausPassword+ausPasswordAck)*16.666666666667+"%");
    })
    $("#txtPasswordAck").on("keyup", function() {
        if($("#txtPasswordAck").val() != "") {
            ausPasswordAck = 1;
        }
        else {
            ausPasswordAck = 0;
        }
        $("#progressBar").css("width", (ausEmail+ausName+ausSurname+ausNickname+ausPassword+ausPasswordAck)*16.666666666667+"%");
    })
    $("#txtPasswordAck").on("change", function() {
        if($("#txtPasswordAck").val() != $("#txtPassword").val()) {
            $("#txtPasswordAck").addClass("is-invalid");
            $("#errorConfirmPassword").show();
        }
        else {
            $("#txtPasswordAck").removeClass("is-invalid");
            $("#errorConfirmPassword").hide();
        }
    })

});