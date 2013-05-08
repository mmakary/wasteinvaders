//Global
var level = 1;
var pause = false;
var lives = 3;

var scoreRate = 1;
var shield = false;

var myPlane;
var badGuys = [];
var missiles = [];
var mines = [];
var badMissiles = [];
var bonusArray = [];

var noOfBadGuys = 0;
var noOfMissiles = 0;
var noOfMines = 0;

var exp=true;
var fire = false;

var score  = 0;

var tidMine;
var tid;
var tidMissile;

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x66FF99, true);

// create a renderer instance
if(window.innerWidth>800)
{
    var renderer = PIXI.autoDetectRenderer(600, window.innerHeight, null, true);
    var width = 600;
}
else
{
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, true);
    var width = window.innerWidth;
}
	
// add the renderer view element to the DOM
document.body.appendChild(renderer.view);
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
if(window.innerWidth>800)
{
    renderer.view.style.left = ""+((window.innerWidth/2)-300)+"px";
}
else
{
    renderer.view.style.left = "0px";
}

requestAnimFrame( animate );

var bg1=PIXI.Sprite.fromImage("shmupBG_top.jpg");
var bg2=PIXI.Sprite.fromImage("shmupBG_bot.jpg");
var bg3=PIXI.Sprite.fromImage("shmupBG_mid.jpg");
stage.addChild(bg1);
stage.addChild(bg2);
stage.addChild(bg3);

var cld1=PIXI.Sprite.fromImage("cld1.png");
var cld2=PIXI.Sprite.fromImage("cld2.png");
var cld3=PIXI.Sprite.fromImage("cld3.png");
stage.addChild(cld1);
stage.addChild(cld2);
stage.addChild(cld3);

//lives
var lifeTexture = new PIXI.Texture.fromImage("life.png");

var life1 = new PIXI.Sprite(lifeTexture);
life1.position.x = width - 50;
life1.position.y = 50;
life1.anchor.x = 0;
life1.anchor.y = 1;
life1.scale.x = life1.scale.y = 0.2;
stage.addChild(life1);

var life2 = new PIXI.Sprite(lifeTexture);
life2.position.x = width - 50;
life2.position.y = 100;
life2.anchor.x = 0;
life2.anchor.y = 1;
life2.scale.x = life2.scale.y = 0.2;
stage.addChild(life2);

var life3 = new PIXI.Sprite(lifeTexture);
life3.position.x = width - 50;
life3.position.y = 150;
life3.anchor.x = 0;
life3.anchor.y = 1;
life3.scale.x = life3.scale.y = 0.2;
stage.addChild(life3);

//Score Text
var scoreTxt = new PIXI.Text("2","bold 75px Electrolize","#82c442");
scoreTxt.alpha=0.7;
scoreTxt.position.x = width-50;
scoreTxt.position.y = 50;
scoreTxt.anchor.x = 1;
scoreTxt.anchor.y = 0.5;

function play(){
    stage.addChild(scoreTxt);
    createMyplane(width/2, window.innerHeight-(window.innerHeight/4));
    if(level === 1){
        tidMine = setInterval(createMine, 2000);
        tid = setInterval(mycode, 1000);
    }else if(level === 2){
        tidMine = setInterval(createMine, 1000);
        tid = setInterval(mycode,500);
    }
    beginBonus();
    tidMissile = setInterval(missileShoot, 50);
    createPause();
}

function beginAgain(){
    
        for (var i=0; i < badGuys.length; i++) 
        {
            if(badGuys[i].life)
            {
                stage.removeChild(badGuys[i].sprite);
                badGuys[i].life = false;
                badGuys.slice(i,1);
            }
        }

        for (var i=0; i < mines.length; i++) 
        {
            if(mines[i].life)
            {
                stage.removeChild(mines[i].sprite);
                mines[i].life = false;
                mines.slice(i,1);
            }
        }

        for (var i=0; i <  missiles.length; i++) 
        {
            if(missiles[i].life)
            {
                stage.removeChild(missiles[i].sprite);
                missiles[i].life = false;
                missiles.slice(i,1);
            }
        }
        
        fire = false;
        abortTimer();
        abortMineTimer();
        abortBadMissileShoot();
        abortBonus();
        
    if(lives === 0){
        score = 0;
        lives = 3;
        stage.addChild(life2);
        stage.addChild(life3);
        gameOver();
        setTimeout(waitThenRemove, 3000);
        function waitThenRemove(){
            stage.removeChild(gOver);
            createMyplane(width/2, window.innerHeight-(window.innerHeight/4));
            if(level === 1){
                tidMine = setInterval(createMine,2000);
                tid = setInterval(mycode, 1000);
            }else if(level === 2){
                tidMine = setInterval(createMine, 1000);
                tid = setInterval(mycode, 500);
            }
            beginBonus();
            tidMissile = setInterval(missileShoot, 50);
            stage.removeChild(pauseButton);
            createPause();
            pause = false;
        }
    }else{
        if(lives === 2){
            stage.removeChild(life3);
        }else if(lives === 1){
            stage.removeChild(life2);
        }
        
        setTimeout(waitThenBegin, 1000);
        
        function waitThenBegin(){
            createMyplane(width/2, window.innerHeight-(window.innerHeight/4));
            if(level === 1){
                tidMine = setInterval(createMine, 2000);
                tid = setInterval(mycode, 1000);
            }else if(level === 2){
                tidMine = setInterval(createMine, 1000);
                tid = setInterval(mycode, 500);
            }
            beginBonus();
            tidMissile = setInterval(missileShoot, 50);
            stage.removeChild(pauseButton);
            createPause();
        }
    }
}

var gOver;
function gameOver(){
    gOver = new PIXI.Sprite(gameOverTexture);
    gOver.position.x = width/2;
    gOver.position.y = innerHeight/2;
    gOver.anchor.x = 0.5;
    gOver.anchor.y = 0.5;
    gOver.scale.x = gOver.scale.y = 0.1;
    stage.addChild(gOver);
}

// create a texture from an image path
var texture = new PIXI.Texture.fromImage("myplane.png");
var texture2 = new PIXI.Texture.fromImage("badguy.png");
var texture3 = new PIXI.Texture.fromImage("badguy2.png");
var texture4 = new PIXI.Texture.fromImage("badguy3.png");
var texture5 = new PIXI.Texture.fromImage("mine.png");
var missileTexture = new PIXI.Texture.fromImage("badmissile.png");
var pauseTexture = new PIXI.Texture.fromImage("pause.png");
var gameOverTexture = new PIXI.Texture.fromImage("gameover.png");
var easy = new PIXI.Texture.fromImage("easy.png");
var hard = new PIXI.Texture.fromImage("hard.png");

var pauseButton;

function createPause(){
    pauseButton = new PIXI.Sprite(pauseTexture);
    pauseButton.setInteractive(true);
    pauseButton.buttonMode = true;
    pauseButton.position.x = width - 50;
    pauseButton.position.y = innerHeight - 50;
    pauseButton.anchor.x = 0.1;
    pauseButton.anchor.y = 0.1;
    pauseButton.scale.x = pauseButton.scale.y = 0.2;
    pauseButton.mousedown = pauseButton.touchstart = function(data)
    {
            this.data = data;
            this.alpha = 0.8;
    };
    pauseButton.mouseup = pauseButton.mouseupoutside = pauseButton.touchend = pauseButton.touchendoutside = function(data)
    {
        this.data = data;
        this.alpha = 1;
        if(!pause){
            pause = true;
            fire = false;
            abortTimer();
            abortMineTimer();
            abortBadMissileShoot();
            abortBonus();
        }else{
            pause = false;
            fire = false;
            if(level === 1){
                tidMine = setInterval(createMine, 2000);
                tid = setInterval(mycode, 1000);
            }else if(level === 2){
                tidMine = setInterval(createMine, 1000);
                tid = setInterval(mycode, 500);
            }
            tidMissile = setInterval(missileShoot, 50);
            beginBonus();
        }
    };
    stage.addChild(pauseButton);
}
menu();
var easyButton;
var hardButton;

function menu(){
    easyButton = new PIXI.Sprite(easy);
    easyButton.setInteractive(true);
    easyButton.buttonMode = true;
    easyButton.position.x = width/2;
    easyButton.position.y = innerHeight/2 - 50;
    easyButton.anchor.x = 0.5;
    easyButton.anchor.y = 0.5;
    easyButton.scale.x = easyButton.scale.y = 1;
    easyButton.mousedown = easyButton.touchstart = function(data)
    {
            this.data = data;
            this.alpha = 0.8;
    };
    easyButton.mouseup = easyButton.mouseupoutside = easyButton.touchend = easyButton.touchendoutside = function(data)
    {
        this.alpha = 1;
        level = 1;
        play();
        stage.removeChild(easyButton);
        stage.removeChild(hardButton);
    };
    stage.addChild(easyButton);
    
    hardButton = new PIXI.Sprite(hard);
    hardButton.setInteractive(true);
    hardButton.buttonMode = true;
    hardButton.position.x = width/2;
    hardButton.position.y = innerHeight/2 + 50;
    hardButton.anchor.x = 0.5;
    hardButton.anchor.y = 0.5;
    hardButton.scale.x = hardButton.scale.y = 1;
    hardButton.mousedown = hardButton.touchstart = function(data)
    {
            this.data = data;
            this.alpha = 0.8;
    };
    hardButton.mouseup = hardButton.mouseupoutside = hardButton.touchend = hardButton.touchendoutside = function(data)
    {
        this.data = data;
        this.alpha = 1;
        level = 2;
        play();
        stage.removeChild(easyButton);
        stage.removeChild(hardButton);
    };
    stage.addChild(hardButton);
}

function createMyplane(x, y){
    // create our little myplane friend..
    var myplane = new PIXI.Sprite(texture);
    // enable the myplane to be interactive.. this will allow it to respond to mouse and touch events		
    myplane.setInteractive(true);
    // this button mode will mean the hand cursor appears when you rollover the myplane with your mouse
    //myplane.buttonMode = true;

    // center the myplanes anchor point
    myplane.anchor.x = 0.5;
    myplane.anchor.y = 0.5;
    // make it a bit smaller
    myplane.scale.x = myplane.scale.y = 0.5;

    // use the mousedown and touchstart
    myplane.mousedown = myplane.touchstart = function(data)
    {
        // store a refference to the data
        // The reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = data;
        this.alpha = 1;
        this.dragging = true;
        fire = true;
    };
		
    // set the events for when the mouse is released or a touch is released
    myplane.mouseup = myplane.mouseupoutside = myplane.touchend = myplane.touchendoutside = function(data)
    {
        if(!pause){
            this.alpha = 1;
            this.dragging = false;
            fire = false;
            // set the interaction data to null
            this.data = null;
        }
    };
		
    // set the callbacks for when the mouse or a touch moves
    myplane.mousemove = myplane.touchmove = function(data)
    {
        if(!pause){
            this.data = data;
            this.alpha = 1;
            this.dragging = true;
            if(this.dragging)
            {
                // need to get parent coords..
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
                myPlane = { life: true, sprite: myplane, x: myplane.position.x, y: myplane.position.y };
            }
        }
    };

    // move the sprite to its designated position
    myplane.position.x = x;
    myplane.position.y = y;

    // add it to the stage
    stage.addChild(myplane);
    
    myPlane = { life: true, sprite: myplane, x: myplane.position.x, y: myplane.position.y };
}

function createMine() {
        var mine= new PIXI.Sprite(texture5);

        mine.position.x = 40 + (Math.random() * width-80);
        mine.position.y = 0;
        mine.anchor.x = 0.5;
        mine.anchor.y = 0.5;
        mine.scale.x = mine.scale.y = 0.2;
        
        mines.push({sprite:mine, life:true});
        stage.addChild(mines[noOfMines].sprite);
        noOfMines += 1;
}

function abortMineTimer() { // to be called when you want to stop the timer
    clearInterval(tidMine);
}

function explosion(x,y,type){
    
    var explosionTextures = [];
    for(var i=0; i < 26; i++){
        var texture = PIXI.Texture.fromImage("Explosion_Sequence_A " + (i+1) + ".png");
        explosionTextures.push(texture);
    }
    // create an explosion MovieClip
    var expl = new PIXI.MovieClip(explosionTextures);
    expl.position.x = x;
    expl.position.y = y;
    expl.anchor.x = 0.5;
    expl.anchor.y = 0.5;
    expl.rotation = Math.random() * Math.PI;
    
    if(type === 1){
        expl.scale.x = expl.scale.y = 1;
    }else if(type === 2){
        expl.scale.x = expl.scale.y = 0.5;
    }else if(type === 3){
        expl.scale.x = expl.scale.y = 3;
    }
    
    expl.gotoAndPlay(Math.random() * 27);
    stage.addChild(expl);
    
    if((type === 1)||(type === 2)){
        setTimeout(stopExplosion, 300);
    }else if(type === 3){
        setTimeout(stopExplosion, 1000);
    }
    
    function stopExplosion(){
        stage.removeChild(expl);
    };
}

function mycode() {
    
    var badGuyType = Math.floor(Math.random()*4);
    var bad;
    if(badGuyType===1){
        bad = new PIXI.Sprite(texture2);
    }
    if(badGuyType===2){
        bad = new PIXI.Sprite(texture4);
    }
    if(badGuyType===3){
        bad = new PIXI.Sprite(texture3);
    }
    
    bad.position.x = 40 + (Math.random() * width-80);
    bad.position.y = (-10);
    bad.anchor.x = 0.5;
    bad.anchor.y = 0.5;
    bad.scale.x = bad.scale.y = 0.7;

    badGuys.push({sprite:bad, life:true});
    stage.addChild(badGuys[noOfBadGuys].sprite);
    noOfBadGuys += 1;
}

function abortTimer() { // to be called when you want to stop the timer
    clearInterval(tid);
}                       

function missileShoot() {
    if (fire)
    {
        var missile = new PIXI.Sprite(missileTexture);

        missile.position.x = myPlane.x;
        missile.position.y = myPlane.y;
        missile.anchor.x = 0.5;
        missile.anchor.y = 0.5;
        missile.scale.x = 0.5;
        missile.scale.y = 0.5;

        missiles.push({sprite:missile, life:true});
        stage.addChild(missiles[noOfMissiles].sprite);
        noOfMissiles += 1;
    }
}

function abortBadMissileShoot() { // to be called when you want to stop the timer
    clearInterval(tidMissile);
} 

var tidBonus;
var bonus1 = new PIXI.Texture.fromImage("bonus1.png");
var bonus2 = new PIXI.Texture.fromImage("bonus2.png");
var lifeBonus = new PIXI.Texture.fromImage("life.png");

function beginBonus(){
    tidBonus = setInterval(bonus, 30000);
}
        
function bonus(){
    var bonusType = Math.floor(Math.random()*3)+1;
    if(bonusType === 1){
        var bonus = new PIXI.Sprite(bonus1);
        bonus.position.x = 40 + (Math.random()*(width-80));
        bonus.position.y = 30;
        bonus.anchor.x = 0.5;
        bonus.anchor.y = 0.5;
        bonus.scale.x = 0.4;
        bonus.scale.y = 0.4;

        bonusArray.push({sprite:bonus, life:true, type: bonusType});
        stage.addChild(bonusArray[bonusArray.length-1].sprite);
    }else if(bonusType === 2){
        var bonus = new PIXI.Sprite(bonus2);
        bonus.position.x = 40 + (Math.random()*(width-80));
        bonus.position.y = 30;
        bonus.anchor.x = 0.5;
        bonus.anchor.y = 0.5;
        bonus.scale.x = 0.2;
        bonus.scale.y = 0.2;

        bonusArray.push({sprite:bonus, life:true, type: bonusType});
        stage.addChild(bonusArray[bonusArray.length-1].sprite);
    }else{
        var bonus = new PIXI.Sprite(lifeBonus);
        bonus.position.x = 40 + (Math.random()*(width-80));
        bonus.position.y = 30;
        bonus.anchor.x = 0.5;
        bonus.anchor.y = 0.5;
        bonus.scale.x = 0.2;
        bonus.scale.y = 0.2;

        bonusArray.push({sprite:bonus, life:true, type: bonusType});
        stage.addChild(bonusArray[bonusArray.length-1].sprite);        
    }
}

function abortBonus() { // to be called when you want to stop the timer
    clearInterval(tidBonus);
}

function hitBadGuys(){
    
    for(var j=0; j < missiles.length; j++)
    {
        for(var i=0; i < badGuys.length; i++)
        {
            if(badGuys[i].life && missiles[j].life)
            {
                if((missiles[j].sprite.position.x < badGuys[i].sprite.position.x+50)&&(missiles[j].sprite.position.x > badGuys[i].sprite.position.x-50))
                {
                    if((missiles[j].sprite.position.y < badGuys[i].sprite.position.y+20)&&(missiles[j].sprite.position.y > badGuys[i].sprite.position.y-20))
                    {
                        explosion(missiles[j].sprite.position.x, missiles[j].sprite.position.y,1);
                        stage.removeChild(missiles[j].sprite);
                        stage.removeChild(badGuys[i].sprite);
                        missiles[j].life = false;
                        badGuys[i].life = false;
                        missiles.slice(j,1);
                        badGuys.slice(i,1);
                        score += 25*scoreRate;
                    }
                }
            }
        }
        
        for(var i=0; i < mines.length; i++)
        {
            if(mines[i].life && missiles[j].life)
            {
                if((missiles[j].sprite.position.x < mines[i].sprite.position.x+15)&&(missiles[j].sprite.position.x > mines[i].sprite.position.x-15))
                {
                    if((missiles[j].sprite.position.y < mines[i].sprite.position.y+15)&&(missiles[j].sprite.position.y > mines[i].sprite.position.y-15))
                    {
                        explosion(missiles[j].sprite.position.x, missiles[j].sprite.position.y,2);
                        stage.removeChild(missiles[j].sprite);
                        stage.removeChild(mines[i].sprite);
                        missiles[j].life = false;
                        mines[i].life = false;
                        missiles.slice(j,1);
                        mines.slice(i,1);
                        score += 10*scoreRate;
                    }
                }
            }
        }
    }
}

function getHit(){
    if (!shield){
        for(var i=0; i < badGuys.length; i++){
            if(badGuys[i].life && myPlane.life){
                if((myPlane.x < badGuys[i].sprite.position.x+50)&&(myPlane.x > badGuys[i].sprite.position.x-50)){
                    if((myPlane.y < badGuys[i].sprite.position.y+20)&&(myPlane.y > badGuys[i].sprite.position.y-20)){
                        explosion(myPlane.x, myPlane.y, 3);
                        stage.removeChild(myPlane.sprite);
                        stage.removeChild(badGuys[i].sprite);
                        myPlane.life = false;
                        badGuys[i].life = false;
                        badGuys.slice(i,1);
                        fire = false;
                        lives -= 1;
                        beginAgain();
                    }
                }
            }
        }

        for(var i=0; i < mines.length; i++){
            if(mines[i].life && myPlane.life){
                if((myPlane.x < mines[i].sprite.position.x+50)&&(myPlane.x > mines[i].sprite.position.x-50)){
                    if((myPlane.y < mines[i].sprite.position.y+20)&&(myPlane.y > mines[i].sprite.position.y-20)){
                        explosion(myPlane.x, myPlane.y, 3);
                        stage.removeChild(myPlane.sprite);
                        stage.removeChild(mines[i].sprite);
                        myPlane.life = false;
                        mines[i].life = false;
                        mines.slice(i,1);
                        fire = false;
                        lives -= 1;
                        beginAgain();
                    }
                }
            }
        }
    }
}

function getBonus(){
    var typeOfBonus;
    for(var i=0; i<bonusArray.length; i++){
        if(bonusArray[i].life && myPlane.life){
            if((myPlane.x < bonusArray[i].sprite.position.x+50)&&(myPlane.x > bonusArray[i].sprite.position.x-50)){
                if((myPlane.y < bonusArray[i].sprite.position.y+20)&&(myPlane.y > bonusArray[i].sprite.position.y-20)){
                    typeOfBonus = bonusArray[i].type;
                    stage.removeChild(bonusArray[i].sprite);
                    bonusArray[i].life = false;
                    bonusArray.slice(i,1);
                    
                    if(typeOfBonus === 1){
                        getDoubleScore();
                    }else if(typeOfBonus === 2){
                        getShield();
                    }else if(typeOfBonus === 3){
                        getExtralife();
                    }
                }
            }
        }
    }
}

function getDoubleScore(){
    scoreRate = 2;
    var bonusActive1 = new PIXI.Sprite(bonus1);
    bonusActive1.position.x = width - 80;
    bonusActive1.position.y = 100;
    bonusActive1.anchor.x = 0.5;
    bonusActive1.anchor.y = 0.5;
    bonusActive1.scale.x = 0.4;
    bonusActive1.scale.y = 0.4;
    stage.addChild(bonusActive1);
    
    setTimeout(function(){scoreRate = 1; stage.removeChild(bonusActive1);}, 8000);
}
 
function getShield(){
    shield = true;
    var bonusActive2 = new PIXI.Sprite(bonus2);
    bonusActive2.position.x = width - 130;
    bonusActive2.position.y = 100;
    bonusActive2.anchor.x = 0.5;
    bonusActive2.anchor.y = 0.5;
    bonusActive2.scale.x = 0.25;
    bonusActive2.scale.y = 0.25;
    stage.addChild(bonusActive2);
    
    setTimeout(function(){shield = false; stage.removeChild(bonusActive2);}, 8000);
}

function getExtralife(){
    if(lives === 2){
        stage.addChild(life3);
        lives += 1;
    }else if(lives === 1){
        stage.addChild(life2);
        lives += 1;
    }else if(lives === 3){
        score += 100*scoreRate;
    }
    
}

function animate() {
    bg1.position.y=bg1.position.y+5;	
    if(bg3.position.y==0){
        bg1.position.y=-790;
    }
    if(bg1.position.y==0){
        bg2.position.y=-800;
    }
    bg2.position.y=bg2.position.y+5;
    if(bg2.position.y==0){
        bg3.position.y=-800;
    }
    bg3.position.y=bg3.position.y+5;

    cld1.position.y=cld1.position.y+2;	
    if(cld3.position.y==0){
        cld1.position.y=-800;
    }
    if(cld1.position.y==0){
        cld2.position.y=-800;
    }
        cld2.position.y=cld2.position.y+2;
    if(cld2.position.y==0){
        cld3.position.y=-800;
    }
    cld3.position.y=cld3.position.y+2;

    if(!pause){
        for (var i=0; i < badGuys.length; i++) 
        {
            if(badGuys[i].life)
            {
                if(level ===1){
                    badGuys[i].sprite.position.y = badGuys[i].sprite.position.y + 1;
                    badGuys[i].sprite.position.y = badGuys[i].sprite.position.y + 1;
                }else{
                    badGuys[i].sprite.position.y = badGuys[i].sprite.position.y + 2;
                    badGuys[i].sprite.position.y = badGuys[i].sprite.position.y + 2;
                }
                
                var direction = Math.floor(Math.random()*1000)+1;
                if(direction %2 === 0){
                    if(badGuys[i].sprite.position.x+20 < width){
                        badGuys[i].sprite.position.x = badGuys[i].sprite.position.x + 0.5;
                    }
                }else{
                    if(badGuys[i].sprite.position.x-20 > 0){
                        badGuys[i].sprite.position.x = badGuys[i].sprite.position.x - 0.5;
                    }
                }

                if (badGuys[i].sprite.position.y > innerHeight+50)
                {
                    stage.removeChild(badGuys[i].sprite);
                    badGuys[i].life = false;
                    badGuys.slice(i,1);
                }
            }
        }

        for (var i=0; i < mines.length; i++) 
        {
            if(mines[i].life)
            {
                mines[i].sprite.position.y = mines[i].sprite.position.y + 1;
                mines[i].sprite.position.y = mines[i].sprite.position.y + 1;

                if (mines[i].sprite.position.y > innerHeight+5)
                {
                    stage.removeChild(mines[i].sprite);
                    mines[i].life = false;
                    mines.slice(i,1);
                }
            }
        }

        for (var i=0; i < bonusArray.length; i++) 
        {
            if(bonusArray[i].life)
            {
                bonusArray[i].sprite.position.y = bonusArray[i].sprite.position.y + 1;
                bonusArray[i].sprite.position.y = bonusArray[i].sprite.position.y + 1;

                if (bonusArray[i].sprite.position.y > innerHeight+5)
                {
                    stage.removeChild(bonusArray[i].sprite);
                    bonusArray[i].life = false;
                    bonusArray.slice(i,1);
                }
            }
        }

        for (var i=0; i <  missiles.length; i++) 
        {
            if(missiles[i].life)
            {
                missiles[i].sprite.position.y = missiles[i].sprite.position.y - 3;
                missiles[i].sprite.position.y = missiles[i].sprite.position.y - 3;

                if (missiles[i].y < -50)
                {
                    stage.removeChild(missiles[i].sprite);
                    missiles[i].life = false;
                    missiles.slice(i,1);
                }
            }
        }

        hitBadGuys();
        getHit();
        getBonus();
        
        scoreTxt.setText(score);
    }
    renderer.render(stage);
    requestAnimFrame( animate );
}