let roomId = "";
let teamId = "";
let hostId = "";
let inProgress = false;
let myNickname = "";
let gameType = 1;
let punishmentActive = false;
let lastChallengeForm = undefined;
let currentPunishmentTime = 0; // seconds
let punishmentTimer = undefined;
let selectedTile = undefined;

let tiles = [];

function joinRoom(){
    if (roomIdParam == undefined || roomIdParam == "") return console.log("ERROR: No room ID defined!");

    showAnnouncement("Joining gameroom...", false);
    let join_Intr = setInterval(() => {
        if (socket.id == undefined) return;

        requestJoinGameroom(roomIdParam, (info) => {
            if (info == undefined || info.status == undefined) return console.log("Unable to join gameroom!");

            if (info.status == 0){
                clearInterval(join_Intr); 

                switch (info.msg){
                    case "room404":
                        roomId = "";
                        showInvalidGameroom();
                        break;
                    case "full":
                        showRoomIsFull();
                        break;
                }
            }

            if (info.status == 1){
                killAnnouncement(true);
                clearInterval(join_Intr);

                roomId = roomIdParam;
                if (info.teamId != undefined) teamId = info.teamId;
                if (info.roomHost != undefined) hostId = info.roomHost;

                gameType = info.gameType;

                resetTiles();
                if (gameType == 1) fillTiles();

                console.log(`Successfully connected to gameroom "${roomIdParam}"`);
                
                if (gameType == 1 && !inProgress) showWaitingForPlayer();
                else if (gameType == 2 && !inProgress) showPickNickname();
            }
            if (info.status == 2){
                killAnnouncement();
                clearInterval(join_Intr);
                
                roomId = roomIdParam;
                if (info.teamId != undefined) teamId = info.teamId;
                if (info.roomHost != undefined) hostId = info.roomHost;
                console.log(`Successfully connected to gameroom "${roomIdParam}"`);

                resetTiles();
                fillTiles();

                console.log("Setting existing tiles...");
                if (info.tiles != undefined) updateTiles(info.tiles);
            }
        });
    }, 1000);
}

function start(){
    if (roomIdParam == undefined || roomIdParam == "") return window.location.replace(`../`);
    joinRoom();
}

function submitNickname_Click(){
    const textbox = document.getElementById('nicknameTextbox');
    if (textbox == undefined) return;

    const nickname = textbox.value;

    closePopup();

    requestSetNickname(nickname, (info) => {
        if (info == undefined || info.status == undefined) return console.log("Unable to set nickname!");

        if (info.status == 1){
            console.log(`Successfully set nickname to "${nickname}"`);
            myNickname = nickname;

            showPickTeam();
        }
        else if (info.status == 2){
            if (info.msg == undefined || info.msg == "") return;
            console.log(`Unable to set nickname (msg: "${info.msg}")`);

            if(info.msg == "toolong"){
                showToast("Nickname is too long!", 3000);
                showPickNickname();
            }
            else if(info.msg == "unavailable"){
                showToast("Nickname is already used!", 3000);
                showPickNickname();
            }

            return;
        }

        
    })
}

function joinTeam_Click(requestedTeamId){
    closePopup();

    requestTeamJoin(requestedTeamId, (info) => {
        if (info == undefined || info.status == undefined) return console.log("Unable to join team!");

        if (info.status == 1){
            teamId = requestedTeamId;
            console.log(`Successfully joined team #${teamId}`);

            fillTiles();
            changeTileClickPermission(false);

            showTeamsList();
            setTimeout(() => {
                requestPlayerList();
            }, 1000);
        }
        else if (info.status == 2){
            console.log("Unable to join team!");

            if (info.msg == undefined || info.msg == "") return;
            
            if (info.msg == "full"){
                showToast("Team is already full!", 3000);
                showPickTeam();
            }
        }
    });
}

function publicCheckbox_Click(){
    const checkBox = document.getElementById('popup-publicSelect-checkbox');
    if (checkBox == undefined) return;

    const state = checkBox.checked;

    requestSetRoomPublicState(state);
}

function startGame_Click(){
    closePopup();

    requestGameStart();
}

function resetGame(currentTurnTeam, newGame = true){
    if(gameType == 1){
        if (!newGame) {
            showAnnouncement("GAME START!");
            setTimeout(() => {
                announceNextTurn(currentTurnTeam, false);
            }, 2000);
        }
        else{
            resetTiles();
            clearTiles();
            inProgress = true;
    
            showAnnouncement("NEXT ROUND!");
            setTimeout(() => {
                announceNextTurn(currentTurnTeam, false);
            }, 2000);
        }
    }
    else if (gameType == 2){
        if (!newGame) {
            showAnnouncement("GAME START!");
            setTimeout(() => {
                showAnnouncement("FIRST CHALLENGE", true, 2);
            }, 2000);
        }
        else{
            resetTiles();
            clearTiles();
            inProgress = true;
            lastChallengeForm = undefined;

            showAnnouncement("NEXT ROUND!");
            setTimeout(() => {
                showAnnouncement("FIRST CHALLENGE", true, 2);
            }, 2000);
        }
    }
}

function fillScoreboard(scoreboard){
    if (scoreboard == undefined) return;

    const scoreboardContainer = document.getElementById('scoreboard-container');
    const scoreboardTable = document.getElementById('scoreboard-table');
    scoreboardTable.innerHTML = "";

    const scoreboardTableHeaders = document.createElement('tr');
    scoreboardTableHeaders.id = 'scoreboard-table-headers';
    scoreboardTableHeaders.classList.add('scoreboard-table-headers');
    scoreboardTable.append(scoreboardTableHeaders);

    const scoreboardTableHeaderX = document.createElement('th');
    scoreboardTableHeaderX.classList.add('scoreboard-header');
    scoreboardTableHeaderX.classList.add('dt-font');
    scoreboardTableHeaderX.innerText = "Team X";
    scoreboardTableHeaders.append(scoreboardTableHeaderX);

    const scoreboardTableHeaderO = document.createElement('th');
    scoreboardTableHeaderO.classList.add('scoreboard-header');
    scoreboardTableHeaderO.classList.add('dt-font');
    scoreboardTableHeaderO.innerText = "Team O";
    scoreboardTableHeaders.append(scoreboardTableHeaderO);

    const playersListTeamX = scoreboard.playersListTeamX;
    const playersListTeamO = scoreboard.playersListTeamO;

    let rowCount = (playersListTeamX.length >= playersListTeamO.length) ? playersListTeamX.length : playersListTeamO.length;

    for (let i = 0; i < rowCount; i++){
        const playerX = playersListTeamX[i];
        const playerO = playersListTeamO[i];

        console.log(playerX);
        console.log(playerO);

        const scoreboardRow = document.createElement('tr');
        scoreboardRow.id = `scoreboard-table-row-${i}`;
        scoreboardRow.classList.add('scoreboard-table-row');
        scoreboardTable.append(scoreboardRow);

        if (playerX != undefined){
            const scoreboardCellX = document.createElement('th');
            scoreboardCellX.id = `scoreboard-table-cell-X-${i}`;
            scoreboardCellX.classList.add('scoreboard-table-cell')
            scoreboardCellX.classList.add('player-8bit-font');

            let scoreboardCellX_Text = playerX.nickname;
            if (playerX.lastSolveTime != "") scoreboardCellX_Text += ` (${playerX.lastSolveTime})`;
            scoreboardCellX.innerText = scoreboardCellX_Text;

            if (playerX.nickname == scoreboard.teamXTurnPlayer) {
                scoreboardCellX.classList.add('scoreboard-glow-X');
                scoreboardCellX.classList.add('scoreboard-glow-anim');
                scoreboardCellX.classList.add('scoreboard-glow-anim-X');
            }
            else {
                scoreboardCellX.classList.remove('scoreboard-glow-X');
                scoreboardCellX.classList.remove('scoreboard-glow-anim');
                scoreboardCellX.classList.remove('scoreboard-glow-anim-X');
            }

            scoreboardRow.append(scoreboardCellX);
            console.log(`Added "${scoreboardCellX_Text}" to row ${i} on X`);
        }
        else{
            const scoreboardCellX = document.createElement('th');
            scoreboardCellX.id = `scoreboard-table-cell-X-${i}`;
            scoreboardCellX.classList.add('scoreboard-table-cell')
            scoreboardCellX.classList.add('player-8bit-font');
            scoreboardCellX.innerText = "";

            scoreboardRow.append(scoreboardCellX);
        }

        if (playerO != undefined){
            const scoreboardCellO = document.createElement('th');
            scoreboardCellO.id = `scoreboard-table-cell-O-${i}`;
            scoreboardCellO.classList.add('scoreboard-table-cell')
            scoreboardCellO.classList.add('player-8bit-font');

            let scoreboardCellO_Text = playerO.nickname;
            if (playerO.lastSolveTime != "") scoreboardCellO_Text += ` (${playerO.lastSolveTime})`;
            scoreboardCellO.innerText = scoreboardCellO_Text;

            if (playerO.nickname == scoreboard.teamOTurnPlayer) {
                scoreboardCellO.classList.add('scoreboard-glow-O');
                scoreboardCellO.classList.add('scoreboard-glow-anim');
                scoreboardCellO.classList.add('scoreboard-glow-anim-O');
            }
            else {
                scoreboardCellO.classList.remove('scoreboard-glow-O');
                scoreboardCellO.classList.remove('scoreboard-glow-anim');
                scoreboardCellO.classList.remove('scoreboard-glow-anim-O');
            }

            scoreboardRow.append(scoreboardCellO);
            console.log(`Added "${scoreboardCellO_Text}" to row ${i} on O`);
        }
        else{
            const scoreboardCellO = document.createElement('th');
            scoreboardCellO.id = `scoreboard-table-cell-X-${i}`;
            scoreboardCellO.classList.add('scoreboard-table-cell')
            scoreboardCellO.classList.add('player-8bit-font');
            scoreboardCellO.innerText = "";

            scoreboardRow.append(scoreboardCellO);
        }
    }

    scoreboardContainer.classList.remove('scoreboard-hidden');
}

function setTilePermissionGranted(){
    closePopup();

    showToast("Pick a tile!");
    changeTileClickPermission(true);
} 

function showTiles(){
    const container = document.getElementById('tile-container');
    if (container == undefined) return;

    for(let i = 0; i < 9; i++){
        const btn = document.createElement('button');
        btn.classList.add('tile');
        btn.id = `tile${i + 1}`;
        btn.addEventListener("click", () => { tileClick(i + 1) });
        
        container.append(btn);
    }
}

function fillTiles(){
    for(let i = 0; i < 9; i++){
        const tile = document.getElementById(`tile${i + 1}`);

        const img = document.createElement("img");
        img.id = `img${i + 1}`;
        img.classList.add('tile-img');
        if (teamId == "1") {
            img.src = "../assets/sprites/x.webp"; 
            img.alt="X";
        }
        if (teamId == "2") {
            img.src = "../assets/sprites/o.webp"; 
            img.alt="O";
        }

        tile.append(img);
    }
}

function clearTiles(){
    for(let i = 0; i < 9; i++){
        const tile = document.getElementById(`tile${i + 1}`);
        const img = document.getElementById(`img${i + 1}`);

        if (teamId == "1") {
            img.src = "../assets/sprites/x.webp"; 
            img.alt="X";
            img.classList.remove('tile-img-showTileValue');
        }
        if (teamId == "2") {
            img.src = "../assets/sprites/o.webp"; 
            img.alt="O";
            img.classList.remove('tile-img-showTileValue');
        }

        tile.classList.remove('tile-notYourTurn');
    }
}

function tileClick(tileNum){
    if (tileNum == undefined || isNaN(tileNum) || tileNum < 1 || tileNum > 9) return;
    
    const tile = document.getElementById(`tile${tileNum}`);

    const y = (tileNum - 1) % 3;
    const x = Math.trunc((tileNum - 1) / 3);

    console.log(tiles[x][y]);
    console.log(teamId);
    console.log(selectedTile);
    if (!inProgress) return;
    else if (tiles[x][y] == teamId && selectedTile == undefined && getTeamTilesPlacedCount() >= 3 && inProgress){ // Select
        submitTilePickup(tileNum - 1, (info) => {
            if (info.status == undefined || info.status != 1) return;

            selectedTile = tileNum;

            const img = document.getElementById(`img${tileNum}`);
            img.classList.remove('tile-img-showTileValue');
            tilePickup(tileNum);
        });
        
        return;
    }
    /*else if (tiles[x][y] == teamId && selectedTile != undefined && getTeamTilesPlacedCount() >= 3 && inProgress){ // Deselect
        selectedTile = undefined;
        
        //tile.classList.remove('tile-selected');
        showToast("Tile deselected");
        
        return;
    }*/
    else if (tiles[x][y] == 0 && selectedTile != undefined && getTeamTilesPlacedCount() >= 3 && inProgress){ // Swap
        submitTileSwap(selectedTile - 1, tileNum - 1);
        
        const selectedTile_Obj = document.getElementById(`tile${selectedTile}`);
        selectedTile_Obj.classList.remove('tile-selected');
        tileUnpickup();
    
        selectedTile = undefined;

        return;
    }
    else if (tiles[x][y] == 0 && getTeamTilesPlacedCount() < 3 && inProgress) { // Place
        submitTilePlace(tileNum - 1);
        return;
    }
    else return;
}

function getTeamTilesPlacedCount(){
    if (teamId == undefined) return Error("Team ID is undefined!");
    
    let counter = 0;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if (tiles[i][j] == teamId) counter++; 
        }
    }

    return counter;
}

function updateTiles(newTiles){
    console.log("UPDATING TILES...")

    for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
            if (tiles[i][j] != newTiles[i][j]) tileSwitch(i, j, newTiles[i][j]);
        }
    }
}

function tileSwitch(x, y, value){
    tiles[x][y] = value;

    const pos = x * 3 + y;
    const tile = document.getElementById(`tile${pos + 1}`);
    const img = document.getElementById(`img${pos + 1}`);

    if (value == 0){
        if (teamId == 1) img.src = "../assets/sprites/x.webp";
        if (teamId == 2) img.src = "../assets/sprites/o.webp";
        img.alt = "";
        img.classList.remove('tile-img-showTileValue');
    }
    if (value == 1) {
        img.src = "../assets/sprites/x_colored.webp";
        img.alt="X";
        img.classList.add('tile-img-showTileValue');
    }
    else if (value == 2){
        img.src = "../assets/sprites/o_colored.webp"; 
        img.alt="O";
        img.classList.add('tile-img-showTileValue');
    } 
}

function changeTileClickPermission(value = false){
    console.log(`Tile click permission: ${value}`)
    for (let i = 0; i < 9; i++){
        const tile = document.getElementById(`tile${i + 1}`);

        if (value) tile.classList.remove('tile-notYourTurn');
        else tile.classList.add('tile-notYourTurn');
    }
}

function resetTiles(){
    let newTiles = [];
    for(let i = 0; i < 3; i++){
        var row = [];
        for(let j = 0; j < 3; j++){
            row.push(0);
        }
        newTiles.push(row);
    }

    tiles = newTiles;
}

function challengeFormAnswer_Click(index){
    if (index == undefined || isNaN(index)) return;

    submitChallengeFormAnswer(index);
}

function announceChallengeFailed(punishmentTimestamp, serverLocalTime, type = 2){
    if (punishmentTimestamp == undefined || isNaN(punishmentTimestamp) || isNaN(serverLocalTime)) return;

    closePopup();

    const punishmentTime_Seconds = Math.round((punishmentTimestamp - serverLocalTime) / 1000);

    if (type == 1){
        if (punishmentActive && punishmentTime_Seconds < currentPunishmentTime) return;

        console.log("Challenge failed!");
        punishmentActive = true;
        showAnnouncement("WRONG ANSWER!");
        announceChallengeFailedTimer(punishmentTime_Seconds, serverLocalTime);
    }
    else if (type == 2){
        if (punishmentActive && (punishmentTime_Seconds - 2) < currentPunishmentTime) return;
        /*else if (punishmentActive){
            return;
        }*/

        console.log("Teammate failed challenge!");
        punishmentActive = true;
        showAnnouncement("TEAMMATE FAILED!");
        announceChallengeFailedTimer(punishmentTime_Seconds, serverLocalTime);
    }
    else return;
}

function announceChallengeFailedTimer(punishmentTime, serverLocalTime){
    if (punishmentTime == undefined || serverLocalTime == undefined) return;

    if (punishmentTimer != undefined) {
        closePopup();
        clearInterval(punishmentTimer);
        punishmentTimer = undefined;
    }

    setTimeout(() => {
        let secondsCounter = 0;
        punishmentTimer = setInterval(() => {
            if (secondsCounter == 0) killAnnouncement(true);;
            if (secondsCounter >= punishmentTime) {
                console.log("Punishment ended");
                clearInterval(punishmentTimer);
                punishmentActive = false;
                currentPunishmentTime = 0;
                return (lastChallengeForm != undefined) ? showChallengeForm(lastChallengeForm) : undefined;
            }
            
            currentPunishmentTime = punishmentTime - secondsCounter;
            console.log(`Punishment ends in: ${currentPunishmentTime}`);
            showAnnouncement(`${Math.round(currentPunishmentTime)}`, true, 1);

            secondsCounter++;
        }, 1000);
    }, 1000);
}

function announceChallengeCompleted(winnerNickname, winnerTeamId){
    if (winnerNickname == undefined || winnerTeamId == undefined) return;

    killAnnouncement(true);
    clearInterval(punishmentTimer);
    punishmentTimer = undefined;

    if (teamId != winnerTeamId){
        console.log("Opposing team scored!");
        showAnnouncement("OPPOSING TEAM SCORED!");
    }
    else{
        if (myNickname == winnerNickname) {
            console.log("You scored!");
            showAnnouncement("YOU SCORED!", true, 1, false);
        }
        else {
            console.log("Teammate scored!");
            showAnnouncement("TEAMMATE SCORED!");
        }
    }
}

function announceNextTurn(currentTurnTeam, short = true){
    let announcementLifeTime;
    if (short) announcementLifeTime = 1;
    else announcementLifeTime = 2; 

    if (currentTurnTeam == teamId) {
        showAnnouncement("YOUR TURN!", true, announcementLifeTime);

        for (let i = 0; i < 9; i++){
            const tile = document.getElementById(`tile${[i + 1]}`);
            if (tile == undefined) break;

            tile.classList.remove('tile-notYourTurn');
        }
    }
    else {
        showAnnouncement("OPPONENTS TURN!", true, announcementLifeTime);

        for (let i = 0; i < 9; i++){
            const tile = document.getElementById(`tile${[i + 1]}`);
            if (tile == undefined) break;

            if (!tile.classList.contains('tile-unclickable')) {
                tile.classList.add('tile-notYourTurn');
            }
        }
    }
}

function announceWinner(winningTeamId){  
    let msg = "";
    if (winningTeamId != undefined) {
        if (teamId == winningTeamId) msg = "YOU WIN!";
        else msg = "YOU LOSE!";
    }
    else msg = "Error: Winner undefined!";

    const scoreboardContainer = document.getElementById('scoreboard-container');
    scoreboardContainer.classList.add('scoreboard-hidden');

    showAnnouncement(msg);
}

function announceTie(){
    showAnnouncement("IT'S A TIE!");
}

showTiles();
start();