'use strict';

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const KEY_SPACE = 32;
const KEY_PLUS = 107;
const KEY_MINUS = 109;

let bLeftKey = false;
let bRightKey = false;
let bUpKey = false;
let bDownKey = false;
let bSpaceKey = false;
let bOldSpaceKey = false;

function CaveManGameEngine (nScreenWidth, nScreenHeight) {
    JBGameEngine.call(this, nScreenWidth, nScreenHeight);
    this.prototype = Object.create(JBGameEngine.prototype);
    
    let sLevel;
    let nLevelWidth;
    let nLevelHeight;
    
    let fCameraPosX;
    let fCameraPosY;
    
    let fPlayerPosX;
    let fPlayerPosY;
    
    let fPlayerVelX;
    let fPlayerVelY;
    
    let bPlayerOnGround;
    
    // override init
    this.init = function () {
        sLevel = "";
        nLevelWidth = 64;
        nLevelHeight = 16;

        fCameraPosX = 0.0;
        fCameraPosY = 0.0;
        
        fPlayerPosX = 0.0;
        fPlayerPosY = 0.0;

        fPlayerVelX = 0.0;
        fPlayerVelY = 0.0;
    
        bPlayerOnGround = false;
        
        sLevel += "................................................................";
        sLevel += "................................................................";
        sLevel += "................................................................";
        sLevel += "................................................................";
        sLevel += "................................................................";
        sLevel += "........#............######.....#.#.............................";
        sLevel += "...................##...........#.#.............................";
        sLevel += "................###.............................................";
        sLevel += "############################################.#############.....#";
        sLevel += "...........................................#.#..............###.";
        sLevel += "......................######################.#...........###....";
        sLevel += "......................#......................#........###.......";
        sLevel += "......................#.######################.....###..........";
        sLevel += "......................#.........................###.............";
        sLevel += "......................##########################................";
        sLevel += "................................................................";
    }
    
    
    function Statistics(that, fElapsedTime) {
        that.context.fillStyle = "Black";    
        that.context.font="15px Arial";
        that.context.fillText("FPS: " + (1000 / fElapsedTime).toFixed(), 0.5, 15.5);
    }

    function log(that, sText) {
        that.context.fillStyle = "black";    
        that.context.font="15px Arial";
        that.context.fillText(sText, 0.5, 15.5);
    }
    
    let getTile = (x, y) => {
        if (x >= 0 && x < nLevelWidth && y >= 0 && y < nLevelHeight) {
            return sLevel[y * nLevelWidth + x];
        }
        else {
            return " ";
        } 
    }

    let setTile = (x, y, c) => {
        if (x >= 0 && x < nLevelWidth && y >= 0 && y < nLevelHeight) 
            sLevel[y * nLevelWidth + x] = c;
    }

    // override gameloop
    this.gameloop = function (fElapsedTime) {

          // Handle input
        
//        fPlayerVelX = 0;
//        fPlayerVelY = 0;
        
        let fvelocity = 0.006;
        if (document.hasFocus()) {
            if (bUpKey) {
                fPlayerVelY = -fvelocity;
            }    
            if (bDownKey) {
                fPlayerVelY = fvelocity;
            }    
            if (bLeftKey) {
                fPlayerVelX += -0.05 * fvelocity * fElapsedTime;
            }    
            if (bRightKey) {
                fPlayerVelX += 0.05 * fvelocity * fElapsedTime;
            }    
            if (!bOldSpaceKey && bSpaceKey) {
                bOldSpaceKey = bSpaceKey;
                if (fPlayerVelY === 0) {
                    fPlayerVelY = -0.3 * fvelocity * fElapsedTime;
                }
            }
        }
        
        // Gravity
        fPlayerVelY += 0.02 * fvelocity * fElapsedTime;
        
        // Drag
		if (bPlayerOnGround)
		{
			fPlayerVelX += -(0.75 * fvelocity * fPlayerVelX * fElapsedTime);
            console.log(fPlayerVelX);
//            console.log(Math.abs(fPlayerVelX));
			if (Math.abs(fPlayerVelX) < 0.001)
				fPlayerVelX = 0;
		}
        
        		// Clamp velocities
		if (fPlayerVelX > fvelocity)
			fPlayerVelX = fvelocity;

		if (fPlayerVelX < -fvelocity)
			fPlayerVelX = -fvelocity;

		if (fPlayerVelY > 2 * fvelocity)
			fPlayerVelY = 2 * fvelocity;

//		if (fPlayerVelY < -2 * fvelocity)
//			fPlayerVelY = -2 * fvelocity;

        let fNewPlayerPosX = fPlayerPosX + fPlayerVelX * fElapsedTime;
        let fNewPlayerPosY = fPlayerPosY + fPlayerVelY * fElapsedTime;
        
        // Collision
        bPlayerOnGround = false;
        if (fPlayerVelX <= 0) {
            if (getTile((fNewPlayerPosX + 0.0)|0, (fPlayerPosY + 0.0)|0) !== "." ||
                getTile((fNewPlayerPosX + 0.0)|0, (fPlayerPosY + 0.9)|0) !== ".")
                {
                    fNewPlayerPosX = (fNewPlayerPosX + 1) | 0;
                    fPlayerVelX = 0;
                }
        }
        else {
            if (getTile((fNewPlayerPosX + 1.0)|0, (fPlayerPosY + 0.0)|0) !== "." ||
                getTile((fNewPlayerPosX + 1.0)|0, (fPlayerPosY + 0.9)|0) !== ".")
                {
                    fNewPlayerPosX = (fNewPlayerPosX) | 0;
                    fPlayerVelX = 0;
                }
        }

        if (fPlayerVelY <= 0) {
            if (getTile((fNewPlayerPosX + 0.0)|0, (fNewPlayerPosY)|0) !== "." ||
                getTile((fNewPlayerPosX + 0.9)|0, (fNewPlayerPosY)|0) !== ".")
                {
                    fNewPlayerPosY = (fNewPlayerPosY + 1) | 0;
                    fPlayerVelY = 0;
                }
        }
        else {
            if (getTile((fNewPlayerPosX + 0.0)|0, (fNewPlayerPosY + 1.0)|0) !== "." ||
                getTile((fNewPlayerPosX + 0.9)|0, (fNewPlayerPosY + 1.0)|0) !== ".")
                {
                    fNewPlayerPosY = (fNewPlayerPosY) | 0;
                    fPlayerVelY = 0;
                    bPlayerOnGround = true;
                }
        }
        
        // Apply new position
        fPlayerPosX = fNewPlayerPosX;
        fPlayerPosY = fNewPlayerPosY;
        
        fCameraPosX = fPlayerPosX;
        fCameraPosY = fPlayerPosY;
        
        // Draw field
        let nTileWidth = 32;
        let nTileHeight = 32;
        
        let nVisibleTilesX = this.nScreenWidth / nTileWidth;
        let nVisibleTilesY = this.nScreenHeight / nTileHeight;
        
//        console.log("nVisibleTilesX: ", nVisibleTilesX);
//        console.log("nVisibleTilesY: ", nVisibleTilesY);
        
        // Calculate Top-Left most visible tile
        let fOffsetX = fCameraPosX - (nVisibleTilesX / 2.0);
        let fOffsetY = fCameraPosY - (nVisibleTilesY / 2.0);
        
        // Clamp camera to game boundaries
        if (fOffsetX < 0) fOffsetX = 0;
        if (fOffsetY < 0) fOffsetY = 0;
        if (fOffsetX > nLevelWidth - nVisibleTilesX) fOffsetX = 
            nLevelWidth - nVisibleTilesX;
        if (fOffsetY > nLevelHeight - nVisibleTilesY) fOffsetY = 
            nLevelHeight - nVisibleTilesY;
        
        // Get offsets for smooth movement
        let fTileOffsetX = (fOffsetX - (fOffsetX | 0)) * nTileWidth;
        let fTileOffsetY = (fOffsetY - (fOffsetY | 0)) * nTileHeight;
        
        // Draw visible tile map
        for (let x = -1; x < nVisibleTilesX + 1; x++) {
            for (let y = -1; y < nVisibleTilesY + 1; y++) {
                let nTileID = getTile(x + (fOffsetX | 0), y + (fOffsetY | 0));
                switch (nTileID) {
                    case ".":
                        this.fillRect(x * nTileWidth - (fTileOffsetX | 0), 
                                      y * nTileHeight - (fTileOffsetY | 0),
                                    nTileWidth, nTileHeight,
                                    "cyan");
                        break;
                    case "#":
                        this.fillRect(x * nTileWidth - (fTileOffsetX | 0), 
                                      y * nTileHeight - (fTileOffsetY | 0),
                                    nTileWidth, nTileHeight,
                                    "red");
                        break;
                    default:
                        this.fillRect(x * nTileWidth - (fTileOffsetX | 0), 
                                      y * nTileHeight - (fTileOffsetY | 0),
                                    nTileWidth, nTileHeight,
                                    "purple");
                }
            }
        }
        
        // Draw Player
        this.fillRect((fPlayerPosX - fOffsetX) * nTileWidth,
                      (fPlayerPosY - fOffsetY) * nTileHeight,
                    nTileWidth, nTileHeight,
                    "green");
        
        
//        log(this, fTileOffsetX);
        Statistics(this, fElapsedTime);    
        return true;
    }
    
    // override term
    this.term = function () {
    }
}

window.onload = function () {
    let nScale = 4;
    new CaveManGameEngine(1024, 512).run();
};


window.onkeydown = (e) => {
    switch (e.keyCode) {
        case KEY_SPACE:
            bSpaceKey = true;
            break;
        case LEFT_ARROW:
            bLeftKey = true;
            break;
        case RIGHT_ARROW:
            bRightKey = true;
            break;
        case UP_ARROW:
            bUpKey = true;
            break;
        case DOWN_ARROW:
            bDownKey = true;
            break;
    }
}

window.onkeyup = (e) => {
    switch (e.keyCode) {
        case KEY_SPACE:
            bSpaceKey = false;
            bOldSpaceKey = false;  
            break;
        case LEFT_ARROW:
            bLeftKey = false;
            break;
        case RIGHT_ARROW:
            bRightKey = false;
            break;
        case UP_ARROW:
            bUpKey = false;
            break;
        case DOWN_ARROW:
            bDownKey = false;
            break;
    }
}