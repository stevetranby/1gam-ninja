var Loader = {
	setupPlatform: function() 
	{
	},
	setupDungeon: function(gameLayer, level, shouldReloadMap) 
	{
		gameLayer._inDungeonLevel = level;
		gameLayer._inDungeon = true;
		gameLayer._state = STATE_PLAYING;

		gameLayer._player.retain();

		if(shouldReloadMap)
		{
				//tilemap
				if(gameLayer._tileMap)
				{
						cc.log("tilemap is being removed");
						gameLayer._tileMap.removeFromParent();
						gameLayer._tileMap = null;
				}

				if(level === 1)
						gameLayer._tileMap = cc.TMXTiledMap.create(s_TilemapDungeon1);
				if(level === 2)
						gameLayer._tileMap = cc.TMXTiledMap.create(s_TilemapDungeon2);
				if(level === 3)
						gameLayer._tileMap = cc.TMXTiledMap.create(s_TilemapDungeon3);

				cc.log("after trying to create tilemap => " + gameLayer._tileMap);

				gameLayer.addChild(gameLayer._tileMap, -9);

				gameLayer.mapSize = gameLayer._tileMap.getMapSize();
				gameLayer.tileSize = gameLayer._tileMap.getTileSize();
				gameLayer.screenRect = cc.rect(0, 0, gameLayer.mapSize.width * gameLayer.tileSize.width, gameLayer.mapSize.height * gameLayer.tileSize.height);

				gameLayer.clearContainers();
		}
		else
		{
				gameLayer.clearEnemies();
				gameLayer.clearContainers();
		}

		cc.log("getting ready to add the player back in");

		// player
		if(gameLayer._player && gameLayer._tileMap)
		{
				gameLayer._player.removeFromParent(false);
				gameLayer._tileMap.addChild(gameLayer._player);
				gameLayer._player.tilemap = gameLayer._tileMap;
		}

		cc.log("repositioning player in new dungeon");
		gameLayer._player.setAnchorPoint(cc.p(0.5,0.3));
		gameLayer._player.setPosition(cc.p(100,gameLayer.tileSize.height * 3.3));
		gameLayer._player.inDungeon = true;

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
				addEnemy._gameLayer = gameLayer;
				addEnemy.setPosition(cc.p(gameLayer.tileSize.width * (x+0.5), gameLayer.tileSize.height * (y+0.5)));
				gameLayer._tileMap.addChild(addEnemy, addEnemy.zOrder, ST.UNIT_TAG.ENEMY);
				ST.CONTAINER.ENEMIES.push(addEnemy);
				cc.log("enemy added at tile = " + x + "," + y + "; pos = " + addEnemy.getPosition() + ", enemys.length = " + ST.CONTAINER.ENEMIES.length);
		}

		gameLayer._player.release();
	},
	setupOverworld: function(gameLayer, shouldReloadMap) 
	{
		var levelExited = gameLayer._inDungeonLevel;

		// reset game state
		gameLayer._inDungeonLevel = 0;
		gameLayer._inDungeon = false;
		gameLayer._state = STATE_PLAYING;
		gameLayer._specialNotOpen = true;

		gameLayer._player.retain();

		if(shouldReloadMap)
		{
				//tilemap
				if(gameLayer._tileMap)
				{
						gameLayer._tileMap.removeFromParent();
						gameLayer._tileMap = null;
				}

				gameLayer._tileMap = cc.TMXTiledMap.create(s_TilemapOverworld);
				gameLayer.addChild(gameLayer._tileMap, -9);

				gameLayer.mapSize = gameLayer._tileMap.getMapSize();
				gameLayer.tileSize = gameLayer._tileMap.getTileSize();
				gameLayer.screenRect = cc.rect(0, 0, gameLayer.mapSize.width * gameLayer.tileSize.width,
																	gameLayer.mapSize.height * gameLayer.tileSize.height);

				gameLayer.clearContainers();
		}
		else
		{
				gameLayer.clearEnemies();
				gameLayer.clearContainers();
		}

		// player
		if(gameLayer._player)
		{
				gameLayer._player.removeFromParent(false);
				gameLayer._tileMap.addChild(gameLayer._player, gameLayer._player.zOrder, ST.UNIT_TAG.PLAYER);
				
				gameLayer._player.setAnchorPoint(cc.p(0.5,0.3));
				gameLayer._player.setPosition(cc.p(100,gameLayer._tileMap.getTileSize().height * 3.5));
				gameLayer._player.inDungeon = false;
				gameLayer._player.tilemap = gameLayer._tileMap;
				
				// find last level, place at marker in tilemap
				//levelExited
		}

		gameLayer._player.release();

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

		var thingsGroup = gameLayer._tileMap.getObjectGroup("Things");
		var things = thingsGroup.getObjects();
		var enemySpawns = [];

		for(var i=0; i<things.length; i++)
		{
				var thing = things[i];
				cc.log("thing with name = " + thing.name);
				if(thing.type === "EnemySpawn")
				{
						var x = thing.x / thing.width;
						var y = gameLayer.mapSize.height - (thing.y / thing.height + 2);

						var tile = cc.p(x + 0.5, y + 0.5);
						var pos = gameLayer._tileMap.getLayer(ST.LAYERS.META).getPositionAt(tile);

						util.ccpLog(pos);

						var newEnemy = new Enemy(enemyOptions);
						newEnemy.setPosition(pos);
						newEnemy._gameLayer = gameLayer;
						newEnemy.attackDir = Math.floor(Math.random() * 4.0);
						gameLayer._tileMap.addChild(newEnemy, newEnemy.zOrder, ST.UNIT_TAG.ENEMY);
						ST.CONTAINER.ENEMIES.push(newEnemy);
				}
		}
	}
};