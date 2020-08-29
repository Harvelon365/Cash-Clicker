const Toast ={
    init(){
        this.hideTimeout = null;

        this.el = document.createElement("div");
        this.el.className = "toast";
        document.body.appendChild(this.el);
    },

    show(message){
        clearTimeout(this.hideTimeout);

        this.el.textContent = message;
        this.el.className = "toast toast--visible";
        this.hideTimeout = setTimeout(() =>{
            this.el.className = "toast";
        }, 3000)
    }
}

document.addEventListener('DOMContentLoaded', () => Toast.init());


var game = {
    cash: 0,
    totalCash: 0,
    totalClicks: 0,
    cashMultiplier: 1,
    highestCash: 0,
    clickValue: 1,
    version: 0.000,

    addToCash: function(amount) {
        this.cash += amount;
        this.totalCash +=  amount;
        display.updateScore();
        display.updateShop();
        display.updateUpgrades();
    },

    getCashPerSecond: function(){
        var cashPerSecond = 0;
        for (i = 0; i < building.name.length; i++){
            cashPerSecond += (building.income[i] * building.count[i]);
        }
        cashPerSecond *= this.cashMultiplier;
        return cashPerSecond;
    }
};

var building = {
    name: [
        "Cursor",
        "Grandma",
        "Farm",
        "Bakery",
        "Mine"
    ],
    image: [
        "Cursor.png",
        "Grandma.png",
        "Farm.png",
        "Bakery.png",
        "Mine.png"
    ],
    count: [0, 0, 0, 0, 0],
    income: [
        0.1,
        1,
        5,
        12,
        25

    ],
    cost: [
        15,
        100,
        500,
        2000,
        4500
    ],

    purchase: function(index){
        if (game.cash>=this.cost[index]){
            game.cash -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.15);
            display.updateScore();
            display.updateShop();
            display.updateUpgrades();
        }
    }
}

var upgrade = {
    name:[
        "Butter Fingers",
        "Rock Fingers",
        "Big Click",
        "Metal Fingers",
        "Giant Click",
        "Mega Click",
        "Vanilla Cream",
        "Mint Cream",
        "Strawberry Cream"
    ],
    description:[
        "Cursors are twice as powerful",
        "Cursors are twice as powerful",
        "Your click is twice as powerful",
        "Cursors are twice as powerful",
        "Your click is twice as powerful",
        "Your click is twice as powerful",
        "Cash production multiplier +1%",
        "Cash production multiplier +1%",
        "Cash production multiplier +1%"
    ],
    image:[
        "ButterCursor.png",
        "StoneCursor.png",
        "Mouse.png",
        "MetalCursor.png",
        "Mouse.png",
        "Mouse.png",
        "Cream1.png",
        "Cream2.png",
        "Cream3.png"
    ],
    type:[
        "building",
        "building",
        "click",
        "building",
        "click",
        "click",
        "cps",
        "cps",
        "cps"
    ],
    cost:[
        100,
        500,
        5000,
        10000,
        10000,
        15000,
        999999,
        5000000,
        10000000
    ],
    buildingIndex:[
        0,
        0,
        -1,
        0,
        -1,
        -1,
        -1,
        -1,
        -1
    ],
    requirement:[
        1,
        5,
        500,
        10,
        3500,
        7200,
        50000,
        250000,
        500000
    ],
    bonus:[
        2,
        2,
        2,
        2,
        2,
        2,
        0.01,
        0.01,
        0.01
    ],
    purchased:[false],

    purchase: function(index){
        if(!this.purchased[index] && game.cash >= this.cost[index]){
            if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]){
                game.cash -= this.cost[index];
                building.income[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;

                display.updateScore();
                display.updateUpgrades();
                display.updateShop();
            } else if (this.type[index] == "click" && game.totalClicks >= this.requirement[index]){
                game.cash -= this.cost[index];
                game.clickValue *= this.bonus[index];
                this.purchased[index] = true;

                display.updateScore();
                display.updateUpgrades();
                display.updateShop();
            } else if (this.type[index] == "cps" && game.totalCash >= this.requirement[index]){
                game.cash -= this.cost[index];
                game.cashMultiplier += this.bonus[index];
                this.purchased[index] = true;

                display.updateScore();
                display.updateUpgrades();
                display.updateShop();
            }
        }
    }
};

var display = {
    updateScore: function(){
        document.getElementById("cashCount").innerHTML = game.cash.toFixed(0);
        document.getElementById("cps").innerHTML = game.getCashPerSecond().toFixed(1);
        document.title = game.cash.toFixed(0) + " cash";
    },

    updateShop: function(){
        document.getElementById("shopContainer").innerHTML = "<h2><center>Shop</center></h2>";
        for (i = 0; i < building.name.length; i++){
            if (game.cash>=building.cost[i]){
                document.getElementById("shopContainer").innerHTML += '<table id="shopButtonTooltip" class="shopButton unselectable" data-tooltip="Production per unit: '+building.income[i]+'/cps -- Total Production: '+building.income[i] * building.count[i]+'/cps" onclick="building.purchase('+i+')"><tr><td id="image"><img src="images/buildings/'+building.image[i]+'"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> cash</p></td><td id="amount"><span>'+building.count[i]+'</span></td></tr></table>'
            }else{
                document.getElementById("shopContainer").innerHTML += '<table id="shopButtonTooltip" class="shopButtonGreyed unselectable" data-tooltip="Production per unit: '+building.income[i]+'/cps -- Total Production: '+building.income[i] * building.count[i]+'/cps" onclick="building.purchase('+i+')"><tr><td id="image"><img src="images/buildings/'+building.image[i]+'"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> cash</p></td><td id="amount"><span>'+building.count[i]+'</span></td></tr></table>'
            }
            
        }
    },

    updateUpgrades: function(){
        document.getElementById("upgradeContainer").innerHTML = "<h2><center>Upgrades</center></h2>";
        for (i = 0; i < upgrade.name.length; i++){
            if (!upgrade.purchased[i]){
                if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  -- '+upgrade.description[i]+' - ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  -- '+upgrade.description[i]+' - ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')"></div>';
                    }
                }else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  -- '+upgrade.description[i]+' - ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  -- '+upgrade.description[i]+' - ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')"></div>';
                    }
                }else if (upgrade.type[i] == "cps" && game.totalCash >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  -- '+upgrade.description[i]+' - ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  -- '+upgrade.description[i]+' - ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')"></div>';
                    }
                }
            }
        }
    }
};

function saveGame(){
    var gameSave = {
        cash: game.cash,
        totalCash: game.totalCash,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        cashMultiplier: game.cashMultiplier,
        version: game.version,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        upgradePurchased: upgrade.purchased,
    }
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
    Toast.show("Game Saved!")
}

function loadGame(){
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if (localStorage.getItem("gameSave") !== null){
        if (typeof savedGame.cash !== "undefined") game.cash = savedGame.cash;
        if (typeof savedGame.totalCash !== "undefined") game.totalCash = savedGame.totalCash;
        if (typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if (typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if (typeof savedGame.cashMultiplier !== "undefined") game.cashMultiplier = savedGame.cashMultiplier;
        if (typeof savedGame.buildingCount !== "undefined"){
            for (i = 0; i < savedGame.buildingCount.length; i++){
                building.count[i] = savedGame.buildingCount[i];
            }
        }
        if (typeof savedGame.buildingIncome !== "undefined"){
            for (i = 0; i < savedGame.buildingIncome.length; i++){
                building.income[i] = savedGame.buildingIncome[i];
            }
        }
        if (typeof savedGame.buildingCost !== "undefined"){
            for (i = 0; i < savedGame.buildingCost.length; i++){
                building.cost[i] = savedGame.buildingCost[i];
            }
        }
        if (typeof savedGame.upgradePurchased !== "undefined"){
            for (i = 0; i < savedGame.upgradePurchased.length; i++){
                upgrade.purchased[i] = savedGame.upgradePurchased[i];
            }
        }
    }
};

function resetGame(){
    if (confirm("Are you sure you want to reset the game?")){
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
};

document.getElementById("clicker").addEventListener("click", function(){
    game.totalClicks++;
    game.addToCash(game.clickValue);
}, false);

window.onload = function(){
    loadGame();
    display.updateScore();
    display.updateUpgrades();
    display.updateShop();
};

setInterval(function(){
    game.cash += game.getCashPerSecond();
    game.totalCash += game.getCashPerSecond();
    display.updateScore();


}, 1000);

setInterval(function(){
    display.updateScore();
    display.updateShop();
    display.updateUpgrades();
    document.getElementById("statsContainer").innerHTML = 'Cash in bank: '+game.cash.toFixed(0)+'<br/>Cash printed (all time): '+game.totalCash.toFixed(0)+''
}, 1000);

setInterval(function() {
    saveGame();
}, 30000);

function sum(total, num){
    return total + num;
}

function detectUpgrades(){
    var count = 0;
    for(i = 0; i < upgrade.purchased.length; i++){
        if (upgrade.purchased[i] == true)
        count++;
    }
    return count;
}

function highest(){
    if (game.cash > game.highestCash){
        game.highestCash = game.cash;
        return game.cash.toFixed(0);
    }else{
        return game.highestCash.toFixed(0);
    }
}

document.addEventListener("keydown", function(event){
    if(event.ctrlKey && event.which == 83){
        event.preventDefault();
        saveGame();
    }
}, false);