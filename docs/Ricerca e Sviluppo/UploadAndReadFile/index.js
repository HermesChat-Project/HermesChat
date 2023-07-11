//sull'onload della pagina
window.onload = async function () {
  let token;
  //set interval
  //setInterval(async function () {
  let response = await fetch("https://10.88.251.84:8090/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    withCredentials: true,
    body: JSON.stringify({
      username: "Paolo23",
      password: "Paolo23gay",
    }),
  });

  let result = await response.json();
  console.log(result);
  console.log(response.headers);

  //how to read cookie set by server



  for (let [key, value] of response.headers) {
    console.log(`${key} = ${value}`);
    if (key == "authorization") {
      token = value;
    }
  }


  /*const xhr = new XMLHttpRequest();
  
  

  xhr.open("POST", "https://10.88.251.84:8090/getChats", true); // Specify the URL and method
  xhr.withCredentials = true;
 xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200) {
      // Request was successful
      console.log("AAAAAAAAAA");
    } else {
      // Request failed
      console.error("File upload failed.");
    }
  };

  xhr.onerror = function () {
    // Request error
    console.error("An error occurred while sending the request.");
  };

  xhr.send();*/
  /*token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODczMzg4NjQsInN1YiI6IjY0MDFjNjVjMDFjNmU5NDU4ZTYyZWMwYSJ9.HRccDCego5fru3in1QZocPEZBKwR6abHPxWbkgWuNJs"	
  let response2 = await fetch("https://10.88.251.84:8090/getChats", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      "Authorization": token},
    withCredentials: true
  });

  let result2 = await response2.json();
  console.log(result2);
  for (let [key, value] of response2.headers) {
    console.log(`${key} = ${value}`);
  }*/

  $("#submit").on("click", function () {
    const fileInput = document.getElementById("fileInput");
    //get every files and add to the form data
    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append("file", fileInput.files[i]);
    }
    
    var chatIds = []; // Array of chatIds
    for(let i = 0; i < fileInput.files.length; i++){
      chatIds.push("63ee875e5f8af6bbe5d63acb");
    }
    for (var i = 0; i < chatIds.length; i++) {
      formData.append("chatId", chatIds[i]);
    }

    console.log(formData);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://10.88.251.84:8090/sendFile", true); // Specify the URL and method

    
    // Set up event handlers for the XMLHttpRequest object
    xhr.onload = function () {
      if (xhr.status === 200) {
        // Request was successful
        console.log("File uploaded successfully.");
      } else {
        // Request failed
        console.error("File upload failed.");
      }
    };

    xhr.onerror = function () {
      // Request error
      console.error("An error occurred while sending the request.");
    };

    // Send the form data as the request payload
    xhr.send(formData);
  });
};
/*
function submitForm(event) {
  event.preventDefault(); // Prevent default form submission

  // Get the file input element
  const fileInput = document.getElementById('fileInput');
  //get every files and add to the form data
  const formData = new FormData();
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('file', fileInput.files[i]);
  }

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://10.88.251.84:8090/sendFile', true); // Specify the URL and method

  // Set up event handlers for the XMLHttpRequest object
  xhr.onload = function() {
    if (xhr.status === 200) {
      // Request was successful
      console.log('File uploaded successfully.');
    } else {
      // Request failed
      console.error('File upload failed.');
    }
  };

  xhr.onerror = function() {
    // Request error
    console.error('An error occurred while sending the request.');
  };

  // Send the form data as the request payload
  xhr.send(formData);
}
*/

function inviaRichiesta(method, url, parameters = {}, headers = {}) {
  let contentType;
  if (method.toUpperCase() == "GET") {
    contentType = "application/x-www-form-urlencoded; charset=UTF-8";
  } else {
    contentType = "application/json; charset=utf-8";
    parameters = JSON.stringify(parameters);
    headers["Content-Type"] = contentType;
    headers = JSON.stringify(headers);
  }

  return $.ajax({
    url: url, //default: currentPage
    type: method,
    data: parameters,
    headers: {
      Authorization: `Bearer ${headers}`,
    },
    contentType: contentType,
    dataType: "json",
    timeout: 7500,
  });
}

function errore(jqXHR, testStatus, strError) {
  if (jqXHR.status == 0) alert("Connection refused or Server timeout");
  else if (jqXHR.status == 200)
    alert("Formato dei dati non corretto : " + jqXHR.responseText);
  else alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}
