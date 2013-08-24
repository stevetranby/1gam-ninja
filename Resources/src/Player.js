var Player = cc.Sprite.extend({
	tilemap:null,
	speed:100,

	HP:0,
	maxHP:12,

	_timeTick:0,
	_shootTimer:0,

	fallThroughTimer:0.0,
	fallThrough:false,

	inDungeon:false,
	isJumping:false,
	velocity:cc.p(0,0),
	lastDir:ST.DIR.EAST,

	bulletSpeed:200,
	bulletTypeValue:1,
	bulletPowerValue:1,

	canBeAttack:true,

	throwBombing:false,
	isThrowingBomb:false,

	zOrder:3000,

	maxBulletPowerValue:4,
	appearPosition:cc.p(160, 60),

	_hurtColorLife:0,
	_foundDungeonLevel:0,
	_foundExit: false,

	active:true,

	ctor:function () {

		this._super();

		//init life
		this.HP = this.maxHP;
		this._shootTimer = 0.0;

		var sheetTexture = cc.TextureCache.getInstance().addImage(s_PlayerSheet);
		this.initWithTexture(sheetTexture, cc.rect(0, 0, 16, 16));
		this.setTag(this.zOrder);
		this.setPosition(this.appearPosition);

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
	toString: function() {
		return "[Object Player]";
	},
	getTileFromPos: function (pos) {
		return cc.p(Math.floor(pos.x / this.tilemap.getTileSize().width),
					Math.floor(this.tilemap.getMapSize().height - pos.y / this.tilemap.getTileSize().height));
	},
	isWalkableGID: function (gid) {
		if( gid == ST.GID.TREE ||
			gid == ST.GID.ROCK ||
			gid == ST.GID.BLD1 ||
			gid == ST.GID.BLD2 ||
			gid == ST.GID.LVL1 ||
			gid == ST.GID.LVL2 ||
			gid == ST.GID.LVL3)
		{
			return false;
		}
		// todo: should fail to false, not true
		return true;
	},
	centerViewpoint: function (pos) {

		var mapSize = this.tilemap.getMapSize();
		var tileSize = this.tilemap.getTileSize();

		var x = Math.max(pos.x, winSize.width / 2);
		var y = Math.max(pos.y, winSize.height / 2);

		x = Math.min(x, (mapSize.width * tileSize.width) - winSize.width / 2);
		y = Math.min(y, (mapSize.height * tileSize.height) - winSize.height / 2);
		var actualPosition = cc.p(x, y);

		var centerOfView = cc.p(winSize.width/2, winSize.height/2);
		var viewPoint = cc.pSub(centerOfView, actualPosition);
		this.tilemap.setPosition(viewPoint);

	},
	updateDungeon: function (dt)
	{
		var mapSize = this.tilemap.getMapSize();
		var tileSize = this.tilemap.getTileSize();

		var collisionLayer = this.tilemap.getLayer(ST.LAYERS.META);
		if(!collisionLayer)
		{
			cc.log("ERROR: collision layer null");
			return;
		}

		var oldPos = this.getPosition();
		var pos = cc.p(oldPos.x,oldPos.y);

		if(ST.KEYS[ST.KEY.w] || ST.KEYS[ST.KEY.z] || ST.KEYS[ST.KEY.up]
		 		|| ST.KEYPADS[ST.KEYPAD.BUTTON_UP] || ST.KEYPADS[ST.KEYPAD.BUTTON_A])
		{
			if(false === this.isJumping)
			{
				this.velocity.y = 300;
				this.isJumping = true;
			}
		}

		if(ST.KEYS[ST.KEY.s] || ST.KEYS[ST.KEY.down]
				|| ST.KEYPADS[ST.KEYPAD.BUTTON_DOWN])
		{
			if(false === this.fallThrough)
			{
				var gid = 1, gid2 = 1;
				var curTile = this.getTileFromPos(pos);
				var tile = cc.p(curTile.x, curTile.y + 1);
				if(tile.x > 0 && tile.y > 0 && tile.x < mapSize.width && tile.y < mapSize.height)
					gid = collisionLayer.getTileGIDAt(tile);

				tile = cc.p(curTile.x, curTile.y + 2);
				if(tile.x > 0 && tile.y > 0 && tile.x < mapSize.width && tile.y < mapSize.height)
					gid2 = collisionLayer.getTileGIDAt(tile);

				if(gid > 0 && gid2 === 0)
				{
					this.fallThroughTimer -= dt;
					if(this.fallThroughTimer < 0.0)
					{
						this.fallThroughTimer = 0.5;
						this.fallThrough = true;
					}
				}
			}
		}
		else
		{
			this.fallThrougTimer = 0.5;
			this.fallThrough = false;
		}

		if ((ST.KEYS[ST.KEY.a] || ST.KEYS[ST.KEY.left] || ST.KEYPADS[ST.KEYPAD.BUTTON_LEFT]) && pos.x >= 0)
		{
			this.lastDir = ST.DIR.WEST;
			pos.x -= dt * this.speed;
		}

		if (ST.KEYS[ST.KEY.d] || ST.KEYS[ST.KEY.right] || ST.KEYPADS[ST.KEYPAD.BUTTON_RIGHT]) // && pos.x <= winSize.width)
		{
			this.lastDir = ST.DIR.EAST;
			pos.x += dt * this.speed;
		}

		if(this.fallThrough)
		{
			var buffer = 10;
			var curTile = this.getTileFromPos(pos);
			var tile = cc.p(curTile.x, curTile.y + 1);
			var newPos = collisionLayer.getPositionAt(tile);
			pos = cc.p(pos.x, newPos.y - buffer);
			this.fallThrougTimer = 0.5;
			this.fallThrough = false;
		}
		else
		{
			// gravity pulls down if in the air
			var dy = 0;
			if(this.isJumping)
			{
				var GRAVITY = 800;
				var MAX_SPEEDY = -100;
				if(this.velocity.y > MAX_SPEEDY)
					this.velocity.y -= dt * GRAVITY;

				var dy = dt * this.velocity.y;
				pos.y = pos.y + dy;
			}

			// check if passed bottom threshold for death
			if(pos.y < this.tilemap.getTileSize().height/2.0)
			{
				// destroy / death
				cc.log("todo: destroy self");
				pos = cc.p(pos.x,oldPos.y);
				this.active = false;
			}
			else
			{
				var tile = this.getTileFromPos(pos);
				var gid = 1;
				if(tile.x > 0 && tile.y > 0 && tile.x < mapSize.width && tile.y < mapSize.height)
					gid = collisionLayer.getTileGIDAt(tile);
				if(dy < 0 && gid > 0)
				{
					// collision
					pos = oldPos;//collisionLayer.getPositionAt(cc.p(tile.x, tile.y));
					this.isJumping = false;
					this.velocity = cc.p(0,0);
				}
				else
				{
					// tile below
					var tile = this.getTileFromPos(cc.p(pos.x,pos.y));
					tile = cc.p(tile.x,tile.y+1);
					var gid = 1;
					if(tile.x > 0 && tile.y > 0 && tile.x < mapSize.width && tile.y < mapSize.height)
						gid = collisionLayer.getTileGIDAt(tile);
					if(gid === 0) {
						this.isJumping = true;
					} else {
						//pos = cc.p(pos.x,oldPos.y);
					}
				}
			}
		}

		var inBoundsX = (pos.x > (tileSize.width + 1) &&
						pos.x < (mapSize.width * tileSize.width - tileSize.width - 1));
		var inBoundsY = (pos.y > (tileSize.height + 1) &&
						pos.y < (mapSize.height * tileSize.height - tileSize.height - 1));

		if(inBoundsX && inBoundsY)
			 pos = cc.p(pos.x,pos.y);
		else if(inBoundsY)
			pos = cc.p(oldPos.x, pos.y);
		else if(inBoundsX && pos.y > (tileSize.height + 1))
			pos = cc.p(pos.x, oldPos.y);
		else
			this.active = false;

		var metaLayer = this.tilemap.getLayer(ST.LAYERS.META);
		if(metaLayer)
		{
			var tile = this.getTileFromPos(pos);
			var gidMeta = metaLayer.getTileGIDAt(tile);
			if(gidMeta > 0)
			{
				var gidMetaOffset = gidMeta - metaLayer.getTileSet().firstGid + 1;
				if(gidMetaOffset == ST.GID_META.EXIT)
				{
					this._foundExit = true;
				}
			}
		}

		this.setPosition(pos);
		this.centerViewpoint(pos);
	},
	updateOverworld:function (dt)
	 {
		var mapSize = this.tilemap.getMapSize();
		var tileSize = this.tilemap.getTileSize();

		var oldPos = this.getPosition();
		var pos = cc.p(oldPos.x,oldPos.y);

		// todo: refactor this into a single input system
		// Keys are only enabled on the browser
		//if( sys.platform == 'browser' )
		{
			if (ST.KEYS[ST.KEY.w] || ST.KEYS[ST.KEY.up] || ST.KEYPADS[ST.KEYPAD.BUTTON_UP]) {
				pos.y += dt * this.speed;
				this.lastDir = ST.DIR.NORTH;
			}
			if (ST.KEYS[ST.KEY.a] || ST.KEYS[ST.KEY.left] || ST.KEYPADS[ST.KEYPAD.BUTTON_LEFT]) {
				pos.x -= dt * this.speed;
				this.lastDir = ST.DIR.WEST;
			}
			if (ST.KEYS[ST.KEY.s] || ST.KEYS[ST.KEY.down] || ST.KEYPADS[ST.KEYPAD.BUTTON_DOWN]) {
				pos.y -= dt * this.speed;
				this.lastDir = ST.DIR.SOUTH;
			}
			if (ST.KEYS[ST.KEY.d] || ST.KEYS[ST.KEY.right] || ST.KEYPADS[ST.KEYPAD.BUTTON_RIGHT]) {
				pos.x += dt * this.speed;
				this.lastDir = ST.DIR.EAST;
			}
		}

		// check if inside bounds
		// check if now on valid tile?
		if(this.tilemap)
		{
			var objLayer = this.tilemap.getLayer(ST.LAYERS.OBJECTS);
			if(objLayer)
			{
				var tile = this.getTileFromPos(pos);
				var gid = objLayer.getTileGIDAt(tile);

				var posUpDown = cc.p(oldPos.x,pos.y);
				var tileUpDown = this.getTileFromPos(posUpDown);
				var gidUpDown = objLayer.getTileGIDAt(tileUpDown);

				var posLeftRight = cc.p(pos.x,oldPos.y);
				var tileLeftRight = this.getTileFromPos(posLeftRight);
				var gidLeftRight = objLayer.getTileGIDAt(tileLeftRight);

				var gidUsed = gid;
				var newPos = oldPos;
				if( this.isWalkableGID(gid) )
				{
					newPos = pos;
				}
				else
				{
					if(gid == ST.GID.LVL1)
						this._foundDungeonLevel = 1;
					else if(gid == ST.GID.LVL2)
						this._foundDungeonLevel = 2;
					else if(gid == ST.GID.LVL3)
						this._foundDungeonLevel = 3;
					else if( this.isWalkableGID(gidUpDown) )
					{
						newPos = posUpDown;
					}
					else if( this.isWalkableGID(gidLeftRight) )
					{
						newPos = posLeftRight;
					}
				}

				var metaLayer = this.tilemap.getLayer(ST.LAYERS.META);
				if(metaLayer)
				{
					var gidMeta = metaLayer.getTileGIDAt(tile);
					if(gidMeta > 0)
					{
						var gidMetaOffset = gidMeta - metaLayer.getTileSet().firstGid + 1;
						if(gidMetaOffset == ST.GID_META.FILL_HEALTH)
						{
							this.HP = this.maxHP;
						}
					}
				}

				var inBoundsX = (newPos.x > 0 &&
								newPos.x < (mapSize.width * tileSize.width - tileSize.width - 1));
				var inBoundsY = (newPos.y > 0 &&
								newPos.y < (mapSize.height * tileSize.height - tileSize.height - 1));

				if(inBoundsX && inBoundsY)
				{
					 this.setPosition(newPos);
				}
				else if(inBoundsY)
				{
					this.setPosition(cc.p(oldPos.x, newPos.y));
				}
				else if(inBoundsX)
				{
					this.setPosition(cc.p(newPos.x, oldPos.y));
				}

				this.centerViewpoint(this.getPosition());
			}
		}
	},
	update:function (dt)
	{
		if(this.inDungeon)
			this.updateDungeon(dt);
		else
			this.updateOverworld(dt);

		// Keys are only enabled on the browser
		if (ST.KEYS[ST.KEY.x] || ST.KEYS[ST.KEY.space] || ST.KEYPADS[ST.KEYPAD.BUTTON_X]) {
			this.shoot(dt);
		}

		if (this.HP <= 0)
			this.active = false;

		this._timeTick += dt;
		this._shootTimer += dt;

		if (this._timeTick > 0.1) {
			this._timeTick = 0;
			if (this._hurtColorLife > 0) {
				this._hurtColorLife--;

				if (this._hurtColorLife % 2 == 0) {
					this.setColor(cc.WHITE);
				} else {
					this.setColor(cc.RED);
				}
			}
		}
	},
	shoot:function (dt)
	{
		var shootTimerThreshold = 0.3;
		var shootMAX = 3;
		var shootCount = ST.CONTAINER.PLAYER_BULLETS.length;
		if(this._shootTimer > shootTimerThreshold && shootCount < shootMAX)
		{
			// reset to have min time between bullets fired
			this._shootTimer = 0.0;

			var offset = 13;

			var p = this.getPosition();
			var cs = this.getContentSize();

			var a = new Bullet(this.bulletSpeed, "W1.png", 0);
			ST.CONTAINER.PLAYER_BULLETS.push(a);
			this.getParent().addChild(a, a.zOrder, ST.UNIT_TAG.PLAYER_BULLET);

			a.xVelocity = 0;
			a.yVelocity = 0;

			// straight line bullet
			if(this.lastDir === ST.DIR.EAST)
			{
				offset = 13;
				a.xVelocity = this.bulletSpeed;
			}
			else if(this.lastDir === ST.DIR.WEST)
			{
				offset = -13;
				a.xVelocity = -this.bulletSpeed;
			}
			else if(this.lastDir === ST.DIR.NORTH)
			{
				offset = 0;
				a.yVelocity = this.bulletSpeed;
			}
			else
			{
				offset = 0;
				a.yVelocity = -this.bulletSpeed;
			}

			// in dungeon with spread get SPRAY like contra
			if(this.inDungeon)//&& this.hasSpread)
			{
				var b = new Bullet(this.bulletSpeed, "W1.png", 0);
				ST.CONTAINER.PLAYER_BULLETS.push(b);
				this.getParent().addChild(b, b.zOrder, ST.UNIT_TAG.PLAYER_BULLET);

				var c = new Bullet(this.bulletSpeed, "W1.png", 0);
				ST.CONTAINER.PLAYER_BULLETS.push(c);
				this.getParent().addChild(c, c.zOrder, ST.UNIT_TAG.PLAYER_BULLET);

				b.xVelocity = 0;
				b.yVelocity = 0;

				c.xVelocity = 0;
				c.yVelocity = 0;

				// left/right/spread
				if(this.lastDir === ST.DIR.EAST)
				{
					offset = 13;
					b.xVelocity = this.bulletSpeed;
					c.xVelocity = this.bulletSpeed;
				}
				else
				{
					offset = -13;
					b.xVelocity = -this.bulletSpeed;
					c.xVelocity = -this.bulletSpeed;
				}

				b.yVelocity = -this.bulletSpeed/3;
				c.yVelocity = +this.bulletSpeed/3;

				var bPos = cc.p(p.x + offset, p.y + 3 + cs.height * 0.3);
				b.setPosition(bPos);
				b.startPos = bPos;

				var cPos = cc.p(p.x + offset, p.y + 3 + cs.height * 0.3);
				c.setPosition(cPos);
				c.startPos = cPos;
			}

			var aPos = cc.p(p.x + offset, p.y + 3 + cs.height * 0.3);
			a.setPosition(aPos);
			a.startPos = aPos;
		}
	},
	destroy:function () {
		var p = this.getPosition();
		var myParent = this.getParent();
		//todo: myParent.addChild( new Explosion(p) );
		myParent.removeChild(this,true);
		if (ST.SOUND) {
			cc.AudioEngine.getInstance().playEffect(s_enemyDeathEffect);
		}
	},
	hurt:function () {
		if (this.canBeAttack) {
			this._hurtColorLife = 6;
			this.HP--;
			this.setColor(cc.RED);
		}
	},
	collideRect:function(){
		var p = this.getPosition();
		var a = this.getContentSize();
		var r = new cc.rect(p.x - a.width/2, p.y - a.height/2, a.width, a.height/2);
		return r;
	}
});
