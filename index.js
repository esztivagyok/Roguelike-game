const display = document.getElementById("display");
const spiderText = document.getElementById("spider");
'use strict';
/**
 * Unchangable configuration variables
 */
const c = Object.freeze({
  emptySpace: '  ',
  tile: '🟫',
  wall: '🌲',
  caveWall: "🪨",
  enemy: 'X',
  gateHorizontal: '🪨',
  gateVertical: '🪨',
  boardWidth: 80,
  boardHeight: 24,
});
let inventoryDisplay = false;
/**
 * The state of the current game
 */
let GAME = {
  currentRoom: '',
  board: [],
  map: {},
  player: {},
};

/**
 * Create a new player Object
 *
 * @param {string} name name of the player
 * @param {string} race race of the player
 * @returns
 */
function initPlayer(name, race) {
  return {
    x: 11,
    y: 12,
    name: name,
    icon: '🏃🏻',
    race: race,
    health: 100,
    attack: 1,
    defense: 1,
    isPlayer: true,
    counter: [{ itemName: 'Honey', itemCount: 0 }, { itemName: 'Torch', itemCount: 0 }, { itemName: 'Racket', itemCount: 0 }]
  };
}

/**
 * List of the 4 main directions
 */
const DIRECTIONS = [
  [-1, 0], //up
  [1, 0], //down
  [0, -1], // left
  [0, 1], //right
];

/**
 * Enum for the rooms
 */
const ROOM = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
};

/**
 * Icon of the enemies
 */
const ENEMY = {
  poop: "💩",
  wolf: "🐺",
  boar: "🐗",
  bat: "🦇",
  web: "🕸️",
  spider: "🕷️",
  BEES: "🐝",
};

/**
 * Info of the enemies
 */
const ENEMY_INFO = {
  [ENEMY.poop]: {
    health: 10,
    attack: 1,
    defense: 0,
    icon: ENEMY.poop,
    race: "stuff",
    isBoss: false
  },
  [ENEMY.bat]: {
    health: 10,
    attack: 1,
    defense: 0,
    icon: ENEMY.bat,
    race: "animal",
    isBoss: false
  },
  [ENEMY.boar]: {
    health: 10,
    attack: 1,
    defense: 0,
    icon: ENEMY.boar,
    race: "animal",
    isBoss: false
  },
  [ENEMY.wolf]: {
    health: 10,
    attack: 1,
    defense: 0,
    icon: ENEMY.wolf,
    race: "animal",
    isBoss: false
  },
  [ENEMY.web]: {
    health: 10,
    attack: 1,
    defense: 0,
    icon: ENEMY.web,
    race: "stuff",
    isBoss: false
  },
  [ENEMY.spider]: {
    health: 10,
    attack: 1,
    defense: 0,
    icon: ENEMY.spider,
    race: "animal",
    isBoss: false
  },
  [ENEMY.BEES]: {
    health: 50,
    attack: 20,
    defense: 10,
    icon: ENEMY.BEES,
    race: 'Bee',
    isBoss: true,
  }, //💨 💦🏸
};

/**
 * Initialize the play area with starting conditions
 */
function init() {
  GAME.currentRoom = ROOM.A;
  GAME.map = generateMap();
  GAME.board = createBoard(c.boardWidth, c.boardHeight, c.emptySpace);
  GAME.player = initPlayer('Legolas', 'Elf');
  drawScreen();
  console.table(GAME.board);
}

/**
 * Initialize the dungeon map and the items and enemies in it
 */
function generateMap() {
  return {
    [ROOM.A]: {
      layout: [5, 10, 20, 40],
      gates: [
        {
          to: ROOM.B,
          x: 40,
          y: 15,
          icon: c.gateVertical,
          playerStart: { x: 10, y: 15 },
        },
      ],
      obstacles: [
        { type: "Tree", x: 29, y: 11, icon: "🌲" },
        { type: "Tree", x: 16, y: 15, icon: "🌲" },
        { type: "Tree", x: 20, y: 18, icon: "🌲" },
        { type: "Tree", x: 18, y: 13, icon: "🌲" },
        { type: "Tree", x: 37, y: 17, icon: "🌲" },
        { type: "Tree", x: 19, y: 15, icon: "🌲" },
        { type: "Tree", x: 33, y: 16, icon: "🌲" },
        { type: "Tree", x: 19, y: 15, icon: "🌲" },
        { type: "Tree", x: 18, y: 8, icon: "🌲" },
        { type: "Tree", x: 14, y: 10, icon: "🌲" },
        { type: "Tree", x: 16, y: 10, icon: "🌲" },
        { type: "Tree", x: 11, y: 10, icon: "🌲" },
        { type: "Tree", x: 11, y: 17, icon: "🌲" },
        { type: "Tree", x: 12, y: 14, icon: "🌲" },
        { type: "Tree", x: 24, y: 8, icon: "🌲" },
        { type: "Tree", x: 31, y: 17, icon: "🌲" },
        { type: "Tree", x: 37, y: 11, icon: "🌲" },
        { type: "Tree", x: 33, y: 13, icon: "🌲" },
        { type: "Tree", x: 19, y: 9, icon: "🌲" },
      ],
      items: [
        { type: 'Honey', x: 13, y: 8, icon: '🍯', counter: 0 },
        { type: 'Dynamite', x: 12, y: 19, icon: '🧨', counter: 0 },
        { type: 'Water', x: 15, y: 17, icon: '💧' },
        { type: 'Water', x: 30, y: 9, icon: '💧' },
        { type: 'Water', x: 27, y: 17, icon: '💧' },
        { type: 'Water', x: 18, y: 7, icon: '💧' },
        { type: 'Water', x: 37, y: 19, icon: '💧' },
        { type: 'Water', x: 38, y: 10, icon: '💧' },
        { type: 'Torch', x: 38, y: 16, icon: '🔥', counter: 0 },
        { type: 'Torch', x: 31, y: 7, icon: '🔥', counter: 0 },
        { type: 'Torch', x: 23, y: 15, icon: '🔥', counter: 0 },


      ],
      enemies: [
        { type: ENEMY.poop, x: 13, y: 11, name: "Poo", ...ENEMY_INFO[ENEMY.poop] },
        { type: ENEMY.poop, x: 35, y: 9, name: "Poo", ...ENEMY_INFO[ENEMY.poop] },
        { type: ENEMY.poop, x: 13, y: 18, name: "Poo", ...ENEMY_INFO[ENEMY.poop] },
        { type: ENEMY.poop, x: 35, y: 9, name: "Poo", ...ENEMY_INFO[ENEMY.poop] },
        { type: ENEMY.poop, x: 35, y: 9, name: "Poo", ...ENEMY_INFO[ENEMY.poop] },
        { type: ENEMY.wolf, x: 26, y: 17, name: "Wolf", ...ENEMY_INFO[ENEMY.wolf] },
        { type: ENEMY.wolf, x: 20, y: 12, name: "Wolf", ...ENEMY_INFO[ENEMY.wolf] },
        { type: ENEMY.wolf, x: 29, y: 7, name: "Wolf", ...ENEMY_INFO[ENEMY.wolf] },
        { type: ENEMY.boar, x: 12, y: 15, name: "Boar", ...ENEMY_INFO[ENEMY.boar] },
        { type: ENEMY.boar, x: 35, y: 9, name: "Boar", ...ENEMY_INFO[ENEMY.boar] },
        { type: ENEMY.boar, x: 25, y: 13, name: "Boar", ...ENEMY_INFO[ENEMY.boar] },

      ],
      /*items: [
        { type: 'Honey', x: 17, y: 11, icon: '🍯', counter: 0 }, { type: 'Water', x: 25, y: 17, icon: '💧' },
        { type: 'Dynamite', x: 40, y: 10, icon: '🧨', counter: 0 }, { type: 'Torch', x: 42, y: 15, icon: '🕯', counter: 0 }
      ]*/

    },
    [ROOM.B]: {
      layout: [13, 10, 17, 40],
      gates: [
        {
          to: ROOM.C,
          x: 40,
          y: 15,
          icon: '🌞',
          playerStart: { x: 11, y: 10 },
        },
      ],
      enemies: [
        { type: ENEMY.web, x: 13, y: 14, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 13, y: 15, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 13, y: 16, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 20, y: 14, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 21, y: 15, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 23, y: 16, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 24, y: 15, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 26, y: 15, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 27, y: 15, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 28, y: 14, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.web, x: 29, y: 16, name: "SpiderWeb", ...ENEMY_INFO[ENEMY.web] },
        { type: ENEMY.spider, x: 14, y: 16, name: "Spider", ...ENEMY_INFO[ENEMY.spider] },
        { type: ENEMY.bat, x: 33, y: 15, name: "Bat", ...ENEMY_INFO[ENEMY.bat] },
      ],
      items: [
        { type: 'Honey', x: 19, y: 14, icon: '🍯', counter: 0 }, { type: 'Dynamite', x: 25, y: 16, icon: '🧨', counter: 0 },
        { type: 'Water', x: 35, y: 15, icon: '💧' }, { type: 'Torch', x: 15, y: 15, icon: '🔥', counter: 0 }
      ],
    },
    [ROOM.C]: {
      layout: [5, 10, 20, 40],
      gates: [
        {
          to: ROOM.C,
          x: 40,
          y: 15,
          icon: c.wall,
          playerStart: { x: 19, y: 15 },
        },
      ],
      enemies: [
        { type: ENEMY.BEES, x: 35, y: 10, name: "Swarm of Bees", ...ENEMY_INFO[ENEMY.BEES] },
      ],
      items: [
        { type: 'Honey', x: 17, y: 12, icon: '🍯', counter: 0 }, { type: 'Racket', x: 12, y: 15, icon: '🏸' }
      ],
    },
  };
}

/**
 * Display the board on the screen
 * @param {*} board the gameplay area
 */
function displayBoard(board) {
  let screen = ''; // ...

  for (let i = 0; i < board.length; i++) {
    let row = '';
    for (let j = 0; j < board[i].length; j++) {
      row += board[i][j];
    }
    screen += `${row}\n`;
  }

  showStats(GAME.player, GAME.map[GAME.currentRoom].enemies);
  _displayBoard(screen);
}

/**
 * Draw the rectangular room, and show the items, enemies and the player on the screen, then print to the screen
 */
function drawScreen() {
  // ... reset the board with `createBoard`
  GAME.board = createBoard(c.boardWidth, c.boardHeight, c.emptySpace);
  // ... use `drawRoom`
  drawRoom(GAME.board, ...GAME.map[GAME.currentRoom].layout);
  // ... print entities with `addToBoard`
  addToBoard(
    GAME.board,
    {
      x: GAME.map[GAME.currentRoom].gates[0].x,
      y: GAME.map[GAME.currentRoom].gates[0].y,
    },
    GAME.map[GAME.currentRoom].gates[0].icon
  );
  addToBoard(
    GAME.board,
    { x: GAME.player.x, y: GAME.player.y },
    GAME.player.icon
  );
  if (GAME.currentRoom === 'A') {
    for (let i = 0; i < GAME.map[GAME.currentRoom].items.length; i++) {
      addToBoard(
        GAME.board,
        {
          x: GAME.map[GAME.currentRoom].items[i].x,
          y: GAME.map[GAME.currentRoom].items[i].y,
        },
        GAME.map[GAME.currentRoom].items[i].icon
      );
    }
    for (let i = 0; i < GAME.map[GAME.currentRoom].enemies.length; i++) {
      addToBoard(
        GAME.board,
        {
          x: GAME.map[GAME.currentRoom].enemies[i].x,
          y: GAME.map[GAME.currentRoom].enemies[i].y,
        },
        GAME.map[GAME.currentRoom].enemies[i].icon
      );
    }
    for (let i = 0; i < GAME.map[GAME.currentRoom].obstacles.length; i++) {
      addToBoard(
        GAME.board,
        {
          x: GAME.map[GAME.currentRoom].obstacles[i].x,
          y: GAME.map[GAME.currentRoom].obstacles[i].y,
        },
        GAME.map[GAME.currentRoom].obstacles[i].icon
      );
    }
  } else if (GAME.currentRoom === 'B') {
    for (let i = 0; i < GAME.map[GAME.currentRoom].items.length; i++) {
      addToBoard(
        GAME.board,
        {
          x: GAME.map[GAME.currentRoom].items[i].x,
          y: GAME.map[GAME.currentRoom].items[i].y,
        },
        GAME.map[GAME.currentRoom].items[i].icon
      );
    }
    for (let i = 0; i < GAME.map[GAME.currentRoom].enemies.length; i++) {
      addToBoard(
        GAME.board,
        {
          x: GAME.map[GAME.currentRoom].enemies[i].x,
          y: GAME.map[GAME.currentRoom].enemies[i].y,
        },
        GAME.map[GAME.currentRoom].enemies[i].icon
      );
    }
  } else if (GAME.currentRoom === ROOM.C) {
    for (let i = 0; i < GAME.map[GAME.currentRoom].enemies.length; i++) {
      for (let x5 = 0; x5 < 5; x5++) {
        for (let y5 = 0; y5 < 5; y5++) {
          addToBoard(
            GAME.board,
            {
              x: GAME.map[GAME.currentRoom].enemies[i].x + x5,
              y: GAME.map[GAME.currentRoom].enemies[i].y + y5,
            },
            GAME.map[GAME.currentRoom].enemies[i].icon
          );
        }
      }

    }
    for (let i = 0; i < GAME.map[GAME.currentRoom].items.length; i++) {
      addToBoard(
        GAME.board,
        { x: GAME.map[GAME.currentRoom].items[i].x, y: GAME.map[GAME.currentRoom].items[i].y },
        GAME.map[GAME.currentRoom].items[i].icon

      );
    }
  }

  if (GAME.currentRoom === ROOM.C) {
    console.log(GAME.map[GAME.currentRoom].enemies[0].x);
    if (GAME.map[GAME.currentRoom].enemies[0].x > GAME.player.x) {
      GAME.map[GAME.currentRoom].enemies[0].x -= 1;
    } else if (GAME.map[GAME.currentRoom].enemies[0].x < GAME.player.x) {
      GAME.map[GAME.currentRoom].enemies[0].x += 1;
    }

    if (GAME.map[GAME.currentRoom].enemies[0].y > GAME.player.y) {
      GAME.map[GAME.currentRoom].enemies[0].y -= 1;
    } else if (GAME.map[GAME.currentRoom].enemies[0].y < GAME.player.y) {
      GAME.map[GAME.currentRoom].enemies[0].y += 1;
    }

    console.log(GAME.map[GAME.currentRoom].enemies[0].x);
    for (let x5 = 0; x5 < 5; x5++) {
      for (let y5 = 0; y5 < 5; y5++) {
        addToBoard(
          GAME.board,
          {
            x: GAME.map[GAME.currentRoom].enemies[0].x + x5,
            y: GAME.map[GAME.currentRoom].enemies[0].y + y5,
          },
          GAME.map[GAME.currentRoom].enemies[0].icon
        );
      }
    }
  }




  displayBoard(GAME.board);
}

/**
 * Implement the turn based movement. Move the player, move the enemies, show the statistics and then print the new frame.
 *
 * @param {*} yDiff
 * @param {*} xDiff
 * @returns
 */
function moveAll(yDiff, xDiff) {
  // ... use `move` to move all entities
  move(GAME.player, yDiff, xDiff);
  // ... show statistics with `showStats`
  showStats(GAME.player, GAME.map[GAME.currentRoom].enemies);
  // ... reload screen with `drawScreen`

  drawScreen();
}

/**
 * Implement the movement of an entity (enemy/player)
 *
 * - Do not let the entity out of the screen.
 * - Do not let them mve through walls.
 * - Let them visit other rooms.
 * - Let them attack their enemies.
 * - Let them move to valid empty space.
 *
 * @param {*} who entity that tried to move
 * @param {number} yDiff difference in Y coord
 * @param {number} xDiff difference in X coord
 * @returns
 */

function move(who, yDiff, xDiff) {
  who.x += xDiff;
  who.y += yDiff;

  // ... check if move to empty space
  // ... check if hit a wall
  if (GAME.board[who.y][who.x] === c.wall) {
    who.x -= xDiff;
    who.y -= yDiff;
  }
  if (GAME.board[who.y][who.x] === c.caveWall && GAME.currentRoom === 'B') {
    who.x -= xDiff;
    who.y -= yDiff;
  }



  // ... check if move to new room (`removeFromBoard`, `addToBoard`)
  if (
    GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].gates[0].icon &&
    GAME.map[GAME.currentRoom].items[1].counter === 1
  ) {
    who.x = GAME.map[GAME.currentRoom].gates[0].playerStart.x;
    who.y = GAME.map[GAME.currentRoom].gates[0].playerStart.y;
    GAME.currentRoom = GAME.map[GAME.currentRoom].gates[0].to;
    if (GAME.currentRoom === "B") {
      display.classList.add("cave");
      display.classList.remove("field");
    } else if (GAME.currentRoom === "C") {
      display.classList.remove("cave");
      display.classList.add("field");
    }
  }

  //check for items
  for (let i = 0; i < GAME.map[GAME.currentRoom].items.length; i++) {
    if (GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].items[i].icon) {
      console.log(GAME.map[GAME.currentRoom].items[i].type);
      if (GAME.map[GAME.currentRoom].items[i].type === GAME.player.counter[0].itemName && GAME.map[GAME.currentRoom].items[i].x === who.x && GAME.map[GAME.currentRoom].items[i].y === who.y) {
        GAME.player.counter[0].itemCount += 1;
        GAME.map[GAME.currentRoom].items[i].x = 1;
        GAME.map[GAME.currentRoom].items[i].y = 1;
        GAME.map[GAME.currentRoom].items[i].icon = '';
      } else if (GAME.map[GAME.currentRoom].items[i].type === GAME.player.counter[1].itemName && GAME.map[GAME.currentRoom].items[i].x === who.x && GAME.map[GAME.currentRoom].items[i].y === who.y) {
        GAME.player.counter[1].itemCount += 1;
        GAME.map[GAME.currentRoom].items[i].x = 1;
        GAME.map[GAME.currentRoom].items[i].y = 1;
        GAME.map[GAME.currentRoom].items[i].icon = '';
      } else if (GAME.map[GAME.currentRoom].items[i].type === GAME.player.counter[2].itemName && GAME.map[GAME.currentRoom].items[i].x === who.x && GAME.map[GAME.currentRoom].items[i].y === who.y) {
        GAME.player.counter[2].itemCount += 1;
        GAME.map[GAME.currentRoom].items[i].x = 1;
        GAME.map[GAME.currentRoom].items[i].y = 1;
        GAME.map[GAME.currentRoom].items[i].icon = '';
      } else if (GAME.map[GAME.currentRoom].items[i].type === 'Dynamite') {
        GAME.map[GAME.currentRoom].items[i].counter += 1;
        GAME.map[GAME.currentRoom].items[i].x = 1;
        GAME.map[GAME.currentRoom].items[i].y = 1;
        GAME.map[GAME.currentRoom].items[i].icon = '';
      } else if (GAME.map[GAME.currentRoom].items[i].type === 'Water' && GAME.player.health <= 95 && GAME.map[GAME.currentRoom].items[i].x === who.x && GAME.map[GAME.currentRoom].items[i].y === who.y) {
        GAME.player.health = GAME.player.health + 5;
        GAME.map[GAME.currentRoom].items[i].x = 1;
        GAME.map[GAME.currentRoom].items[i].y = 1;
        GAME.map[GAME.currentRoom].items[i].icon = '';

      }


    }

  }
  if (inventoryDisplay) {
    inventory.innerText = `${GAME.player.counter[0].itemName}:  ${GAME.player.counter[0].itemCount}/3  ${GAME.player.counter[1].itemName}:  ${GAME.player.counter[1].itemCount}  ${GAME.player.counter[2].itemName}:  ${GAME.player.counter[2].itemCount}`;
  }
  // ... check if attack enemy
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[5].icon && GAME.map[GAME.currentRoom].enemies[5].x === who.x && GAME.map[GAME.currentRoom].enemies[5].y === who.y) {
    GAME.map[GAME.currentRoom].enemies[5].x = Math.floor(Math.random() * 29) + 11;
    GAME.map[GAME.currentRoom].enemies[5].y = Math.floor(Math.random() * 14) + 6;
    GAME.player.health = GAME.player.health - 20;

  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[6].icon && GAME.map[GAME.currentRoom].enemies[6].x === who.x && GAME.map[GAME.currentRoom].enemies[6].y === who.y) {
    GAME.map[GAME.currentRoom].enemies[6].x = Math.floor(Math.random() * 29) + 11;
    GAME.map[GAME.currentRoom].enemies[6].y = Math.floor(Math.random() * 14) + 6;
    GAME.player.health = GAME.player.health - 20;

  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[7].icon && GAME.map[GAME.currentRoom].enemies[7].x === who.x && GAME.map[GAME.currentRoom].enemies[7].y === who.y) {
    GAME.map[GAME.currentRoom].enemies[7].x = Math.floor(Math.random() * 29) + 11;
    GAME.map[GAME.currentRoom].enemies[7].y = Math.floor(Math.random() * 14) + 6;
    GAME.player.health = GAME.player.health - 20;

  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[8].icon && GAME.map[GAME.currentRoom].enemies[8].x === who.x && GAME.map[GAME.currentRoom].enemies[8].y === who.y) {
    GAME.map[GAME.currentRoom].enemies[8].x = Math.floor(Math.random() * 29) + 11;
    GAME.map[GAME.currentRoom].enemies[8].y = Math.floor(Math.random() * 14) + 6;
    GAME.player.health = GAME.player.health - 20;

  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[9].icon && GAME.map[GAME.currentRoom].enemies[9].x === who.x && GAME.map[GAME.currentRoom].enemies[9].y === who.y) {
    GAME.map[GAME.currentRoom].enemies[9].x = Math.floor(Math.random() * 29) + 11;
    GAME.map[GAME.currentRoom].enemies[9].y = Math.floor(Math.random() * 14) + 6;
    GAME.player.health = GAME.player.health - 20;

  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[10].icon && GAME.map[GAME.currentRoom].enemies[10].x === who.x && GAME.map[GAME.currentRoom].enemies[10].y === who.y) {
    GAME.map[GAME.currentRoom].enemies[10].x = Math.floor(Math.random() * 29) + 11;
    GAME.map[GAME.currentRoom].enemies[10].y = Math.floor(Math.random() * 14) + 6;
    GAME.player.health = GAME.player.health - 20;

  }
  if (GAME.currentRoom === "B" && GAME.map[GAME.currentRoom].enemies[11].x === GAME.player.x - 2) {
    GAME.map[GAME.currentRoom].enemies[11].x = GAME.player.x - 1;
    GAME.map[GAME.currentRoom].enemies[11].y = GAME.player.y;
    spiderText.classList.remove("is-hidden");
    spiderText.innerHTML = "You destroyed my web, now RUN!"
  }
  if (GAME.currentRoom === "B") {
    GAME.map[GAME.currentRoom].enemies[12].x = Math.floor(Math.random() * 10) + 30;
    GAME.map[GAME.currentRoom].enemies[12].y = Math.floor(Math.random() * 3) + 14;
  }
  if (GAME.currentRoom === "C") {
    spiderText.classList.add("is-hidden");
  }

  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[0].icon && GAME.map[GAME.currentRoom].enemies[0].x === who.x && GAME.map[GAME.currentRoom].enemies[0].y === who.y) {
    GAME.player.health = GAME.player.health - 50;
  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[1].icon && GAME.map[GAME.currentRoom].enemies[1].x === who.x && GAME.map[GAME.currentRoom].enemies[1].y === who.y) {
    GAME.player.health = GAME.player.health - 50;
  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[2].icon && GAME.map[GAME.currentRoom].enemies[2].x === who.x && GAME.map[GAME.currentRoom].enemies[2].y === who.y) {
    GAME.player.health = GAME.player.health - 50;
  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[3].icon && GAME.map[GAME.currentRoom].enemies[3].x === who.x && GAME.map[GAME.currentRoom].enemies[3].y === who.y) {
    GAME.player.health = GAME.player.health - 50;
  }
  if (GAME.currentRoom === "A" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[4].icon && GAME.map[GAME.currentRoom].enemies[4].x === who.x && GAME.map[GAME.currentRoom].enemies[4].y === who.y) {
    GAME.player.health = GAME.player.health - 50;
  }


  if (GAME.currentRoom === "C" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[0].icon && GAME.player.counter[0].itemCount === 3 && GAME.player.counter[2].itemCount === 1) {
    document.getElementById('screen').classList.add('is-hidden');
    _gameOver('You won!');
  } else if (GAME.currentRoom === "C" && GAME.board[who.y][who.x] === GAME.map[GAME.currentRoom].enemies[0].icon && (GAME.player.counter[0].itemCount !== 3 || GAME.player.counter[2].itemCount !== 1)) {
    _gameOver('Game over!');
  }

  // ... check if attack player
  //     ... use `_gameOver()` if necessary
  if (GAME.player.health < 1) {
    _gameOver('Game over!');
  }

}

/**
 * Check if the entity found anything actionable.
 *
 * @param {*} board the gameplay area
 * @param {*} y Y position on the board
 * @param {*} x X position on the board
 * @returns boolean if found anything relevant
 */
function hit(board, y, x) {
  // ...
}

/**
 * Add entity to the board
 *
 * @param {*} board the gameplay area
 * @param {*} item anything with position data
 * @param {string} icon icon to print on the screen
 */
function addToBoard(board, item, icon) {
  board[item.y][item.x] = icon;
}

/**
 * Remove entity from the board
 *
 * @param {*} board the gameplay area
 * @param {*} item anything with position data
 */
function removeFromBoard(board, item) {
  // ...
}

/**
 * Create the gameplay area to print
 *
 * @param {number} width width of the board
 * @param {number} height height of the board
 * @param {string} emptySpace icon to print as whitespace
 * @returns
 */
function createBoard(width, height, emptySpace) {
  const board = [];

  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(emptySpace);
    }
    board.push(row);
  }
  return board;
}

/**
 * Draw a rectangular room
 *
 * @param {*} board the gameplay area to update with the room
 * @param {*} topY room's top position on Y axis
 * @param {*} leftX room's left position on X axis
 * @param {*} bottomY room's bottom position on Y axis
 * @param {*} rightX room's right position on X axis
 */
function drawRoom(board, topY, leftX, bottomY, rightX) {
  if (GAME.currentRoom === 'A' || GAME.currentRoom === 'C') {

    for (let i = leftX; i <= rightX; i++) {
      board[bottomY][i] = c.wall;
      board[topY][i] = c.wall;
    }


    for (let i = topY; i < bottomY; i++) {
      board[i][leftX] = c.wall;
      board[i][rightX] = c.wall;
    }
  } else if (GAME.currentRoom === 'B') {
    for (let i = leftX; i <= rightX; i++) {
      board[bottomY][i] = c.caveWall;
      board[topY][i] = c.caveWall;
    }

    for (let i = topY; i < bottomY; i++) {
      board[i][leftX] = c.caveWall;
      board[i][rightX] = c.caveWall;
    }
  }
  for (let i = leftX + 1; i <= rightX - 1; i++) {
    for (let j = topY + 1; j <= bottomY - 1; j++) {
      board[j][i] = c.tile;
    }
  }
}

/**
 * Print stats to the user
 *
 * @param {*} player player info
 * @param {array} enemies info of all enemies in the current room
 */
function showStats(player, enemies) {
  const playerStats = player.health + '/100'; // ...
  /* let enemyStats = ''; // ... concatenate them with a newline
   for (let i = 0; i < enemies.length; i++) {
     enemyStats += enemies[i].name + ': ' + enemies[i].health + '\n';
   }*/

  _updateStats(playerStats, enemyStats);
}

/**
 * Update the gameplay area in the DOM
 * @param {*} board the gameplay area
 */
function _displayBoard(screen) {
  document.getElementById('screen').innerText = screen;
}

/**
 * Update the gameplay stats in the DOM
 *
 * @param {*} playerStatText stats of the player
 * @param {*} enemyStatText stats of the enemies
 */
function _updateStats(playerStatText, enemyStatText) {
  const playerStats = document.getElementById('playerStats');
  playerStats.innerText = playerStatText;
  //const enemyStats = document.getElementById('enemyStats');
  //enemyStats.innerText = enemyStatText;
  const inventory = document.getElementById('inventory');
}

/**
 * Keep a reference of the existing keypress listener, to be able to remove it later
 */
let _keypressListener = null;

/**
 * Code to run after the player ddecided to start the game.
 * Register the movement handler, and make sure that the boxes are hidden.
 *
 * @param {function} moveCB callback to handle movement of all entities in the room
 */
function _start(moveCB) {
  const msgBox = document.getElementById('startBox');
  const endBox = document.getElementById('endBox');
  const screenTag = document.getElementById('screen');
  screenTag.classList.remove('is-hidden');
  playerStats.classList.remove('is-hidden');
  enemyStats.classList.remove('is-hidden');
  endBox.classList.add('is-hidden');
  GAME.player.name = document.getElementById('playerName').value;
  GAME.player.race = document.getElementById('playerRace').value;
  msgBox.classList.toggle('is-hidden');
  document.getElementById('spider').classList.add('is-hidden');
  console.log(GAME.player.race);
  if (GAME.player.race === 'Boy scout') {
    GAME.player.icon = '👨🏻‍🌾';
  } else if (GAME.player.race === 'Forester') {
    GAME.player.icon = '🧙🏻';
  } else if (GAME.player.race === 'Hiker') {
    GAME.player.icon = '🏃🏻';
  }
  drawScreen();



  _keypressListener = (e) => {
    let xDiff = 0;
    let yDiff = 0;
    switch (e.key.toLocaleLowerCase()) {
      case 'w': {
        yDiff = -1;
        xDiff = 0;
        break;
      }
      case 's': {
        yDiff = 1;
        xDiff = 0;
        break;
      }
      case 'a': {
        yDiff = 0;
        xDiff = -1;
        break;
      }
      case 'd': {
        yDiff = 0;
        xDiff = 1;
        break;
      }
      case 'i': {
        inventoryDisplay = true;
        inventory.innerText = `${GAME.player.counter[0].itemName}:  ${GAME.player.counter[0].itemCount}/3  ${GAME.player.counter[1].itemName}:  ${GAME.player.counter[1].itemCount}  ${GAME.player.counter[2].itemName}:  ${GAME.player.counter[2].itemCount}`;
        break;
      }
    }
    if (xDiff !== 0 || yDiff !== 0) {
      moveCB(yDiff, xDiff);
    }
  };
  document.addEventListener('keypress', _keypressListener);
}

/**
 * Code to run when the player died.
 *
 * Makes sure that the proper boxes are visible.
 */
function _gameOver(text) {
  const msgBox = document.getElementById('startBox');
  msgBox.classList.add('is-hidden');
  const endBox = document.getElementById('endBox');
  endBox.classList.remove('is-hidden');
  endBox.firstChild.textContent = text;
  if (_keypressListener) {
    document.removeEventListener('keypress', _keypressListener);
  }
}

/**
 * Code to run when the player hits restart.
 *
 * Makes sure that the proper boxes are visible.
 */
function _restart() {
  const msgBox = document.getElementById('startBox');
  msgBox.classList.remove('is-hidden');
  const endBox = document.getElementById('endBox');
  endBox.classList.add('is-hidden');
  const screenTag = document.getElementById('screen');
  screenTag.classList.add('is-hidden');
  document.getElementById('inventory').innerText = '';
  inventoryDisplay = false;

  init();
}

init();
