
//sull'onload della pagina
window.onload = async function () {
  let token;
  //set interval
  //setInterval(async function () { 
  let response = await fetch('https://api.hermeschat.it:8090/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ 
      username: "Paolo23",
      password: "Paolo23gay"})
  });
  
  let result = await response.json();
  console.log(result);
  console.log(response.headers);
  for (let [key, value] of response.headers) {
    console.log(`${key} = ${value}`);
    if (key == 'authorization') {
      token = value;
    }
  }
  console.log(token)
   

  let response2 = await fetch('https://api.hermeschat.it:8090/getFriends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': `${token}`
    },
    body: JSON.stringify({ 
      username: "Paolo23",
      password: "Paolo23gay"})
  });
  
  let result2 = await response2.json();
  console.log(result2);
  for (let [key, value] of response2.headers) {
    console.log(`${key} = ${value}`);
  }
  //}, 10);
  
  
  /*let res = inviaRichiesta2("POST", "https://87.14.170.24/login", {
    username: "Paolo23",
    password: "Paolo23gay",
  })
    res.then((data) => {
      console.log(data);
      for (let [key, value] of res.headers) {
        alert(`${key} = ${value}`);
      }
      inviaRichiesta2("POST", "https://87.14.170.24/getFriends", {}, data)
        .then((data) => {
          console.log(data);
        })
        .catch(errore);
    })
    res.catch(errore);*/
};
function inviaRichiesta2(){
  
}



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
      'Authorization': `Bearer ${headers}`
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
  else 
  alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}
