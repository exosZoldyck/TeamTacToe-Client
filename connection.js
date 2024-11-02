const httpTypeText = 'http'//'https';
const domainName = '192.168.1.5'
const pathName = '/tictactoe/'//'/tictactoe/';
const port = 24887;

const serverLocation = `${httpTypeText}://${domainName}:${port}`;
console.log(`Server location set to: ${serverLocation}`);

const socket = io(serverLocation);

let userId = "";

let submitTileDelay_Active = false;

async function validateUserIdCookie(){
    if (socket == undefined) return;
    userId = Cookie.get('userId');
    
    requestUserId(userId, (info) => {
        if (info == undefined || info.clientId == undefined) return;

        userId = info.clientId;
        console.log("Recived ID: " + userId);
        Cookie.set('userId', userId, (Date.now() + 1000 * 60), pathName, window.location.hostname, true);

        if (window.location.pathname.replaceAll('/', '') == 'tictactoe') showToast("Connected to server successfully!", 3000);
    });
}

function requestUserId(userId, callback){
    if (socket == undefined) return callback(undefined);
    socket.emit('client-requestUserId', { clientId: userId });
    socket.once('server-setUserId', (info) => {
        return callback(info);
    })
}

function requestOpenGameroom(type = 1, callback){
    if (socket == undefined) return;

    socket.emit('client-requestOpenGameroom', {clientId: userId, gameType: type})
    socket.once('server-requestOpenGameroom_Ack', (room) => {
        return callback(room);
    })
}

function requestGameroomList(){
    if (socket == undefined) return;

    socket.emit('client-requestRoomList', { clientId: userId })
}

function requestJoinGameroom(roomId, callback){
    if (roomId == undefined) return callback(0);
    if (userId == undefined || userId == "") return console.log("ERROR: No user ID found! ")

    socket.emit('client-requestJoinGameroom', {clientId: userId, roomId: roomId})
    socket.once('server-requestJoinGameroom_Ack', (info) => { 
        return callback(info);
    })
}

function requestNextRound(){
    if (userId != hostId) return console.log("ERROR: Client is not host!");

    socket.emit('client-requestGameRestart', { clientId: userId, roomId: roomId });
    console.log(`New round request sent to server`);
}

function submitTilePlace(tileId){
    if (submitTileDelay_Active == true) return;
    
    socket.emit('client-submitTilePlace', { clientId: userId, roomId: roomId, tileId: tileId });
    console.log(`Submitted tile "${tileId + 1}" to server`);

    submitTileDelay_Active = true;
    setTimeout(() => {
        submitTileDelay_Active = false;
    }, 250) // 0.25s
}

function submitTileSwap(selectedTile, setTile){
    if (submitTileDelay_Active == true) return;
    
    socket.emit('client-submitTileSwap', { clientId: userId, roomId: roomId, selectTileId: selectedTile, setTileId: setTile });
    console.log(`Submitted tiles "${selectedTile + 1}" and "${setTile + 1}" to server`);

    submitTileDelay_Active = true;
    setTimeout(() => {
        submitTileDelay_Active = false;
    }, 250) // 0.25s
}

function submitTilePickup(tileId, callback){
    if (submitTileDelay_Active == true) return;
    
    socket.emit('client-submitTilePickup', { clientId: userId, roomId: roomId, tileId: tileId });
    socket.once('server-submitTilePickup_Ack', (info) => { 
        console.log(`Picked up tile "${tileId + 1}"`);
        return callback(info);
    })

    submitTileDelay_Active = true;
    setTimeout(() => {
        submitTileDelay_Active = false;
    }, 250) // 0.25s
}

function requestTeamJoin(teamId, callback){
    if (teamId == undefined) return;

    socket.emit('client-requestTeamJoin', {clientId: userId, roomId: roomId, teamId: teamId})
    socket.once('server-requestTeamJoin_Ack', (info) => { 
        return callback(info);
    })
}

function requestSetNickname(nickname, callback){
    if (nickname == undefined || nickname == "") return;

    socket.emit('client-requestSetNickname', {clientId: userId, roomId: roomId, nickname: nickname})
    socket.once('server-requestSetNickname_Ack', (info) => { 
        return callback(info);
    })
}

function requestSetDifficulty(difficulty){
    if (difficulty == undefined || isNaN(difficulty)) return;

    socket.emit('client-requestSetDifficulty', { clientId: userId, roomId: roomId, difficulty: difficulty });
    console.log("FLAG");
}

function requestPlayerList(){
    socket.emit('client-requestPlayerList', {clientId: userId, roomId: roomId});
}

function requestSetRoomPublicState(state = false){
    socket.emit('client-requestSetPublicState', {clientId: userId, roomId: roomId, state: state});
}

function requestScoreboard(){
    socket.emit('client-requestScoreboard', {clientId: userId, roomId: roomId});
}

function requestGameStart(){
    socket.emit('client-requestGameStart', {clientId: userId, roomId: roomId});
}

function submitChallengeFormAnswer(answerIndex){
    if (answerIndex == undefined || isNaN(answerIndex) || answerIndex < 0) return;

    socket.emit('client-submitChallengeFormAnswer', {clientId: userId, roomId: roomId, answerIndex: answerIndex});
    console.log(`Submitted challenge answer #${answerIndex} to server`);
}

socket.on('connect', () => {
    socket.once('server-connectionTest', (msg) => {
        if (msg == "ok") {
            console.log(`Connected to "${serverLocation}"!`);
            socket.emit('client-connectionTest', "ok");
        }
    });

    socket.on('server-roomListUpdate', (info) => {
        if (info == undefined || info.roomList == undefined) return;

        if (!window.location.pathname.includes("search")) return;

        const roomList = info.roomList;
        updateGameroomList(roomList);
    });

    socket.on('server-newPlayerJoin', (info) => {
        if (info == undefined) return;
        if (info.nickname == undefined || info.nickname == "") return;

        const msg = `"${info.nickname}" has joined the game!`;

        if (myNickname != info.nickname) showToast(msg, 3000);
    });

    socket.on('server-playerTeamJoin', (info) => {
        if (info == undefined) return;
        if (info.playerList == undefined || info.playerList.length <= 0) return;
        
        const playerList = info.playerList;
        if (playerList[0].nickname == undefined || playerList[0].teamId == undefined || playerList[0].isHost == undefined) return;

        teamsListDrop();

        for (let i = 0; i < playerList.length; i++){
            teamsListAppend(playerList[i].nickname, playerList[i].teamId, playerList[i].isHost);
        }
    });

    socket.on('server-newDifficulty', (info) => {
        if (info == undefined) return;
        if (info.difficulty == undefined || isNaN(info.difficulty)) return;

        const difficulty = parseInt(info.difficulty);
        const difficultyNames = ["VERY EASY", "EASY", "MEDIUM", "HARD", "VERY HARD"];

        showToast(`Difficulty set to "${difficultyNames[difficulty - 1]}"`, 3000);
    })

    socket.on('server-newPublicState', (info) => {
        if (info == undefined) return;
        if (info.state == undefined) return;

        if (info.state == true) {
            showToast("Gameroom set to PUBLIC!", 3000);
        }
        else{
            showToast("Gameroom set to PRIVATE!", 3000);
        }
    })

    socket.on('server-updateScoreboard', (info) => {
        if (info == undefined) return;
        if (info.scoreboard == undefined || info.scoreboard.length <= 0) return;
        
        const scoreboard = info.scoreboard;
        if (scoreboard == undefined) return;
        console.log(scoreboard);

        fillScoreboard(scoreboard);
    });

    socket.on('server-gameStart', (info) => {
        if (info == undefined || info.tiles == undefined || info.gameType == undefined) return;

        if (isNaN(info.gameType) || info.gameType < 1 || info.gameType > 2) return;
        gameType = info.gameType;

        console.log("GAME START!");
        inProgress = true;

        closePopup();
        resetGame(info.currentTurnTeam, false);
    });

    socket.on('server-tileUpdate', (info) => {
        if (info == undefined || info.tiles == undefined) return;
        if (gameType == 1) info.currentTurnTeam == undefined;

        if (Array.isArray(info.tiles)) updateTiles(info.tiles);
        
        if (gameType == 1) announceNextTurn(info.currentTurnTeam);
    });

    socket.on('server-submitTilePlace_Ack', (info) => { 
        if (info.status == undefined || info.status != 1) return;
        tileUnpickup();
    })

    socket.on('server-gameEnd', (info) => {
        if (info == undefined || info.teamId == undefined) return;

        if (info.tiles != undefined || Array.isArray(info.tiles)) updateTiles(info.tiles);

        inProgress = false;

        if (info.teamId > 0 && info.teamId < 3){
            killAnnouncement(true);
            announceWinner(info.teamId);

            setTimeout(() => {
                showGameOver();
            }, 2100);
        }
        else if (info.teamId == 3){
            killAnnouncement(true);
            announceTie();

            setTimeout(() => {
                showGameOver();
            }, 2100);
        }
        else return console.log(`Error: State is invalid value "${info.state}"`);; 
    });

    socket.on('server-gameStart-new', (info) => {
        if (info == undefined || info.tiles == undefined) return;

        console.log("GAME (RE)START!");

        closePopup();
        resetGame(info.currentTurnTeam);
    });

    socket.on('server-newChallengeForm', (info) => {
        if (info == undefined || info.nickname == undefined || info.challengeForm == undefined) return;

        if (myNickname != info.nickname) return; 

        const challengeForm = info.challengeForm;
        if (challengeForm == undefined) return;
        if (challengeForm.operands[0] == undefined) return;
        if (challengeForm.operationType == undefined) return;
        if (challengeForm.answerOptions[0] == undefined) return;

        if (lastChallengeForm != undefined){
            showAnnouncement("NEXT CHALLENGE")
            
            setTimeout(() => {
                showChallengeForm(challengeForm);
            }, 2000)
        }
        else showChallengeForm(challengeForm);
    });

    socket.on('server-ChallengeFailed-player', (info) => {
        if (info == undefined || info.clientId == undefined || info.punishmentTimestamp == undefined || info.serverLocalTime == undefined) return;
        if (isNaN(info.serverLocalTime)) return;
        if (isNaN(info.punishmentTimestamp) || info.serverLocalTime >= info.punishmentTimestamp) return;
        if (info.clientId != userId) return;

        announceChallengeFailed(info.punishmentTimestamp, info.serverLocalTime, 1);
    });

    socket.on('server-ChallengeFailed-team', (info) => {
        console.log(info);
        console.log(teamId)
        if (info == undefined || info.teamId == undefined || info.punishmentTimestamp == undefined || info.serverLocalTime == undefined) return;
        if (isNaN(info.serverLocalTime)) return;
        if (isNaN(info.punishmentTimestamp) || info.serverLocalTime >= info.punishmentTimestamp) return;
        if (info.teamId != teamId) return;
        
        announceChallengeFailed(info.punishmentTimestamp, info.serverLocalTime, 2);
    });

    socket.on('server-challengeCompleted', (info) => {
        if (info == undefined || info.winnerNickname == undefined || info.teamId == undefined) return;
        
        if (teamId != info.teamId) return;

        announceChallengeCompleted(info.winnerNickname, info.teamId);
    });

    socket.on('server-setTilePermit', (info) => {
        if (info == undefined || info.status == undefined || info.msg == undefined) return;

        if (isNaN(info.status) || info.status != 1 || info.msg != "permission_granted") return;
        
        console.log("Permission granted!");
        setTilePermissionGranted();
    });

    validateUserIdCookie();
});

socket.on('disconnect', function() {
    console.log("Lost connection to server!");
});