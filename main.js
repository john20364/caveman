'use strict';

function CaveManGameEngine (nScreenWidth, nScreenHeight) {
    this.prototype = Object.create(jcb.lib.GameEngine.prototype);
    jcb.lib.GameEngine.call(this, nScreenWidth, nScreenHeight);

    let keyboard = jcb.lib.KeyBoardFactory.getInstance();
    
    let sLevel;
    let aLevel;
    
    let nLevelWidth;
    let nLevelHeight;
    
    let fCameraPosX;
    let fCameraPosY;
    
    let fPlayerPosX;
    let fPlayerPosY;
    
    let fPlayerVelX;
    let fPlayerVelY;
    
    let bPlayerOnGround;
    
    let fDraw;
    
    // override init
    this.init = function () {
        sLevel = "";
        aLevel = [];
        nLevelWidth = 64;
        nLevelHeight = 16;

        fCameraPosX = 0.0;
        fCameraPosY = 0.0;
        
        fPlayerPosX = 0.0;
        fPlayerPosY = 0.0;

        fPlayerVelX = 0.0;
        fPlayerVelY = 0.0;
    
        bPlayerOnGround = false;
        
        sLevel += ".............................................o.o................";
        sLevel += "................................................................";
        sLevel += ".....o.o..............o.o.o..............####..o................";
        sLevel += "....o.o.o..............o.o............#####.....................";
        sLevel += "................................................................";
        sLevel += "....#####............######.....#.#.............................";
        sLevel += "...................##...........#.#.............................";
        sLevel += "....o..o..o.....###.............................................";
        sLevel += "############################################.#############.....#";
        sLevel += "...........................................#.#o.o.o.........###.";
        sLevel += "......................######################.#...........###....";
        sLevel += "......................#...o...o....o.........#o.o.o...###.......";
        sLevel += "......................#.######################.....###..........";
        sLevel += "......................#.........................###.............";
        sLevel += "......................##########################................";
        sLevel += "................................................................";
        
        aLevel = sLevel.split('');
    }
    
    
    function Statistics(that, fElapsedTime) {
        that.context.fillStyle = "Black";    
        that.context.font="15px Arial";
        that.context.fillText("FPS: " + (1000 / fElapsedTime).toFixed(), 0.5, 15.5);
    }

    function log(that, sText) {
        that.context.fillStyle = "black";    
        that.context.font="15px Arial";
        that.context.fillText(sText, 0.5, 30.5);
    }
    
    let getTile = (x, y) => {
        if (x >= 0 && x < nLevelWidth && y >= 0 && y < nLevelHeight) {
            return aLevel[y * nLevelWidth + x];
        }
        else {
            return ' ';
        } 
    }

    let setTile = (x, y, c) => {
        if (x >= 0 && x < nLevelWidth && y >= 0 && y < nLevelHeight) 
            aLevel[y * nLevelWidth + x] = c;
    }

    this.onPause = function () {
        jcb.lib.waitForAnyKey(100, () => {
            this.continue();
        });
    }
    
    // override gameloop
    this.gameloop = function (fElapsedTime) {

        let fFps = 1000 / fElapsedTime;
        let fTime = fElapsedTime / 1000;
          // Handle input
        
        let fDrag = 50 * fTime;
        let fGravity = 20 * fTime; 

        if (document.hasFocus()) {
            if (keyboard.isKeyDown(keyboard.KEY_LEFT_ARROW())) {
                fPlayerVelX += (bPlayerOnGround) ? -1.5 : -0.25;
            }    
            if (keyboard.isKeyDown(keyboard.KEY_RIGHT_ARROW())) {
                fPlayerVelX += (bPlayerOnGround) ? 1.5 : 0.25;
            }    
            if (keyboard.isKeyPressed(keyboard.getKeyCode(' '))) {
                if (fPlayerVelY === 0) {
                    fPlayerVelY = -12;
                }
            }
        }
        
        // Gravity
        fPlayerVelY += fGravity;
        
        // Drag
		if (bPlayerOnGround)
        {
            if (fPlayerVelX < 0) {
                fPlayerVelX += fDrag;
                if (fPlayerVelX > 0) fPlayerVelX = 0;
            }
            else {
                fPlayerVelX -= fDrag;
                if (fPlayerVelX < 0) fPlayerVelX = 0;
            }
		}
        
        // Clamp velocities
		if (fPlayerVelX > 8)
            fPlayerVelX = 8;

		if (fPlayerVelX < -8)
			fPlayerVelX = -8;
        
        if (fPlayerVelY > 15) 
            fPlayerVelY = 15;

        if (fPlayerVelY < -15) 
            fPlayerVelY = -15;

        let fNewPlayerPosX = fPlayerPosX + fPlayerVelX * fTime;
        let fNewPlayerPosY = fPlayerPosY + fPlayerVelY * fTime;

        if (fNewPlayerPosX < 0) {
            fNewPlayerPosX = 0;
            fPlayerVelX = 0;
        }

        if (fNewPlayerPosY < 0) {
            fNewPlayerPosY = 0;
            fPlayerVelY = 0;
        }
        
        // Check for pickups!
		if (getTile((fNewPlayerPosX + 0.0) | 0, (fNewPlayerPosY + 0.0) | 0) === 'o')
			setTile((fNewPlayerPosX + 0.0) | 0, (fNewPlayerPosY + 0.0) | 0, '.');

        if (getTile((fNewPlayerPosX + 0.0) | 0, (fNewPlayerPosY + 1.0) | 0) === 'o')
			setTile((fNewPlayerPosX + 0.0) | 0, (fNewPlayerPosY + 1.0) | 0, '.');

        if (getTile((fNewPlayerPosX + 1.0) | 0, (fNewPlayerPosY + 0.0) | 0) === 'o')
			setTile((fNewPlayerPosX + 1.0) | 0, (fNewPlayerPosY + 0.0) | 0, '.');

        if (getTile((fNewPlayerPosX + 1.0) | 0, (fNewPlayerPosY + 1.0) | 0) === 'o')
			setTile((fNewPlayerPosX + 1.0) | 0, (fNewPlayerPosY + 1.0) | 0, '.');
        
        
        // Collision

        bPlayerOnGround = false;
        if (fPlayerVelX <= 0) {
            if (getTile((fNewPlayerPosX + 0.0)|0, (fPlayerPosY + 0.0)|0) !== '.' ||
                getTile((fNewPlayerPosX + 0.0)|0, (fPlayerPosY + 0.9)|0) !== '.')
                {
                    fNewPlayerPosX = (fNewPlayerPosX + 1) | 0;
                    fPlayerVelX = 0;
                }
        }
        else {
            if (getTile((fNewPlayerPosX + 1.0)|0, (fPlayerPosY + 0.0)|0) !== '.' ||
                getTile((fNewPlayerPosX + 1.0)|0, (fPlayerPosY + 0.9)|0) !== '.')
                {
                    fNewPlayerPosX = (fNewPlayerPosX) | 0;
                    fPlayerVelX = 0;
                }
        }

        if (fPlayerVelY <= 0) {
            if (getTile((fNewPlayerPosX + 0.0)|0, (fNewPlayerPosY)|0) !== '.' ||
                getTile((fNewPlayerPosX + 0.9)|0, (fNewPlayerPosY)|0) !== '.')
                {
                    fNewPlayerPosY = (fNewPlayerPosY + 1) | 0;
                    fPlayerVelY = 0;
                }
        }
        else {
            if (getTile((fNewPlayerPosX + 0.0)|0, (fNewPlayerPosY + 1.0)|0) !== '.' ||
                getTile((fNewPlayerPosX + 0.9)|0, (fNewPlayerPosY + 1.0)|0) !== '.')
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
                    case '.':
                        this.fillRect(x * nTileWidth - (fTileOffsetX | 0), 
                                      y * nTileHeight - (fTileOffsetY | 0),
                                    nTileWidth, nTileHeight,
                                    "cyan");
                        break;
                    case '#':
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
        
        
//        log(this, fPlayerPosX);
        Statistics(this, fElapsedTime);   
        return true;
    }
    
    // override terminate
    this.terminate = function () {
        
    }
}

window.onload = function () {
    new CaveManGameEngine(1024, 512).run();
};
