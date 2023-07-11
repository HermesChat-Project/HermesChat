window.onload = async function () {
  let data = [];
  let aus;
  let ausUser = [];
  let ausBlocked = [];
  let ausSentFriendship = [];
  let ausToAcceptFriendship = [];
  let ausFriendship = [];

  for (let i = 0; i < 150; i++) {
    let nickname = makeid(getRandomInt(5, 7));
    // nome solo le prime 3 lettere
    let name = nickname.substring(0, 3);
    //cognome le altre
    let surname = nickname.substring(3, nickname.length);

    let ObjectId = (
      m = Math,
      d = Date,
      h = 16,
      s = (s) => m.floor(s).toString(h)
    ) => 
      s(d.now() / 1000) + " ".repeat(h).replace(/./g, () => s(m.random() * h));

      let id = ObjectId();
      
    console.log(id);

    aus = {
      _id: {
        $oid: id,
      },
      nickname: "abc" + nickname,
      name: name,
      surname: surname,
      info: "Hey I'm using HermesChat",
      image:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
      visible: true,
      email: "emailprovaaa" + i + "@gmail.com",
      password: "$2a$10$3T1jjWklF0dQeXgtadcE0.P4v9uwBGhCX/4kp.uy8TrlaFHJm6fn2",
      "language ": "it",
      ids: [
        {
          chats: [],
        },
      ],
      otpDate: {
        $date: Date.now(),
      },
      flagOtp: true,
      otp: makeid(6),
    };
    ausUser.push(aus);

    /*ausBlocked.push(
      JSON.stringify({
        "_id": {
          $oid: ObjectId(),
        },
        "blocked": [],
      })
    );
    ausSentFriendship.push(
      JSON.stringify({
        "_id": {
          $oid: ObjectId(),
        },
        "sentTo": []
      })
    );
    ausFriendship.push(
      JSON.stringify({
        "_id": {
          $oid: ObjectId(),
        },
        "friends": []
      })
    );
    ausToAcceptFriendship.push(
      JSON.stringify({
        "_id": {
          $oid: ObjectId(),
        },
        "pending": []
      })
    );*/
    ausBlocked.push({
        "_id": {
          $oid: id,
        },
        "blocked": [],
      }
    );
    ausSentFriendship.push({
        "_id": {
          $oid: id,
        },
        "sentTo": []
      }
    );
    ausFriendship.push({
        "_id": {
          $oid: id,
        },
        "friends": []
      }
    );
    ausToAcceptFriendship.push(
      {
        "_id": {
          $oid: id,
        },
        "pending": []
      }
    );

        
    
  }
  console.log(ausUser);
  console.log(ausBlocked);
  console.log(ausSentFriendship);
  console.log(ausFriendship);
  console.log(ausToAcceptFriendship);

  $("#risUser").text(JSON.stringify(ausUser));
  $("#risBlocked").text(JSON.stringify(ausBlocked));
  $("#risSentFriendship").text(JSON.stringify(ausSentFriendship));
  $("#risFriendship").text(JSON.stringify(ausFriendship));
  $("#risToAcceptFriendship").text(JSON.stringify(ausToAcceptFriendship));
  


  //
  /*for(let i = 0; i < 180; i++){
    
   
    }, 1000);
  }*/

  //funzione per generare un numero random tra min e max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //funzione per generare una stringa random

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    //ciclo per generare la stringa
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    //ritorno la stringa
    return result;
  }
};
