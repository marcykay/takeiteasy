/****
 * @desc GA Unit 01 : Take It Easy
 * @author mahchinkok@gmail.com
 ****/

// Global Variables
let tilesDB = [ {
        tid: '1-2',
        imgURL: 'url("../images/tile1-2.svg")',
        xVal: 1,
        yVal: 2,
        qty: 12
    },
    {
        tid: '1-4',
        imgURL: 'url("../images/tile1-4.svg")',
        xVal: 1,
        yVal: 4,
        qty: 11
    },
    {
        tid: '1-6',
        imgURL: 'url("../images/tile1-6.svg")',
        xVal: 1,
        yVal: 6,
        qty: 10
    },
    {
        tid: '3-2',
        imgURL: 'url("../images/tile3-2.svg")',
        xVal: 3,
        yVal: 2,
        qty: 11
    },
    {
        tid: '3-4',
        imgURL: 'url("../images/tile3-4.svg")',
        xVal: 3,
        yVal: 4,
        qty: 10
    },
    {
        tid: '3-6',
        imgURL: 'url("../images/tile3-6.svg")',
        xVal: 3,
        yVal: 6,
        qty: 9
    },
    {
        tid: '5-2',
        imgURL: 'url("../images/tile5-2.svg")',
        xVal: 5,
        yVal: 2,
        qty: 10
    },
    {
        tid: '5-4',
        imgURL: 'url("../images/tile5-4.svg")',
        xVal: 5,
        yVal: 4,
        qty: 9
    },
    {
        tid: '5-6',
        imgURL: 'url("../images/tile5-6.svg")',
        xVal: 5,
        yVal: 6,
        qty: 9
    }
];
const tilesDeck = [];
const p1TilesPositionArrYX = [];
const p2TilesPositionArrYX = [];
let gameTurns = 0;
let mapSizeXY = [ 5, 5 ];
let p1gameScore = 0;
let p2gameScore = 0;
let currentP1GameScore = 0;
let currentP2GameScore = 0;
let gameRounds = 0;
let twoPlayerMode = false;
let refGrid = "vh";
let player1Turn = true;
let gameOver = false;
let mapSize = "small";
let x = "";

////////////////////////////////////
// Init Game: Add Event Listeners //
////////////////////////////////////
window.onload = function reloadGame() {
    console.log( '%c window.onload', 'background: red; color: white;' );
    x = document.getElementById("myAudio")
    loadEventListener();
}

let loadEventListener = function() {
    console.log( `func:loadEventListener` );
    document.addEventListener( 'click', function( event ) {
        console.log( `clicked => ${event.target.outerHTML}` );
        // SINGLE Player Mode
        if ( ( !twoPlayerMode ) && event.target.matches( ".p1" ) &&
            ( gameTurns <= mapSizeXY[ 0 ] * mapSizeXY[ 1 ] ) && checkPosition( event.target.id ) ) {
            transferTile( event );
            gameTurns++;
            highLighter( event.target.id );
            checkEndOfGame();
            console.log( `%c GAME TURNS: ${gameTurns}`, 'background: black; color: white;' );
        }
        // TWO Players Mode
        if ( twoPlayerMode && ( gameTurns <= mapSizeXY[ 0 ] * mapSizeXY[ 1 ] ) ) {
            if ( player1Turn && event.target.matches( ".p1" ) && checkPosition( event.target.id ) ) {
                transferTile( event );
                //highLighter( event.target.id );
                player1Turn = !player1Turn;
                document.getElementById( 'output2' ).style.display = "none";
                setTimeout( () => document.getElementById( 'output1' ).style.display = "block", 300 );

            } else if ( !player1Turn && event.target.matches( ".p2" ) && checkPosition( event.target.id ) ) {
                transferTile( event );
                gameTurns++;
                checkEndOfGame();
                //highLighter( event.target.id );
                player1Turn = !player1Turn;
                console.log( `%c GAME TURNS: ${gameTurns}`, 'background: black; color: white;' );
                if ( gameOver ) {
                    document.getElementById( 'output1' ).style.display = "none";
                    document.getElementById( 'output2' ).style.display = "none";
                } else {
                    document.getElementById( 'output1' ).style.display = "none";
                    setTimeout( () => document.getElementById( 'output2' ).style.display = "block", 300 );
                }
            }
        }

        if ( event.target.matches( "#button_start" ) ) newGame();
        if ( event.target.matches( "#button_gamesize" ) ) shuffleGameSize();
        if ( event.target.matches( "#button_player_mode" ) ) shufflePlayerMode();
        if ( event.target.matches( "#button_help" ) ) shuffleHelp();
        if ( event.target.matches( "#button_exit" ) ) location.reload();
    }, false );
}


function playAudio() {
  x.play();
}

let newGame = function() {
    console.log( `%cfunc:newGame`, 'background:darkblue; color: white;' );
    tilesDeck.length = 0;
    p1TilesPositionArrYX.length = 0;
    p2TilesPositionArrYX.length = 0;
    gameTurns = 0;
    currentP1GameScore = 0;
    currentP2GameScore = 0;
    player1Turn = true;
    gameOver = false;
    clearGameBoard();
    document.getElementById( "button_player_mode" ).style.display = "none";
    document.getElementById( "button_exit" ).style.display = "block";
    drawGameBoard( mapSizeXY[ 0 ], mapSizeXY[ 1 ] );
    shuffleTilesDeck();
    if ( mapSize === "large" ) {
        for ( let i = 1; i < 4; i++ ) {
            setTimeout( randomPoop, 300 * i );
        }
    } else setTimeout( randomPoop, 400 );
    if ( twoPlayerMode ) {
        setTimeout( () => document.getElementById( 'output2' ).style.display = "block", 500 );
    }
    displayScores();
    prepareNextTile();
}

let shufflePlayerMode = function() {
    console.log( `%cfunc:shufflePlayerMode `, 'background:darkblue; color: white;' )
    if ( twoPlayerMode ) document.getElementById( 'button_player_mode' ).style.backgroundImage = "url('images/singleplayerbutton.svg')"
    else document.getElementById( 'button_player_mode' ).style.backgroundImage = "url('images/twoplayerbutton.svg')"
    twoPlayerMode = !twoPlayerMode;
    p1gameScore = 0;
    p2gameScore = 0;
}

let shuffleGameSize = function() {
    if ( mapSize === "small" ) {
        mapSize = "large";
        document.getElementById( 'button_gamesize' ).style.backgroundImage = "url('images/largegame.svg')";
        mapSizeXY = [ 7, 7 ];
    } else {
        mapSize = "small";
        document.getElementById( 'button_gamesize' ).style.backgroundImage = "url('images/smallgame.svg')";
        mapSizeXY = [ 5, 5 ];
    }
}

let shuffleHelp = function() {
    if ( document.getElementById( "instruction" ).style.display === "flex" ) document.getElementById( "instruction" ).style.display = "none";
    else document.getElementById( "instruction" ).style.display = "flex";
}

///////////////////////
// Create Game Board //
///////////////////////
let drawGameBoard = function( mapSizeX, mapSizeY ) {
    console.log( `func:drawGameBoard X:${mapSizeX} Y:${mapSizeY}` );
    let sqGridSize = calGridSize( mapSizeX, mapSizeY );
    let map_container1 = document.querySelector( '.map_container1' );
    let rowStringX = `repeat( ${mapSizeX}, ${sqGridSize}${refGrid} )`;
    let rowStringY = `repeat( ${mapSizeY}, ${sqGridSize}${refGrid} )`;
    let loc_xy = "";
    let locId = 0;
    for ( let y = 0; y < mapSizeY; y++ ) {
        let tempArrX = [];
        for ( let x = 0; x < mapSizeX; x++ ) {
            let addDiv = document.createElement( 'div' );
            loc_xy = x + "-" + y;
            addDiv.id = locId;
            locId++;
            addDiv.className = "tiles p1";
            addDiv.dataset.slotId = "empty";
            addDiv.dataset.boardTileId = loc_xy;
            map_container1.appendChild( addDiv );
            tempArrX.push( "empty" );
        }
        p1TilesPositionArrYX.push( tempArrX );
    }
    console.table( p1TilesPositionArrYX );
    map_container1.style.gridTemplateRows = rowStringY;
    map_container1.style.gridTemplateColumns = rowStringX;
    map_container1.style.display = "grid";
    console.log( `X:${rowStringX} Y:${rowStringY}` );

    // draw player 2 gameboard
    if ( twoPlayerMode ) {
        let map_container2 = document.querySelector( '.map_container2' );
        loc_xy = "";
        for ( let y = 0; y < mapSizeY; y++ ) {
            let tempArrX = [];
            for ( let x = 0; x < mapSizeX; x++ ) {
                let addDiv = document.createElement( 'div' );
                loc_xy = x + "-" + y;
                addDiv.id = locId;
                locId++;
                addDiv.className = "tiles p2";
                addDiv.dataset.slotId = "empty";
                addDiv.dataset.boardTileId = loc_xy;
                map_container2.appendChild( addDiv );
                tempArrX.push( "empty" );
            }
            p2TilesPositionArrYX.push( tempArrX );
        }
        //console.table( p2TilesPositionArrYX );
        map_container2.style.gridTemplateRows = rowStringY;
        map_container2.style.gridTemplateColumns = rowStringX;
        map_container2.style.display = "grid";

        let all = document.getElementsByClassName( "msgCloud" );
        let cloudSize = 1;
        if ( mapSizeX >= mapSizeY ) cloudSize = mapSizeY;
        else cloudSize = mapSizeX;

        for ( let i = 0; i < all.length; i++ ) {
            all[ i ].style.width = cloudSize * sqGridSize + refGrid;
            all[ i ].style.height = cloudSize * sqGridSize + refGrid;
            all[ i ].style.top = ( ( mapSizeY - cloudSize ) / 2 * sqGridSize ) + refGrid;
            all[ i ].style.left = ( ( mapSizeX - cloudSize ) / 2 * sqGridSize ) + refGrid;
        }

    }
    let allButton = document.getElementsByClassName( 'button' );
    console.log( "%c all buttons: ", 'background:purple; color:white;' );
    console.log( allButton );
    for ( let i = 0; i < allButton.length; i++ ) {
        allButton[ i ].style.width = sqGridSize + refGrid;
        allButton[ i ].style.height = sqGridSize + refGrid;
    }
    drawInGameControls( sqGridSize + refGrid );
}

let calGridSize = function( mapSizeX, mapSizeY ) {
    console.log( `func:calGridSize map size, X: ${mapSizeX}  Y: ${mapSizeY}` );
    // console.log( `innerWidth => ${window.innerWidth}` );
    // console.log( `innerHeight => ${innerHeight}` );
    // two player mode screen calculation mode
    if ( twoPlayerMode ) mapSizeX = mapSizeX * 2 + 1;

    let sqGridSize = 0;
    let calGridX = Math.floor( window.innerWidth / mapSizeX / 10 ) * 10;
    let calGridY = Math.floor( window.innerHeight / ( mapSizeY + 4 ) / 10 ) * 10; //80 is the height of the title and game controls containers
    if ( calGridX >= calGridY ) {
        sqGridSize = Math.floor( calGridY / window.innerHeight * 100 );
        refGrid = "vh";
    } else {
        sqGridSize = Math.floor( calGridX / window.innerWidth * 100 );
        refGrid = "vw";
    }
    // console.log( `innerWidth calGridX=> ${calGridX}` );
    // console.log( `innerHeight calGridY=> ${calGridY}` );
    // console.log( `sqGridSize=> ${sqGridSize}` );
    return sqGridSize;
}

let drawInGameControls = function( tileSize ) {
    console.log( `func: drawInGameControls` )

    let ingameContainer = document.getElementById( 'ingame_controls_container' );
    let addDivP1t = document.createElement( 'div' );
    addDivP1t.id = "p1_total_score";
    addDivP1t.className = "newtiles";
    addDivP1t.style.width = tileSize;
    addDivP1t.style.height = tileSize;
    addDivP1t.style.backgroundImage = "url('images/total_gamescore.svg')";
    ingameContainer.appendChild( addDivP1t );
    let addDivP1a = document.createElement( 'div' );
    addDivP1a.id = "p1_total_scoreboard";
    addDivP1a.style.fontSize = ( parseInt( tileSize ) / 2.5 ) + refGrid;
    document.getElementById( "p1_total_score" ).appendChild( addDivP1a );
    ingameContainer.style.display = "flex";

    let addDivP1c = document.createElement( 'div' );
    addDivP1c.id = "p1_current_score";
    addDivP1c.className = "newtiles";
    addDivP1c.style.width = tileSize;
    addDivP1c.style.height = tileSize;
    addDivP1c.style.backgroundImage = "url('images/this_gamescore.svg')";
    ingameContainer.appendChild( addDivP1c );
    let addDivP1b = document.createElement( 'div' );
    addDivP1b.id = "p1_current_scoreboard";
    addDivP1b.style.fontSize = ( parseInt( tileSize ) / 2.5 ) + refGrid;
    document.getElementById( "p1_current_score" ).appendChild( addDivP1b );

    let addDiv = document.createElement( 'div' );
    addDiv.id = "nextTile";
    addDiv.className = "newtiles";
    addDiv.style.width = tileSize;
    addDiv.style.height = tileSize;
    ingameContainer.appendChild( addDiv );
    let addDivA = document.createElement( 'div' );
    addDivA.id = "nextTileTxt";
    addDivA.style.fontSize = ( parseInt( tileSize ) / 6 ) + refGrid;
    addDivA.textContent = "NEXT";
    document.getElementById( "nextTile" ).appendChild( addDivA );

    if ( twoPlayerMode ) {
        let ingameContainer = document.getElementById( 'ingame_controls_container' );

        let addDivP2c = document.createElement( 'div' );
        addDivP2c.id = "p2_current_score";
        addDivP2c.className = "newtiles";
        addDivP2c.style.width = tileSize;
        addDivP2c.style.height = tileSize;
        addDivP2c.style.backgroundImage = "url('images/this_gamescore.svg')";
        ingameContainer.appendChild( addDivP2c );
        let addDivP2a = document.createElement( 'div' );
        addDivP2a.id = "p2_current_scoreboard";
        addDivP2a.style.fontSize = ( parseInt( tileSize ) / 2.5 ) + refGrid;
        document.getElementById( "p2_current_score" ).appendChild( addDivP2a );

        let addDivP2t = document.createElement( 'div' );
        addDivP2t.id = "p2_total_score";
        addDivP2t.className = "newtiles";
        addDivP2t.style.width = tileSize;
        addDivP2t.style.height = tileSize;
        addDivP2t.style.backgroundImage = "url('images/total_gamescore.svg')";
        ingameContainer.appendChild( addDivP2t );
        let addDivP2b = document.createElement( 'div' );
        addDivP2b.id = "p2_total_scoreboard";
        addDivP2b.style.fontSize = ( parseInt( tileSize ) / 2.5 ) + refGrid;
        document.getElementById( "p2_total_score" ).appendChild( addDivP2b );
        ingameContainer.style.display = "flex";
    } //end of player 2 settings

}

let clearGameBoard = function() {
    console.log( `func:clearing gameboard` );
    let mapContainer1 = document.querySelector( '.map_container1' );
    while ( mapContainer1.hasChildNodes() ) {
        mapContainer1.removeChild( mapContainer1.lastChild );
    }
    let mapContainer2 = document.querySelector( '.map_container2' );
    while ( mapContainer2.hasChildNodes() ) {
        mapContainer2.removeChild( mapContainer2.lastChild );
    }
    let inGameControls = document.querySelector( '.ingame_controls_container' );
    while ( inGameControls.hasChildNodes() ) {
        inGameControls.removeChild( inGameControls.lastChild );
    }
    document.getElementById( 'output1' ).style.display = "none";
    document.getElementById( 'output2' ).style.display = "none";

    mapContainer1.style.display = "none";
    mapContainer2.style.display = "none";
}

let shuffleTilesDeck = function() {
    console.log( `func:shuffleTilesDeck` );
    for ( let i = 0; i < tilesDB.length; i++ ) {
        for ( let j = 0; j < tilesDB[ i ][ "qty" ]; j++ ) {
            tilesDeck.push( tilesDB[ i ][ "tid" ] );
        }
    }
    for ( let i = 0; i < 200; i++ ) {
        let halfDeckSize = Math.floor( tilesDeck.length / 2 );
        let tempIndex1 = Math.floor( Math.random() * halfDeckSize );
        let tempIndex2 = halfDeckSize + Math.floor( Math.random() * halfDeckSize );
        let tempIndex3 = Math.floor( Math.random() * tilesDeck.length );
        let tempIndex4 = halfDeckSize + Math.floor( Math.random() * halfDeckSize );
        let tempIndex5 = Math.floor( Math.random() * tilesDeck.length );
        let tempString = tilesDeck[ tempIndex1 ];
        tilesDeck[ tempIndex1 ] = tilesDeck[ tempIndex2 ];
        tilesDeck[ tempIndex2 ] = tilesDeck[ tempIndex3 ];
        tilesDeck[ tempIndex3 ] = tilesDeck[ tempIndex4 ];
        tilesDeck[ tempIndex4 ] = tilesDeck[ tempIndex5 ];
        tilesDeck[ tempIndex5 ] = tempString;
    }
    console.table( tilesDeck );
}

//////////////////////////
// In Game Manipulation //
//////////////////////////
let randomPoop = function() {
    let poopQty = 1;
    let newPoop = 0;
    let randP1Poop = 0;
    let randP2Poop = 0;
    while ( newPoop < poopQty ) {
        do {
            randP1Poop = Math.floor( Math.random() * mapSizeXY[ 0 ] * mapSizeXY[ 1 ] );
            console.table( "random poop => " + randP1Poop );
        } while ( !checkPosition( randP1Poop ) );

        let transferPoopTile = document.getElementById( randP1Poop );
        transferPoopTile.style.backgroundImage = `url("images/tile-poop.svg")`;
        transferPoopTile.dataset.slotId = "0-0";
        console.log( "poop transferred!" );
        recordPosition( randP1Poop, "0-0" );

        if ( twoPlayerMode ) {
            do {
                randP2Poop = ( mapSizeXY[ 0 ] * mapSizeXY[ 1 ] ) + Math.floor( Math.random() * mapSizeXY[ 0 ] * mapSizeXY[ 1 ] );
                console.table( "random poop => " + randP2Poop );
            } while ( !checkPosition( randP2Poop ) );

            let transferPoopTile = document.getElementById( randP2Poop );
            transferPoopTile.style.backgroundImage = `url("images/tile-poop.svg")`;
            transferPoopTile.dataset.slotId = "0-0";
            console.log( "poop transferred!" );
            recordPosition( randP1Poop, "0-0" );
        }
        newPoop++;
        gameTurns++;
    }
}

let prepareNextTile = function() {
    console.log( `func:prepareTile` );
    let nextTile = document.getElementById( "nextTile" );
    let tileStr = tilesDeck[ tilesDeck.length - 1 ]
    nextTile.style.backgroundImage = `url("images/tile${tileStr}.svg")`;
    nextTile.dataset.slotId = tileStr;
    tilesDeck.pop();
    // console.log( `tiles left on deck : ${tilesDeck.length}` );
}

let checkPosition = function( idPos ) {
    console.log( `func: checkPosition ` );
    let checkTile = document.getElementById( idPos );
    if ( checkTile.dataset.slotId === "empty" ) {
        return true;
    } else {
        return false;
    }
}

let transferTile = function( event ) {
    console.log( `func:transferTile >>>>>>>>>> ` );
    let nextTile = document.getElementById( "nextTile" );
    let transferNextTile = document.getElementById( event.target.id );
    recordPosition( event.target.id, nextTile.dataset.slotId );
    transferNextTile.style.backgroundImage = nextTile.style.backgroundImage;
    transferNextTile.dataset.slotId = nextTile.dataset.slotId;
    console.log( "transferred!" );
}

let recordPosition = function( evtId, tileId ) {
    console.log( `func:recordPosition, player 1 turn:${player1Turn}` );
    console.log( tileId );
    let loc = document.getElementById( evtId ).dataset.boardTileId;
    let posXY = tileId.split( '-' );
    let locXY = loc.split( '-' );
    console.log( posXY );
    if ( player1Turn ) {
        p1TilesPositionArrYX[ locXY[ 1 ] ][ locXY[ 0 ] ] = tileId.split( '-' );
        console.log( `%c p1TilesPositionArrYX`, 'background: yellow; color:black;' );
        console.table( p1TilesPositionArrYX );
    } else {
        p2TilesPositionArrYX[ locXY[ 1 ] ][ locXY[ 0 ] ] = tileId.split( '-' );
        console.log( `%c p2TilesPositionArrYX`, 'background: yellow; color:black;' );
        console.table( p2TilesPositionArrYX );
    }
}

let highLighter = function( evtId ) {
    let targetLoc = document.getElementById( evtId ).dataset.boardTileId.split( '-' );
    let subsetArr = [];
    let rowNum = targetLoc[ 0 ];
    let colNum = targetLoc[ 1 ];

    console.table( p1TilesPositionArrYX[ targetLoc[ 1 ] ][ targetLoc[ 0 ] ] );
    for ( let x = 0; x < p1TilesPositionArrYX[ 0 ].length; x++ ) {
        subsetArr.push( parseInt( p1TilesPositionArrYX[ targetLoc[ 1 ] ][ x ][ 0 ] ) );
    }
    console.log( `%clet's go!`, 'background:purple; color:white;' )
    let tempX = countSubsetScore( subsetArr, "row" );
    console.log("tempX: " +tempX);
    if ( tempX > 0 ) {
        console.log( tempX / mapSizeXY[ 0 ] );
        playAudio();
        let rowIdentifier = tempX / mapSizeXY[ 0 ];
        console.log( "map : " + mapSizeXY[ 0 ] );
        console.log( "row identifier = " + rowIdentifier );
        for ( let x = 0; x < mapSizeXY[ 0 ]; x++ ) {
            let searchStr = `[data-board-tile-id="${x}-${colNum}"]`;
            let createDiv = document.createElement( 'div' );
            createDiv.id = "alert" + x;
            createDiv.className = "alert";
            createDiv.style.backgroundImage = `url("images/color${rowIdentifier}.svg")`;
            setTimeout( () => document.querySelector( searchStr ).appendChild( createDiv ), 350 * x );
        }
    }
    subsetArr.length = 0;
    for ( let y = 0; y < p1TilesPositionArrYX.length; y++ ) {
        subsetArr.push( parseInt( p1TilesPositionArrYX[ y ][ targetLoc[ 0 ] ][ 1 ] ) );
    }
    console.log( `%clet's go!`, 'background:purple; color:white;' )

    let tempY = countSubsetScore( subsetArr, "col" );
    console.log("tempY: " +tempY);
    if ( tempY > 0 ) {
        console.log( tempY /mapSizeXY[1] );
        playAudio();
        let colIdentifier = tempY / mapSizeXY[ 1 ];
        console.log( "col identifier = " + colIdentifier );
        for ( let y = 0; y < mapSizeXY[ 1 ]; y++ ) {
            let searchStr = `[data-board-tile-id="${rowNum}-${y}"]`;
            let createDiv = document.createElement( 'div' );
            createDiv.id = "alert" + y;
            createDiv.className = "alert";
            createDiv.style.backgroundImage = `url("images/color${colIdentifier}.svg")`;
            setTimeout( () => document.querySelector( searchStr ).appendChild( createDiv ), 350 * y );
        }
    }
    currentP1GameScore += tempX + tempY;
    displayScores();
}

let checkEndOfGame = function() {
    if ( gameTurns < mapSizeXY[ 0 ] * mapSizeXY[ 1 ] ) {
        if ( !twoPlayerMode ) prepareNextTile();
        else if ( twoPlayerMode && !player1Turn ) prepareNextTile();
    } else {
        console.log( 'might have ended!' );
        nextTile.style.backgroundImage = "";
        nextTile.dataset.slotId = "empty";
        calculateScores();
        //gameRounds++;
        displayScores();
    }
}

let calculateScores = function() {
    console.log( `%cfunc:calculateScores`, "background: black; color: yellow;" );
    console.log( p1TilesPositionArrYX );
    console.log( p2TilesPositionArrYX );
    let score = 0;
    let subsetArr = [];
    let tempArray = [ ...p1TilesPositionArrYX ];
    let player = 1;
    console.log( 'tempArray' );
    console.table( tempArray );
    if ( twoPlayerMode ) player = 2;
    for ( let p = 1; p <= player; p++ ) {
        score = 0;
        if ( p === 2 ) {
            console.log( `%c CALCULATING PLAYER TWO SCORES`, 'background: RED;' )
        }
        console.log( 'tempArray again' );
        console.table( tempArray );

        for ( let y = 0; y < tempArray.length; y++ ) {
            subsetArr.length = 0;
            console.log( 'tempArray' );
            console.table( tempArray );
            for ( let x = 0; x < tempArray[ y ].length; x++ ) {
                console.log( ` parsing integer : ${parseInt( tempArray[ y ][ x ][ 0 ])} ` );
                subsetArr.push( parseInt( tempArray[ y ][ x ][ 0 ] ) );
            }
            console.table( subsetArr );
            let tempScore = countSubsetScore( subsetArr, "row" );

            console.log( `Temp SCORING@calculateScore row${y} = ${tempScore}` );
            score += tempScore;
            console.log( `Total SCORING@calculateScore row${y} = ${score}` );
        }
        console.log( 'in between loops tempArray' );
        console.table( tempArray );
        for ( let x = 0; x < tempArray[ 0 ].length; x++ ) {
            subsetArr.length = 0;
            for ( let y = 0; y < tempArray.length; y++ ) {
                subsetArr.push( parseInt( tempArray[ y ][ x ][ 1 ] ) );
            }
            console.table( subsetArr );
            let tempScore = countSubsetScore( subsetArr, "col" );

            console.log( `Temp SCORING@calculateScore col${x} = ${tempScore}` );
            score += tempScore;
            console.log( `Total SCORING@calculateScore col${x} = ${score}` );
        }

        if ( p === 1 ) {
            currentP1GameScore = score;
            p1gameScore += currentP1GameScore;
        } else {
            currentP2GameScore = score;
            p2gameScore += currentP2GameScore;
        }

        if ( twoPlayerMode ) tempArray = [ ...p2TilesPositionArrYX ];

    }
    gameOver = true;
}

let countSubsetScore = function( subsetArr, colRow ) { //colRow = [1,3,5] or [2,4,6]
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    let subsetScore = 0;
    let mapLength = 0;
    let colRowArr = [];
    if ( colRow === "row" ) {
        colRowArr = [ 1, 3, 5 ];
        mapLength = mapSizeXY[ 0 ];
    } else {
        colRowArr = [ 2, 4, 6 ];
        mapLength = mapSizeXY[ 1 ];
    }
    console.log( `countSubsetScore: mapLength:${mapLength}, colRowArr:${colRowArr}` );

    for ( let i = 0; i < subsetArr.length; i++ ) {
        if ( subsetArr[ i ] === colRowArr[ 0 ] ) {
            count1++;
        } else if ( subsetArr[ i ] === colRowArr[ 1 ] ) {
            count2++;
        } else if ( subsetArr[ i ] === colRowArr[ 2 ] ) {
            count3++;
        }
    }
    console.log( `${count1} ${count2} ${count3}` );
    if ( ( count1 > 0 && count2 > 0 ) || ( count1 > 0 && count3 > 0 ) || ( count2 > 0 && count3 > 0 ) ) {
        return 0;
    } else {
        if ( count1 === mapLength ) {
            subsetScore += colRowArr[ 0 ] * count1;
            console.log( `SCORE C1===> ${subsetScore}` );
            return subsetScore;
        } else if ( count2 === mapLength ) {
            subsetScore += colRowArr[ 1 ] * count2;
            console.log( `SCORE C2===> ${subsetScore}` );
            return subsetScore;
        } else if ( count3 === mapLength ) {
            subsetScore += colRowArr[ 2 ] * count3;
            console.log( `SCORE C3===> ${subsetScore}` );
            return subsetScore;
        } else {
            return 0;
        }
    }
}

//////////////////////
// Display Functions//
//////////////////////

//NOT IN USED
let displayOutput = function( message = "" ) {
    console.log( `func:displayOutput msg="${message}"` );
    let output = document.querySelector( '#output' );
    output.innerHTML = message;
};

let displayScores = function() {
    document.getElementById( 'p1_total_scoreboard' ).innerText = p1gameScore;
    document.getElementById( 'p1_current_scoreboard' ).innerText = currentP1GameScore;
    if ( twoPlayerMode ) {
        document.getElementById( 'p2_total_scoreboard' ).innerText = p2gameScore;
        document.getElementById( 'p2_current_scoreboard' ).innerText = currentP2GameScore;
    }
};
