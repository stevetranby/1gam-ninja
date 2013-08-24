//bullet
var Bullet = cc.Sprite.extend({
		active:true,
		startPos:null,
		xVelocity:0,
		yVelocity:0,
		power:1,
		HP:1,
		moveType:null,
		zOrder:3000,
		attackDir:0,
		parentType:ST.BULLET_TYPE.PLAYER,
		ctor:function (bulletSpeed, weaponType, attackDir)
		{
				this._super();

				if(attackDir == ST.DIR.EAST)
						this.xVelocity = bulletSpeed;
				if(attackDir == ST.DIR.WEST)
						this.xVelocity = -bulletSpeed;
				if(attackDir == ST.DIR.NORTH)
						this.yVelocity = bulletSpeed;
				if(attackDir == ST.DIR.SOUTH)
						this.yVelocity = -bulletSpeed;

				this.attackDir = attackDir;
				this.startPos = cc.p(0,0);

				var sheetTexture = cc.TextureCache.getInstance().addImage(s_WeaponSheet);
				this.initWithTexture(sheetTexture, cc.rect(0, 0, 16, 16), false);

				var rotateAction = cc.RotateBy.create(0.6,360);
				var repeatAction = cc.RepeatForever.create(rotateAction);
				this.runAction(repeatAction);
		},
		update:function (dt) {
				var p = this.getPosition();
				p.x += this.xVelocity * dt;
				p.y += this.yVelocity * dt;
				this.setPosition( p );
				if (this.HP <= 0) {
						this.active = false;
				}
				if(Math.abs(this.startPos.x - p.x) > winSize.width * 0.75)
						this.active = false;
		},
		destroy:function () {
				//var explode = cc.Sprite.create(s_hit);
				//explode.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
				//explode.setPosition(this.getPosition());
				//explode.setRotation(Math.random()*360);
				//explode.setScale(0.75);
				//this.getParent().addChild(explode,9999);

				cc.ArrayRemoveObject(ST.CONTAINER.ENEMY_BULLETS,this);
				cc.ArrayRemoveObject(ST.CONTAINER.PLAYER_BULLETS,this);

				this.stopAllActions();
				this.removeFromParent(true);

				//var removeExplode = cc.CallFunc.create(explode,explode.removeFromParent);
				//explode.runAction(cc.ScaleBy.create(0.3, 2,2));
				//explode.runAction(cc.Sequence.create(cc.FadeOut.create(0.3), removeExplode));
		},
		hurt:function () {
				this.HP--;
		},
		collideRect:function(){
				var p = this.getPosition();
				return cc.rect(p.x - 6, p.y - 6, 12, 12);
		}
});
