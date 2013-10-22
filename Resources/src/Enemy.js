var Enemy = cc.Sprite.extend({
    eID:0,
    active:true,

    bulletSpeed:60,
    bulletPowerValue:1,
    bulletMaxShots:3,

    HP:10,
    _hurtColorLife:0,
    _gameLayer: null,

    speed:200,
    moveType:null,
    attackDir:0,

    moveComponent: null,
    renderComponent: null,
    aiComponent: null,

    zOrder:1000,
    delayTime:1 + 1.2 * Math.random(),

    ctor:function (arg) {

        this._super();

        this.HP = arg.HP;
        this.moveType = arg.moveType;
        this.scoreValue = arg.scoreValue;
        this.attackDir = arg.attackDir;

        var sheetTexture = cc.TextureCache.getInstance().addImage(s_EnemySheet);
        this.initWithTexture(sheetTexture, cc.rect(0, 0, 16, 16), false);
        this.setTag(this.zOrder);

        // set frame
        var frame0 = cc.SpriteFrame.createWithTexture(sheetTexture, cc.rect(0, 0, 16, 16));
        var frame1 = cc.SpriteFrame.createWithTexture(sheetTexture, cc.rect(16, 0, 16, 16));

        var animFrames = [];
        animFrames.push(frame0);
        animFrames.push(frame1);

        // animate
        var animation = cc.Animation.create(animFrames, 0.3);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
    },

    _timeTick:0,
    _shootTimer:0.0,
    update:function (dt)
    {
        if (this.HP <= 0) {
            this.active = false;
        }

        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
            if (this._hurtColorLife == 1) {
                this.setColor( cc.WHITE );
            }
        }

        this._shootTimer -= dt;
        if (this._shootTimer < 0.0) {
            this._shootTimer = this.delayTime + 0.5 * Math.random();
            this.shoot();
        }

        if(this.aiComponent)
            this.aiComponent.update();
    },

    destroy:function ()
    {
        cc.log("enemy destroyed");
        ST.SCORE += this.scoreValue;

        //var a = new Explosion();
        //a.setPosition(this.getPosition());
        //this.getParent().addChild(a);
        //spark(this.getPosition(),this.getParent(), 1.2, 0.7);

        cc.ArrayRemoveObject(ST.CONTAINER.ENEMIES,this);

        this.removeFromParent(true);

        if (ST.SOUND) {
            cc.AudioEngine.getInstance().playEffect(s_enemyDeathEffect);
        }
    },
    shoot:function ()
    {
        var p = this.getPosition();

        var player = this._gameLayer ? this._gameLayer._player : null;
        if(player)
        {
            var dx = player.getPosition().x - p.x;
            var dy = player.getPosition().y - p.y;
            if(this._gameLayer._inDungeon || Math.abs(dx) > Math.abs(dy))
            {
                if(dx < 0)
                    this.attackDir = ST.DIR.WEST;   
                else
                    this.attackDir = ST.DIR.EAST;   
            }
            else
            {
                if(dy < 0)
                    this.attackDir = ST.DIR.SOUTH;
                else
                    this.attackDir = ST.DIR.NORTH;
            }
        }

        var b = new Bullet(this.bulletSpeed, "W2.png", this.attackDir);

        var bpos = cc.p(p.x, p.y - this.getContentSize().height * 0.2);
        b.setPosition(bpos);
        b.startPos = bpos;

        ST.CONTAINER.ENEMY_BULLETS.push(b);
        this.getParent().addChild(b, b.zOrder, ST.UNIT_TAG.ENMEY_BULLET);
    },
    hurt:function () {
        this._hurtColorLife = 2;
        this.HP--;
        this.setColor( cc.RED);
    },
    collideRect:function(){
        var a = this.getContentSize();
        var p = this.getPosition();
        return cc.rect(p.x - a.width/2, p.y - a.height/4,a.width,a.height/2);
    }
});
