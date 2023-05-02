
//sull'onload della pagina
window.onload = async function () {
  let data = [];
  let aus;

  let users = ["6401c65c01c6e9458e62ec0b", "6401c65c01c6e9458e62ec0a"]
  setInterval(function () {
    aus = {
      "type": "text",
      "content": makeid(getRandomInt(40, 150)),
      "idUser": users[getRandomInt(0, 2)],
      "dateTime": new Date()
    }
    data.push(JSON.stringify(aus));
    $("#ris").text(data);

  }, 1000);

  /*for(let i = 0; i < 180; i++){
    
   
    }, 1000);
  }*/

  

  //funzione per generare un numero random tra min e max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //funzione per generare una stringa random

  function makeid(length) {
    var result = '';
    var characters = 'ABC DEF GHI JKL MNO PQR STU VWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    var charactersLength = characters.length;

    //ciclo per generare la stringa
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    //ritorno la stringa
    return result;
  }

}