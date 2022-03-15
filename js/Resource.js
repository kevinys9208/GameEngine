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
    { key: 'walk_8', src: '../resources/character/walk_nw.png' },
    { key: 'walk_shadow', src: '../resources/character/walk_shadow.png' }
];

let SS = 10;
let SW = 288;
let SH = 288;
let SR = [
    { key: 'fireball', src: '../resources/spell/fireball.png' },
    { key: 'fireball_shadow', src: '../resources/spell/fireball_shadow.png' }
];

let TILE_SIZE = 36;
let TILE_HALF = 18;

let MR = [
    { key: 'map_001', src: '../resources/map/map_001.png' }
];

let OR = [
  
];

export { TO_RADIAN, TILE_SIZE, TILE_HALF, WF, SF, CS, CW, CH, CR, SS, SW, SH, SR, MR, OR };