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
let startTime;
let scoresController = scoreBarController("user-scores");
let card2 = document.getElementsByClassName("left-card card")[1];

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
        if (areEqualCards(targetCard, lastCard)) {
          lastCard.classList.add("animate__animated", "animate__rubberBand")
          lastCard.classList.add("test")
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
            if (hardMode) {
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
  btn.addEventListener("click", playAgain);
}

easyBtn.addEventListener("click", () => {
  hardMode = false;
  startGame(currentUser);
});

hardBtn.addEventListener("click", () => {
  hardMode = true;
  startGame(currentUser);
});


function scoreBarController(barId) {
  let scoresBar = document.getElementById(barId);

  return {
    getUser(username) {
      return document.querySelector(`[data-username=${username}]`);
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
      if (this.hasUser(username)) {
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
      }
    },

    setUserLost(username) {
      let userContainer = this.getUser(username);
      userContainer.lastElementChild.innerHTML = `<p>kaybettin! - ${tries -
        1} defa hata yaptın </p>`;
    }
  };
}

function createUserScoreDiv(username) {
  let container = document.createElement("div");
  container.setAttribute("data-username", username);
  container.innerHTML = `<h2>${username}</h2> <p>Oynuyor..</p>`;
  return container;
}


function goToModePage() {
  let username = document.getElementById("username").value;
  if (isValidUsername(username)) {
    currentUser = username.toLowerCase();
    modeContainer.classList.remove("hide");
    chooseUserDiv.classList.add("hide");
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
  document.getElementById("username").value = "";
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
  timer();
  setTimeout(() => {
    flipCards(imgDivArray);
  }, 3000);
}
function timer() {
  time = setInterval(() => {

    var current_time = (Date.now() - startTime) / 1000;
    document.getElementById("time").innerHTML = `<i class="fa-solid fa-stopwatch fa-2xl"> ${Math.floor(current_time)} </i> &nbsp &nbsp` +
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
  second_paragraph.innerHTML = newContent;
}

function looseGame(username) {
  let triesSpan = document.getElementById("tries-span");
  let triesInARow = tries - 1;
  scoresController.setUserLost(username);
  triesSpan.textContent = triesInARow;
  clearInterval(time);

  imgsGrid.classList.add("hide");
  looseDiv.classList.remove("hide");
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
var placeholder = document.getElementById("placeholder");

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


let scoreToggle = document.getElementById("score-toggle")
let scoreContainer = document.getElementById("score-container")

scoreToggle.addEventListener("click", () => {
  scoreContainer.classList.toggle("fade-toggle")
})

function big_message(title, message, type) {
  Swal.fire(
    title,
    message,
    type
  )
}

function checkEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function email_process() {
  var userEmail = document.getElementById("mail").value;
  if (checkEmail(userEmail)) {
    console.log("Geçerli email adresi");
    big_message("Teşekkürler", "Mail adresiniz ekibimize ulaştırılmıştır", 'success')
  } else {
    big_message("Hata", "Geçersiz mail adresi lütfen kontrol edin", 'error')
  }
}