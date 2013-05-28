ig.module(
	'rogers'
)
.requires(
	'impact.game',
	'impact.entity',
	'impact.font',
	'plugins.parallax',
	'plugins.impact-splash-loader',
	'plugins.impact-storage'
)
.defines(function(){

// Asteroids Entity
EntityAsteroid = ig.Entity.extend({
	sizes: [16,21,32,42,47],
	damage: [10,10,20,30,30],
	num: 0,
	speed: 0,
	maxVel: { x: 0, y: 0 },
	type: ig.Entity.TYPE.B,
	sound: new ig.Sound('media/audio/asteroid-hit.*'),
	init: function( x, y, settings ) {
		this.num = Math.floor(Math.random()*this.sizes.length);
		var actualSize = this.sizes[this.num];
		this.size = { x: actualSize, y: actualSize };
		this.animSheet = new ig.AnimationSheet('media/img/asteroid-'+actualSize+'.png', actualSize, actualSize);
		var animationTable = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
		if(Math.random() < 0.5) {
			animationTable.reverse();
		}
		this.addAnim('rotate', 0.07, animationTable);
		this.parent( x, y, settings );
		this.speed = ig.game.speed + Math.random()*ig.game.speed - Math.random()*ig.game.speed;
	},
	update: function() {
		this.parent();
		if(this.pos.x-ig.game.screen.x < -50) {
			this.kill();
		}
	},
	check: function(other) {
		ig.game.player.receiveDamage(this.damage[this.num],this);
		ig.game.UIShield.currentAnim = ig.game.UIShield.anims[ig.game.player.health.floor().toString()];
		if(ig.game.player.health <= 0) {
			ig.game.gameOverType = 'asteroid';
		}
		if(ig.Sound.enabled)
			this.sound.play();
		this.kill();
	},
	kill: function() {
		if(this.pos.x+50 > 0) {
			ig.game.spawnEntity(EntityAsteroidExplosion, ig.game.player.pos.x, ig.game.player.pos.y-40);
		}
		this.parent();
	}
});
EntityAsteroidExplosion = ig.Entity.extend({
	lifetime: 0.3,
	size: { x: 1, y: 1 },
	maxVel: { x: 0, y: 0 },
	animSheet: new ig.AnimationSheet('media/img/asteroid-explosion.png', 93, 96),
	type: ig.Entity.TYPE.NONE,
	init: function(x, y, settings) {
		this.addAnim('hit', 0.03, [9,8,7,6,5,4,3,2,1,0]);
		this.parent(x, y, settings);
		this.idleTimer = new ig.Timer();
	},
	update: function() {
		if(this.idleTimer.delta() > this.lifetime) {
			this.kill();
			return;
		}
		this.parent();
	}
});

// Buttons Entity
EntityButton = ig.Entity.extend({
	sound: new ig.Sound('media/audio/button-click.*'),
	init: function(x, y, settings) {
		this.addAnim('idle', 0.1, [0]);
		this.addAnim('hover', 0.1, [1]);
		this.parent(x, y, settings);
	},
	inFocus: function() {
		return (
			(this.pos.x <= (ig.input.mouse.x + ig.game.screen.x)) &&
			((ig.input.mouse.x + ig.game.screen.x) <= this.pos.x + this.size.x) &&
			(this.pos.y <= (ig.input.mouse.y + ig.game.screen.y)) &&
			((ig.input.mouse.y + ig.game.screen.y) <= this.pos.y + this.size.y)
		);
	}
});
EntityButtonStart = EntityButton.extend({
	size: { x: 183, y: 60 },
	animSheet: new ig.AnimationSheet('media/img/button-start.png', 183, 60),
	update: function() {
		if(ig.input.pressed('click') && this.inFocus()) {
			if(ig.Sound.enabled) {
				this.sound.play();
			}
			ig.system.setGame(StoryScreen);
		}
	}
});
EntityButtonPause = EntityButton.extend({
	size: { x: 42, y: 44 },
	animSheet: new ig.AnimationSheet('media/img/button-pause.png', 42, 44),
	update: function() {
		if(ig.input.pressed('click') && this.inFocus()) {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.game.gamePaused = !ig.game.gamePaused;
		}
	}
});
EntityButtonAudio = EntityButton.extend({
	size: { x: 42, y: 44 },
	animSheet: new ig.AnimationSheet('media/img/button-audio.png', 42, 44),
	init: function(x, y, settings) {
		this.addAnim('true', 0.1, [0]);
		this.addAnim('false', 0.1, [1]);
		this.parent(x, y, settings);
	},
	update: function() {
		if(ig.input.pressed('click') && this.inFocus()) {
			if(!ig.ua.iOS) {
				ig.Sound.enabled = !ig.Sound.enabled;
				if(!ig.ua.mobile && ig.game.storage.isCapable())
					ig.game.storage.set('rogers-audio',ig.Sound.enabled);
				this.currentAnim = this.anims[(ig.Sound.enabled).toString()];
				if(ig.Sound.enabled) {
					ig.music.play();
					this.sound.play();
				}
				else {
					ig.music.pause();
				}
			}
		}
	}
});
EntityButtonFacebook = EntityButton.extend({
	size: { x: 66, y: 69 },
	animSheet: new ig.AnimationSheet('media/img/button-facebook.png', 66, 69),
	update: function() {
		if(ig.input.pressed('click') && this.inFocus()) {
			if(ig.Sound.enabled)
				this.sound.play();
			window.open('http://www.facebook.com/CaptainRogersChronicles');
		}
	}
});
EntityButtonBack = EntityButton.extend({
	size: { x: 206, y: 58 },
	animSheet: new ig.AnimationSheet('media/img/button-back.png', 206, 58),
	update: function() {
		if(ig.input.pressed('click') && this.inFocus()) {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.system.setGame(StartScreen);
		}
	}
});
EntityButtonContinue = EntityButton.extend({
	size: { x: 146, y: 43 },
	animSheet: new ig.AnimationSheet('media/img/button-continue.png', 146, 43),
	update: function() {
	    if(ig.input.pressed('click') && this.inFocus()) {
			if(ig.Sound.enabled)
				this.sound.play();
		}
	}
});
EntityButtonRestart = EntityButton.extend({
	size: { x: 197, y: 58 },
	animSheet: new ig.AnimationSheet('media/img/button-restart.png', 197, 58),
	update: function() {
	    if(ig.input.pressed('click') && this.inFocus()) {
			if(ig.Sound.enabled)
				this.sound.play();
			ig.system.setGame(RogersGame);
		}
	}
});

// The Collectable Shield Entity
EntityItemShield = ig.Entity.extend({
	size: { x: 28, y: 23 },
	maxVel: { x: 0, y: 0 },
	animSheet: new ig.AnimationSheet('media/img/shield.png', 28, 23),
	type: ig.Entity.TYPE.B,
	sound: new ig.Sound('media/audio/shield-collect.*'),
	init: function(x, y, settings) {
		this.addAnim('idle', 0.1, [0]);
		this.parent(x, y, settings);
	},
	update: function() {
		this.parent();
		if(this.pos.x-ig.game.screen.x < -this.size.x) {
			this.kill();
		}
	},
	check: function(other) {
		ig.game.player.health += 20;
		if(ig.game.player.health > ig.game.player.maxHealth) {
			ig.game.player.health = ig.game.player.maxHealth;
		}
		ig.game.UIShield.currentAnim = ig.game.UIShield.anims[ig.game.player.health.floor().toString()];
		if(ig.Sound.enabled)
			this.sound.play();
		this.kill();
	}
});

// The Collectable Star Entity
EntityItemStar = ig.Entity.extend({
	size: { x: 26, y: 26 },
	maxVel: { x: 0, y: 0 },
	animSheet: new ig.AnimationSheet('media/img/star.png', 26, 26),
	type: ig.Entity.TYPE.B,
	sound: new ig.Sound('media/audio/bonus-collect.*'),
	init: function(x, y, settings) {
		this.addAnim('rotate', 0.1, [0,1,2,3,4,5,6,7,8]);		
		this.parent(x, y, settings);
	},
	update: function() {
		this.parent();
		if(this.pos.x-ig.game.screen.x < -this.size.x) {
			this.kill();
		}
	},
	check: function(other) {
		ig.game.score += 200;
		if(ig.Sound.enabled)
			this.sound.play();
		this.kill();
	}
});

// The Mine Entity
EntityItemMine = ig.Entity.extend({
	size: { x: 32, y: 32 },
	maxVel: { x: 0, y: 0 },
	direction: 0,
	animSheet: new ig.AnimationSheet('media/img/mine.png', 32, 32),
	type: ig.Entity.TYPE.B,
	init: function(x, y, settings) {
		this.addAnim('idle', 0.1, [0]);
		this.parent(x, y, settings);
		this.direction = ((Math.floor((Math.random()*2))*2)-1); // 1 or -1
	},
	update: function() {
		this.parent();
		if(this.pos.x - ig.game.screen.x < -this.size.x) {
			this.kill();
		}
		if(this.pos.y > ig.system.height-this.size.y || this.pos.y < 0) { // out of the screen
			this.direction = -this.direction;
		}
		this.pos.y += this.direction;
	},
	check: function(other) {
		this.kill();
		ig.game.gameOverType = 'mine';
		ig.game.player.kill();
	}
});

// The UI Shield Entity
EntityUIShield = ig.Entity.extend({
	size: { x: 100, y: 20 },
	maxVel: { x: 0, y: 0 },
	animSheet: new ig.AnimationSheet('media/img/ui-shield.png', 100, 20),
	type: ig.Entity.TYPE.NONE,
	init: function(x, y, settings) {
		this.addAnim('10', 0.1, [0]);
		this.addAnim('20', 0.1, [1]);
		this.addAnim('30', 0.1, [2]);
		this.addAnim('40', 0.1, [3]);
		this.addAnim('50', 0.1, [4]);
		this.addAnim('60', 0.1, [5]);
		this.addAnim('70', 0.1, [6]);
		this.addAnim('80', 0.1, [7]);
		this.addAnim('90', 0.1, [8]);
		this.addAnim('100', 0.1, [9]);
		this.currentAnim = this.anims['100'];
		this.parent(x, y, settings);
	},
	update: function() {
		this.parent();
	}
});

// The UI Score Entity
EntityUIScore = ig.Entity.extend({
	font: new ig.Font('media/telemarines.font.png'),
	size: { x: 150, y: 20 },
	maxVel: { x: 0, y: 0 },
	animSheet: new ig.AnimationSheet('media/img/ui-score.png', 150, 20),
	type: ig.Entity.TYPE.NONE,
	init: function(x, y, settings) {
		this.addAnim('idle', 0.1, [0]);
		this.parent(x, y, settings);
	},
	update: function() {
		this.parent();
	},
	draw: function() {
		this.parent();
		this.font.draw(ig.game.score.floor().toString(), ig.system.width-60-52, 10, ig.Font.ALIGN.RIGHT);
	}
});

// The Player Entity
EntityPlayer = ig.Entity.extend({
	health: 100,
	maxHealth: 100,
	size: { x: 50, y: 30 },
	offset: { x: 20, y: 30 },
	checkAgainst: ig.Entity.TYPE.B,
	animSheet: new ig.AnimationSheet('media/img/player.png', 82, 74),
	maxVel: { x: 0, y: 110 },
	friction: {x: 0, y: 225 },
	speed: 200,
	ascend: 140,
	sound: new ig.Sound('media/audio/player-engines.*'),
	init: function(x, y, settings) {
		this.addAnim('up', 0.025, [0,1,2,3,4,5,6,5,4,3,2,1]);
		this.addAnim('idle', 0.025, [7,8,9,10,11,12,13,12,11,10,9,8]);
		this.parent(x, y, settings);
	},
	update: function() {
		if(ig.input.state('up') || ig.input.state('click')) {
			if(ig.game.player.pos.y > ig.game.screen.y) {
				if(ig.Sound.enabled)
					this.sound.play();
				this.vel.y = -this.ascend;
				this.currentAnim = this.anims.up;
			}
		}
		else {
				this.currentAnim = this.anims.idle;
		}
		this.parent();
	},
	check: function(other) {
		other.check();
	},
	kill: function() {
		ig.game.spawnEntity(
			EntityPlayerExplosion,
			ig.game.player.pos.x-70,
			ig.game.player.pos.y-90,
			{ callBack: this.onDeath }
		);
		this.parent();
	},
	onDeath: function() {
		ig.game.gameOver = true;
	}
});

EntityPlayerExplosion = ig.Entity.extend({
	lifetime: 1.5,
	callBack: null,
	size: { x: 1, y: 1 },
	maxVel: { x: 0, y: 0 },
	animSheet: new ig.AnimationSheet('media/img/player-explosion.png', 174, 208),
	type: ig.Entity.TYPE.NONE,
	sound: new ig.Sound('media/audio/player-explosion.*'),
	init: function(x, y, settings) {
		this.addAnim('kaboom', 0.03, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
			21,22,23,24,25,26,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
		this.parent(x, y, settings);
		this.idleTimer = new ig.Timer();
		if(ig.Sound.enabled)
			this.sound.play();
	},
	update: function() {
		if(this.idleTimer.delta() > this.lifetime) {
			this.kill();
			if(this.callBack) {
				this.callBack();
			}
			return;
		}
		this.parent();
	},
	draw: function() {
		this.pos.x = ig.game.screen.x;
		this.parent();
	}
});

// The actual Game source
RogersGame = ig.Game.extend({
	clearColor: null, // don't clear the screen
	gravity: 350,
	player: null,
	gameOver: false,
	gameOverType: null,
	gamePaused: false,
	gameCompleted: false,
	maxScore: 20000,
	score: 0,
	speed: 1.5,
	seconds: null,
	secondsTimer: null,
	font: new ig.Font('media/telemarines.font.png'),
	background: new ig.Image('media/img/deepspace.png'),
	stars: new ig.Image('media/img/stars.png'),
	gameOverScreenAsteroid: new ig.Image('media/img/screen-gameover-asteroid.png'),
	gameOverScreenMine: new ig.Image('media/img/screen-gameover-mine.png'),
	gameOverScreenOffscreen: new ig.Image('media/img/screen-gameover-offscreen.png'),
	gamePausedScreen: new ig.Image('media/img/screen-pause.png'),
	gameCompletedScreen: new ig.Image('media/img/screen-gamecompleted.png'),
	storage: new ig.Storage(),
	parallax: null,
	init: function() {
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
		ig.input.bind(ig.KEY.MOUSE1, 'click');
		ig.input.bind(ig.KEY.ENTER, 'ok');
		ig.input.bind(ig.KEY.P, 'p');
		this.secondsTimer = new ig.Timer(1);
		
		this.parallax = new Parallax();
		this.parallax.add(this.background.path, {distance: 5, y: 0});
		this.parallax.add(this.stars.path, {distance: 2, y: 0});
		this.player = this.spawnEntity(EntityPlayer, 40, 72);
		this.UIShield = this.spawnEntity(EntityUIShield, 5, 2);
		this.UIScore = this.spawnEntity(EntityUIScore, ig.system.width-205-47-5, 5);
		this.BtnPause = this.spawnEntity(EntityButtonPause, ig.system.width-47-47-5, 5);
		this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-47, 5);

		if(ig.Sound.enabled) {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['true'];
		}
		else {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['false'];
		}
		this.newItemTable();
		ig.game.player.vel.y = 0;
	},
	placeEntity: function(entity) {
		var x = ig.system.width+50;
		var y = Math.random()*ig.system.height;
		var item = this.spawnEntity(entity, x, y);
			item.speed = ig.game.speed + Math.random()*ig.game.speed/2 - Math.random()*ig.game.speed/2;
		if(y > ig.system.height-item.size.y)
			item.pos.y = ig.system.height-item.size.y;
	},
	shuffleArray: function(array) {
		var len = array.length;
		var i = len;
		while (i--) {
			var p = parseInt(Math.random()*len);
			var t = array[i];
			array[i] = array[p];
			array[p] = t;
		}
	},
	newItemTable: function() {
		this.entityItemTable = [];
		this.entityItemTable.push(EntityItemMine);
		this.entityItemTable.push(EntityItemStar);
		this.entityItemTable.push(EntityItemShield);
		for (var i=0; i<17; i++) {
			this.entityItemTable.push(EntityAsteroid);
		}
		this.shuffleArray(this.entityItemTable);
	},
	update: function() {
		if(this.score >= this.maxScore) {
			// GAME COMPLETED
			if(!this.BtnCompleted) {
				this.BtnCompleted = this.spawnEntity(EntityButtonBack, ig.system.width-206-10, ig.system.height-58-10);
			}
			this.BtnCompleted.update();
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			if(!this.BtnRestart)
				this.BtnRestart = this.spawnEntity(EntityButtonRestart, 10, ig.system.height-58-10);
			if(!this.BtnBack)
				this.BtnBack = this.spawnEntity(EntityButtonBack, ig.system.width-206-10, ig.system.height-58-10);
			this.BtnRestart.update();
			this.BtnBack.update();
			if(ig.input.pressed('click')) {
				this.gamePaused = false;
				ig.game.player.vel.y = 0;
				this.BtnBack.kill();
				this.BtnRestart.kill();
			}
		}
		else if(this.gameOver) {
			// GAME OVER
			if(!this.BtnRestart)
				this.BtnRestart = this.spawnEntity(EntityButtonRestart, 10, ig.system.height-58-10);
			if(!this.BtnBack)
				this.BtnBack = this.spawnEntity(EntityButtonBack, ig.system.width-206-10, ig.system.height-58-10);
			this.BtnRestart.update();
			this.BtnBack.update();
			this.BtnAudio.update();
		}
		else {
			if(ig.input.pressed('ok')) {
				ig.system.setGame(RogersGame);
			}
			else {
				this.speed += 0.0005;
				this.score += ig.system.tick*this.speed*5;

				for(var i = 0; i < this.entities.length; i++) {
					if(this.entities[i].type == ig.Entity.TYPE.B)
						this.entities[i].pos.x -= this.entities[i].speed;
				}
				this.tickCount = Math.ceil(this.score/1000);
				if(this.secondsTimer.delta() > 0) {
					ig.game.seconds++;
					this.secondsTimer.reset();
					for (var i=0; i<this.tickCount; i++) {
						if(!this.entityItemTable.length) {
							this.newItemTable();
						}
						this.placeEntity(this.entityItemTable.pop());
					}
				}
				this.parallax.move(40*this.speed);
				this.parent();
				
				// check for gameover
				if(this.player.pos.y > ig.system.height+this.player.size.y) {
					this.gameOver = true;
					this.gameOverType = 'offscreen';
				}
			}
		}
	},
	draw: function() {
		if(this.score >= this.maxScore) {
			// GAME COMPLETED
			this.gameCompletedScreen.draw(0,0);
			if(this.BtnCompleted)
				this.BtnCompleted.draw();
		}
		else if(this.gamePaused) {
			// GAME PAUSED
			this.gamePausedScreen.draw(0,0);
			if(this.BtnRestart)
				this.BtnRestart.draw();
			if(this.BtnBack)
				this.BtnBack.draw();
		}
		else if(this.gameOver) {
			// GAME OVER
			var x = (ig.system.width-254)/2;
			var y = ((ig.system.height-147)/2)-30;
			switch(this.gameOverType) {
				case 'offscreen': {
					this.gameOverScreenOffscreen.draw(x,y);
					break;
				}
				case 'asteroid': {
					this.gameOverScreenAsteroid.draw(x,y);
					break;
				}
				case 'mine': {
					this.gameOverScreenMine.draw(x,y);
					break;
				}
				default: {}
			}
			if(this.BtnRestart)
				this.BtnRestart.draw();
			if(this.BtnBack)
				this.BtnBack.draw();
			if(this.BtnAudio)
				this.BtnAudio.draw();
		}
		else {
			this.parallax.draw();
			this.parent();
			this.UIShield.draw();
			this.UIScore.draw();
			this.BtnPause.draw();
			this.BtnAudio.draw();
		}
	}
});

// Start Screen
StartScreen = ig.Game.extend({
	clearColor: null, // don't clear the screen
	font: new ig.Font('media/telemarines.font.png'),
	background: new ig.Image('media/img/deepspace.png'),
	stars: new ig.Image('media/img/stars.png'),
	ship: new ig.Image('media/img/cover-ship.png'),
	logo: new ig.Image('media/img/cover-logo.png'),
	title: new ig.Image('media/img/cover-title.png'),
	logoBlackmoon: new ig.Image('media/img/button-blackmoon.png'),
	logoEnclave: new ig.Image('media/img/button-enclave.png'),
	storage: new ig.Storage(),
	counter: 0,
	parallax: null,
	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'start');
		ig.input.bind(ig.KEY.ENTER, 'start');
		ig.input.bind(ig.KEY.MOUSE1, 'click');
		ig.input.bind(ig.KEY.H, 'howTo');
		this.parallax = new Parallax();
		this.parallax.add(this.background.path, {distance: 5, y: 0});
		this.parallax.add(this.stars.path, {distance: 2, y: 0});
		this.BtnStart = this.spawnEntity(EntityButtonStart, ig.system.width-183-10, ig.system.height-60-10);
		this.BtnFacebook = this.spawnEntity(EntityButtonFacebook, ig.system.width-66-10, 10);
		this.BtnAudio = this.spawnEntity(EntityButtonAudio, ig.system.width-130, 10);

		if(!ig.ua.mobile && ig.game.storage.isCapable()) {
			ig.Sound.enabled = ig.game.storage.get('rogers-audio');
		}
		ig.music.add('media/audio/theme-music.*');
		ig.music.volume = 0.7;
		if(ig.Sound.enabled) {
			ig.music.play();
			this.BtnAudio.currentAnim = this.BtnAudio.anims['true'];
		}
		else {
			this.BtnAudio.currentAnim = this.BtnAudio.anims['false'];
		}
	},
	update: function() {
		if(ig.input.pressed('start')) {
			ig.system.setGame(StoryScreen);
		}
		else if(ig.input.pressed('howTo')) {
			ig.system.setGame(HowToScreen);
		}
		this.counter++;
		this.parallax.move(40);
		this.parent();
	},
	draw: function() {
		this.parent();
		this.parallax.draw();
		this.BtnStart.draw();
		this.logoBlackmoon.draw(10,10);
		this.logoEnclave.draw(55,10);
		this.BtnFacebook.draw();
		this.BtnAudio.draw();
		var range = ((this.counter/3)%60)-30;
		var delta = (range > 0) ? 1 : -1;
		var tick = range*delta;
		this.ship.draw(-30,ig.system.height-this.ship.height+tick+10);
		this.logo.draw((ig.system.width-this.logo.width)/2-20,10);
		this.title.draw((ig.system.width-this.title.width+160)/2,100);
	}
});

StoryScreen = ig.Game.extend({
	story: new ig.Image('media/img/screen-story.png'),
	buttonContinue: new ig.Image('media/img/button-continue.png'),
	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'start');
		ig.input.bind(ig.KEY.ENTER, 'start');
		ig.input.bind(ig.KEY.MOUSE1, 'start');
	},
	update: function() {
		if(ig.input.pressed('start')) {
			ig.system.setGame(HowToScreen);
		}
		this.parent();
	},
	draw: function() {
		this.parent();
		this.story.draw(0,0);
		this.buttonContinue.draw(ig.system.width-146-10,ig.system.height-43-10);
	}
});

HowToScreen = ig.Game.extend({
	howTo: new ig.Image('media/img/screen-howto.png'),
	buttonContinue: new ig.Image('media/img/button-continue.png'),
	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'start');
		ig.input.bind(ig.KEY.ENTER, 'start');
		ig.input.bind(ig.KEY.MOUSE1, 'start');
		ig.input.bind(ig.KEY.H, 'howTo');
	},
	update: function() {
		if(ig.input.pressed('howTo')) {
			ig.system.setGame(StartScreen);
		}
		if(ig.input.pressed('start')) {
			ig.system.setGame(RogersGame);
		}
		this.parent();
	},
	draw: function() {
		this.parent();
		this.howTo.draw(0,0);
		this.buttonContinue.draw(ig.system.width-146-10,ig.system.height-43-10);
	}
});

if(ig.ua.iOS) {
	ig.Sound.enabled = false;
}

window.onorientationchange = function() {
	if(ig.ua.mobile && window.orientation == 0) {
		document.getElementById('rotate').style.display = 'block';
		document.getElementById('canvas').style.display = 'none';
	}
	else {
		document.getElementById('rotate').style.display = 'none';
		document.getElementById('canvas').style.display = 'block';
	}
}

if(ig.ua.mobile && window.orientation == 0) {
	document.getElementById('rotate').style.display = 'block';
	document.getElementById('canvas').style.display = 'none';
}

ig.main('#canvas', StartScreen, 30, 480, 320, 1, ig.ImpactSplashLoader);
});