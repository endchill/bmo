export const WIDTH            = body.clientWidth
export const HEIGHT           = body.clientHeight
export const FPS              = 60
const POINTS_SIZE      = 6 * (WIDTH + HEIGHT) / 1600
const LINES_THICKNESS  = 4 * (WIDTH + HEIGHT) / 1600
const POINTS_COLOR     = "#ffbf00"
const LINES_COLOR      = "#ffffff"
const SURFACES_COLOR   = "#000000"
const FOREGROUND_COLOR = "#ffffff"
const BACKGROUND_COLOR = "#1f1f1f"

const ctx = canvas.getContext("2d")

if (WIDTH < HEIGHT) {
    canvas.width  = WIDTH
    canvas.height = WIDTH
} else {
    canvas.width  = HEIGHT
    canvas.height = HEIGHT
}

export const cube = {
    vertices: [
        {x:  0.25, y:  0.25, z: 0.25},
        {x: -0.25, y:  0.25, z: 0.25},
        {x: -0.25, y: -0.25, z: 0.25},
        {x:  0.25, y: -0.25, z: 0.25},
        {x:  0.25, y:  0.25, z: -0.25},
        {x: -0.25, y:  0.25, z: -0.25},
        {x: -0.25, y: -0.25, z: -0.25},
        {x:  0.25, y: -0.25, z: -0.25},
    ],
    edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
    ],
    surfaces: [
        [0, 1, 2, 3],
        [0, 1, 5, 4],
        [0, 3, 7, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [4, 5, 6, 7],
    ]
}

export const shape = {
    vertices: [
        {x:  0.25, y:  0.25, z: 0.25},
        {x: -0.25, y:  0.25, z: 0.25},
        {x: -0.25, y: -0.25, z: 0.25},
        {x:  0.25, y: -0.25, z: 0.25},
        {x:  0.25, y:  0.25, z: -0.25},
        {x: -0.25, y:  0.25, z: -0.25},
        {x: -0.25, y: -0.25, z: -0.25},
        {x:  0.25, y: -0.25, z: -0.25},
        {x:  0.00, y:  0.50, z: 0.00},
    ],
    edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],

        [8, 0],
        [8, 1],
        [8, 4],
        [8, 5],
    ],
    surfaces: [
        [0, 1, 2, 3],
        [0, 3, 7, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [4, 5, 6, 7],

        [8, 0, 1],
        [8, 1, 5],
        [8, 5, 4],
        [8, 4, 0],
    ]
}

export function clear() {
    ctx.fillStyle = BACKGROUND_COLOR
    ctx.fillRect(0,0, canvas.width, canvas.height)
}

function screen(point) {
    const tmp   = WIDTH < HEIGHT ? WIDTH : HEIGHT

    // fit
    return {
        x:     ((point.x + 1) / 2) * tmp,
        y: (1 - (point.y + 1) / 2) * tmp
    }

    // stretch
    // return {
    //     x:     ((p.x + 1) / 2) * WIDTH,
    //     y: (1 - (p.y + 1) / 2) * HEIGHT
    // }
}

function project({x, y, z}) {
    return {
        x: x / z,
        y: y / z
    }
}

function drawPoint(point, size = POINTS_SIZE, color = POINTS_COLOR) {
    ctx.fillStyle   = color
    ctx.strokeStyle = color
    ctx.beginPath();
    ctx.arc(point.x, point.y, size / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawLine(points, thickness = LINES_THICKNESS, color = LINES_COLOR) {
    ctx.lineWidth   = thickness
    ctx.strokeStyle = color

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(points[1].x, points[1].y)
    ctx.stroke()
}

function drawPoly(poly, color = SURFACES_COLOR) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(poly[0].x, poly[0].y)
    for (let i = 1; i < poly.length; ++i) {
        ctx.lineTo(poly[i].x, poly[i].y)
    }
    ctx.closePath()
    ctx.fill()
}

export function drawVertices(object, properties = {size: POINTS_SIZE, color: POINTS_COLOR}) {
    for (const c of object.vertices) {
        const projected = screen(project(c))
        drawPoint(projected, properties.size, properties.color)
    }
}

export function drawEdges(object, properties = {thinkness: LINES_THICKNESS, color: LINES_COLOR}) {
    for(const l of object.edges) {
        const points = []

        for (let i = 0; i < l.length; ++i) {
            const c = object.vertices[l[i]]
            const projected = screen(project(c))
            points.push(projected)
        }

        drawLine(points, properties.thinkness, properties.color)
    }
}

export function drawSurfaces(object, properties = {color: SURFACES_COLOR}) {
    const faces = []

    for (const f of object.surfaces) {
        const points = []
        let depth = 0

        for (let i = 0; i < f.length; ++i) {
            const c = object.vertices[f[i]]
            const projected = screen(project(c))
            points.push(projected)
            depth += c.z
        }

        faces.push({ points: points, depth: depth / f.length })
    }

    for (let i = 0; i < faces.length; ++i) {
        for (let j = 0; j < faces.length - 1 - i; ++j) {
            if (faces[j].depth < faces[j + 1].depth) {
                const temp = faces[j]
                faces[j] = faces[j + 1]
                faces[j + 1] = temp
            }
        }
    }

    for (let i = 0; i < faces.length; ++i) {
        const p = faces[i].points

        drawPoly(p, properties.color)
    }
}

export function rotate_xy(object, angle) {
    const rotated = structuredClone(object)
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    for (let i = 0; i < object.vertices.length; ++i) {
        const x = rotated.vertices[i].x
        const y = rotated.vertices[i].y
        const z = rotated.vertices[i].z

        rotated.vertices[i].x = x*c-y*s,
        rotated.vertices[i].y = x*s+y*c,
        rotated.vertices[i].z = z
    }

    return rotated
}

export function rotate_xz(object, angle) {
    const rotated = structuredClone(object)
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    for (let i = 0; i < object.vertices.length; ++i) {
        const x = rotated.vertices[i].x
        const y = rotated.vertices[i].y
        const z = rotated.vertices[i].z

        rotated.vertices[i].x = x*c-z*s,
        rotated.vertices[i].y = y,
        rotated.vertices[i].z = x*s+z*c
    }

    return rotated
}

export function rotate_yz(object, angle) {
    const rotated = structuredClone(object)
    const s = Math.sin(angle)
    const c = Math.cos(angle)

    for (let i = 0; i < object.vertices.length; ++i) {
        const x = rotated.vertices[i].x
        const y = rotated.vertices[i].y
        const z = rotated.vertices[i].z

        rotated.vertices[i].x = x,
        rotated.vertices[i].y = y*c-z*s,
        rotated.vertices[i].z = y*s+z*c
    }

    return rotated
}

export function move_x(object, dx) {
    const moved = structuredClone(object)

    for (let i = 0; i < moved.vertices.length; ++i) {
        moved.vertices[i].x += dx
    }

    return moved
}

export function move_y(object, dy) {
    const moved = structuredClone(object)

    for (let i = 0; i < moved.vertices.length; ++i) {
        moved.vertices[i].y += dy
    }

    return moved
}

export function move_z(object, dz) {
    const moved = structuredClone(object)

    for (let i = 0; i < moved.vertices.length; ++i) {
        moved.vertices[i].z += dz
    }

    return moved
}
