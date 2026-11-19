import * as Bmo from "./lib/bmo.js"

// let dx    = 0
// let dy    = 0
// let dz    = 1
let angle = 0

const models = [
    {
        model: Bmo.shape,
        angles: {
            x: 90,
            y: 30,
            z: 60
        },
        location: {
            x: -0.33,
            y: 0,
            z: 1
        },
        pointsSize: 6,
        linesThinkness: 4,
        surfacesColor: "#00ff00"
    },
{
    model: Bmo.cube,
    angles: {
        x: 90,
        y: 30,
        z: 60
    },
    location: {
        x: 1,
        y: 0,
        z: 3
    },
    pointsSize: 6,
    linesThinkness: 4,
    surfacesColor: "#00ff00"
}
]

function frame(models) {
    const dt = 1 / Bmo.FPS
    angle += 2 * Math.PI * dt / 12

    Bmo.clear()

    for (let i = 0; i < models.length; ++i) {
        const m = models[i]

        const pointsSize      = m.pointsSize * (Bmo.WIDTH + Bmo.HEIGHT) / 1600 / m.location.z
        const linesThinkness = m.linesThinkness * (Bmo.WIDTH + Bmo.HEIGHT) / 1600 / m.location.z

        const angle_x = (Math.PI / 180) * m.angles.x
        const angle_y = (Math.PI / 180) * m.angles.y
        const angle_z = (Math.PI / 180) * m.angles.z

        const rotated = Bmo.rotate_xz(Bmo.rotate_yz(Bmo.rotate_xy(m.model, angle_x + angle), angle_y + angle), angle_z + angle)
        const moved   = Bmo.move_z(Bmo.move_y(Bmo.move_x(rotated, m.location.x), m.location.y), m.location.z)

        Bmo.drawSurfaces(moved, { color: m.surfacesColor})
        Bmo.drawEdges(moved, {thinkness: linesThinkness, color: "#ff0000"})
        Bmo.drawVertices(moved, { size: pointsSize, color: "#7f7f7f" })
    }

    setTimeout(frame, 1000 / Bmo.FPS, models)
}

setTimeout(frame, 1000 / Bmo.FPS, models)
