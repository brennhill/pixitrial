// SLOT MACHINE:
/**
 * Algorithm:
 * 1. hit button
 * 2. calculate 3 random sprites
 * 3. display sprites in boxes.
 * 4. if sprite1===sprite2===sprite3 display reward.
 *
 */

function runGame() {
    console.log("Loading pixi");
    let type = "WebGL"
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas"
    }
    PIXI.utils.sayHello(type)
//Create a Pixi Application


    const app = new PIXI.Application({width: 500, height: 500});
    // Install EventSystem, if not already
    //   (PixiJS 6 doesn't add it by default)
    // if (!('events' in app.renderer)) {
    //     app.renderer.addSystem(PIXI.EventSystem, 'events');
    // }
    document.body.appendChild(app.view);

    // Hold results so we can clear them later.
    const gameState = {
        displayedIcons: [],
        message:null
    }

    // For rendering text
    const messageStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    });

// create a new Sprite from an image path, with 2 textures for up/down.
    const slotmachineUp = PIXI.Texture.from('/images/slotmachine.png');
    const slotmachineDown =  PIXI.Texture.from('/images/slotmachine-down.png');

    const slotmachine = new PIXI.Sprite(slotmachineUp);

// center the sprite's anchor point
    slotmachine.anchor.set(0.5);

// move the sprite to the center of the screen
    slotmachine.x = app.screen.width / 2;
    slotmachine.y = app.screen.height / 2;
    slotmachine.width= app.screen.width * 0.8;
    slotmachine.height= app.screen.height * 0.8;

    // Make slot machine interactive
    slotmachine.interactive = true;
    app.stage.addChild(slotmachine);

// Make stage interactive so you can click on it too
    app.stage.interactive = true;
    app.stage.hitArea = app.renderer.screen;

    let generating_slots = false;
    const clickLimiter = function() {
        if(!generating_slots) {
            setTimeout(function () {
                generating_slots = false;
            }, 1000)
        }
        generating_slots = true;
    }
    const icons = ['door', 'treasure', 'blob', 'explorer', 'cat'];

    const getSlotResults = () => {
        const results = [];
        for(let i=0; i<3; i++) {
            results.push(icons[Math.floor(Math.random() * icons.length)]);
        }
        return results;
    }



    clearResults = () => {
        if(!gameState.displayedIcons) {
            gameState.displayedIcons=[];
        } else {
            gameState.displayedIcons.forEach(val => {
                app.stage.removeChild(val)
            })
        }
        if(gameState.message) {
            app.stage.removeChild(gameState.message);
        }
    }

    setSlotDisplay = (slot1, slot2, slot3) => {
        gameState.displayedIcons = [slot1, slot2, slot3]
        slot1.anchor.set(0.5);
        slot1.x = app.screen.width * 0.3;
        slot1.y = app.screen.height / 2;
        slot2.anchor.set(0.5);
        slot2.x = app.screen.width * 0.48;
        slot2.y = app.screen.height / 2;
        slot3.anchor.set(0.5);
        slot3.x = app.screen.width * 0.66;
        slot3.y = app.screen.height / 2;
        app.stage.addChild(slot1);
        app.stage.addChild(slot2);
        app.stage.addChild(slot3);
    }

    getSprite = (icon) => {
        const sprite=PIXI.Sprite.from('/images/'+icon+'.png');
        sprite.width=45;
        sprite.height=45;
        return sprite;
    }
    displayMessage = (icons) => {
        const iconset = new Set(icons);
        const messages = [
            "You Won!",
            "2 out of 3, So close!",
            "Drat, nothing."
        ]
        const message = messages[iconset.size-1]; // if size is 1, that means all icons are the same, etc.
        const richText = new PIXI.Text(message, messageStyle);
        richText.anchor.set(0.5)
        richText.x = app.stage.width / 2
        richText.y = 50;
        gameState.message = richText;
        app.stage.addChild(richText);
    }

    displayResults = (icons) => {
        clearResults();
        const slot1 = getSprite(icons[0])
        const slot2 = getSprite(icons[1])
        const slot3 = getSprite(icons[2]);
        setSlotDisplay(slot1, slot2, slot3);
        displayMessage(icons);
    }

    getRandomSprite = (sprites) => {
        return  sprites[Math.floor(Math.random()*sprites.length)]
    }

    createScrollingEffect = () => {
        const textures = icons.map(icon=> {
            const texture = getSprite(icon);
            texture.blendMode = PIXI.BLEND_MODES.ADD;
            texture.alpha=0.8
            return texture;
        })
        const interval = setInterval(()=>{
            clearResults()
            const sprite1 = getRandomSprite(textures)
            const sprite2 = getRandomSprite(textures)
            const sprite3 = getRandomSprite(textures)
            setSlotDisplay(sprite1, sprite2, sprite3);
        },50)
        return interval
    }

    displayAnimation = () =>{

    }

    calculateReward = (results) => {
        if(results[0]==results[1]===results[2]) {
            //emit reward;
        }
    }

    startAnimation = (duration, callback) => {
        const animating = createScrollingEffect();
        setTimeout(()=>{
            clearInterval(animating);
            callback();
        }, 2000);
    }

    let currentResults =[];
// Listen for clicks
    app.stage.on('pointerdown', (e) => {
        console.log(e);
        if (e.target === slotmachine) {
            // For click events, the detail specifies the number of clicks
            // done in a 200ms interval
            const clicks = e.detail;
            slotmachine.texture = slotmachineDown;
            setTimeout(()=>{
                slotmachine.texture = slotmachineUp;
            }, 750)
            //
            if(!generating_slots) {
                clearResults();
                const results = getSlotResults()
                startAnimation(3000, ()=>{
                    displayResults(results)
                })
            }
            clickLimiter();
        } else {
            // Other stuff
        }
    });

// // Listen for animate update
//     app.ticker.add((delta) => {
//         // just for fun, let's rotate mr rabbit a little
//         // delta is 1 if running at 100% performance
//         // creates frame-independent transformation
//         //slotmachine.rotation += 0.1 * delta;
//     });
}

runGame();