const canvas = document.querySelector('canvas')
const viewport = canvas.getContext('2d')

const controller = document.querySelector('.controller')




const imgMap = new Image()
const imgMapUpLauer = new Image()
const imgCharacterRunUp = new Image()
const imgCharacterRunDown = new Image()
const imgCharacterRunLeft = new Image()
const imgCharacterRunRight = new Image()


canvas.width = 1280;
canvas.height = 720;


imgMap.src = 'sources/img/world/map.png'
imgMapUpLauer.src = 'sources/img/world/mapUpLauer.png'
imgCharacterRunUp.src = 'sources/img/character/me/Character_Run_Up.png'
imgCharacterRunDown.src = 'sources/img/character/me/Character_Run_Down.png'
imgCharacterRunLeft.src = 'sources/img/character/me/Character_Run_Left.png'
imgCharacterRunRight.src = 'sources/img/character/me/Character_Run_Right.png'

class Sprite {
    constructor({ position, velocity, img, frames = { max: 1 }, sprites }) {
        this.position = position
        this.img = img
        this.frames = { ...frames, val: 0, elapsed: 0 }

        this.img.onload = () => {
            this.width = this.img.width / this.frames.max
            this.height = this.img.height
        }
        this.moving = false
        this.sprites = sprites
    }

    draw() {
        viewport.drawImage(
            this.img,//image: CanvasImageSource
            this.width * this.frames.val,// sx: number,
            0,// sy: number,
            this.width,// sw: number,
            this.img.height,// sh: number,
            this.position.x,// dx: number,
            this.position.y,// dy: number,
            this.width,// dw: number,
            this.img.height// dh: number
        )
        if (!this.moving) return
        if (this.frames.max > 1) this.frames.elapsed++
        if (this.frames.elapsed % 5 === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }


    }
}


const offset = {
    x: -2050,
    y: -1600
}

const worldMap = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },


    img: imgMap
})

const worldMapUpLauer = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },

    img: imgMapUpLauer
})

const player = new Sprite({
    position: {
        x: canvas.width / 2,
        y: canvas.height / 2,
    },
    frames: {
        max: 6
    },
    sprites: {
        up: imgCharacterRunUp,
        down: imgCharacterRunDown,
        left: imgCharacterRunLeft,
        right: imgCharacterRunRight
    },

    img: imgCharacterRunDown
})

///////////////////////////////////////////////////////////////////////////
// Collision map /////////////////////////////////////////////////////////

class Bound {
    static width = 64
    static height = 64
    constructor({ position }) {
        this.position = position
    }

    draw() {
        viewport.fillStyle = 'rgba(255,0,0,0)'
        viewport.fillRect(this.position.x, this.position.y, Bound.width, Bound.height)
    }
}

const collisionMap = []
for (let i = 0; i < collision.length; i += 90) {
    collisionMap.push(collision.slice(i, 90 + i))
}

const boundes = []
collisionMap.forEach((row, y) => row.forEach((item, x) => {
    if (item !== 0)
        boundes.push(new Bound({
            position: {
                x: x * Bound.width + offset.x,
                y: y * Bound.height + offset.y
            }
        }))
}))

const testBound = new Bound({
    position: {
        x: 400,
        y: 400
    }
})

function itemCollision({ item1, item2 }) {
    return (item1.position.x + 10 >= item2.position.x - Bound.width / 2 &&
        item1.position.x - 10 <= item2.position.x + Bound.width / 2 &&
        item1.position.y + 30 <= item2.position.y + Bound.height / 2 &&
        item1.position.y + 30 >= item2.position.y - Bound.height / 2)
}

// end collision map /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////
// Control movies /////////////////////////////////////////////////////////

const moweKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
}

const moveObj = [worldMap, testBound, worldMapUpLauer, ...boundes]
function breakMoveByCollision() {

}
function moveOnWorld() {
    const speed = 5
    let moving = true
    player.moving = false
    if (moweKeys.up) {
        player.img = player.sprites.up
        player.moving = true
        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (itemCollision({
                item1: player,
                item2: {
                    ...bound, position: {
                        x: bound.position.x,
                        y: bound.position.y + speed,
                    }
                }
            })) {
                // console.log('collision')
                moving = false
                break
            }
        }
        if (moving) moveObj.forEach(obj => obj.position.y += speed)
    }

    if (moweKeys.down) {
        player.img = player.sprites.down
        player.moving = true
        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (itemCollision({
                item1: player,
                item2: {
                    ...bound, position: {
                        x: bound.position.x,
                        y: bound.position.y - speed,
                    }
                }
            })) {
                // console.log('collision')
                moving = false
                break
            }
        }
        if (moving) moveObj.forEach(obj => obj.position.y -= speed)
    }

    if (moweKeys.left) {
        player.img = player.sprites.left
        player.moving = true
        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (itemCollision({
                item1: player,
                item2: {
                    ...bound, position: {
                        x: bound.position.x + speed,
                        y: bound.position.y,
                    }
                }
            })) {
                // console.log('collision')
                moving = false
                break
            }
        }
        if (moving) moveObj.forEach(obj => obj.position.x += speed)
    }

    if (moweKeys.right) {
        player.img = player.sprites.right
        player.moving = true
        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (itemCollision({
                item1: player,
                item2: {
                    ...bound, position: {
                        x: bound.position.x - speed,
                        y: bound.position.y,
                    }
                }
            })) {
                // console.log('collision')
                moving = false
                break
            }
        }
        if (moving) moveObj.forEach(obj => obj.position.x -= speed)
    }
}

const supportsTouch = ('ontouchstart' in document.documentElement)

if (!supportsTouch) controller.style.display = 'none'

controller.addEventListener('touchstart', (e) => {
    e.preventDefault()
    e.target.closest('.up') ? moweKeys.up = true : ''
    e.target.closest('.down') ? moweKeys.down = true : ''
    e.target.closest('.left') ? moweKeys.left = true : ''
    e.target.closest('.right') ? moweKeys.right = true : ''
})
controller.addEventListener('touchend', (e) => {
    e.preventDefault()
    e.target.closest('.up') ? moweKeys.up = false : ''
    e.target.closest('.down') ? moweKeys.down = false : ''
    e.target.closest('.left') ? moweKeys.left = false : ''
    e.target.closest('.right') ? moweKeys.right = false : ''
})

window.addEventListener('keydown', (e) => {
    e.preventDefault()
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            moweKeys.up = true
            break
        case 'KeyS':
        case 'ArrowDown':
            moweKeys.down = true
            break
        case 'KeyA':
        case 'ArrowLeft':
            moweKeys.left = true
            break
        case 'KeyD':
        case 'ArrowRight':
            moweKeys.right = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    e.preventDefault()
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            moweKeys.up = false
            break
        case 'KeyS':
        case 'ArrowDown':
            moweKeys.down = false
            break
        case 'KeyA':
        case 'ArrowLeft':
            moweKeys.left = false
            break
        case 'KeyD':
        case 'ArrowRight':
            moweKeys.right = false
            break
    }
})

// end control movies /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function animate() {
    window.requestAnimationFrame(animate)

    worldMap.draw()
    // testBound.draw()
    player.draw()
    worldMapUpLauer.draw()

    moveOnWorld()

    boundes.forEach(bound => {
        bound.draw()
    })
}
animate()