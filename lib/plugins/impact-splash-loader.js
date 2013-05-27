ig.module(
	'plugins.impact-splash-loader'
)
.requires(
	'impact.loader'
)
.defines(function(){

ig.ImpactSplashLoader = ig.Loader.extend({
	
	endTime: 0,
	fadeToWhiteTime: 200,
	fadeToGameTime: 800,
	logoWidth: 340,
	logoHeight: 120,
	
	end: function() {
		this.parent();
		this.endTime = Date.now();
		
		// This is a bit of a hack - set this class instead of ig.game as the delegate.
		// The delegate will be set back to ig.game after the screen fade is complete.
		ig.system.setDelegate( this );
	},
	
	
	// Proxy for ig.game.run to show the screen fade after everything is loaded
	run: function() {	
		var t = Date.now() - this.endTime;
		var alpha = 1;
		if( t < this.fadeToWhiteTime ) {
			// Draw the logo -> fade to white
			this.draw();
			alpha = t.map( 0, this.fadeToWhiteTime, 0, 1);
		}
		else if( t < this.fadeToGameTime ) {
			// Draw the game -> fade from white
			ig.game.run();
			alpha = t.map( this.fadeToWhiteTime, this.fadeToGameTime, 1, 0);
		}
		else {
			// All done! Dismiss the preloader completely, set the delegate
			// to ig.game
			ig.system.setDelegate( ig.game );
			return;
		}
		
		// Draw the white rect over the whole screen
		ig.system.context.fillStyle = 'rgba(255,255,255,'+alpha+')';
		ig.system.context.fillRect( 0, 0, ig.system.realWidth, ig.system.realHeight );
	},
	
	
	draw: function() {
		// Some damping for the status bar
		this._drawStatus += (this.status - this._drawStatus)/5;
		
		var ctx = ig.system.context;
		var w = ig.system.realWidth;
		var h = ig.system.realHeight;
		var scale = w / this.logoWidth / 3; // Logo size should be 1/3 of the screen width
		var center = (w - this.logoWidth * scale)/2;
		
		// Clear
		ctx.fillStyle = 'rgba(0,0,0,0.8)';
		ctx.fillRect( 0, 0, w, h );

  		var loadingScreen = new Image();
        loadingScreen.src = "data:image/png;base64,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";
        ctx.drawImage(loadingScreen, 0, 0);
		// URL
		// ctx.fillStyle = 'rgb(128,128,128)';
		// ctx.textAlign = 'right';
		// ctx.font = '10px Arial';
		// ctx.fillText( 'http://impactjs.com', w - 10, h - 10 );
		// ctx.textAlign = 'left';
		
		
		ctx.save();
		
			ctx.translate( center, h / 1.9 );
			ctx.scale( scale, scale );
			
			// Loading bar ('visually' centered for the Impact logo)
			ctx.lineWidth = '3';
			ctx.strokeStyle = 'rgb(255,255,255)';
			ctx.strokeRect( 25, this.logoHeight + 40, 300, 20 );
			
			ctx.fillStyle = 'rgb(255,255,255)';
			ctx.fillRect( 30, this.logoHeight + 45, 290 * this._drawStatus, 10 );		
			
			// // Draw 'Impact' text
			// this.drawPaths( 'rgb(255,255,255)', ig.ImpactSplashLoader.PATHS_IMPACT );
			
			// // Some quick and dirty hackery to make the comet's tail wiggle
			// var comet = ig.ImpactSplashLoader.PATHS_COMET;
			// comet[5][0] = 3 -Math.random() * this._drawStatus * 7;
			// comet[5][1] = 3 -Math.random() * this._drawStatus * 10;
			// comet[7][0] = 29.5 -Math.random() * this._drawStatus * 10;
			// comet[7][1] = 40.4 -Math.random() * this._drawStatus * 10;
			// comet[9][0] = 16.1 -Math.random() * this._drawStatus * 10;
			// comet[9][1] = 36.1 -Math.random() * this._drawStatus * 5;
			// ctx.translate( -Math.random() * this._drawStatus * 7, -Math.random() * this._drawStatus * 5 );
			
			// // Draw the comet
			// this.drawPaths( 'rgb(243,120,31)', comet );
			
		ctx.restore();	
	},
	
	
	drawPaths: function( color, paths ) {
		var ctx = ig.system.context;
		ctx.fillStyle = color;
		
		for( var i = 0; i < paths.length; i+=2 ) {
			ctx[ig.ImpactSplashLoader.OPS[paths[i]]].apply( ctx, paths[i+1] );
		}
	}
});

ig.ImpactSplashLoader.OPS = {
	bp:'beginPath',
	cp:'closePath',
	f:'fill',
	m:'moveTo',
	l:'lineTo',
	bc:'bezierCurveTo'
};

// ig.ImpactSplashLoader.PATHS_COMET = [
// 	'bp',[],'m',[85.1,58.3],'l',[0.0,0.0],'l',[29.5,40.4],'l',[16.1,36.1],'l',[54.6,91.6],'bc',[65.2,106.1,83.4,106.7,93.8,95.7],'bc',[103.9,84.9,98.6,67.6,85.1,58.3],'cp',[],'m',[76.0,94.3],'bc',[68.5,94.3,62.5,88.2,62.5,80.8],'bc',[62.5,73.3,68.5,67.2,76.0,67.2],'bc',[83.5,67.2,89.6,73.3,89.6,80.8],'bc',[89.6,88.2,83.5,94.3,76.0,94.3],'cp',[],'f',[]
// ];

// ig.ImpactSplashLoader.PATHS_IMPACT = [
// 	'bp',[],'m',[128.8,98.7],'l',[114.3,98.7],'l',[114.3,26.3],'l',[128.8,26.3],'l',[128.8,98.7],'cp',[],'f',[],
// 	'bp',[],'m',[159.2,70.1],'l',[163.6,26.3],'l',[184.6,26.3],'l',[184.6,98.7],'l',[170.3,98.7],'l',[170.3,51.2],'l',[164.8,98.7],'l',[151.2,98.7],'l',[145.7,50.7],'l',[145.7,98.7],'l',[134.1,98.7],'l',[134.1,26.3],'l',[155.0,26.3],'l',[159.2,70.1],'cp',[],'f',[],
// 	'bp',[],'m',[204.3,98.7],'l',[189.8,98.7],'l',[189.8,26.3],'l',[211.0,26.3],'bc',[220.0,26.3,224.5,30.7,224.5,39.7],'l',[224.5,60.1],'bc',[224.5,69.1,220.0,73.6,211.0,73.6],'l',[204.3,73.6],'l',[204.3,98.7],'cp',[],'m',[207.4,38.7],'l',[204.3,38.7],'l',[204.3,61.2],'l',[207.4,61.2],'bc',[209.1,61.2,210.0,60.3,210.0,58.6],'l',[210.0,41.3],'bc',[210.0,39.5,209.1,38.7,207.4,38.7],'cp',[],'f',[],
// 	'bp',[],'m',[262.7,98.7],'l',[248.3,98.7],'l',[247.1,88.2],'l',[238.0,88.2],'l',[237.0,98.7],'l',[223.8,98.7],'l',[233.4,26.3],'l',[253.1,26.3],'l',[262.7,98.7],'cp',[],'m',[239.4,75.5],'l',[245.9,75.5],'l',[242.6,43.9],'l',[239.4,75.5],'cp',[],'f',[],
// 	'bp',[],'m',[300.9,66.7],'l',[300.9,85.9],'bc',[300.9,94.9,296.4,99.4,287.4,99.4],'l',[278.5,99.4],'bc',[269.5,99.4,265.1,94.9,265.1,85.9],'l',[265.1,39.1],'bc',[265.1,30.1,269.5,25.6,278.5,25.6],'l',[287.2,25.6],'bc',[296.2,25.6,300.7,30.1,300.7,39.1],'l',[300.7,56.1],'l',[286.4,56.1],'l',[286.4,40.7],'bc',[286.4,38.9,285.6,38.1,283.8,38.1],'l',[282.1,38.1],'bc',[280.4,38.1,279.5,38.9,279.5,40.7],'l',[279.5,84.3],'bc',[279.5,86.1,280.4,86.9,282.1,86.9],'l',[284.0,86.9],'bc',[285.8,86.9,286.6,86.1,286.6,84.3],'l',[286.6,66.7],'l',[300.9,66.7],'cp',[],'f',[],
// 	'bp',[],'m',[312.5,98.7],'l',[312.5,39.2],'l',[303.7,39.2],'l',[303.7,26.3],'l',[335.8,26.3],'l',[335.8,39.2],'l',[327.0,39.2],'l',[327.0,98.7],'l',[312.5,98.7],'cp',[],'f',[]
// ];


});