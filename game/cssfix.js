const gameboard = document.getElementById('board-container');

function recalcArea(){
    const pickupImg = document.getElementById('pickup-img');
    const tileImg = document.getElementById('img1');
    
    gameboard.style.width = `${gameboard.getBoundingClientRect().height}px`;
    
    if (pickupImg != undefined && tileImg != undefined){
        pickupImg.style.width = `${tileImg.getBoundingClientRect().width}px`;
        pickupImg.style.height = `${tileImg.getBoundingClientRect().height}px`;
    }

    if (gameboard.getBoundingClientRect().width > window.innerWidth){
        gameboard.style.width = `${window.innerWidth - 20}px`;
        gameboard.style.height = `${gameboard.getBoundingClientRect().width}px`;
    }
    else if (gameboard.getBoundingClientRect().width < 420){
        gameboard.style.width = `${window.innerWidth}px`;
        gameboard.style.height = `${gameboard.getBoundingClientRect().width}px`;
    }
    else {
        gameboard.style.width = `420px`;
        gameboard.style.height = `${gameboard.getBoundingClientRect().width}px`;
    }
}

window.onresize = recalcArea;

gameboard.style.width = `420px`;
gameboard.style.height = `${gameboard.getBoundingClientRect().width}px`;

window.onload = () => {
    recalcArea();
    console.log("Recalc complete!");
};