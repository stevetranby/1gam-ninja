var winSize;

var STATE_PLAYING = 0;
var STATE_GAMEOVER = 1;
var STATE_ENTER_DUNGEON = 2;
var STATE_ENTER_OVERWORLD = 3;

var ST = {};

//game state
ST.GAME_STATE = {
    HOME:0,
    PLAY:1,
    OVER:2
};

//keyboard keys pressed state
ST.KEYS = [];
ST.KEYPADS = [];

// game state
ST.WON = false;
ST.LIFE = 3;
ST.SCORE = 0;
ST.SOUND = true;
ST.LevelCompleted = [];

ST.MAX_LEVELS = 3;


//enemy move type
ST.ENEMY_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3
};

ST.DIR = {
    EAST:0,
    WEST:1,
    NORTH:2,
    SOUTH:3
};

//bullet type
ST.BULLET_TYPE = {
    PLAYER:1,
    ENEMY:2
};

//weapon type
ST.WEAPON_TYPE = {
    ONE:1
};

//unit tag
ST.UNIT_TAG = {
    ENMEY_BULLET:900,
    PLAYER_BULLET:901,
    ENEMY:1000,
    PLAYER:1001
};

//container
ST.CONTAINER = {
    ENEMIES:[],
    ENEMY_BULLETS:[],
    PLAYER_BULLETS:[]
};

ST.LAYERS = {
    OBJECTS:'Objects',
    GROUND:'Ground',
    META:'Meta',
    ENTITIES:'Entities',
    FG:'Foreground',
    BG:'Background'
};

ST.GID = {
    GROUND: 1,
    TREE: 2,
    ROCK: 3,
    BLD1: 11,
    BLD2: 12,
    LVL1: 13,
    LVL2: 14,
    LVL3: 15,
};

ST.GID_META = {
    COLLIDE: 1,
    REMOVE_ROCK: 2,
    FILL_HEALTH: 3,
    EXIT: 12
};

ST.KEY = {};
if(cc.KEY) {
    ST.KEY.w = cc.KEY.w;
    ST.KEY.a = cc.KEY.a;
    ST.KEY.d = cc.KEY.d;
    ST.KEY.s = cc.KEY.s;
    ST.KEY.x = cc.KEY.x;
    ST.KEY.z = cc.KEY.z;
    ST.KEY.space = cc.KEY.space;
    ST.KEY.up = cc.KEY.up;
    ST.KEY.down = cc.KEY.down;
    ST.KEY.left = cc.KEY.left;
    ST.KEY.right = cc.KEY.right;
}

ST.KEYPAD = {
    BUTTON_UP: 19,
    BUTTON_DOWN: 20,
    BUTTON_LEFT: 21,
    BUTTON_RIGHT: 22,
    BUTTON_A: 96,
    BUTTON_B: 97,
    BUTTON_C: 98,
    BUTTON_X: 99,
    BUTTON_Y: 100,
    BUTTON_Z: 96,
    BUTTON_L1: 102,
    BUTTON_R1: 103,
    BUTTON_L2: 104,
    BUTTON_R2: 105,
    BUTTON_L3: 104,
    BUTTON_R3: 105,
    BUTTON_START: 108,
};