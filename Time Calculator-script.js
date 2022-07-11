const counterDivs = document.querySelectorAll('.counterDivs') 
const daysNo = document.querySelector(".daysNo");
const hoursNo = document.querySelector(".hoursNo");
const minsNo = document.querySelector(".minsNo");
const secondsNo = document.querySelector(".secondsNo");
const enterBtn = document.querySelector("#enterBtn");
const hiddenDate = document.querySelector("#hiddenDate");
const hiddenText = document.querySelector("#hiddenText");
const resultTxt = document.querySelector("#resultTxt");
const memInputTxt = document.querySelector("#memInputTxt");
const resetBtn = document.querySelector("#resetBtn");
const saveBtn = document.querySelector("#saveBtn");
const ul = document.querySelector("ul");

let storedMemories = JSON.parse(localStorage.getItem('storedMemories'))
let memoriesArr = [];
if(storedMemories) {
	memoriesArr = JSON.parse(localStorage.getItem('storedMemories'));
} else {
	memoriesArr = [];
};

let days;
let hours;
let mins;
let seconds;

const count = (chosenDate, memory) => {
	const chosenDateRef = new Date(chosenDate).getTime() + (new Date().getTimezoneOffset() * 60000);
	const currentDate = new Date();

	const timeLeft = (chosenDateRef - currentDate) / 1000;
	const timePassed = (currentDate - chosenDateRef) / 1000;

	if(timeLeft>0) {
		days = Math.floor(timeLeft / 3600 / 24);
		hours = Math.floor(timeLeft / 3600) % 24;
		mins = Math.floor(timeLeft / 60) % 60;
		seconds = Math.floor(timeLeft) % 60;

		daysNo.innerHTML = days;
		hoursNo.innerHTML = addZero(hours);
		minsNo.innerHTML = addZero(mins);
		secondsNo.innerHTML = addZero(seconds);
		if(memory !== "") {
			resultTxt.innerHTML = `Left to the "${memory}" on "${chosenDate}"`;
		} else {
			resultTxt.innerHTML = `Left to "${chosenDate}"`;
		} 
	} else {
		days = Math.floor(timePassed / 3600 / 24);
		hours = Math.floor(timePassed / 3600) % 24;
		mins = Math.floor(timePassed / 60) % 60;
		seconds = Math.floor(timePassed) % 60;

		daysNo.innerHTML = days;
		hoursNo.innerHTML = addZero(hours);
		minsNo.innerHTML = addZero(mins);
		secondsNo.innerHTML = addZero(seconds);
		if(memory !== "") {
			resultTxt.innerHTML = `Passed from the "${memory}" on "${chosenDate}"`;
		} else {
			resultTxt.innerHTML = `Passed from "${chosenDate}"`;
		}
	}
	setInterval(function() {
		count(chosenDate, memory);
	}, 1000);
}

const prepareToCount = (x) => {
	let memory = x.target.parentElement.children[0].value;
	let chosenDate = x.target.parentElement.children[1].value;

	let item = {
		chosenDate: chosenDate,
		chosenDateMS: new Date(chosenDate).getTime(),
		memory: memory
	}
	memoriesArr.push(item)

	for(let i=0; i<counterDivs.length; i++) {
		counterDivs[i].classList.add('rotate');
	}

	count(memoriesArr[memoriesArr.length-1].chosenDate, memoriesArr[memoriesArr.length-1].memory);

	memory = "";
	chosenDate = "";

	resultTxt.classList.add('show');
}

const giveWarning = x => {
	x.parentElement.children[2].classList.add('showWarning');
	x.parentElement.children[1].style.border = '1px solid red';
}

const countAfterClick = (a) => {
	let chosenDate = a.target.parentElement.children[1].value;

	if(resultTxt.innerHTML === '') {
		a.target.parentElement.children[2].classList.remove('showWarning');
		a.target.parentElement.children[1].style.border = '0';
	
		if(chosenDate.length !== 0) {
			prepareToCount(a);
			activeSaveBtn();
		} else {
			giveWarning(a.target)
		}
	} else {
		alert('Please click "Reset" button');
		resetBtn.style.padding = '12px 20px 10px 20px';
	}
}
enterBtn.addEventListener("click" , countAfterClick);

const countAfterKeypress = (event) => {
	if(resultTxt.innerHTML === '' && event.keyCode === 13) {
		event.target.parentElement.children[2].classList.remove('showWarning');
		event.target.parentElement.children[1].style.border = '0';
		if (dateInput.value !== "" && event.keyCode === 13) {
			prepareToCount(event);
			activeSaveBtn();

			dateInput.blur();
			memInputTxt.blur();

		} else {
			giveWarning(dateInput);
		}
	} else if (resultTxt.innerHTML !== '' && event.keyCode === 13) {
		alert('Please click "Reset" button');
		resetBtn.style.padding = '12px 20px 10px 20px';
	}
}
dateInput.addEventListener("keypress", countAfterKeypress);
memInputTxt.addEventListener('keypress', countAfterKeypress);

const addZero = (time) => time < 10 ? `0${time}` : time;

resetBtn.addEventListener("click", () => {
	location.reload();
})

const activeResetBtn = () => {
	resetBtn.disabled = false;
	resetBtn.style.cursor = 'pointer';

	resetBtn.style.color = '#ff3232';
	resetBtn.style.background = '#0000';
	resetBtn.style.boxShadow = '0px 0px 10px #f86666';
}
dateInput.addEventListener("input", activeResetBtn);
memInputTxt.addEventListener("input", activeResetBtn);

const activeSaveBtn = () => {
	saveBtn.disabled = false;
	saveBtn.style.cursor = 'pointer';

	saveBtn.style.color = '#32ff32';
	saveBtn.style.background = '#0000';
	saveBtn.style.boxShadow = '0px 0px 10px #66f866';
}

const countPassed = (item) => {
	const chosenDateRef = new Date(item.chosenDate).getTime() + (new Date().getTimezoneOffset() * 60000);
	const currentDate = new Date();

	const timePassed = (currentDate - chosenDateRef) / 1000;

		days = Math.floor(timePassed / 3600 / 24);
		hours = addZero(Math.floor(timePassed / 3600) % 24);
		mins = addZero(Math.floor(timePassed / 60) % 60);
		seconds = addZero(Math.floor(timePassed) % 60);

		if(item.memory !== '') {
			ul.innerHTML += `
			<li>
				<span class="savedMemories">${item.memory} on "${item.chosenDate}":<br>
				<span class="savedCounters">Passed time: "${days} days, ${hours}:${mins}:${seconds}"</span>
				</span>
				<button class="delBtn">Delete Memory</button>
			</li>
			`
		} else {
			ul.innerHTML += `
			<li>
				<span class="savedMemories">Passed time from "${item.chosenDate}" is:<br>
				<span class="savedCounters"> "${days} days, ${hours}:${mins}:${seconds}"</span>
				</span>
				<button class="delBtn">Delete Memory</button>
			</li>
			`
		}
}

const countLeft = (item) => {
	const chosenDateRef = new Date(item.chosenDate).getTime() + (new Date().getTimezoneOffset() * 60000);
	const currentDate = new Date();

	const timeLeft = (chosenDateRef - currentDate) / 1000;

		days = Math.floor(timeLeft / 3600 / 24);
		hours = addZero(Math.floor(timeLeft / 3600) % 24);
		mins = addZero(Math.floor(timeLeft / 60) % 60);
		seconds = addZero(Math.floor(timeLeft) % 60);

		if(item.memory !== '') {
			ul.innerHTML += `
			<li>
				<span class="savedMemories">${item.memory} on "${item.chosenDate}":<br>
				<span class="savedCounters">Left time: "${days} days, ${hours}:${mins}:${seconds}"</span>
				</span>
				<button class="delBtn">Delete Memory</button>
			</li>
			`
		} else {
			ul.innerHTML += `
			<li>
				<span class="savedMemories">Left time to "${item.chosenDate}" is:<br>
				<span class="savedCounters"> "${days} days, ${hours}:${mins}:${seconds}"</span>
				</span>
				<button class="delBtn">Delete Memory</button>
			</li>
			`
		}
}

const createLi = () => {
	const currentDate = new Date();

	while (ul.firstChild) {
		ul.firstChild.remove();
	};

	for(let i=0; i<memoriesArr.length; i++) {
		if(memoriesArr[i].chosenDateMS < currentDate) {
			countPassed(memoriesArr[i])
		} else if(memoriesArr[i].chosenDateMS > currentDate) {
			countLeft(memoriesArr[i])
		}
	}

	setInterval(createLi, 1000);
}

if(memoriesArr) {
	createLi();
}

/* Save item */
saveBtn.addEventListener('click', () => {
	localStorage.setItem('storedMemories', JSON.stringify(memoriesArr.sort((a,b) => a.chosenDateMS - b.chosenDateMS)));
	
	location.reload();
})

/* Delete item */
ul.addEventListener('click', (e) => {
	if(e.target.className === 'delBtn') {
		let indexOfItem = Array.from(e.target.parentElement.parentElement.children).indexOf(e.target.parentElement)
		memoriesArr.splice(indexOfItem,1);
	}

	localStorage.setItem('storedMemories', JSON.stringify(memoriesArr));
})

/* intro */
let title = 'TIME CALCULATOR';
let splitedTitle = title.split('');

let alfabetLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I','J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

function moveLetters(arr1, i, arr2, j) {
	const generalTitle1 = document.querySelector('#generalTitle1');
	const generalTitle2 = document.querySelector('#generalTitle2');
	start = setInterval(
        function() {
            if(arr1[i] !== ' ' && arr2[j] !== arr1[i]) {
                generalTitle1.innerText = arr2[j];
                j++;
            } else if(arr1[i] !== ' ' && arr2[j] === arr1[i]) {
                generalTitle2.innerText += arr2[j];
				generalTitle1.style.transform += 'translateX(6vw)'
                j = 0;
                i++;
            } else if(arr1[i] === ' ') {
                generalTitle2.innerText += '-';
				generalTitle1.style.transform += 'translateX(6vw)'
                j = 0;
                i++;
            }
			if (i === arr1.length) {
                clearInterval(start);
				generalTitle1.innerText = '';
            }
        }, 10);
}
moveLetters(splitedTitle, 0, alfabetLetters, 0);