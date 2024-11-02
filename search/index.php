<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="exosZoldyck">
    <meta name="description" content="TicTacToe - Room Search">
    <meta name="keywords" content="tictactoe, game, multiplayer, fun">
    <title>TicTacToe - Room Search</title>
    <link rel="stylesheet" href="style.css?t=<?php echo filemtime("style.css"); ?>">
    <link rel="shortcut icon" href="../assets/images/logo.webp" type="image/x-icon">
</head>
<body>
    <div class="big-header-container">
      <h1 class="big-header dt-font">Room Search</h1>
    </div>
    <div class="main-container">
      <span class="search-box" id="search-box">
        <span id="search-box-loading-text" class="search-box-loading-text dt-font">Loading...</span>
        <table class="rooms-table" id="rooms-table">
        </table>
      </span>
    </div>
</div>
</body>
<script src="https://cdn.socket.io/4.7.3/socket.io.min.js"></script>
<script src="../connection.js?t=<?php echo filemtime("../connection.js"); ?>"></script>
<script src="./search.js?t=<?php echo filemtime("./search.js"); ?>"></script>
<script src="../classes/cookie.js?t=<?php echo filemtime("../classes/cookie.js"); ?>"></script>
</html>