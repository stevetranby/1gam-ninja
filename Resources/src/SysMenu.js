var SysMenu = cc.Layer.extend({
	_ship:null,

	init:function () {

		var bRet = false;

		if (this._super()) {
			winSize = cc.Director.getInstance().getWinSize();

			var titleScreen = cc.Sprite.create(s_titleScreen);
			titleScreen.setPosition(cc.p(winSize.width/2, winSize.height/2));
			this.addChild(titleScreen, 10, 1);

			var selfPointer = this;
			// Setup Window and Input
			this.setTouchEnabled(true);
			
			if(this.setKeypadEnabled)
				this.setKeypadEnabled(true);

			// accept touch now!
			var t = sys.platform;
			if( t == 'browser' )
			{
				this.setTouchEnabled(true);
				this.setKeyboardEnabled(true);
			}
			else if( t == 'desktop' )
			{
				this.setMouseEnabled(true);
			}
			else if( t == 'mobile' )
			{
				this.setTouchEnabled(true);
			}

			if (ST.SOUND) {
				cc.AudioEngine.getInstance().setMusicVolume(0.2);
				cc.AudioEngine.getInstance().playMusic(s_mainMainMusic, false);
				cc.AudioEngine.getInstance().setMusicVolume(0.2);
			}

			bRet = true;
		}

		return bRet;
	},
	onTouchesBegan:function (touches, event) {
		this.isMouseDown = true;
	},
	onTouchesMoved:function (touches, event) {
		if (this.isMouseDown) {
			if (touches) {
				// do stuff with touch drag
			}
		}
	},
	onTouchesEnded:function (touches, event) {
		this.isMouseDown = false;
		// start game
		this.onNewGame();
	},
	onTouchesCancelled:function (touches, event) {
		cc.log("onTouchesCancelled");
	},
	keyBackClicked:function (e) {
		cc.log("[sysMenu] keyBackClicked => " + e);
	},
	keyMenuClicked:function (e) {
		cc.log("[sysMenu] keyMenuClicked => " + e);
	},
	keypadDown:function (e) {
		cc.log("[sysMenu] keypadDown => " + e);
		//this.onNewGame();
	},
	keypadUp:function (e) {
		cc.log("[sysMenu] keypadUp => " + e);
		this.onNewGame();
	},
	onKeyDown:function (e)
	{
		cc.log("key down => " + e);
		ST.KEYS[e] = true;
		if(e === ST.KEY.space)
		{
			this.onNewGame();
		}
	},
	onKeyUp:function (e) {
		cc.log("key up => " + e);
		ST.KEYS[e] = false;
	},
	onNewGame:function (pSender) {
		this.onButtonEffect();
		var scene = cc.Scene.create();
		scene.addChild(GameLayer.create());
		cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
	},
	onAbout:function (pSender) {
		this.onButtonEffect();
		//var scene = cc.Scene.create();
		//scene.addChild(AboutLayer.create());
		//cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
	},
	onButtonEffect:function(){
		if (ST.SOUND) {
			var s = cc.AudioEngine.getInstance().playEffect(s_buttonEffect);
		}
	}
});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};