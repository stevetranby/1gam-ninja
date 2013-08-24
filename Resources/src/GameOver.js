var GameOver = cc.Layer.extend({

    _player:null,
    lbWin:null,

    ctor:function() {
        // needed for JS-Bindings compatibility
        //cc.associateWithNative( this, cc.Layer);
    },
    init:function () {
        var bRet = false;
        if (this._super()) {

            var playAgain = cc.MenuItemFont.create("Play Again", this.onPlayAgain, this);

            var menu = cc.Menu.create(playAgain);
            this.addChild(menu, 1, 2);
            menu.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            playAgain.setEnabled(true);

            var lbWin = cc.LabelTTF.create("DEAD","Arial Bold",24);
            lbWin.setPosition(cc.p(winSize.width / 2, winSize.height * 0.75));
            lbWin.setColor(cc.c3b(250,179,0));
            this.addChild(lbWin,10);

            if(ST.WON)
            {
                lbWin.setString("YOU WON!!!");
                if(ST.SOUND)
                {
                    cc.AudioEngine.getInstance().playEffect(s_winEffect);
                }
            }

            var lbScore = cc.LabelTTF.create("Your Score:"+ST.SCORE,"Arial Bold",16);
            lbScore.setPosition(cc.p(winSize.width / 2, winSize.height * 0.25));
            lbScore.setColor(cc.c3b(250,179,0));
            this.addChild(lbScore,10);

            bRet = true;
        }
        return bRet;
    },
    onPlayAgain:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2,scene));
    }
});

GameOver.create = function () {
    var sg = new GameOver();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameOver.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameOver.create();
    scene.addChild(layer);
    return scene;
};
