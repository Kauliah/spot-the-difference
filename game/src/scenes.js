// Double Take — scenes. Every picture is drawn in code (Canvas 2D), no image assets.
// Each level draws two panels from one function: variant 0 = left picture,
// variant 1 = right picture. The seven differences are the places where the
// right picture's drawing branches. diffs[] holds the click targets (panel
// coordinates, 460 x 340) in the same order as the branches below.

export const PANEL_W = 460;
export const PANEL_H = 340;

function circ(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function ell(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
function poly(ctx, pts, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}
function strokeLine(ctx, x1, y1, x2, y2, color, w) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function vgrad(ctx, y0, y1, stops) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [o, c] of stops) g.addColorStop(o, c);
  return g;
}
function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}
function cloud(ctx, x, y, s) {
  circ(ctx, x, y, 18 * s, '#ffffff');
  circ(ctx, x + 20 * s, y - 6 * s, 15 * s, '#ffffff');
  circ(ctx, x + 40 * s, y, 17 * s, '#ffffff');
  rect(ctx, x - 14 * s, y, 68 * s, 14 * s, '#ffffff');
}

// ---------------------------------------------------------------- Level 1: Sunny Beach
function drawBeach(ctx, v) {
  // sky
  ctx.fillStyle = vgrad(ctx, 0, 200, [[0, '#8fd3ea'], [1, '#e8f8ff']]);
  ctx.fillRect(0, 0, PANEL_W, 200);
  // sun + rays (diff 1: sunglasses on the right picture)
  ctx.fillStyle = '#ffd94a';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    strokeLine(ctx, 70 + Math.cos(a) * 32, 55 + Math.sin(a) * 32,
      70 + Math.cos(a) * 42, 55 + Math.sin(a) * 42, '#ffd94a', 4);
  }
  circ(ctx, 70, 55, 26, '#ffd94a');
  if (v === 1) {
    // sunglasses
    rect(ctx, 52, 48, 16, 10, '#22303c');
    rect(ctx, 72, 48, 16, 10, '#22303c');
    strokeLine(ctx, 68, 52, 72, 52, '#22303c', 3);
  }
  cloud(ctx, 250, 50, 1);
  cloud(ctx, 360, 90, 0.7);
  // sea
  rect(ctx, 0, 190, PANEL_W, 62, '#3d9db5');
  ctx.fillStyle = '#6cc3d8';
  for (let x = 10; x < PANEL_W; x += 46) {
    ctx.beginPath();
    ctx.arc(x, 210, 12, Math.PI, 0);
    ctx.fill();
  }
  // boat (diff 5: sail white vs yellow)
  poly(ctx, [[100, 228], [126, 228], [118, 208], [108, 208]], '#8a5a2b');
  strokeLine(ctx, 113, 208, 113, 168, '#5a3a1a', 3);
  poly(ctx, [[115, 170], [115, 206], [142, 206]], v === 1 ? '#ffd94a' : '#ffffff');
  // sand
  ctx.fillStyle = vgrad(ctx, 252, 340, [[0, '#f6dc9a'], [1, '#eec887']]);
  ctx.fillRect(0, 252, PANEL_W, 88);
  // umbrella (diff 2: middle stripe red vs teal)
  strokeLine(ctx, 170, 252, 170, 168, '#7a4a21', 5);
  for (let i = 0; i < 5; i++) {
    const a0 = Math.PI + (i * Math.PI) / 5;
    const a1 = Math.PI + ((i + 1) * Math.PI) / 5;
    ctx.fillStyle = i === 2 ? (v === 1 ? '#17877b' : '#e4572e') : (i % 2 === 0 ? '#fff3d6' : '#f2a541');
    ctx.beginPath();
    ctx.moveTo(170, 168);
    ctx.arc(170, 168, 52, a0, a1);
    ctx.closePath();
    ctx.fill();
  }
  // beach ball (diff 7: blue stripe vs green stripe)
  circ(ctx, 230, 295, 22, '#ffffff');
  ctx.save();
  ctx.beginPath();
  ctx.arc(230, 295, 22, 0, Math.PI * 2);
  ctx.clip();
  poly(ctx, [[212, 278], [224, 278], [236, 316], [222, 316]], v === 1 ? '#2e9e5b' : '#3d7bd6');
  poly(ctx, [[236, 278], [248, 278], [242, 316], [232, 316]], '#e4572e');
  ctx.restore();
  ctx.strokeStyle = '#22303c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(230, 295, 22, 0, Math.PI * 2);
  ctx.stroke();
  // bucket (diff 3: present vs missing)
  if (v === 0) {
    poly(ctx, [[288, 268], [314, 268], [310, 298], [292, 298]], '#e4572e');
    rect(ctx, 284, 264, 34, 7, '#c7431f');
    ctx.beginPath();
    ctx.arc(301, 268, 12, Math.PI, 0);
    ctx.strokeStyle = '#8a5a2b';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // crab (diff 4: two claws vs one claw)
  ell(ctx, 382, 306, 16, 11, '#e4572e');
  circ(ctx, 374, 296, 4, '#22303c');
  circ(ctx, 390, 296, 4, '#22303c');
  circ(ctx, 366, 300, 6, '#e4572e');
  if (v === 0) circ(ctx, 398, 300, 6, '#e4572e');
  strokeLine(ctx, 372, 314, 366, 322, '#e4572e', 3);
  strokeLine(ctx, 382, 316, 382, 324, '#e4572e', 3);
  strokeLine(ctx, 392, 314, 398, 322, '#e4572e', 3);
  // palm tree (diff 6: two coconuts vs three)
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(412, 252);
  ctx.quadraticCurveTo(420, 200, 408, 150);
  ctx.stroke();
  ctx.strokeStyle = '#2e7d4f';
  ctx.lineWidth = 6;
  for (const [dx, dy] of [[-26, -8], [-14, -20], [2, -22], [20, -14], [26, 2]]) {
    ctx.beginPath();
    ctx.moveTo(408, 150);
    ctx.quadraticCurveTo(408 + dx, 150 + dy, 408 + dx * 1.5, 150 + dy + 14);
    ctx.stroke();
  }
  circ(ctx, 402, 152, 6, '#6b4a1f');
  circ(ctx, 414, 154, 6, '#6b4a1f');
  if (v === 1) circ(ctx, 408, 162, 6, '#6b4a1f');
  // starfish
  star(ctx, 88, 306, 12, '#f2a541');
}

const BEACH_DIFFS = [
  { x: 70, y: 55, r: 30, label: 'the sun wears sunglasses' },
  { x: 170, y: 178, r: 30, label: 'the umbrella stripe changed colour' },
  { x: 301, y: 282, r: 24, label: 'the red bucket vanished' },
  { x: 382, y: 300, r: 22, label: 'the crab lost a claw' },
  { x: 122, y: 190, r: 26, label: 'the boat sail turned yellow' },
  { x: 408, y: 154, r: 20, label: 'a third coconut appeared' },
  { x: 230, y: 295, r: 24, label: 'the beach ball stripe changed colour' },
];

// ---------------------------------------------------------------- Level 2: Cozy Kitchen
function drawKitchen(ctx, v) {
  // wall + floor
  ctx.fillStyle = '#f3e2c7';
  ctx.fillRect(0, 0, PANEL_W, 250);
  rect(ctx, 0, 250, PANEL_W, 90, '#b98a5a');
  rect(ctx, 0, 250, PANEL_W, 6, '#8a5a2b');
  // window with curtains (diff 7: curtain tie red vs blue)
  rect(ctx, 56, 36, 148, 116, '#ffffff');
  ctx.fillStyle = vgrad(ctx, 40, 150, [[0, '#9fd8f0'], [1, '#e8f8ff']]);
  ctx.fillRect(64, 44, 132, 100);
  circ(ctx, 170, 70, 14, '#ffd94a');
  cloud(ctx, 84, 70, 0.5);
  rect(ctx, 64, 44, 132, 100, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#8a5a2b';
  ctx.lineWidth = 3;
  ctx.strokeRect(64, 44, 132, 100);
  strokeLine(ctx, 130, 44, 130, 144, '#8a5a2b', 3);
  // curtains
  poly(ctx, [[52, 30], [84, 30], [78, 150], [52, 150]], '#e4572e');
  poly(ctx, [[176, 30], [208, 30], [208, 150], [182, 150]], '#e4572e');
  circ(ctx, 68, 92, 6, v === 1 ? '#3d7bd6' : '#e4572e');
  circ(ctx, 192, 92, 6, v === 1 ? '#3d7bd6' : '#e4572e');
  // cat on the windowsill (diff 2: tail up vs tail down)
  ell(ctx, 130, 148, 26, 10, '#f2a541');
  circ(ctx, 150, 138, 11, '#f2a541');
  poly(ctx, [[144, 130], [147, 122], [151, 130]], '#f2a541');
  poly(ctx, [[156, 130], [159, 122], [162, 130]], '#f2a541');
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (v === 0) {
    ctx.moveTo(106, 148);
    ctx.quadraticCurveTo(96, 128, 108, 118);
  } else {
    ctx.moveTo(106, 148);
    ctx.quadraticCurveTo(96, 162, 104, 168);
  }
  ctx.stroke();
  circ(ctx, 154, 136, 2, '#22303c');
  // wall clock (diff 1: 3:00 vs 4:30)
  circ(ctx, 330, 70, 30, '#ffffff');
  ctx.strokeStyle = '#22303c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(330, 70, 30, 0, Math.PI * 2);
  ctx.stroke();
  strokeLine(ctx, 330, 70, 330, 48, '#22303c', 3);
  if (v === 0) strokeLine(ctx, 330, 70, 350, 70, '#22303c', 3);
  else strokeLine(ctx, 330, 70, 322, 88, '#22303c', 3);
  // shelf + plant (diff 5: five leaves vs four)
  rect(ctx, 380, 190, 60, 8, '#8a5a2b');
  poly(ctx, [[396, 190], [424, 190], [420, 168], [400, 168]], '#c96a3b');
  ctx.strokeStyle = '#2e7d4f';
  ctx.lineWidth = 4;
  const leaves = v === 1
    ? [[398, 168], [406, 160], [414, 158], [420, 168]]
    : [[394, 168], [400, 158], [408, 154], [416, 158], [422, 168]];
  for (const [lx, ly] of leaves) {
    ctx.beginPath();
    ctx.moveTo(410, 168);
    ctx.lineTo(lx, ly);
    ctx.stroke();
  }
  // stove + teapot (diff 3: lid on vs lid off, steam)
  rect(ctx, 220, 232, 90, 18, '#5a6b7a');
  circ(ctx, 240, 232, 5, '#22303c');
  circ(ctx, 290, 232, 5, '#22303c');
  ell(ctx, 262, 216, 26, 16, '#17877b');
  poly(ctx, [[236, 212], [226, 204], [236, 200]], '#17877b');
  if (v === 0) {
    ell(ctx, 262, 200, 14, 5, '#0f5f56');
    circ(ctx, 262, 194, 4, '#f2a541');
  } else {
    ctx.strokeStyle = 'rgba(120,130,140,0.8)';
    ctx.lineWidth = 3;
    for (const sx of [254, 264, 272]) {
      ctx.beginPath();
      ctx.moveTo(sx, 196);
      ctx.quadraticCurveTo(sx + 4, 184, sx, 174);
      ctx.stroke();
    }
  }
  // table + fruit bowl (diff 4: three apples vs four)
  rect(ctx, 60, 262, 340, 12, '#8a5a2b');
  rect(ctx, 70, 274, 10, 66, '#7a4a21');
  rect(ctx, 380, 274, 10, 66, '#7a4a21');
  ell(ctx, 150, 258, 34, 10, '#3d7bd6');
  circ(ctx, 132, 250, 9, '#e4572e');
  circ(ctx, 150, 246, 9, '#e4572e');
  circ(ctx, 168, 250, 9, '#e4572e');
  if (v === 1) circ(ctx, 150, 238, 9, '#2e9e5b');
  // mug (diff 6: handle on the right vs on the left)
  rect(ctx, 318, 262, 26, 26, '#f2a541');
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (v === 0) ctx.arc(348, 275, 8, -Math.PI / 2, Math.PI / 2);
  else ctx.arc(314, 275, 8, Math.PI / 2, (3 * Math.PI) / 2);
  ctx.stroke();
  // rug
  ell(ctx, 230, 322, 90, 12, '#c96a3b');
  ell(ctx, 230, 322, 60, 8, '#e8c98a');
}

const KITCHEN_DIFFS = [
  { x: 330, y: 70, r: 32, label: 'the clock shows a different time' },
  { x: 118, y: 142, r: 22, label: 'the cat lowered its tail' },
  { x: 262, y: 198, r: 18, label: 'the teapot lost its lid' },
  { x: 150, y: 248, r: 26, label: 'a fourth apple appeared' },
  { x: 408, y: 160, r: 22, label: 'the plant lost a leaf' },
  { x: 331, y: 275, r: 20, label: 'the mug handle moved sides' },
  { x: 68, y: 92, r: 26, label: 'the curtain tie changed colour' },
];

// ---------------------------------------------------------------- Level 3: Space Station
function drawSpace(ctx, v) {
  // deep space
  ctx.fillStyle = vgrad(ctx, 0, 340, [[0, '#10142e'], [1, '#2b3a6b']]);
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // stars (diff 3: the star at 200,60 is missing on the right)
  const stars = [
    [40, 40], [120, 30], [200, 60], [280, 36], [380, 130], [30, 150], [250, 90],
    [420, 200], [60, 220], [180, 250], [330, 250], [440, 40], [150, 110],
  ];
  for (const [sx, sy] of stars) {
    if (v === 1 && sx === 200 && sy === 60) continue;
    star(ctx, sx, sy, 4, '#ffffff');
  }
  // planet with ring (diff 1: ring vs no ring)
  circ(ctx, 350, 95, 42, '#c96a3b');
  circ(ctx, 338, 84, 10, '#a8542f');
  circ(ctx, 364, 108, 7, '#a8542f');
  if (v === 0) {
    ctx.strokeStyle = '#f2d38a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(350, 95, 62, 14, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  // satellite (diff 6: dish tilts up vs down)
  rect(ctx, 70, 78, 44, 20, '#9aa7b8');
  strokeLine(ctx, 92, 98, 92, 118, '#9aa7b8', 4);
  poly(ctx, [[92, 84], [112, 66], [118, 76], [96, 92]], '#e8ecf2');
  if (v === 1) poly(ctx, [[92, 84], [72, 66], [66, 76], [88, 92]], '#e8ecf2');
  strokeLine(ctx, 70, 88, 52, 88, '#e8ecf2', 3);
  strokeLine(ctx, 114, 88, 132, 88, '#e8ecf2', 3);
  // astronaut (diff 2: helmet light on vs off)
  ell(ctx, 150, 190, 26, 34, '#eef2f6');
  circ(ctx, 150, 148, 20, '#dfe6ee');
  circ(ctx, 150, 148, 13, '#22303c');
  circ(ctx, 146, 144, 4, '#9fd8f0');
  if (v === 0) {
    circ(ctx, 168, 132, 5, '#ffd94a');
    ctx.fillStyle = 'rgba(255, 217, 74, 0.25)';
    ctx.beginPath();
    ctx.arc(168, 132, 12, 0, Math.PI * 2);
    ctx.fill();
  } else {
    circ(ctx, 168, 132, 5, '#5a6b7a');
  }
  // backpack + limbs
  rect(ctx, 122, 172, 12, 26, '#c96a3b');
  strokeLine(ctx, 132, 210, 118, 236, '#eef2f6', 9);
  strokeLine(ctx, 168, 210, 182, 236, '#eef2f6', 9);
  strokeLine(ctx, 130, 180, 108, 168, '#eef2f6', 8);
  strokeLine(ctx, 170, 180, 192, 168, '#eef2f6', 8);
  // tether
  ctx.strokeStyle = 'rgba(238,242,246,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(118, 236);
  ctx.quadraticCurveTo(80, 280, 60, 300);
  ctx.stroke();
  // rocket (diff 5: big flame vs small flame)
  poly(ctx, [[300, 150], [316, 190], [284, 190]], '#e4572e');
  circ(ctx, 300, 190, 14, '#e4572e');
  rect(ctx, 288, 184, 24, 10, '#ffffff');
  poly(ctx, [[284, 186], [272, 200], [284, 196]], '#f2a541');
  poly(ctx, [[316, 186], [328, 200], [316, 196]], '#f2a541');
  if (v === 0) {
    poly(ctx, [[292, 204], [308, 204], [300, 236]], '#f2a541');
    poly(ctx, [[295, 204], [305, 204], [300, 222]], '#ffd94a');
  } else {
    poly(ctx, [[294, 204], [306, 204], [300, 216]], '#f2a541');
  }
  // alien peeking from behind a moon rock (diff 7: antenna ball red vs yellow)
  ell(ctx, 410, 292, 34, 18, '#8a97a3');
  circ(ctx, 410, 268, 16, '#7fd08a');
  circ(ctx, 404, 266, 4, '#22303c');
  circ(ctx, 416, 266, 4, '#22303c');
  strokeLine(ctx, 410, 252, 410, 238, '#7fd08a', 3);
  circ(ctx, 410, 234, 6, v === 1 ? '#ffd94a' : '#e4572e');
  // control panel (diff 4: the big button red vs green)
  rect(ctx, 0, 282, PANEL_W, 58, '#22303c');
  rect(ctx, 10, 292, 440, 38, '#2e3d4c');
  for (let i = 0; i < 8; i++) {
    const bx = 40 + i * 52;
    circ(ctx, bx, 311, 9, ['#e4572e', '#f2a541', '#2e9e5b', '#3d7bd6'][i % 4]);
  }
  circ(ctx, 40, 311, 13, v === 1 ? '#2e9e5b' : '#e4572e');
  rect(ctx, 380, 298, 60, 24, '#10142e');
  ctx.fillStyle = '#7fd08a';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('O2 98%', 388, 314);
}

const SPACE_DIFFS = [
  { x: 350, y: 95, r: 50, label: 'the planet lost its ring' },
  { x: 168, y: 132, r: 18, label: 'the helmet light went dark' },
  { x: 200, y: 60, r: 12, label: 'a star vanished' },
  { x: 40, y: 311, r: 16, label: 'the big button turned green' },
  { x: 300, y: 214, r: 20, label: 'the rocket flame shrank' },
  { x: 100, y: 80, r: 24, label: 'the satellite dish tilted' },
  { x: 410, y: 238, r: 18, label: 'the antenna ball changed colour' },
];

// ---------------------------------------------------------------- Level 4: Enchanted Forest
function drawForest(ctx, v) {
  // sky + ground
  ctx.fillStyle = vgrad(ctx, 0, 200, [[0, '#bfe6b0'], [1, '#e8f6d8']]);
  ctx.fillRect(0, 0, PANEL_W, 200);
  ctx.fillStyle = '#6fae56';
  ctx.fillRect(0, 200, PANEL_W, 140);
  ctx.fillStyle = '#5d9c48';
  ctx.fillRect(0, 200, PANEL_W, 10);
  // big trees
  for (const [tx, th, tw] of [[40, 190, 70], [420, 200, 76], [230, 170, 60]]) {
    rect(ctx, tx - 8, 200 - th * 0.4, 16, th * 0.4 + 10, '#7a4a21');
    poly(ctx, [[tx - tw / 2, 200 - th * 0.35], [tx, 200 - th], [tx + tw / 2, 200 - th * 0.35]], '#2e7d4f');
    poly(ctx, [[tx - tw / 2 - 6, 200 - th * 0.15], [tx, 200 - th * 0.7], [tx + tw / 2 + 6, 200 - th * 0.15]], '#35855a');
  }
  // hollow in the left tree (diff 7: bird in the hollow vs empty)
  ell(ctx, 40, 168, 12, 16, '#4a2f14');
  if (v === 0) {
    circ(ctx, 40, 164, 7, '#3d7bd6');
    circ(ctx, 43, 162, 2, '#22303c');
    poly(ctx, [[46, 164], [52, 166], [46, 168]], '#f2a541');
  }
  // owl on a branch (diff 1: eyes open vs closed)
  strokeLine(ctx, 300, 130, 370, 130, '#7a4a21', 7);
  ell(ctx, 335, 108, 20, 24, '#8a6a45');
  circ(ctx, 328, 100, 8, '#ffffff');
  circ(ctx, 342, 100, 8, '#ffffff');
  if (v === 0) {
    circ(ctx, 328, 100, 3, '#22303c');
    circ(ctx, 342, 100, 3, '#22303c');
  } else {
    strokeLine(ctx, 323, 100, 333, 100, '#22303c', 2);
    strokeLine(ctx, 337, 100, 347, 100, '#22303c', 2);
  }
  poly(ctx, [[335, 106], [332, 112], [338, 112]], '#f2a541');
  // mushrooms (diff 2: three spots vs five spots)
  for (const [mx, my, s] of [[100, 292, 1], [128, 300, 0.7]]) {
    rect(ctx, mx - 5 * s, my, 10 * s, 16 * s, '#f3e2c7');
    ell(ctx, mx, my, 20 * s, 12 * s, '#e4572e');
    circ(ctx, mx - 8 * s, my - 4 * s, 2.5 * s, '#ffffff');
    circ(ctx, mx + 6 * s, my - 6 * s, 2.5 * s, '#ffffff');
    circ(ctx, mx + 2 * s, my - 2 * s, 2.5 * s, '#ffffff');
    if (v === 1) {
      circ(ctx, mx - 2 * s, my - 8 * s, 2.5 * s, '#ffffff');
      circ(ctx, mx + 11 * s, my - 2 * s, 2.5 * s, '#ffffff');
    }
  }
  // stream
  ctx.fillStyle = '#6cc3d8';
  ctx.beginPath();
  ctx.moveTo(280, 340);
  ctx.quadraticCurveTo(300, 280, 270, 240);
  ctx.lineTo(300, 240);
  ctx.quadraticCurveTo(330, 290, 320, 340);
  ctx.closePath();
  ctx.fill();
  // stream stone (diff 6: stone vs no stone)
  if (v === 0) ell(ctx, 296, 296, 12, 8, '#8a97a3');
  // flowers (diff 4: pink vs yellow)
  for (const [fx, fy] of [[180, 300], [210, 312], [160, 318]]) {
    strokeLine(ctx, fx, fy, fx, fy - 12, '#2e7d4f', 3);
    for (let p = 0; p < 5; p++) {
      const a = (p * Math.PI * 2) / 5;
      circ(ctx, fx + Math.cos(a) * 6, fy - 14 + Math.sin(a) * 6, 4, v === 1 ? '#ffd94a' : '#e87aa8');
    }
    circ(ctx, fx, fy - 14, 3, '#f2a541');
  }
  // butterfly (diff 5: wing spot vs plain wing)
  const bx = 205, by = 150;
  ell(ctx, bx - 10, by, 12, 8, '#9b7ede');
  ell(ctx, bx + 10, by, 12, 8, '#9b7ede');
  if (v === 0) {
    circ(ctx, bx - 10, by - 2, 3, '#ffffff');
    circ(ctx, bx + 10, by - 2, 3, '#ffffff');
  }
  strokeLine(ctx, bx, by - 4, bx, by + 6, '#22303c', 3);
  // fireflies (diff 3: the firefly at 260,120 is missing on the right)
  const flies = [[260, 120], [290, 100], [240, 170], [380, 180], [90, 200]];
  for (const [fx, fy] of flies) {
    if (v === 1 && fx === 260 && fy === 120) continue;
    circ(ctx, fx, fy, 4, '#ffe98a');
    ctx.fillStyle = 'rgba(255, 233, 138, 0.25)';
    ctx.beginPath();
    ctx.arc(fx, fy, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

const FOREST_DIFFS = [
  { x: 335, y: 100, r: 22, label: 'the owl closed its eyes' },
  { x: 100, y: 288, r: 20, label: 'the mushrooms grew more spots' },
  { x: 260, y: 120, r: 12, label: 'a firefly blinked out' },
  { x: 180, y: 292, r: 18, label: 'the flowers changed colour' },
  { x: 205, y: 150, r: 20, label: 'the butterfly lost its wing spots' },
  { x: 296, y: 296, r: 16, label: 'the stream stone vanished' },
  { x: 40, y: 166, r: 18, label: 'the bird left the hollow' },
];

// ---------------------------------------------------------------- Level 5: Rooftop Dusk
function drawRooftop(ctx, v) {
  // dusk sky
  ctx.fillStyle = vgrad(ctx, 0, 340, [[0, '#2c3e5e'], [0.6, '#7a5a7e'], [1, '#e88a5a']]);
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
  // moon (diff 1: crater vs plain)
  circ(ctx, 390, 60, 26, '#fdf3d0');
  if (v === 0) {
    circ(ctx, 382, 52, 5, '#d8c9a3');
    circ(ctx, 398, 66, 4, '#d8c9a3');
    circ(ctx, 392, 72, 3, '#d8c9a3');
  }
  // skyline
  const buildings = [
    [0, 180, 70, 160], [70, 150, 60, 190], [130, 200, 80, 140],
    [210, 160, 66, 180], [276, 190, 70, 150], [346, 170, 60, 170], [406, 200, 54, 140],
  ];
  for (const [bx, by, bw, bh] of buildings) {
    rect(ctx, bx, by, bw, bh, '#232c3d');
    // windows: some lit
    for (let wy = by + 16; wy < 330; wy += 26) {
      for (let wx = bx + 10; wx < bx + bw - 12; wx += 20) {
        // diff 4: the window at (140,180) is lit on the left, dark on the right
        if (wx === 140 && wy === 176) {
          rect(ctx, wx, wy, 10, 12, v === 0 ? '#ffd94a' : '#232c3d');
          continue;
        }
        const lit = ((wx * 7 + wy * 13) % 5) < 2;
        rect(ctx, wx, wy, 10, 12, lit ? '#ffd94a' : '#3a4a63');
      }
    }
  }
  // water tower (diff 7: ladder rung missing on the right)
  rect(ctx, 78, 96, 34, 44, '#8a5a2b');
  poly(ctx, [[72, 96], [118, 96], [108, 82], [82, 82]], '#6b4423');
  strokeLine(ctx, 82, 140, 82, 200, '#5a3a1a', 3);
  strokeLine(ctx, 108, 140, 108, 200, '#5a3a1a', 3);
  for (let ry = 148; ry <= 192; ry += 11) {
    if (v === 1 && ry === 170) continue;
    strokeLine(ctx, 82, ry, 108, ry, '#5a3a1a', 3);
  }
  // antenna (diff 5: red ball vs missing ball)
  strokeLine(ctx, 250, 170, 250, 80, '#c9d2dc', 4);
  strokeLine(ctx, 250, 120, 232, 132, '#c9d2dc', 2);
  strokeLine(ctx, 250, 120, 268, 132, '#c9d2dc', 2);
  if (v === 0) circ(ctx, 250, 76, 6, '#e4572e');
  // string lights across the rooftop (diff 2: the bulb at 230,45 is dark on the right)
  ctx.strokeStyle = '#22303c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(230, 70, 460, 30);
  ctx.stroke();
  for (let i = 0; i < 11; i++) {
    const lx = 20 + i * 42;
    const ly = 30 + Math.sin((lx / 460) * Math.PI) * 18;
    const dark = v === 1 && i === 5;
    circ(ctx, lx, ly + 8, 6, dark ? '#3a4a63' : ['#ffd94a', '#e87aa8', '#7fd08a'][i % 3]);
    strokeLine(ctx, lx, ly, lx, ly + 4, '#22303c', 2);
  }
  // rooftop floor
  rect(ctx, 0, 300, PANEL_W, 40, '#3a3f4a');
  rect(ctx, 0, 300, PANEL_W, 4, '#2a2f38');
  // pigeon (diff 3: faces left vs right)
  ell(ctx, 180, 288, 16, 11, '#8a97a3');
  circ(ctx, v === 0 ? 166 : 194, 280, 8, '#8a97a3');
  circ(ctx, v === 0 ? 163 : 197, 278, 2, '#22303c');
  poly(ctx, v === 0 ? [[160, 282], [152, 285], [160, 287]] : [[200, 282], [208, 285], [200, 287]], '#f2a541');
  strokeLine(ctx, 174, 298, 174, 306, '#e4572e', 2);
  strokeLine(ctx, 186, 298, 186, 306, '#e4572e', 2);
  // cat on the ledge (diff 6: tail curled vs straight)
  ell(ctx, 330, 296, 22, 10, '#22303c');
  circ(ctx, 348, 288, 10, '#22303c');
  poly(ctx, [[342, 281], [345, 273], [349, 281]], '#22303c');
  poly(ctx, [[352, 281], [355, 273], [358, 281]], '#22303c');
  ctx.strokeStyle = '#22303c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (v === 0) {
    ctx.moveTo(310, 294);
    ctx.quadraticCurveTo(296, 288, 300, 276);
  } else {
    ctx.moveTo(310, 294);
    ctx.lineTo(292, 292);
  }
  ctx.stroke();
}

const ROOFTOP_DIFFS = [
  { x: 390, y: 60, r: 28, label: 'the moon lost its craters' },
  { x: 230, y: 55, r: 12, label: 'a string-light bulb went dark' },
  { x: 180, y: 284, r: 20, label: 'the pigeon turned around' },
  { x: 145, y: 182, r: 16, label: 'a window went dark' },
  { x: 250, y: 76, r: 12, label: 'the antenna ball vanished' },
  { x: 302, y: 288, r: 18, label: 'the cat straightened its tail' },
  { x: 95, y: 170, r: 16, label: 'a ladder rung went missing' },
];

// ---------------------------------------------------------------- Level registry
export const LEVELS = [
  {
    id: 'beach', name: 'Sunny Beach', blurb: 'A quiet cove, a crab, and one suspicious sun.',
    time: 150, draw: drawBeach, diffs: BEACH_DIFFS,
  },
  {
    id: 'kitchen', name: 'Cozy Kitchen', blurb: 'Tea is on. The cat knows something.',
    time: 150, draw: drawKitchen, diffs: KITCHEN_DIFFS,
  },
  {
    id: 'space', name: 'Space Station', blurb: 'Orbit is calm. Mostly.',
    time: 150, draw: drawSpace, diffs: SPACE_DIFFS,
  },
  {
    id: 'forest', name: 'Enchanted Forest', blurb: 'The owl saw everything. Twice.',
    time: 150, draw: drawForest, diffs: FOREST_DIFFS,
  },
  {
    id: 'rooftop', name: 'Rooftop Dusk', blurb: 'The city lights up. Something changed.',
    time: 150, draw: drawRooftop, diffs: ROOFTOP_DIFFS,
  },
];
