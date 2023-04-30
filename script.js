// LOGIQUE DOM //

const resultElement = document.querySelector("#result");
const choicesBtn = document.querySelector("#choice-box").children; // retourne un élement HTML sur lequel on va loop
const playAgainBtn = document.querySelector("#play-again-container h2");
const weatherElement = document.querySelector("#confetti-container");

for (btn of choicesBtn) {
	btn.addEventListener("click", handleClick); // la fonction ne peut pas être anonyme car elle sera retirée éventuellement par disableBtn()
}

playAgainBtn.addEventListener("click", playAgain);

function disableBtn() {
	for (btn of choicesBtn) {
		btn.removeEventListener("click", handleClick);
		btn.classList.add("disabled");
	}
}

function reactivateBtn() {
	setTimeout(() => {
		for (btn of choicesBtn) {
			btn.addEventListener("click", handleClick);
			btn.classList.remove("disabled");
		}
	}, 3000);
}

function handleClick(event) {
	disableBtn();
	playRound(event.target.dataset.value, getComputerChoice()); // récupère le choix du joueur par la dataset du bouton cliqué et celui du double aléatoirement
	reactivateBtn();
}

function handleDeath() {
	setTimeout(() => {
		playWeather();
	}, 2000);
	document.querySelector("h1").innerHTML = `${
		villain.hp === 0 ? "Victoire ! " : "Défaite..."
	}`;
	setTimeout(() => {
		document.querySelector("#play-again-container").style.display = "flex";
	}, 6000);
}

function playWeather() {
	villain.hp === 0 // si le double est mort, alors on sort les confettis. sinon, la pluie dramatique.
		? (weatherElement.style.backgroundImage = "url('assets/confetti.gif')")
		: (weatherElement.style.backgroundImage = "url('assets/rain.gif')");
	weatherElement.style.display = "block";
}

function announce(string) {
	resultElement.innerHTML = string;
	resultElement.classList.add("appeared");
	setTimeout(() => {
		resultElement.classList.remove("appeared");
	}, 3000);
}

// LOGIQUE DE JEU //

function getRandomNumber() {
	return Math.floor(Math.random() * 3);
}

function getComputerChoice() {
	switch (getRandomNumber()) {
		case 0:
			return "sword";
		case 1:
			return "crossbow";
		case 2:
			return "axe";
	}
}

function playRound(playerChoice, computerChoice) {
	if (
		(playerChoice === "sword" && computerChoice === "crossbow") ||
		(playerChoice === "crossbow" && computerChoice === "axe") ||
		(playerChoice === "axe" && computerChoice === "sword")
	) {
		announce("Victoire de l'héroïne !");
		villain.loseHP();
	} else if (playerChoice === computerChoice) {
		announce("Égalité !");
	} else {
		announce("Victoire du double maléfique !");
		hero.loseHP();
	}
}

function playAgain() {
	// le container play-again apparait via la fonction handleDeath()
	document.querySelector("#play-again-container").style.display = "none";
	weatherElement.style.display = "none";
	villain.reset();
	hero.reset();
	document.querySelector("h1").innerHTML = "Qu'allez vous choisir ?";
}

class Actor {
	constructor(hp, characterElement, spriteElement, healthBarElement) {
		this.hp = hp;
		this.characterElement = characterElement;
		this.spriteElement = spriteElement;
		this.healthBarElement = healthBarElement;
	}

	loseHP() {
		this.hp--;
		this.healthBarElement.style.width = `${this.hp * 20}%`;
		this.spriteElement.classList.add("damaged");
		setTimeout(() => {
			this.spriteElement.classList.remove("damaged");
		}, 1000);
		if (this.hp === 0) this.die();
	}

	die() {
		this.characterElement.classList.add("dead");
		handleDeath();
	}

	reset() {
		this.hp = 5;
		this.healthBarElement.style.width = `${this.hp * 20}%`;
		this.characterElement.classList.remove("dead");
	}
}

let hero = new Actor(
	5,
	document.querySelector("#hero"),
	document.querySelector("#hero img"),
	document.querySelector("#hero .health-point")
);

let villain = new Actor(
	5,
	document.querySelector("#villain"),
	document.querySelector("#villain img"),
	document.querySelector("#villain .health-point")
);
