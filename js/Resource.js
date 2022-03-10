let WF = 24;

let CS = 4;
let CW = 300;
let CH = 300;
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

let TILE_SIZE = 36;
let TILE_HALF = 18;

let MR = [
    { key: 'map_001', src: '../resources/map/map_001.png' },
    { key: 'map_002', src: '../resources/map/map_002.png' }
];

let OR = [
    { key: 'tree_stump', src: '../resources/obstacle/tree_stump.png' }  
];

export { TILE_SIZE, TILE_HALF, WF, CS, CW, CH, CR, MR, OR };