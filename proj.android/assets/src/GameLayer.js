var GameLayer = cc.Layer.extend({
		isMouseDown:false,
		_transitionTime:0.0,
		_hudLayer:null,
		_scoreLabel:null,
		_healthLabel:null,
		_levelsLabel:null,
		_livesLabel:null,
		_player:null,
		_tileMap:null,
		_state:STATE_PLAYING,
		_dungeonToEnter:0,
		_inDungeonLevel:0,
		_inDungeon:false,
		_specialNotOpen:true,
		screenRect:null,
		mapSize:null,
		tileSize:null,

		clearContainers:function () {
				ST.CONTAINER.ENEMIES = [];
				ST.CONTAINER.ENEMY_BULLETS = [];
				ST.CONTAINER.PLAYER_BULLETS = [];
		},

		clearEnemies:function()
		{
				var n = ST.CONTAINER.ENEMIES.length;
				for(var i=0; i<n; i++)
				{
						var enemy = ST.CONTAINER.ENEMIES[i];
						enemy.removeFromParent();
				}
		},

		loadOverworld:function (reloadMap)
		{
				var levelExited = this._inDungeonLevel;

				// reset game state
				this._inDungeonLevel = 0;
				this._inDungeon = false;
				this._state = STATE_PLAYING;
				this._specialNotOpen = true;

				this._player.retain();

				if(reloadMap)
				{
						//tilemap
						if(this._tileMap)
						{
								this._tileMap.removeFromParent();
								this._tileMap = null;
						}

						this._tileMap = cc.TMXTiledMap.create(s_TilemapOverworld);
						this.addChild(this._tileMap, -9);

						this.mapSize = this._tileMap.getMapSize();
						this.tileSize = this._tileMap.getTileSize();
						this.screenRect = cc.rect(0, 0, this.mapSize.width * this.tileSize.width,
																			this.mapSize.height * this.tileSize.height);

						this.clearContainers();
				}
				else
				{
						this.clearEnemies();
						this.clearContainers();
				}

				// player
				if(this._player)
				{
						this._player.removeFromParent(false);
						this._tileMap.addChild(this._player, this._player.zOrder, ST.UNIT_TAG.PLAYER);
						
						this._player.setAnchorPoint(cc.p(0.5,0.3));
						this._player.setPosition(cc.p(100,this._tileMap.getTileSize().height * 3.5));
						this._player.inDungeon = false;
						this._player.tilemap = this._tileMap;
						
						// find last level, place at marker in tilemap
						//levelExited
				}

				this._player.release();

				// spawn test enemy
				var enemyOptions = {
						type:0,
						//textureName:"E0.png",
						//bulletType:"W2.png",
						HP:2,
						moveType:0,
						attackDir:ST.DIR.EAST,
						scoreValue:15
				};

				var thingsGroup = this._tileMap.getObjectGroup("Things");
				var things = thingsGroup.getObjects();
				var enemySpawns = [];

				for(var i=0; i<things.length; i++)
				{
						var thing = things[i];
						cc.log("thing with name = " + thing.name);
						if(thing.type === "EnemySpawn")
						{
								var x = thing.x / thing.width;
								var y = this.mapSize.height - (thing.y / thing.height + 2);

								var tile = cc.p(x + 0.5, y + 0.5);
								var pos = this._tileMap.getLayer(ST.LAYERS.META).getPositionAt(tile);

								util.ccpLog(pos);

								var addEnemy = new Enemy(enemyOptions);
								addEnemy.setPosition(pos);
								addEnemy.attackDir = Math.floor(Math.random() * 4.0);
								this._tileMap.addChild(addEnemy, addEnemy.zOrder, ST.UNIT_TAG.ENEMY);
								ST.CONTAINER.ENEMIES.push(addEnemy);
						}
				}
		},

		loadDungeon:function (level, reloadMap)
		{
				this._inDungeonLevel = level;
				this._inDungeon = true;
				this._state = STATE_PLAYING;

				this._player.retain();

				if(reloadMap)
				{
						//tilemap
						if(this._tileMap)
						{
								cc.log("tilemap is being removed");
								this._tileMap.removeFromParent();
								this._tileMap = null;
						}

						if(level === 1)
								this._tileMap = cc.TMXTiledMap.create(s_TilemapDungeon1);
						if(level === 2)
								this._tileMap = cc.TMXTiledMap.create(s_TilemapDungeon2);
						if(level === 3)
								this._tileMap = cc.TMXTiledMap.create(s_TilemapDungeon3);

						cc.log("after trying to create tilemap => " + this._tileMap);

						this.addChild(this._tileMap, -9);

						this.mapSize = this._tileMap.getMapSize();
						this.tileSize = this._tileMap.getTileSize();
						this.screenRect = cc.rect(0, 0, this.mapSize.width * this.tileSize.width,
																			this.mapSize.height * this.tileSize.height);

						this.clearContainers();
				}
				else
				{
						this.clearEnemies();
						this.clearContainers();
				}

				cc.log("getting ready to add the player back in");

				// player
				if(this._player && this._tileMap)
				{
						this._player.removeFromParent(false);
						this._tileMap.addChild(this._player);//, this._player.zOrder, ST.UNIT_TAG.PLAYER);
						this._player.tilemap = this._tileMap;
				}

				cc.log("repositioning player in new dungeon");
				this._player.setAnchorPoint(cc.p(0.5,0.3));
				this._player.setPosition(cc.p(100,this.tileSize.height * 3.3));
				this._player.inDungeon = true;

				// spawn test enemy
				var enemyOptions = {
						type:0,
						//textureName:"E0.png",
						//bulletType:"W2.png",
						HP:2,
						moveType:0,
						attackDir:ST.DIR.WEST,
						scoreValue:15
				};

				cc.log("setting up enemies");

				var enemyTiles = [[14,6],[25,6],[33,9],[42,9],[48,6],[58,8],[72,9],
													[80,5],[101,3],[115,4],[115,5],[115,6]];
				for(var i=0; i < enemyTiles.length; i++)
				{
						var enemyTile = enemyTiles[i];
						var x = enemyTile[0];
						var y = enemyTile[1];
						var addEnemy = new Enemy(enemyOptions);
						addEnemy.setPosition(cc.p(this.tileSize.width * (x+0.5), this.tileSize.height * (y+0.5)));
						this._tileMap.addChild(addEnemy, addEnemy.zOrder, ST.UNIT_TAG.ENEMY);
						ST.CONTAINER.ENEMIES.push(addEnemy);
						cc.log("enemy added at tile = " + x + "," + y + "; pos = " + addEnemy.getPosition() + ", enemys.length = " + ST.CONTAINER.ENEMIES.length);
				}

				this._player.release();
		},

		initHUD:function ()
		{
				cc.log("init HUD");

				// layer
				this._hudLayer = cc.LayerColor.create(cc.BLACK,winSize.width,16);
				this._hudLayer.setPosition(cc.p(0,winSize.height-16));
				this.addChild(this._hudLayer, 10000);

				// score
				cc.log("setup score");
				this._scoreLabel = cc.LabelTTF.create("Score: 000000", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
				this._scoreLabel.setPosition(cc.p(205,1));
				this._scoreLabel.setAnchorPoint(cc.p(0,0));
				this._hudLayer.addChild(this._scoreLabel, 5);

				// complete
				cc.log("setup complete");
				this._levelsLabel = cc.LabelTTF.create("Complete: 00%", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
				this._levelsLabel.setPosition(cc.p(140,1));
				this._levelsLabel.setAnchorPoint(cc.p(0,0));
				this._hudLayer.addChild(this._levelsLabel, 5);

				// health
				cc.log("setup health");
				this._healthLabel = cc.LabelTTF.create("Health: ######", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
				this._healthLabel.setPosition(cc.p(50,1));
				this._healthLabel.setAnchorPoint(cc.p(0,0));
				this._hudLayer.addChild(this._healthLabel, 5);

				// lives
				cc.log("setup lives");
				this._livesLabel = cc.LabelTTF.create("Lives: 3", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
				this._livesLabel.setPosition(cc.p(10,1));
				this._livesLabel.setAnchorPoint(cc.p(0,0));
				this._hudLayer.addChild(this._livesLabel, 5);
		},

		init:function ()
		{
				var selfPointer = this;
				this.name = "GameLayer";
				this._inDungeon = false;

				ST.WON = false;
				ST.SCORE = 0;
				ST.LIFE = 3;
				ST.LevelCompleted = [];

				//////////////////////////////
				// 1. super init first
				this._super();

				// ask director the window size
				winSize = cc.Director.getInstance().getWinSize();

				// player
				this._player = new Player();

				this.initHUD();
				this.loadOverworld(true);

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

				this._state = STATE_PLAYING;
				// schedule
				this.scheduleUpdate();

				return true;
		},

		// a selector callback
		menuCloseCallback:function (sender) {
				cc.Director.getInstance().end();
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
		},
		onTouchesCancelled:function (touches, event) {
				cc.log("onTouchesCancelled");
		},

		onKeyDown:function (e)
		{
				ST.KEYS[e] = true;
		},

		onKeyUp:function (e) {
				ST.KEYS[e] = false;
		},

		keypadDown:function (e) {
			cc.log("[gamelayer] keypadDown => " + e);
			ST.KEYPADS[e] = true;
		},
		keypadUp:function (e) {
			cc.log("[gamelayer] keypadUp => " + e);
			ST.KEYPADS[e] = false;
		},

		update:function (dt) {
				dt = Math.min(dt,0.1);
				if( this._state == STATE_PLAYING )
				{
						this.checkIsCollide();
						this.removeInactiveUnit(dt);
						this.checkSpecials();
						//this.checkIsReborn();
						this.updateUI();
				}
				else if (this._state === STATE_ENTER_DUNGEON)
				{
						this.loadDungeon(this._dungeonToEnter,true);
				}
				else if (this._state === STATE_ENTER_OVERWORLD)
				{
						this.loadOverworld(true);
				}
				else
				{
						cc.log("unknown state");
				}
		},

		checkSpecials:function ()
		{
				if(! this._inDungeon && this._specialNotOpen)
				{
						if(ST.CONTAINER.ENEMIES.length === 0)
						{
								if(this._tileMap)
								{
										var objLayer = this._tileMap.getLayer(ST.LAYERS.OBJECTS);
										if(objLayer)
										{
												var tile1 = cc.p(14,7);
												var tile2 = cc.p(14,8);

												objLayer.setTileGID(0,tile1);
												objLayer.setTileGID(0,tile2);

												this._specialNotOpen = false;
										}
								}
						}
				}
		},

		updateUI:function ()
		{
				this._scoreLabel.setString("Score: " + ST.SCORE);
				this._livesLabel.setString("Lives: " + ST.LIFE);

				var percentComplete = 0;
				if(ST.LevelCompleted[1]) percentComplete += 33.3;
				if(ST.LevelCompleted[2]) percentComplete += 33.3;
				if(ST.LevelCompleted[3]) percentComplete += 33.3;
				percentComplete = Math.round(percentComplete);
				this._levelsLabel.setString("Completed: " + percentComplete + "%");

				if(this._player)
				{
						var nMarkers = 10;
						var hpPerMarker = this._player.maxHP / nMarkers;
						var nFilled = this._player.HP / hpPerMarker;
						var nEmpty = nMarkers - nFilled;

						var healthBar = [];
						for(var i=0; i<nMarkers; i++)
						{
								if(i < nFilled)
										healthBar.push("#");
								else
										healthBar.push("_");
						}
				}
				else
				{
						var healthBar = ["_","_","_","_","_","_","_","_","_","_"];
				}

				this._healthLabel.setString("Health: [" + healthBar.join("") + "]");
		},

		checkIsCollide:function ()
		{
				var selChild, bulletChild;
				//check collide
				var i =0;
				for (i = 0; i < ST.CONTAINER.ENEMIES.length; i++) {
						selChild = ST.CONTAINER.ENEMIES[i];
						for (var j = 0; j < ST.CONTAINER.PLAYER_BULLETS.length; j++) {
								bulletChild = ST.CONTAINER.PLAYER_BULLETS[j];
								if (this.collide(selChild, bulletChild)) {
										bulletChild.hurt();
										selChild.hurt();
								}
								if (!cc.rectIntersectsRect(this.screenRect, bulletChild.getBoundingBox() )) {
										bulletChild.destroy();
								}
						}
						if (this.collide(selChild, this._player)) {
								if (this._player.active) {
										selChild.hurt();
										this._player.hurt();
								}
						}
				}

				for (i = 0; i < ST.CONTAINER.ENEMY_BULLETS.length; i++) {
						selChild = ST.CONTAINER.ENEMY_BULLETS[i];
						if (this.collide(selChild, this._player)) {
								if (this._player.active) {
										selChild.hurt();
										this._player.hurt();
								}
						}
						if (!cc.rectIntersectsRect(this.screenRect, selChild.getBoundingBox() )) {
								selChild.destroy();
						}
				}
		},
		collide:function (a, b) {
				var aRect = a.collideRect();
				var bRect = b.collideRect();
				if (cc.rectIntersectsRect(aRect, bRect)) {
						return true;
				}
		},
		removeInactiveUnit:function (dt) {
				var selChild, layerChildren = this._tileMap.getChildren();
				for (var i in layerChildren) {
						selChild = layerChildren[i];
						if (selChild) {
								if( typeof selChild.update == 'function' ) {
										var tag = selChild.getTag();
										if ((tag == ST.UNIT_TAG.PLAYER) || (tag == ST.UNIT_TAG.PLAYER_BULLET) ||
												(tag == ST.UNIT_TAG.ENEMY) || (tag == ST.UNIT_TAG.ENMEY_BULLET))
										{
												selChild.update(dt);

												if (selChild && !selChild.active)
														selChild.destroy();

												if (tag === ST.UNIT_TAG.PLAYER)
												{
														if(selChild && !selChild.active)
														{
																if(ST.LIFE > 0)
																{
																		cc.log("player died, lives left = " + ST.LIFE);
																		ST.LIFE--;

																		if(this._inDungeon)
																				this.loadDungeon(this._inDungeonLevel,false);
																		else
																				this.loadOverworld(false);

																		this._player.active = true;
																		this._player.HP = this._player.maxHP;
																}
																else
																{
																		this._state = STATE_GAMEOVER;
																		this._player = null;
																		var delay = cc.DelayTime.create(0.2);
																		var callback = cc.CallFunc.create(this.onGameOver, this);
																		this.runAction(cc.Sequence.create(delay,callback));
																}
														}
														else if(this._inDungeon && this._inDungeonLevel > 0)
														{
																if(selChild && selChild._foundExit)
																{
																		selChild._foundExit = false;

																		// set level completed
																		ST.LevelCompleted[this._inDungeonLevel] = true;

																		var allLevelsComplete = (ST.LevelCompleted[1] &&
																														 ST.LevelCompleted[2] &&
																														 ST.LevelCompleted[3]);


																		// level completed
																		if(allLevelsComplete)
																		{
																				ST.WON = true;
																				this._state = STATE_GAMEOVER;
																				this._player = null;
																				var delay = cc.DelayTime.create(0.2);
																				var callback = cc.CallFunc.create(this.onGameOver, this);
																				this.runAction(cc.Sequence.create(delay,callback));
																		}
																		else
																		{
																				 this._state = STATE_ENTER_OVERWORLD;
																		}
																}
														}
														else if(selChild._foundDungeonLevel > 0)
														{
																this._state = STATE_ENTER_DUNGEON;
																this._dungeonToEnter = selChild._foundDungeonLevel;

																// make sure we reset that a dungeon was found
																selChild._foundDungeonLevel = 0;
														}
												}
										}
								}
						}
				}
		},
		onGameOver:function () {
				var scene = cc.Scene.create();
				scene.addChild(GameOver.create());
				cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
		}
});


GameLayer.create = function () {
		var sg = new GameLayer();
		if (sg && sg.init()) {
				return sg;
		}
		return null;
};

GameLayer.scene = function () {
		var scene = cc.Scene.create();
		var layer = GameLayer.create();
		scene.addChild(layer);
		return scene;
};

