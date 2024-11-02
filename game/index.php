<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="exosZoldyck">
    <meta name="description" content="A simple webpage for playing TicTacToe with your friends">
    <meta name="keywords" content="tictactoe, game, multiplayer, fun">
    <title>TeamTacToe</title>
    <link rel="stylesheet" href="style.css?t=<?php echo filemtime("style.css"); ?>">
    <link rel="stylesheet" href="../popup/style.css?t=<?php echo filemtime("../popup/style.css"); ?>">
    <link rel="shortcut icon" href="../assets/images/logo.webp" type="image/x-icon">
</head>
<body>
    <div class="main-container">
        <div id="board-container" class="board-container">
            <div class="board">
                <div class="tile-container" id="tile-container">
    
                </div>
            </div>
        </div>

        <span id="scoreboard-container" class="scoreboard-container scoreboard-hidden">
            <table id="scoreboard-table" class="scoreboard-table">
                <tr id="scoreboard-table-headers" class="scoreboard-table-headers">
                    <th class="scoreboard-header dt-font">Team X</th>
                    <th class="scoreboard-header dt-font">Team O</th>
                </tr>
            </table>
        </span>

        <div id="pickup-container" class="pickup-container">
            <img id="pickup-img" class="pickup-img" src="../assets/sprites/x_black.webp" alt="Pickup">
        </div>
    </div>
</body>
<script src="cssfix.js?t=<?php echo filemtime("cssfix.js"); ?>"></script>
<script src="https://cdn.socket.io/4.7.3/socket.io.min.js"></script>
<script src="../connection.js?t=<?php echo filemtime("../connection.js"); ?>"></script>
<script src="../classes/cookie.js?t=<?php echo filemtime("../classes/cookie.js"); ?>"></script>
<script src="../parameters.js?t=<?php echo filemtime("../parameters.js"); ?>"></script>
<script src="../popup/popup.js?t=<?php echo filemtime("../popup/popup.js"); ?>"></script>
<script src="game.js?t=<?php echo filemtime("game.js"); ?>"></script>
<script src="pickup.js?t=<?php echo filemtime("pickup.js"); ?>"></script>
</html>