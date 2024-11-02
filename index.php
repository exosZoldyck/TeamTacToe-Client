<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="exosZoldyck">
    <meta name="description" content="A simple webpage for playing TicTacToe with your friends">
    <meta name="keywords" content="tictactoe, game, multiplayer, fun">
    <title>TicTacToe</title>
    <link rel="stylesheet" href="style.css?t=<?php echo filemtime("style.css"); ?>">
    <link rel="stylesheet" href="./popup/style.css?t=<?php echo filemtime("./popup/style.css"); ?>">
    <link rel="shortcut icon" href="./assets/images/logo.webp" type="image/x-icon">
</head>
<body>
    <div class="big-header-container">
      <h1 class="big-header dt-font">TeamTacToe</h1>
      <h2 class="small-header dt-font">Made by exosZoldyck</h2>
    </div>
    <div class="main-container">
      <span class="menu">
        <div class="menu-join-container">
          <input type="text" name="roomId" class="menu-join-textBox dt-font" id="roomIdTextbox">
          <input type="submit" value="Join" class="menu-joinButton dt-font" onclick="joinGameroom_click()">
        </div>
        <div class="menu-create-container">
          <!-- <button class="menu-createButton dt-font" onclick="openGameroom_click(1)">1v1</button> -->
          <button class="menu-createButton dt-font" onclick="openGameroom_click(2)">Open Gameroom</button>
        </div>
        <div class="menu-search-container">
          <button class="menu-search-button dt-font" onclick="searchButton_click()">Search for Gamerooms</button>
        </div>
      </span>
    </div>
</div>
</body>
<script src="https://cdn.socket.io/4.7.3/socket.io.min.js"></script>
<script src="index.js?t=<?php echo filemtime("index.js"); ?>"></script>
<script src="connection.js?t=<?php echo filemtime("connection.js"); ?>"></script>
<script src="./classes/cookie.js?t=<?php echo filemtime("./classes/cookie.js"); ?>"></script>
<script src="./popup/popup.js?t=<?php echo filemtime("./popup/popup.js"); ?>"></script>
</html>