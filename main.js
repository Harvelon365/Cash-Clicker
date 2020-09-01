var difference

const Toast ={
    init(){
        this.hideTimeout = null;

        this.el = document.createElement("div");
        this.el.className = "toast";
        document.body.appendChild(this.el);
    },

    show(message){
        clearTimeout(this.hideTimeout);

        this.el.innerHTML = message;
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
    offlineMultiplier: 0,
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
        "Out of hours work"
    ],
    description:[
        "Increase offline production +0.1%"
    ],
    image:[
        "Clock.png"
    ],
    type:[
        "offline"
    ],
    cost:[
        1000
    ],
    buildingIndex:[
        -1
    ],
    requirement:[
        10000
    ],
    bonus:[
        0.001
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
            } else if (this.type[index] == "offline" && game.totalCash >= this.requirement[index]){
                game.cash -= this.cost[index];
                game.offlineMultiplier += this.bonus[index];
                this.purchased[index] = true;

                display.updateScore();
                display.updateUpgrades();
                display.updateShop();
            }
        }
    }
};

var achievement = {
    name:[
        "The start of something great...",
        "Poke poke"
    ],
    description:[
        "Click the bank note one time",
        "Purchase one cursor"
    ],
    image:[
        "Click1.png",
        "Cursor.png"
    ],
    type:[
        "click",
        "building"
    ],
    requirement:[
        1,
        1
    ],
    buildingIndex:[
        -1,
        0
    ],
    done:[
        false,false
    ],

    
};

var display = {
    checkAchievements: function(){
        for (i = 0; i < achievement.name.length; i++){
            if (!achievement.done[i]){
                if (achievement.type[i] == "cookies" && achievement.requirement[i] <= game.totalCookies){
                    achievement.done[i] = true;
                    Toast.show("<b>"+achievement.name[i] + "</b><br/>" + achievement.description[i])
                }
                if (achievement.type[i] == "click" && achievement.requirement[i] <= game.totalClicks){
                    achievement.done[i] = true;
                    Toast.show("<b>"+achievement.name[i] + "</b><br/>" + achievement.description[i])
                }
                if (achievement.type[i] == "cps" && achievement.requirement[i] <= game.getCookiesPerSecond()){
                    achievement.done[i] = true;
                    Toast.show("<b>"+achievement.name[i] + "</b><br/>" + achievement.description[i])
                }
                if (achievement.type[i] == "building" && building.count[achievement.buildingIndex[i]] >= achievement.requirement[i]){
                    achievement.done[i] = true;
                    Toast.show("<b>"+achievement.name[i] + "</b><br/>" + achievement.description[i])
                }
            }
        }
    },

    updateScore: function(){
        document.getElementById("cashCount").innerHTML = game.cash.toFixed(0);
        document.getElementById("cps").innerHTML = game.getCashPerSecond().toFixed(1);
        document.title = game.cash.toFixed(0) + " cash";
    },

    updateShop: function(){
        document.getElementById("shopContainer").innerHTML = "<h2><center>Shop</center></h2>";
        for (i = 0; i < building.name.length; i++){
            if (game.cash>=building.cost[i]){
                document.getElementById("shopContainer").innerHTML += '<table id="shopButtonTooltip" class="shopButton unselectable" data-tooltip="Production per unit: '+building.income[i]+'/cps  --  Total Production: '+(building.income[i] * building.count[i]).toFixed(0)+'/cps" onclick="building.purchase('+i+')"><tr><td id="image"><img src="images/buildings/'+building.image[i]+'" onerror="imgError(this);"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> cash</p></td><td id="amount"><span>'+building.count[i]+'</span></td></tr></table>'
            }else{
                document.getElementById("shopContainer").innerHTML += '<table id="shopButtonTooltip" class="shopButtonGreyed unselectable" data-tooltip="Production per unit: '+building.income[i]+'/cps  --  Total Production: '+(building.income[i] * building.count[i]).toFixed(0)+'/cps" onclick="building.purchase('+i+')"><tr><td id="image"><img src="images/buildings/'+building.image[i]+'" onerror="imgError(this);"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> cash</p></td><td id="amount"><span>'+building.count[i]+'</span></td></tr></table>'
            }
            
        }
    },

    updateUpgrades: function(){
        document.getElementById("upgradeContainer").innerHTML = "<h2><center>Upgrades</center></h2>";
        document.getElementById("upgradeUnlockedContainer").innerHTML = "<h2><center>Upgrades</center></h2>";
        for (i = 0; i < upgrade.name.length; i++){
            if (!upgrade.purchased[i]){
                if (upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }
                }else if (upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }
                }else if (upgrade.type[i] == "cps" && game.totalCash >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }
                }else if (upgrade.type[i] == "offline" && game.totalCash >= upgrade.requirement[i]){
                    if(game.cash>=upgrade.cost[i]){
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }else{
                        document.getElementById("upgradeContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImgGrey" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
                    }
                }
            }else{
                document.getElementById("upgradeUnlockedContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+upgrade.name[i]+'  --  '+upgrade.description[i]+'  -  ('+upgrade.cost[i]+' cash)"><img src="images/upgrades/'+upgrade.image[i]+'" class="upgradeImg" onclick="upgrade.purchase('+i+')" onerror="imgError(this);"></div>';
            }
        }
    },

    updateStats: function(){
        document.getElementById("statsContainer").innerHTML = '<h2><center>Stats</center></h2>'
        document.getElementById("statsContainer").innerHTML += 'Cash in bank: '+game.cash.toFixed(0)+' cash<br/>'
        document.getElementById("statsContainer").innerHTML += 'Total cash printed: '+game.totalCash.toFixed(0)+' cash<br/>'
        document.getElementById("statsContainer").innerHTML += 'Buildings owned: '+building.count.reduce(sum)+'<br/>'
        document.getElementById("statsContainer").innerHTML += 'Upgrades purchased: '+detectUpgrades()+'<br/>'
        document.getElementById("statsContainer").innerHTML += 'Cash per second: '+game.getCashPerSecond().toFixed(0)+' (multiplier: '+(game.cashMultiplier*100).toFixed(0)+'%)<br/>'
        document.getElementById("statsContainer").innerHTML += 'Cash per click: '+game.clickValue.toFixed(0)+'<br/>'
        document.getElementById("statsContainer").innerHTML += 'Total clicks: '+game.totalClicks.toFixed(0)+'<br/>'
        document.getElementById("statsContainer").innerHTML += 'Offline multiplier: '+(game.offlineMultiplier*100).toFixed(1)+'%<br/>'
    },

    updateAchievements: function(){
        document.getElementById("achievementsContainer").innerHTML = "<h2><center>Achievements ("+detectAchievements()+"/"+achievement.name.length+")</center></h2>";
        for (i = 0; i < achievement.name.length; i++){
            if(achievement.done[i]){
                document.getElementById("achievementsContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="'+achievement.name[i]+'  --  '+achievement.description[i]+'"><img src="images/achievements/'+achievement.image[i]+'" class="upgradeImgGrey" onerror="imgError(this);"></div>';
            }else{
                document.getElementById("achievementsContainer").innerHTML += '<div id="upgradeButtonTooltip" data-tooltip="?????????????"><img src="images/unknown.png" class="upgradeImgGrey" onerror="imgError(this);"></div>';
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
        offlineMultiplier: game.offlineMultiplier,
        version: game.version,
        achievementDone: achievement.done,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        upgradePurchased: upgrade.purchased,
        timeSaved: new Date().getTime()
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
        if (typeof savedGame.offlineMultiplier !== "undefined") game.offlineMultiplier = savedGame.offlineMultiplier;
        if (typeof savedGame.achievementDone !== "undefined"){
            for (i = 0; i < savedGame.achievementDone.length; i++){
                achievement.done[i] = savedGame.achievementDone[i];
            }
        }
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
        if (typeof savedGame.timeSaved !== "undefined"){
            if(offlineProduction(savedGame.timeSaved) > 0){
                Toast.show("<b>You earned "+offlineProduction(savedGame.timeSaved)+" cash while you were away</b><br/>("+offlineTime(savedGame.timeSaved)+")")
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
    display.updateAchievements();
    display.updateShop();
    display.updateStats();
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
    display.updateAchievements();
    display.updateStats();
    display.checkAchievements();
}, 1000);

setInterval(function() {
    saveGame();
}, 30000);

function clickValueSet(){
    document.getElementById("clickValueDisplay").innerText = game.clickValue.toFixed(0);
}

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

function detectAchievements(){
    var count = 0;
    for(i = 0; i < achievement.done.length; i++){
        if (achievement.done[i] == true)
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

function imgError(image) {
    image.onerror = "";
    image.src = "images/unknown.png";
    return true;
}


function openTab(evt, tabName){
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i=0; i<tabcontent.length; i++){
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i=0; i<tablinks.length; i++){
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function offlineProduction(oldTime){
    var now = new Date();
    difference = 0;
    difference = now.getTime() - oldTime;
    var differenceSec = difference / 1000;
    differenceSec = Math.abs(differenceSec).toFixed(0);
    var differenceCash = differenceSec * (game.getCashPerSecond()*game.offlineMultiplier).toFixed(0);
    game.cash += differenceCash;
    return(differenceCash);
}
function offlineTime(oldTime){
    var now = new Date();
    difference = 0;
    difference = now.getTime() - oldTime;
    var differenceSec = difference / 1000;
    var differenceMin = differenceSec / 60;
    var differenceHour = differenceMin / 60;
    saveGame();
    return(differenceHour.toFixed(0)+"h:"+differenceMin.toFixed(0)+"m:"+differenceSec.toFixed(0)+"s")
    
}

document.getElementById("defaultOpen").click();