let dddInterval = undefined;
let dddText = "";
let dddCounter = 0;

function openPopupContainer(){
    if (document.getElementById('popup-container') != undefined) return;

    const container = document.createElement('div');
    container.id = 'popup-container';
    container.classList.add('popup-container');

    document.body.append(container);
    return container;
}

function closePopup(){
    const container = document.getElementById('popup-container'); 
    if (container == undefined) return;

    container.remove();
    resetDotDotDot();
}

function showWaitingForPlayer(){
    closePopup();

    let xhr = new XMLHttpRequest();
    const htmlFile = "/tictactoe/popup/waiting.html";
    xhr.open("GET", htmlFile, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = xhr.responseText;

        const container = document.createElement('div');
        container.id = 'popup-container';
        container.classList.add('popup-container');
        document.body.append(container)
        container.innerHTML = res;


        const linkTextBox = document.getElementById('popup-link-textBox');
        const linkCopyBtn = document.createElement('popup-link-copyButton');
        if (linkTextBox == undefined || linkCopyBtn == undefined) return;

        linkTextBox.textContent = `${roomId}`;

        linkCopyBtn.onclick = () => {
            try{
                if (navigator.clipboard) navigator.clipboard.writeText(`${httpTypeText}://${domainName}/tictactoe/game?room=${roomId}`);
                else {
                    const linkTextBox = document.getElementById('popup-link-textBox');
                    if (linkTextBox == undefined) return;
        
                    textArea.focus();
                    textArea.select();
        
                    const successful = document.execCommand('copy');
                }
                
                showToast("Copied link to clipboard.", 3000);
            }
            catch{
                console.log("Error: Unable to copy link!");
            }
        }

        dotDotDot('popup-header', "Waiting for players", 750);
    }
    };

    xhr.send();
}

function showPickNickname(){
    closePopup();

    let xhr = new XMLHttpRequest();
    const htmlFile = "/tictactoe/popup/nicknamechoice.html";
    xhr.open("GET", htmlFile, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = xhr.responseText;

        const container = document.createElement('div');
        container.id = 'popup-container';
        container.classList.add('popup-container');
        document.body.append(container)
        container.innerHTML = res;

        getRandomNickname((nickname) => {
            const nicknameTextbox = document.getElementById('nicknameTextbox');
            if (nicknameTextbox == undefined) return;

            nicknameTextbox.value = nickname;

            nicknameTextbox.focus(); //nicknameTextbox.select();

            nicknameTextbox.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                event.preventDefault();
                submitNickname_Click();
                }
            })
        })
    }
    };

    xhr.send();
}

function getRandomNickname(callback){
    let xhr = new XMLHttpRequest();
    const htmlFile = '/tictactoe/assets/text/nicknames.txt';
    xhr.open("GET", htmlFile, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = xhr.responseText;

        if (res == undefined || res == "") return "Noname";

        const nicknames = res.split(/\r?\n/);
        
        const nickname = nicknames[Math.floor((Math.random() * nicknames.length))];

        return callback(nickname);
    }
    };

    xhr.send();
}

function showPickTeam(){
    closePopup();

    let xhr = new XMLHttpRequest();
    const htmlFile = "/tictactoe/popup/teamchoice.html";
    xhr.open("GET", htmlFile, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = xhr.responseText;

        const container = document.createElement('div');
        container.id = 'popup-container';
        container.classList.add('popup-container');
        document.body.append(container)
        container.innerHTML = res;
    }
    };

    xhr.send();
}

function showTeamsList(){
    closePopup();

    let xhr = new XMLHttpRequest();
    const htmlFile = "/tictactoe/popup/teamslist.html";
    xhr.open("GET", htmlFile, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = xhr.responseText;

        const container = document.createElement('div');
        container.id = 'popup-container';
        container.classList.add('popup-container');
        document.body.append(container)
        container.innerHTML = res;

        dotDotDot('popup-header', "Waiting on players", 750); 

        const linkTextBox = document.getElementById('popup-link-textBox');
        if (linkTextBox == undefined) return;

        linkTextBox.textContent = roomId;
    }
    };

    xhr.send();
}

function teamsListAppend(nickname, colNum, isHost){
    const col1 = document.getElementById('popup-teamsList-col-1');
    const col2 = document.getElementById('popup-teamsList-col-2');
    if (col1 == undefined || col2 == undefined) return;

    if (nickname == undefined || nickname == "") return;
    if (colNum == undefined || isNaN(colNum) || colNum < 1 || colNum > 2) return;

    const line = document.createElement('span');
    line.classList.add('popup-teamList-line');
    const lineText = document.createElement('span');
    lineText.classList.add('popup-teamList-text')
    lineText.classList.add('dt-font');
    lineText.textContent = nickname;

    if (colNum == 1){
        col1.append(line);
    }
    else if (colNum == 2){
        col2.append(line);
    }
    line.append(lineText);

    if(myNickname == nickname) {
        line.classList.add('popup-teamList-self');
    }

    if (isHost){
        line.classList.add('popup-teamList-host');

        if (hostId == userId){
            const startGameButton = document.getElementById('popup-startGameButton');
            const publicSelectContainer = document.getElementById('popup-publicSelect-container');

            if (startGameButton == undefined) return;
            startGameButton.style.display = "inline";

            if (publicSelectContainer == undefined) return;
            publicSelectContainer.style.display = "inline";
        }
    }
}

function teamsListDrop(){
    const col1 = document.getElementById('popup-teamsList-col-1');
    const col2 = document.getElementById('popup-teamsList-col-2');
    if (col1 == undefined || col2 == undefined) return;

    col1.innerHTML = "";
    col2.innerHTML = "";
}

function showChallengeForm(challengeForm){
    closePopup();

    lastChallengeForm = challengeForm;

    let xhr = new XMLHttpRequest();
    const htmlFile = "/tictactoe/popup/challengeform.html";
    xhr.open("GET", htmlFile, true);

    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = xhr.responseText;

        const container = document.createElement('div');
        container.id = 'popup-container';
        container.classList.add('popup-container');
        document.body.append(container)
        container.innerHTML = res;

        document.querySelectorAll('.popup-challengeform-operands-subcontainer').forEach(function(subcontainer) {
            subcontainer.style.height = `${subcontainer.getBoundingClientRect().width}px`;
        });

        const x = document.getElementById('popup-challengeform-operand-x');
        const y = document.getElementById('popup-challengeform-operand-y');
        const z = document.getElementById('popup-challengeform-operand-z');
        const operator = document.getElementById('popup-challengeform-operator');

        const operandsObjects = [x, y, z];

        for (let i = 0; i < challengeForm.operands.length; i++){
            if (challengeForm.operands[i] == "???" || isNaN(challengeForm.operands[i])){
                operandsObjects[i].innerText = "X";
            }
            else{
                operandsObjects[i].innerText = challengeForm.operands[i];
            }
        }

        document.querySelectorAll('.popup-challengeform-operands').forEach(function(operand) {
            const fontScale = operand.parentElement.getBoundingClientRect().width - (30 + 6 * (operand.innerText.length - 1));
            operand.style.fontSize = `${fontScale}px`;
        });

        switch (challengeForm.operationType){
            case 1:
                operator.innerText = "+";
                break;
            case 2:
                operator.innerText = "-";
                break;
            case 3:
                operator.innerText = "*";
                break;
            case 4:
                operator.innerText = "/";
                break;
            default:
                operator.innerText = "?";
                break;
        }

        for (let i = 0; i < challengeForm.answerOptions.length; i++){
            const answerOption = challengeForm.answerOptions[i];

            const popupChallengeFormAnswersContainer = document.getElementById('popup-challengeform-answers-container');
            if (popupChallengeFormAnswersContainer == undefined) return;

            const popupChallengeFormAnswersSubcontainer = document.createElement('span');
            popupChallengeFormAnswersSubcontainer.classList.add('popup-challengeform-answers-subcontainer');
            popupChallengeFormAnswersSubcontainer.onclick = function(){
                challengeFormAnswer_Click(i);
            }
            
            popupChallengeFormAnswersContainer.append(popupChallengeFormAnswersSubcontainer);

            const popupChallengeFormAnswer = document.createElement('span');
            popupChallengeFormAnswer.id = `popup-challengeform-answer-${i+1}`;
            popupChallengeFormAnswer.classList.add('popup-challengeform-answer');
            popupChallengeFormAnswer.classList.add('dt-font');
            popupChallengeFormAnswer.innerText = answerOption
            
            popupChallengeFormAnswersSubcontainer.append(popupChallengeFormAnswer);
        }
    }
    };

    xhr.send();
}

function copyGameroomLink_Click(){
    try{
        if (navigator.clipboard) navigator.clipboard.writeText(`${httpTypeText}://${window.location.hostname + window.location.pathname.substr(0, window.location.pathname.length - 1)}?room=${roomId}`);
        else {
            const linkTextBox = document.getElementById('popup-link-textBox');
            if (linkTextBox == undefined) return;

            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
        }
        
        showToast("Copied link to clipboard.", 3000);
    }
    catch{
        console.log("Error: Unable to copy link!");
    }
}

function showInvalidGameroom(){
    killAnnouncement();
    closePopup();
    const container = openPopupContainer();

    const popup = document.createElement('span');
    popup.classList.add('popup');
    container.append(popup);

    const header = document.createElement('h2');
    header.classList.add('popup-header');
    header.classList.add('dt-font');
    header.textContent = "This game room does not exist!";
    popup.append(header);

    const returnBtnContainer = document.createElement('span');
    returnBtnContainer.classList.add('popup-returnButton-container');
    popup.append(returnBtnContainer);

    const returnBtn = document.createElement('button');
    returnBtn.classList.add('popup-returnButton');
    returnBtn.classList.add('dt-font');
    returnBtn.textContent = "Return to homepage";
    returnBtn.onclick = () => {
        window.location.replace(`../`);
    }
    returnBtnContainer.append(returnBtn);
}

function showRoomIsFull(){
    killAnnouncement();
    closePopup();
    const container = openPopupContainer();

    const popup = document.createElement('span');
    popup.classList.add('popup');
    container.append(popup);

    const header = document.createElement('h2');
    header.classList.add('popup-header');
    header.classList.add('dt-font');
    header.textContent = "This game room is already full!";
    popup.append(header);

    const returnBtnContainer = document.createElement('span');
    returnBtnContainer.classList.add('popup-returnButton-container');
    popup.append(returnBtnContainer);

    const returnBtn = document.createElement('button');
    returnBtn.classList.add('popup-returnButton');
    returnBtn.classList.add('dt-font');
    returnBtn.textContent = "Return to homepage";
    returnBtn.onclick = () => {
        window.location.replace(`../`);
    }
    returnBtnContainer.append(returnBtn);
}

function showGameOver(){
    killAnnouncement(true);
    closePopup();
    const container = openPopupContainer();

    const popup = document.createElement('span');
    popup.classList.add('popup');
    container.append(popup);

    const header = document.createElement('h2');
    header.classList.add('popup-header');
    header.classList.add('dt-font');
    header.textContent = "Game over!";
    popup.append(header);

    const nextRoundContainer = document.createElement('span');
    nextRoundContainer.classList.add('popup-gameOver-container');
    popup.append(nextRoundContainer);

    if (hostId == userId){
        const nextRoundBtn = document.createElement('button');
        nextRoundBtn.classList.add('popup-gameOverButton');
        nextRoundBtn.classList.add('dt-font');
        nextRoundBtn.textContent = "Next round";
        nextRoundBtn.onclick = () => {
            requestNextRound();
        }
        nextRoundContainer.append(nextRoundBtn);
    }
    else{
        const gameOverText = document.createElement('span');
        gameOverText.classList.add('popup-gameOverText');
        gameOverText.classList.add('dt-font');
        gameOverText.textContent = "Waiting on host...";
        nextRoundContainer.append(gameOverText);
    }
}

function showAnnouncement(text = "", thenDie = true, lifeSpan = 2, noClick = true){ // lifeSpan is in seconds
    closePopup();

    const popupAnnouncementContainer = document.createElement('span');
    popupAnnouncementContainer.id = 'announcement-container';
    popupAnnouncementContainer.classList.add('announcement-container');
    if (!noClick) popupAnnouncementContainer.classList.add('announcement-container-clickthroughAllowed');
    popupAnnouncementContainer.classList.add('announcement-anim');
    popupAnnouncementContainer.style.animationDuration = `${lifeSpan}s`;
    document.body.append(popupAnnouncementContainer);

    const announcement = document.createElement('span');
    announcement.classList.add('announcement');
    announcement.classList.add('dt-font');
    announcement.innerHTML = `<span>${text}</span>`;
    popupAnnouncementContainer.append(announcement);

    setTimeout(() => {
        if (thenDie) {
            popupAnnouncementContainer.style.animationName = 'announcement-anim';
            popupAnnouncementContainer.addEventListener("animationend", () => {
                popupAnnouncementContainer.remove();
            });
        }
        else popupAnnouncementContainer.style.animationName = 'announcement-anim-noDie';
    }, 100);
}

function killAnnouncement(fast = false){
    const popupAnnouncementContainer = document.getElementById('announcement-container');
    if (popupAnnouncementContainer == undefined) return;

    if (fast){
        popupAnnouncementContainer.remove();
        return;
    }

    popupAnnouncementContainer.style.animationName = 'announcement-anim-die';
    popupAnnouncementContainer.style.animationDuration = '0.2s';
    popupAnnouncementContainer.addEventListener("animationend", () => {
        popupAnnouncementContainer.remove();
    });
}

function showToast(msg, ttl = 2000){
    const oldToast = document.getElementById('toast-container');
    if (oldToast != undefined) oldToast.remove();

    const toastContainer = document.createElement('span');
    toastContainer.id = 'toast-container';
    toastContainer.classList.add('toast-container');
    document.body.append(toastContainer);

    const toastBox = document.createElement('span');
    toastBox.id = 'toast-box';
    toastBox.classList.add('toast-box');
    toastBox.classList.add('toast-anim');
    toastContainer.append(toastBox);

    const toastText = document.createElement('span');
    toastText.id = 'toast-text';
    toastText.classList.add('toast-text');
    toastText.classList.add('dt-font');
    toastText.innerText = msg;
    toastBox.append(toastText);

    toastBox.style.animationName = 'toast-anim';

    setTimeout(() => {
        toastBox.style.animationName = 'toast-anim-die';

        setTimeout(()=>{
            toastContainer.remove()
        }, 500);
    }, ttl);
}

function dotDotDot(id, text, updateTime){
    if (id == undefined || text == undefined || text == "") return;
    const element = document.getElementById(id);
    if (element == undefined) return;

    dddText = text;

    dddInterval = setInterval(() => {
        if (dddCounter >= 4) dddCounter = 0;
        
        let dots = "";
        
        for (let i = 0; i < dddCounter; i++){
            dots += ".";
        }
        
        element.innerHTML = dddText + dots

        dddCounter++;
    }, updateTime);
}

function resetDotDotDot(){
    clearInterval(dddInterval);
    dddInterval = undefined;
    dddText = "";
    dddCounter = 0;
}