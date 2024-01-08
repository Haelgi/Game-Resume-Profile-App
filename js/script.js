const canvas = document.querySelector('canvas')
const viewport = canvas.getContext('2d')

const controller = document.querySelector('.controller')

const imgMap = new Image()
const imgMapUpLauer = new Image()
const imgCharacterRunUp = new Image()
const imgCharacterRunDown = new Image()
const imgCharacterRunLeft = new Image()
const imgCharacterRunRight = new Image()

const imgUiDialogPlate = new Image()


canvas.width = 1280;
canvas.height = 720;


imgMap.src = 'sources/img/world/map.png'
imgMapUpLauer.src = 'sources/img/world/mapUpLauer.png'

imgCharacterRunUp.src = 'sources/img/character/me/Character_Run_Up.png'
imgCharacterRunDown.src = 'sources/img/character/me/Character_Run_Down.png'
imgCharacterRunLeft.src = 'sources/img/character/me/Character_Run_Left.png'
imgCharacterRunRight.src = 'sources/img/character/me/Character_Run_Right.png'

imgUiDialogPlate.src = 'sources/img/ui/signs/dialog_plate.png'




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

const uiDialogPlate = new Sprite({
    position: {
        x: (canvas.width / 2) - 310,
        y: (canvas.height / 2) - 330,
    },

    img: imgUiDialogPlate
})

///////////////////////////////////////////////////////////////////////////
// Collision map /////////////////////////////////////////////////////////

class Bound {
    static width = 16 * 4
    static height = 16 * 4
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

const eventHsMap = []
for (let i = 0; i < eventHs.length; i += 90) {
    eventHsMap.push(eventHs.slice(i, 90 + i))
}

const eventSsMap = []
for (let i = 0; i < eventSs.length; i += 90) {
    eventSsMap.push(eventSs.slice(i, 90 + i))
}

const eventPlMap = []
for (let i = 0; i < eventPl.length; i += 90) {
    eventPlMap.push(eventPl.slice(i, 90 + i))
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

const eventHsBoundes = []
eventHsMap.forEach((row, y) => row.forEach((item, x) => {
    if (item !== 0)
        eventHsBoundes.push(new Bound({
            position: {
                x: x * Bound.width + offset.x,
                y: y * Bound.height + offset.y
            }
        }))
}))

const eventSsBoundes = []
eventSsMap.forEach((row, y) => row.forEach((item, x) => {
    if (item !== 0)
        eventSsBoundes.push(new Bound({
            position: {
                x: x * Bound.width + offset.x,
                y: y * Bound.height + offset.y
            }
        }))
}))

const eventPlBoundes = []
eventPlMap.forEach((row, y) => row.forEach((item, x) => {
    if (item !== 0)
        eventPlBoundes.push(new Bound({
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

function worldCollision({ item1, item2 }) {
    return (item1.position.x + 10 >= item2.position.x - Bound.width / 2 &&
        item1.position.x - 10 <= item2.position.x + Bound.width / 2 &&
        item1.position.y + 30 <= item2.position.y + Bound.height / 2 &&
        item1.position.y + 30 >= item2.position.y - Bound.height / 2)
}

function itemCollision({ item1, item2 }) {
    return (item1.position.x + 32 >= item2.position.x - Bound.width / 2 &&
        item1.position.x - 32 <= item2.position.x + Bound.width / 2 &&
        item1.position.y + 30 <= item2.position.y + Bound.height / 2 &&
        item1.position.y + 30 >= item2.position.y - Bound.height / 2)
}

// end collision map /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////
// Control movies /////////////////////////////////////////////////////////

const moveKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
}

const eventKeys = {
    eventHsSign: false,
    eventSsSign: false,
    eventPlSign: false
}

const moveObj = [worldMap, testBound, worldMapUpLauer, ...boundes, ...eventHsBoundes, ...eventSsBoundes, ...eventPlBoundes]

function eventSign() {

    for (let i = 0; i < eventHsBoundes.length; i++) {
        const bound = eventHsBoundes[i];
        if (itemCollision({
            item1: player,
            item2: {
                ...bound, position: {
                    x: bound.position.x,
                    y: bound.position.y,
                }
            }
        })) {
            eventKeys.eventHsSign = true
        } else {
            eventKeys.eventHsSign = false
        }
    }

    for (let i = 0; i < eventSsBoundes.length; i++) {
        const bound = eventSsBoundes[i];
        if (itemCollision({
            item1: player,
            item2: {
                ...bound, position: {
                    x: bound.position.x,
                    y: bound.position.y,
                }
            }
        })) {
            eventKeys.eventSsSign = true
        } else {
            eventKeys.eventSsSign = false
        }
    }

    for (let i = 0; i < eventPlBoundes.length; i++) {
        const bound = eventPlBoundes[i];
        if (itemCollision({
            item1: player,
            item2: {
                ...bound, position: {
                    x: bound.position.x,
                    y: bound.position.y,
                }
            }
        })) {
            eventKeys.eventPlSign = true
        } else {
            eventKeys.eventPlSign = false
        }
    }

    if (eventKeys.eventHsSign) {
        uiDialogPlate.draw()
    }

    if (eventKeys.eventSsSign) {
        uiDialogPlate.draw()
    }

    if (eventKeys.eventPlSign) {
        uiDialogPlate.draw()
    }
}

function moveOnWorld() {
    const speed = 5
    let moving = true
    player.moving = false

    if (moveKeys.up) {
        player.img = player.sprites.up
        player.moving = true

        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (worldCollision({
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

    if (moveKeys.down) {
        player.img = player.sprites.down
        player.moving = true

        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (worldCollision({
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

    if (moveKeys.left) {
        player.img = player.sprites.left
        player.moving = true

        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (worldCollision({
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

    if (moveKeys.right) {
        player.img = player.sprites.right
        player.moving = true

        for (let i = 0; i < boundes.length; i++) {
            const bound = boundes[i];
            if (worldCollision({
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
    e.target.closest('.up') ? moveKeys.up = true : ''
    e.target.closest('.down') ? moveKeys.down = true : ''
    e.target.closest('.left') ? moveKeys.left = true : ''
    e.target.closest('.right') ? moveKeys.right = true : ''
})
controller.addEventListener('touchend', (e) => {
    e.preventDefault()
    e.target.closest('.up') ? moveKeys.up = false : ''
    e.target.closest('.down') ? moveKeys.down = false : ''
    e.target.closest('.left') ? moveKeys.left = false : ''
    e.target.closest('.right') ? moveKeys.right = false : ''
})

window.addEventListener('keydown', (e) => {
    e.preventDefault()
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveKeys.up = true
            break
        case 'KeyS':
        case 'ArrowDown':
            moveKeys.down = true
            break
        case 'KeyA':
        case 'ArrowLeft':
            moveKeys.left = true
            break
        case 'KeyD':
        case 'ArrowRight':
            moveKeys.right = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    e.preventDefault()
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            moveKeys.up = false
            break
        case 'KeyS':
        case 'ArrowDown':
            moveKeys.down = false
            break
        case 'KeyA':
        case 'ArrowLeft':
            moveKeys.left = false
            break
        case 'KeyD':
        case 'ArrowRight':
            moveKeys.right = false
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

    boundes.forEach(bound => {
        bound.draw()
    })

    eventHsBoundes.forEach(bound => {
        bound.draw()
    })

    eventSsBoundes.forEach(bound => {
        bound.draw()
    })

    eventPlBoundes.forEach(bound => {
        bound.draw()
    })

    moveOnWorld()

    eventSign()
}
animate()
