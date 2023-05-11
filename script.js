let imgSrc = [
  {
    pairId: 0,
    src:
      "assets/img/min/react-min.png"
  },
  {
    pairId: 1,
    src:
      "assets/img/min/css-min.png"
  },
  {
    pairId: 2,
    src:
      "assets/img/min/html-min.png"
  },
  {
    pairId: 3,
    src:
      "assets/img/min/py-min.png"
  },
  {
    pairId: 4,
    src:
      "assets/img/min/js-min.png"
  },
  {
    pairId: 5,
    src:
      "assets/img/min/c++-min.png"
  },
  {
    pairId: 7,
    src:
      "assets/img/min/dart-min.png"
  },
  {
    pairId: 8,
    src:
      "assets/img/min/java-min.png"
  }
];


let scoreboard;
let playBtn = document.getElementById("play");
let chooseUserDiv = document.querySelector(".choose-username");
let imgsGrid = document.getElementById("images-grid");
let congratsDiv = document.getElementById("congrats-container");
let looseDiv = document.getElementById("loose-container");
let playAgainBtns = document.querySelectorAll(".play-again-btn");
let modeContainer = document.getElementById("mode-container");
let hardBtn = document.getElementById("hard-btn");
let easyBtn = document.getElementById("easy-btn");
var time;
var body = document.getElementsByTagName("body")[0]

let tries = 0;
let hardMode = false;

let imgDivArray = createGridContentArray(imgSrc);
let discoveredCards = [];
let currentUser = "";
let school_number = "";
let startTime;
let scoresController = scoreBarController("user-scores");
let card2 = document.getElementsByClassName("left-card card")[1];
let elapsed_time = 0 - 3;
let wrong = 0;
let losed = false; //0 ise kazandı 1 ise kaybetti


imgDivArray.forEach(targetCard => {
  targetCard.addEventListener("click", () => {
    if (isFlipped(targetCard)) {
      targetCard.classList.remove("flipped-cell");
      targetCard.style.transform = 'scale(1.2)';

      if (discoveredCards.length % 2 == 0) {
        discoveredCards.push(targetCard);

      } else {
        let lastCard = discoveredCards[discoveredCards.length - 1];
        tries++;
        wrong++;
        if (areEqualCards(targetCard, lastCard)) {
          lastCard.classList.add("animate__animated", "animate__rubberBand")
          console.log(lastCard)
          targetCard.classList.add("animate__animated", "animate__rubberBand")
          discoveredCards.push(targetCard);

          if (isGameEnd(discoveredCards, imgDivArray)) {
            setTimeout(() => {
              winGame(currentUser);
            }, 300);

          }
        } else {
          discoveredCards.pop();
          setTimeout(() => {
            lastCard.classList.add("flipped-cell");
            targetCard.classList.add("flipped-cell");
            if (hardMode && wrong > 3) {
              looseGame(currentUser);
            }
          }, 300);
        }
      }
    }
  });
});

playBtn.addEventListener("click", goToModePage);

document.addEventListener("keydown", event => {
  if (!chooseUserDiv.classList.contains("hide") && event.which === 13) {
    goToModePage();
  } else if (
    (!looseDiv.classList.contains("hide") ||
      !congratsDiv.classList.contains("hide")) &&
    event.which === 13
  ) {
    playAgain();
  }
});

for (let btn of playAgainBtns) {
  btn.addEventListener("click", function () {
    appendToStorage("players", { "name": currentUser, "time": elapsed_time, "click": tries, number: school_number, "email": null, hardMode: false, losed: losed });
  })
  btn.addEventListener("click", playAgain);

}

easyBtn.addEventListener("click", () => {
  hardMode = false;
  startGame(currentUser);
});

/*hardBtn.addEventListener("click", () => {
  hardMode = true;
  startGame(currentUser);
});*/


function scoreBarController(barId) {
  let scoresBar = document.getElementById(barId);

  return {
    getUser(username) {
      const name = `${username}`;
      const space = name.split(' ');
      const result = space.join('-');
      return document.querySelector(`[data-username=${result}]`);
    },

    hasUser(username) {
      let userContainer = this.getUser(username);
      return userContainer !== null;
    },

    createPlayingUser(username) {
      if (this.hasUser(username)) {
        let userContainer = this.getUser(username);
        userContainer.remove();
        userContainer.lastElementChild.textContent = "Oynuyor...";
        scoresBar.insertAdjacentElement("afterbegin", userContainer);
      } else {
        let userContainer = createUserScoreDiv(username);
        if (scoresBar.childElementCount == 5) {
          scoresBar.lastElementChild.remove();
        }
        scoresBar.insertAdjacentElement("afterbegin", userContainer);
      }
    },

    setUserTime(username, seconds) {
      /*if (this.hasUser(username)) {
        let userContainer = this.getUser(username);

        if (!hardMode) {
          userContainer.lastElementChild.innerHTML =
            `<i style="font-size:40px" class="fas fa-stopwatch"></i> ${Math.floor(seconds)} saniye` +
            ` <i class="fas fa-mouse-pointer"></i> ${tries} deneme`;
        } else {
          userContainer.lastElementChild.innerHTML = `<i class="fas fa-stopwatch"></i> ${Math.floor(
            seconds
          )} saniye (Zor Mod)`;
        }
      }*/
    },

    setUserLost(username) {

      let userContainer = this.getUser(username);

      userContainer.lastElementChild.innerHTML = `<p>Kaybettin! - ${tries} defa hata yaptın </p>`;
    }
  };
}

function createUserScoreDiv(username) {
  let container = document.createElement("div");
  container.setAttribute("data-username", username);
  //container.innerHTML = `<h2>${username}</h2> <p>Oynuyor..</p>`;
  return container;
}


function goToModePage() {
  school_number = document.querySelector("body > div > div.left-card.card > div.choose-username > div:nth-child(3) > input[type=text]").value

  if (check_if_played(`${school_number}`) === false) {
    let username = document.getElementById("username").value;
    school_number = document.querySelector("body > div > div.left-card.card > div.choose-username > div:nth-child(3) > input[type=text]").value;
    if (isValidUsername(username) && isValidUsername(school_number)) {
      currentUser = username.toLowerCase();
      modeContainer.classList.remove("hide");
      chooseUserDiv.classList.add("hide");
    }
  }
  else {
    big_message("Hata" , "Zaten daha önce 1 defa oynamışsınız herkesin 1 defa oynama hakkı vardır." , "error");
  }


}
function playAgain() {
  currentUser = "";
  discoveredCards = [];
  tries = 0;
  unFlipCards(imgDivArray);

  looseDiv.classList.add("hide");
  congratsDiv.classList.add("hide");

  chooseUserDiv.classList.remove("hide");


  document.querySelector("#username").value = "";
  document.querySelector("body > div > div.left-card.card > div.choose-username > div:nth-child(3) > input[type=text]").value = ""
}


function startGame(username) {
  startTime = Date.now();
  scoresController.createPlayingUser(username);

  shuffle(imgDivArray);

  imgsGrid.innerHTML = "";
  imgDivArray.forEach(img => {
    imgsGrid.appendChild(img);
  });

  modeContainer.classList.add("hide");
  imgsGrid.classList.remove("hide");
  const elements = document.getElementsByClassName("animate__animated animate__rubberBand");

  Array.from(elements).forEach(element => {
    element.classList.remove("animate__animated", "animate__rubberBand");
  });
  timer();
  setTimeout(() => {
    flipCards(imgDivArray);
  }, 3000);


}
function timer() {
  elapsed_time = elapsed_time - 3;
  time = setInterval(() => {

    elapsed_time = (Date.now() - startTime) / 1000;
    elapsed_time = Math.floor(elapsed_time);
    document.getElementById("time").innerHTML = `<i class="fa-solid fa-stopwatch fa-2xl"> ${Math.floor(elapsed_time)} </i> &nbsp &nbsp` +
      ` <i class="fas fa-mouse-pointer fa-2xl"> ${tries}</i> `;

  }, 100);
}

function isGameEnd(discoveredCards, cards) {
  return discoveredCards.length === cards.length;
}

function winGame(username) {
  party.confetti(body);

  let finalTimeSpan = document.getElementById("user-seconds");
  let totalSeconds = (Date.now() - startTime) / 1000;
  finalTimeSpan.textContent = `${Math.floor(totalSeconds)} saniye`;

  scoresController.setUserTime(username, totalSeconds);
  clearInterval(time);

  imgsGrid.classList.add("hide");
  congratsDiv.classList.remove("hide");
  var paragraph = document.querySelector("#join_team_message");


  var newContent2 = paragraph.innerHTML.replace("{username}", currentUser);
  paragraph.innerHTML = newContent2;
  //second_paragraph.innerHTML = newContent;
  losed = false;
}

function looseGame(username) {
  let triesSpan = document.getElementById("tries-span");
  let triesInARow = tries;
  // scoresController.qsetUserLost(username);
  triesSpan.textContent = triesInARow;
  clearInterval(time);

  imgsGrid.classList.add("hide");
  looseDiv.classList.remove("hide");
  losed = true;
}

function areEqualCards(card1, card2) {
  return card1.getAttribute("data-pair") === card2.getAttribute("data-pair");
}

function isValidUsername(name) {
  return name !== undefined && name.trim() !== "";
}



function isFlipped(card) {

  return card.classList.contains("flipped-cell");
}

function flipCards(cards) {
  cards.forEach(card => card.classList.add("flipped-cell"));
}

function unFlipCards(cards) {
  cards.forEach(card => card.classList.remove("flipped-cell"));
}

function createGridContentArray(imgs) {
  let doubled = doubleContent(imgSrc);
  return doubled.map(img => createImgDiv(img));

}

function createImgDiv(img) {
  let container = document.createElement("div");
  container.setAttribute("data-pair", img.pairId);
  container.style.backgroundImage = `url(${img.src})`;
  container.classList.add("cell");

  return container;
}

function doubleContent(arr) {


  return arr.concat(arr);
}

function shuffle(array) {

  array.sort(() => Math.random() - 0.5);
}


var usernameInput = document.getElementById("username");
var numberInput = document.getElementsByName("school_number")[0];
var placeholder = document.getElementById("placeholder");
var placeholder_school_number = document.getElementsByName("placeholder-school-number")[0];

usernameInput.addEventListener("focusin", () => {
  if (usernameInput.value == "") {
    placeholder.style.opacity = "0";
  }
});


usernameInput.addEventListener("focusout", () => {
  if (usernameInput.value == "") {
    placeholder.style.opacity = "1";
  }
});

numberInput.addEventListener("focusin", () => {
  if (numberInput.value == "") {
    placeholder_school_number.style.opacity = "0";
  }
});

numberInput.addEventListener("focusout", () => {
  if (numberInput.value == "") {
    placeholder_school_number.style.opacity = "1";
  }
});



let scoreToggle = document.getElementById("score-toggle")
let scoreContainer = document.getElementById("score-container")

scoreToggle.addEventListener("click", () => {
  scoreContainer.classList.toggle("fade-toggle")
})

function big_message(title, message, type) {
  swal.fire({
    icon: type,
    title: title,
    text: message,
    type: type
  }).then(function () {
    playAgain();
  });

}



function big_message_error(title, message, type) {
  swal.fire({
    icon: type,
    title: title,
    text: message,
    type: type

  });

}

function checkEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function email_process() {
  var userEmail = document.getElementById("mail").value;
  if (checkEmail(userEmail)) {
    console.log("Geçerli email adresi");
    if (hardMode == true) {
      appendToStorage("players", { "name": currentUser, "time": elapsed_time, "click": tries, number: school_number, "email": userEmail, hardMode: true, losed: losed });

    }
    else {
      appendToStorage("players", { "name": currentUser, "time": elapsed_time, "click": tries, number: school_number, "email": userEmail, hardMode: false, losed: losed });
    }
    big_message("Teşekkürler", "Mail adresiniz ekibimize ulaştırılmıştır", 'success')
  } else {
    big_message_error("Hata", "Geçersiz mail adresi lütfen kontrol edin", 'error')
  }
}

function appendToStorage(name, data) {
  var old = localStorage.getItem(name);
  if (old === null) old = "";
  data_json = JSON.stringify(data);
  localStorage.setItem(name, old + data_json);
}

function list_scoreboard() {
  if (localStorage.getItem("players") !== null) {
    var players_list = document.getElementById("user-scores")

    players_list.innerHTML = "";
    //  <div data-username="adem"><h2>adem</h2> <p><i style="font-size:40px" class="fas fa-stopwatch" aria-hidden="true"></i> 49 saniye <i class="fas fa-mouse-pointer" aria-hidden="true"></i> 32 deneme</p></div>
    let rawData = localStorage.getItem("players")
    // Verileri doğru JSON biçimine dönüştürelim
    rawData = "[" + rawData.replace(/}{/g, "},{") + "]";
    const data = JSON.parse(rawData);

    // losed=true olanları filtreleyelim ve hardMode ve zaman öncelikli olarak sıralayalım
    const filteredData = data.filter(d => !d.losed);
    const sortedData = filteredData.sort((a, b) => {
      if (a.hardMode === b.hardMode) {
        return a.time - b.time;
      }
      return b.hardMode - a.hardMode;
    });

    // Sonuçları yazdıralım
    parsedDatas = sortedData;
    //console.log(parsedDatas);
    for (let i = 0; i < 5 && sortedData[i]; i++) {
      if (sortedData[i].hardMode === true) {

        players_list.innerHTML += `<div data-username="${sortedData[i].name}"><h2 style="">${sortedData[i].name} (Zor)</h2> <p><i style="font-size:20px" class="fas fa-stopwatch" aria-hidden="true">&nbsp ${sortedData[i].time}</i>   <i style="font-size:20;" class="fas fa-mouse-pointer" aria-hidden="true">&nbsp &nbsp${sortedData[i].click}</i> </p></div>`;
      }
      else {
        players_list.innerHTML += `<div data-username="${sortedData[i].name}"><h2 style="">${sortedData[i].name}</h2> <p><i style="font-size:20px" class="fas fa-stopwatch" aria-hidden="true">&nbsp ${sortedData[i].time}</i>   <i style="font-size:20;" class="fas fa-mouse-pointer" aria-hidden="true">&nbsp &nbsp${sortedData[i].click}</i> </p></div>`;

      }
    }
  }
}
function parseJSONData(data) {
  // Her bir JSON nesnesine süslü parantezler ekleme
  data = "[" + data.replace(/}{/g, "},{") + "]";

  // JSON string'i parse etme
  var jsonData = JSON.parse(data);

  return jsonData;
}


function isValidNumber(input) {
  const value = parseInt(input.value);
  if (isNaN(value)) {
    input.value = '';
  }
}

function check_if_played(number) {
  if (localStorage.getItem('players') !== null) {
    let rawData = localStorage.getItem("players")
    rawData = "[" + rawData.replace(/}{/g, "},{") + "]";
    const data = JSON.parse(rawData);
    const filteredData = data.filter(d => !d.losed);
    const sortedData = filteredData.sort((a, b) => {
      if (a.hardMode === b.hardMode) {
        return a.time - b.time;
      }
      return b.hardMode - a.hardMode;
    });
    for (let i = 0; i < data.length; i++) {
      if (data[i].number === number) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }

}


setInterval(function () {
  list_scoreboard()

}, 1000);