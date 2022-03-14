let TO_RADIAN = Math.PI / 180;

let WF = 24;
let SF = 59;

let CS = 5;
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
    { key: 'walk_8', src: '../resources/character/walk_nw.png' }
];

let SS = 10;
let SW = 288;
let SH = 288;
let SR = [
    { key: 'fireball_1', src: '../resources/spell/fireball_nn.png' },
    { key: 'fireball_2', src: '../resources/spell/fireball_ne.png' },
    { key: 'fireball_3', src: '../resources/spell/fireball_ee.png' },
    { key: 'fireball_4', src: '../resources/spell/fireball_se.png' },
    { key: 'fireball_5', src: '../resources/spell/fireball_ss.png' },
    { key: 'fireball_6', src: '../resources/spell/fireball_sw.png' },
    { key: 'fireball_7', src: '../resources/spell/fireball_ww.png' },
    { key: 'fireball_8', src: '../resources/spell/fireball_nw.png' }
];

let TILE_SIZE = 36;
let TILE_HALF = 18;

let MR = [
    { key: 'map_001', src: '../resources/map/map_001.png' },
    { key: 'map_002', src: '../resources/map/map_002.png' }
];

let OR = [
    { key: 'wall_h', src: '../resources/obstacle/wall_h.png' },
    { key: 'wall_v', src: '../resources/obstacle/wall_v.png' },
    { key: 'block_c', src: '../resources/obstacle/block_c.png' }
];

export { TO_RADIAN, TILE_SIZE, TILE_HALF, WF, SF, CS, CW, CH, CR, SS, SW, SH, SR, MR, OR };