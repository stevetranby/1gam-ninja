var Hud = {
	setup: function(layer) 
	{
		cc.log("init HUD");
		// layer
		layer._hudLayer = cc.LayerColor.create(cc.BLACK,winSize.width,16);
		layer._hudLayer.setPosition(cc.p(0,winSize.height-16));
		layer.addChild(layer._hudLayer, 10000);

		// score
		cc.log("setup score");
		layer._scoreLabel = cc.LabelTTF.create("Score: 000000", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
		layer._scoreLabel.setPosition(cc.p(205,1));
		layer._scoreLabel.setAnchorPoint(cc.p(0,0));
		layer._hudLayer.addChild(layer._scoreLabel, 5);

		// complete
		cc.log("setup complete");
		layer._levelsLabel = cc.LabelTTF.create("Complete: 00%", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
		layer._levelsLabel.setPosition(cc.p(140,1));
		layer._levelsLabel.setAnchorPoint(cc.p(0,0));
		layer._hudLayer.addChild(layer._levelsLabel, 5);

		// health
		cc.log("setup health");
		layer._healthLabel = cc.LabelTTF.create("Health: ######", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
		layer._healthLabel.setPosition(cc.p(50,1));
		layer._healthLabel.setAnchorPoint(cc.p(0,0));
		layer._hudLayer.addChild(layer._healthLabel, 5);

		// lives
		cc.log("setup lives");
		layer._livesLabel = cc.LabelTTF.create("Lives: 3", "Arial", 8, cc.size(300,8), cc.TEXT_ALIGNMENT_LEFT);
		layer._livesLabel.setPosition(cc.p(10,1));
		layer._livesLabel.setAnchorPoint(cc.p(0,0));
		layer._hudLayer.addChild(layer._livesLabel, 5);
	}	
};