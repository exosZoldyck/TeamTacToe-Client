function openGameroom_click(type = 1){
    requestOpenGameroom(type, (room) => {
        if (room == undefined || room.roomId == undefined) return;
        window.location.replace(`./game?room=${room.roomId}`);
    });
}

function joinGameroom_click(){
    event.preventDefault();
    const input = document.getElementById('roomIdTextbox').value;
    if (input == undefined || input == "") return;

    window.location.replace(`./game?room=${input}`);
}

function searchButton_click(){
    window.location.replace(`./search`);
}