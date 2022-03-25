let RATIO = 1.5

let TO_RADIAN = Math.PI / 180;

let WF = 24;
let EF = 23;
let SF = 59;

let CS = 8 / RATIO;
let CW = 144;
let CH = 288;
let CR = [
    { key: 'walk_1', src: '../resources/character/walk_nn.png' },
    { key: 'walk_2', src: '../resources/character/walk_ne.png' },
    { key: 'walk_3', src: '../resources/character/walk_ee.png' },
    { key: 'walk_4', src: '../resources/character/walk_se.png' },
    { key: 'walk_5', src: '../resources/character/walk_ss.png' },
    { key: 'walk_6', src: '../resources/character/walk_sw.png' },
    { key: 'walk_7', src: '../resources/character/walk_ww.png' },
    { key: 'walk_8', src: '../resources/character/walk_nw.png' },
    { key: 'walk_shadow', src: '../resources/character/walk_shadow.png' }
];

let SS = 18 / RATIO;
let SW = 288;
let SH = 288;
let SR = [
    { key: 'fireball', src: '../resources/spell/fireball.png' },
    { key: 'fireball_shadow', src: '../resources/spell/fireball_shadow.png' }
];

let ES = 4 / RATIO;
let EW = 144;
let EH = 288;
let ER = [
    { key: 'walk_1', src: '../resources/enemy/walk_nn.png' },
    { key: 'walk_2', src: '../resources/enemy/walk_ne.png' },
    { key: 'walk_3', src: '../resources/enemy/walk_ee.png' },
    { key: 'walk_4', src: '../resources/enemy/walk_se.png' },
    { key: 'walk_5', src: '../resources/enemy/walk_ss.png' },
    { key: 'walk_6', src: '../resources/enemy/walk_sw.png' },
    { key: 'walk_7', src: '../resources/enemy/walk_ww.png' },
    { key: 'walk_8', src: '../resources/enemy/walk_nw.png' },
    { key: 'walk_shadow', src: '../resources/enemy/walk_shadow.png' }
];

let TILE_SIZE = 36 / RATIO;
let TILE_HALF = 18 / RATIO;

let MR = [
    { key: 'map_001', src: '../resources/map/map_001.png' },
    { key: 'map_002', src: '../resources/map/map_002.png' }
];

let OR = [
    { key: 'pedestal', src: '../resources/obstacle/pedestal.png' },
    { key: 'grave', src: '../resources/obstacle/grave.png' }
];

let UR = [
    { key: 'life', src: '../resources/ui/life.png' },
    { key: 'life_back', src: '../resources/ui/life_back.png' }
];

export { RATIO, TO_RADIAN, TILE_SIZE, TILE_HALF, WF, EF, SF, CS, CW, CH, CR, SS, SW, SH, SR, ES, EW, EH, ER, MR, OR, UR };