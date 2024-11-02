function updateGameroomList(roomList){
    console.log(roomList);

    const searchBox = document.getElementById('search-box');
    const noRoomsText = document.getElementById('search-box-loading-text');
    if (searchBox == undefined || noRoomsText == undefined) return;

    if (roomList[0] == undefined) {
        noRoomsText.innerText = "No gamerooms found...";
        return;
    }
    else {
        noRoomsText.style.display = "none";
    }

    const roomsTable = document.getElementById('rooms-table');
    if (roomsTable == undefined) return;
    roomsTable.style.display = "block";

    appendGameroomListTable(roomsTable, `rooms-row-header`, "Room ID", "Host", "Status", "Player Count", "Round Number", true);

    for(let i = 0; i < roomList.length; i++){
        roomInfo = roomList[i];
        appendGameroomListTable(roomsTable, `rooms-row-${i}`, roomInfo.roomId, roomInfo.roomHostNickname, (roomInfo.roomInProgress) ? "Game in progress" : "Waiting for players", roomInfo.roomPlayerCount, roomInfo.roomRoundNumber);
    }
}

function appendGameroomListTable(roomsTable, rowId, roomId_innerText, roomHostNickname_innerText, roomInProgress_innerText, roomPlayerCount_innerText, roomRoundNumber_innerText, noButton = false){
    const row = document.createElement('tr');
    row.id = rowId;
    row.classList = "rooms-row";
    roomsTable.append(row);

    const roomId_th = document.createElement('th');
    roomId_th.innerText = roomId_innerText;
    roomId_th.classList.add('dt-font');
    roomId_th.style.paddingLeft = "5px";
    roomId_th.style.width = "calc(100% / 6)";

    const roomHostNickname_th = document.createElement('th');
    roomHostNickname_th.innerText = roomHostNickname_innerText;
    roomHostNickname_th.classList.add('dt-font');
    roomHostNickname_th.style.width = "calc(100% / 6)";

    const roomInProgress_th = document.createElement('th');
    roomInProgress_th.innerText = roomInProgress_innerText;
    roomInProgress_th.classList.add('dt-font');
    roomInProgress_th.style.width = "calc(100% / 6)";

    const roomPlayerCount_th = document.createElement('th');
    roomPlayerCount_th.innerText = roomPlayerCount_innerText;
    roomPlayerCount_th.classList.add('dt-font');
    roomPlayerCount_th.style.width = "calc(100% / 6)";

    const roomRoundNumber_th = document.createElement('th');
    roomRoundNumber_th.innerText = roomRoundNumber_innerText;
    roomRoundNumber_th.classList.add('dt-font');
    roomRoundNumber_th.style.width = "calc(100% / 6)";

    const roomjoinButton_th = document.createElement('th');
    roomjoinButton_th.innerText = "";
    roomjoinButton_th.style.paddingRight = "5px";
    roomjoinButton_th.style.width = "calc(100% / 6)";

    if (!noButton) {
        const joinButton = document.createElement('button')
        joinButton.classList.add('rooms-rowjoinButton');
        joinButton.classList.add('dt-font')
        joinButton.innerText = "Join";
        joinButton.addEventListener("click", function(){
            window.location.replace(`../game?room=${roomId_innerText}`);
        });

        roomjoinButton_th.append(joinButton);
    }
    else{
        row.style.background = "#2f2f2f";
        row.style.borderBlockColor = "#2f2f2f"
        row.style.border = "0"
        row.style.marginBottom = "5px"
    }

    row.append(roomId_th);
    row.append(roomHostNickname_th);
    row.append(roomInProgress_th);
    row.append(roomPlayerCount_th);
    row.append(roomRoundNumber_th);
    row.append(roomjoinButton_th);
}

const waitingOnConnection = setInterval(() => {
    if (socket != undefined && userId != ""){
        requestGameroomList();
        clearInterval(waitingOnConnection);
    }
}, 100);