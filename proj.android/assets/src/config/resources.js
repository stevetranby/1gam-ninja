// sprite sheets
var s_PlayerSheet = "res/PlayerSheet.png";
var s_EnemySheet = "res/EnemySheet.png";
var s_WeaponSheet = "res/WeaponSheet.png";

// menus
var s_menu = "res/menu.png";
var s_titleScreen = "res/title-screen.png";

// tilemap
var s_TilemapOverworld = "res/tilemap-overworld-01.tmx";
var s_TilemapDungeon1 = "res/tilemap-dungeon-01.tmx";
var s_TilemapDungeon2 = "res/tilemap-dungeon-02.tmx";
var s_TilemapDungeon3 = "res/tilemap-dungeon-03.tmx";
var s_TilesetOverworld = "res/tileset-outside-01.png";
var s_TilesetDungeon = "res/tileset-dungeon-01.png";
var s_TilesetMeta = "res/tileset-meta-01.png";

//music
//var s_bgMusic = "res/Music/bgMusic.mp3";
var s_mainMainMusic = "res/Music/contra-like-intro.wav";

//effect
var s_buttonEffect = "res/Music/button-click.mp3";
var s_winEffect = "res/Music/winner.mp3"
var s_shootEffect = "res/Music/throw-star.wav"
var s_enemyDeathEffect = "res/Music/monster-die.mp3"

var g_resources = [
    //image
    {type:"image", src:s_PlayerSheet},
    {type:"image", src:s_EnemySheet},
    {type:"image", src:s_WeaponSheet},

    //plist

    //fnt

    // tmx
    {type:"tmx", src:s_TilemapOverworld},
    {type:"tmx", src:s_TilemapDungeon1},
    {type:"tmx", src:s_TilemapDungeon2},
    {type:"tmx", src:s_TilemapDungeon3},

    // tmx tilesets
    {type:"image", src:s_TilesetOverworld},
    {type:"image", src:s_TilesetDungeon},
    {type:"image", src:s_TilesetMeta},

    //bgm
    //{type:"bgm", src:s_bgMusic},
    {type:"bgm", src:s_mainMainMusic},

    //effects
    {type:"effect", src:s_buttonEffect},
    {type:"effect", src:s_shootEffect},
    {type:"effect", src:s_winEffect},
    {type:"effect", src:s_enemyDeathEffect},
];