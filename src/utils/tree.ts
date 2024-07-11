import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders'

const coordSystem = function (b) {
    const g = b.normalize()
    b =
      0 == Math.abs(b.x) && 0 == Math.abs(b.y)
        ? new BABYLON.Vector3(b.z, 0, 0).normalize()
        : new BABYLON.Vector3(b.y, -b.x, 0).normalize()
    const r = BABYLON.Vector3.Cross(b, g)
    return { x: b, y: g, z: r }
  },
  randPct = function (b, g) {
    return 0 == g ? b : (1 + (1 - 2 * Math.random()) * g) * b
  },
  createBranch = function (b, g, r, w, h, l, v, n, x) {
    for (var t = [], d, c = [], f, q = [], a = 0; 12 > a; a++) t[a] = []
    for (let m = 0; m < h; m++)
      for (
        a = m / h,
          d = g.y.scale(a * r),
          d.addInPlace(g.x.scale(v * Math.exp(-a) * Math.sin(l * a * Math.PI))),
          d.addInPlace(b),
          c[m] = d,
          d = n * (1 + (0.4 * Math.random() - 0.2)) * (1 - (1 - w) * a),
          q.push(d),
          a = 0;
        12 > a;
        a++
      )
        (f = (a * Math.PI) / 6),
          (f = g.x.scale(d * Math.cos(f)).add(g.z.scale(d * Math.sin(f)))),
          f.addInPlace(c[m]),
          t[a].push(f)
    for (a = 0; 12 > a; a++) t[a].push(c[c.length - 1])
    return {
      branch: BABYLON.MeshBuilder.CreateRibbon('branch', { pathArray: t, closeArray: !0 }, x),
      core: c,
      _radii: q
    }
  },
  createTreeBase = function (b, g, r, w, h, l, v, n, x, t) {
    var d = 2 / (1 + Math.sqrt(5)),
      c = new BABYLON.Vector3(0, 1, 0),
      f,
      c = coordSystem(c),
      q = new BABYLON.Vector3(0, 0, 0),
      a = [],
      m = [],
      e = [],
      A = [],
      q = createBranch(q, c, b, g, r, 1, x, 1, t)
    a.push(q.branch)
    var y = q.core
    m.push(y)
    e.push(q._radii)
    A.push(c)
    for (var q = y[y.length - 1], y = (2 * Math.PI) / h, z, u, p, C, B = 0; B < h; B++)
      if (
        ((f = randPct(B * y, 0.25)),
        (f = c.y
          .scale(Math.cos(randPct(l, 0.15)))
          .add(c.x.scale(Math.sin(randPct(l, 0.15)) * Math.sin(f)))
          .add(c.z.scale(Math.sin(randPct(l, 0.15)) * Math.cos(f)))),
        (z = coordSystem(f)),
        (f = createBranch(q, z, b * v, g, r, n, x * d, g, t)),
        (p = f.core),
        (p = p[p.length - 1]),
        a.push(f.branch),
        m.push(f.core),
        e.push(f._radii),
        A.push(z),
        1 < w)
      )
        for (let D = 0; D < h; D++)
          (u = randPct(D * y, 0.25)),
            (u = z.y
              .scale(Math.cos(randPct(l, 0.15)))
              .add(z.x.scale(Math.sin(randPct(l, 0.15)) * Math.sin(u)))
              .add(z.z.scale(Math.sin(randPct(l, 0.15)) * Math.cos(u)))),
            (u = coordSystem(u)),
            (C = createBranch(p, u, b * v * v, g, r, n, x * d * d, g * g, t)),
            a.push(C.branch),
            m.push(C.core),
            e.push(f._radii),
            A.push(u)
    return { tree: BABYLON.Mesh.MergeMeshes(a), paths: m, radii: e, directions: A }
  },
  createTree = function (b, g, r, w, h, l, v, n, x, t, d, c, f, q, a, m) {
    1 != h && 2 != h && (h = 1)
    const e = createTreeBase(b, g, r, h, l, v, n, d, c, m)
    e.tree.material = w
    const A = b * Math.pow(n, h),
      y = A / (2 * f),
      z = 1.5 * Math.pow(g, h - 1)
    n = BABYLON.MeshBuilder.CreateDisc(
      'leaf',
      { radius: z / 2, tessellation: 12, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
      m
    )
    b = new BABYLON.SolidParticleSystem('leaveSPS', m, { updatable: !1 })
    b.addShape(n, 2 * f * Math.pow(l, h), {
      positionFunction: function (b, a, g) {
        a = Math.floor(g / (2 * f))
        1 == h ? a++ : (a = 2 + (a % l) + Math.floor(a / l) * (l + 1))
        let E = ((g % (2 * f)) * y + (3 * y) / 2) / A,
          d = Math.ceil(r * E)
        d > e.paths[a].length - 1 && (d = e.paths[a].length - 1)
        const k = d - 1,
          c = k / (r - 1),
          m = d / (r - 1)
        b.position = new BABYLON.Vector3(
          e.paths[a][k].x + ((e.paths[a][d].x - e.paths[a][k].x) * (E - c)) / (m - c),
          e.paths[a][k].y +
            ((e.paths[a][d].y - e.paths[a][k].y) * (E - c)) / (m - c) +
            ((0.6 * z) / q + e.radii[a][d]) * ((g % 2) * 2 - 1),
          e.paths[a][k].z + ((e.paths[a][d].z - e.paths[a][k].z) * (E - c)) / (m - c)
        )
        b.rotation.z = (Math.random() * Math.PI) / 4
        b.rotation.y = (Math.random() * Math.PI) / 2
        b.rotation.z = (Math.random() * Math.PI) / 4
        b.scale.y = 1 / q
      }
    })
    b = b.buildMesh()
    b.billboard = !0
    n.dispose()
    d = new BABYLON.SolidParticleSystem('miniSPS', m, { updatable: !1 })
    n = new BABYLON.SolidParticleSystem('minileavesSPS', m, { updatable: !1 })
    const u = []
    c = (2 * Math.PI) / l
    for (var p = 0; p < Math.pow(l, h + 1); p++)
      u.push(randPct(Math.floor(p / Math.pow(l, h)) * c, 0.2))
    c = function (a, b, d) {
      var c = d % Math.pow(l, h)
      1 == h ? c++ : (c = 2 + (c % l) + Math.floor(c / l) * (l + 1))
      var f = e.directions[c],
        c = new BABYLON.Vector3(
          e.paths[c][e.paths[c].length - 1].x,
          e.paths[c][e.paths[c].length - 1].y,
          e.paths[c][e.paths[c].length - 1].z
        ),
        k = u[d],
        k = f.y
          .scale(Math.cos(randPct(v, 0)))
          .add(f.x.scale(Math.sin(randPct(v, 0)) * Math.sin(k)))
          .add(f.z.scale(Math.sin(randPct(v, 0)) * Math.cos(k))),
        f = BABYLON.Vector3.Cross(BABYLON.Axis.Y, k),
        k = Math.acos(BABYLON.Vector3.Dot(k, BABYLON.Axis.Y) / k.length())
      a.scale = new BABYLON.Vector3(Math.pow(g, h + 1), Math.pow(g, h + 1), Math.pow(g, h + 1))
      a.quaternion = BABYLON.Quaternion.RotationAxis(f, k)
      a.position = c
    }
    for (var C = [], B = [], p = e.paths.length, D = e.paths[0].length, F = 0; F < x; F++)
      C.push(2 * Math.PI * Math.random() - Math.PI),
        B.push([Math.floor(Math.random() * p), Math.floor(Math.random() * (D - 1) + 1)])
    p = function (a, c, b) {
      let d = B[b][0],
        f = B[b][1],
        k = e.directions[d]
      c = new BABYLON.Vector3(e.paths[d][f].x, e.paths[d][f].y, e.paths[d][f].z)
      c.addInPlace(k.z.scale(e.radii[d][f] / 2))
      b = C[b]
      k = k.y
        .scale(Math.cos(randPct(t, 0)))
        .add(k.x.scale(Math.sin(randPct(t, 0)) * Math.sin(b)))
        .add(k.z.scale(Math.sin(randPct(t, 0)) * Math.cos(b)))
      b = BABYLON.Vector3.Cross(BABYLON.Axis.Y, k)
      k = Math.acos(BABYLON.Vector3.Dot(k, BABYLON.Axis.Y) / k.length())
      a.scale = new BABYLON.Vector3(Math.pow(g, h + 1), Math.pow(g, h + 1), Math.pow(g, h + 1))
      a.quaternion = BABYLON.Quaternion.RotationAxis(b, k)
      a.position = c
    }
    d.addShape(e.tree, Math.pow(l, h + 1), { positionFunction: c })
    d.addShape(e.tree, x, { positionFunction: p })
    d = d.buildMesh()
    d.material = w
    n.addShape(b, Math.pow(l, h + 1), { positionFunction: c })
    n.addShape(b, x, { positionFunction: p })
    w = n.buildMesh()
    b.dispose()
    w.material = a
    a = BABYLON.MeshBuilder.CreateBox('', {}, m)
    a.isVisible = !1
    e.tree.parent = a
    d.parent = a
    return (w.parent = a)
  }

export { createTree }
