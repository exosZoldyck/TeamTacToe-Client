const pickupContainer = document.getElementById('pickup-container');
const pickupImg = document.getElementById('pickup-img');

const pickupEventHandler = function(e) {
    const posX = e.pageX - (pickupContainer.getBoundingClientRect().width / 2);
    const posY = e.pageY - (pickupContainer.getBoundingClientRect().height / 2);

    pickupContainer.style.left = `${(posX) > 0 ? posX : '0px'}px`;
    pickupContainer.style.top = `${(posY) > 0 ? posY : '0px'}px`;
} 

function tilePickup(tileNum){
    const tile = document.getElementById(`tile${tileNum}`);
    const img = document.getElementById(`img${tileNum}`);

    pickupImg.style.width = `${img.getBoundingClientRect().width}px`;
    pickupImg.style.height = `${img.getBoundingClientRect().height}px`;
    pickupContainer.style.left = `${tile.getBoundingClientRect().left}px`;
    pickupContainer.style.top = `${tile.getBoundingClientRect().top}px`;
    pickupContainer.style.opacity = '1';

    document.body.classList.add('pickup-cursor');

    if (teamId == "1") {
        pickupImg.src = "../assets/sprites/x_colored.webp"; 
    }
    if (teamId == "2") {
        pickupImg.src = "../assets/sprites/o_colored.webp"; 
    }

    document.addEventListener('mousemove', pickupEventHandler, false);
}

function tileUnpickup(){
    pickupContainer.style.left = `0px`;
    pickupContainer.style.top = `0px`;
    pickupContainer.style.opacity = '0';

    document.body.classList.remove('pickup-cursor');

    document.removeEventListener('mousemove', pickupEventHandler, false);
}