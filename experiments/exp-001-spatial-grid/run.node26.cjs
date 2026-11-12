"use strict";
const { performance: perf } = require('node:perf_hooks');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const MIN = -512, MAX = 512, CELL = 32, SIDE = (MAX - MIN) / CELL;
const CELLS = SIDE * SIDE;
const BASE_SEED = 0xdeadbeef;
const REPEATS = 3, WARMUP = 32, MEASURED = 100, QUERIES = 24;
function rng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
    };
}
function wrap(v) { const n = MAX - MIN; return MIN + ((((v - MIN) % n) + n) % n); }
function cell(x, y) {
    if (!(x >= MIN && x < MAX && y >= MIN && y < MAX))
        throw Error('point outside declared world');
    return Math.floor((y - MIN) / CELL) * SIDE + Math.floor((x - MIN) / CELL);
}
function copy(w) { return { x: w.x.slice(), y: w.y.slice(), live: w.live.slice() }; }
function makeWorld(n, distribution, seed) {
    const r = rng(seed), w = { x: new Float64Array(n), y: new Float64Array(n), live: new Uint8Array(n) };
    const centers = [[-256, -256], [-256, 256], [256, -256], [256, 256]];
    for (let i = 0; i < n; i++) {
        if (distribution === 'clustered') {
            const [cx, cy] = centers[i % centers.length];
            w.x[i] = Math.max(MIN, Math.min(MAX - 0.001, cx + (r() + r() + r() - 1.5) * 70));
            w.y[i] = Math.max(MIN, Math.min(MAX - 0.001, cy + (r() + r() + r() - 1.5) * 70));
        }
        else {
            w.x[i] = MIN + r() * (MAX - MIN);
            w.y[i] = MIN + r() * (MAX - MIN);
        }
        w.live[i] = 1;
    }
    return w;
}
function bounds(q) {
    if (q.x + q.r < MIN || q.x - q.r >= MAX || q.y + q.r < MIN || q.y - q.r >= MAX)
        return null;
    return [Math.max(0, Math.floor((q.x - q.r - MIN) / CELL)), Math.min(SIDE - 1, Math.floor((q.x + q.r - MIN) / CELL)),
        Math.max(0, Math.floor((q.y - q.r - MIN) / CELL)), Math.min(SIDE - 1, Math.floor((q.y + q.r - MIN) / CELL))];
}
function inside(w, id, q) {
    const dx = w.x[id] - q.x, dy = w.y[id] - q.y;
    return dx * dx + dy * dy <= q.r * q.r;
}
class Scan {
    w;
    constructor(w) {
        this.w = w;
    }
    update(_id) { }
    build() { }
    visit(q, hit) { for (let i = 0; i < this.w.x.length; i++)
        if (this.w.live[i] && inside(this.w, i, q))
            hit(i); }
}
class Rebuilt {
    w;
    head = new Int32Array(CELLS);
    next;
    constructor(w) {
        this.w = w;
        this.next = new Int32Array(w.x.length);
        this.build();
    }
    build() {
        this.head.fill(-1);
        this.next.fill(-1);
        for (let i = 0; i < this.w.x.length; i++)
            if (this.w.live[i]) {
                const c = cell(this.w.x[i], this.w.y[i]);
                this.next[i] = this.head[c];
                this.head[c] = i;
            }
    }
    update(_id) { }
    visit(q, hit) {
        const b = bounds(q);
        if (!b)
            return;
        for (let cy = b[2]; cy <= b[3]; cy++)
            for (let cx = b[0]; cx <= b[1]; cx++)
                for (let i = this.head[cy * SIDE + cx]; i !== -1; i = this.next[i])
                    if (inside(this.w, i, q))
                        hit(i);
    }
    allocatedBytes() { return this.head.byteLength + this.next.byteLength; }
}
class Incremental {
    w;
    head = new Int32Array(CELLS);
    next;
    prev;
    at;
    constructor(w) {
        this.w = w;
        this.next = new Int32Array(w.x.length);
        this.prev = new Int32Array(w.x.length);
        this.at = new Int32Array(w.x.length);
        this.head.fill(-1);
        this.at.fill(-1);
        this.next.fill(-1);
        this.prev.fill(-1);
        for (let i = 0; i < w.x.length; i++)
            this.update(i);
    }
    unlink(id) {
        const old = this.at[id];
        if (old === -1)
            return;
        const a = this.prev[id], b = this.next[id];
        if (a === -1)
            this.head[old] = b;
        else
            this.next[a] = b;
        if (b !== -1)
            this.prev[b] = a;
        this.at[id] = -1;
        this.next[id] = -1;
        this.prev[id] = -1;
    }
    update(id) {
        const nextCell = this.w.live[id] ? cell(this.w.x[id], this.w.y[id]) : -1;
        if (nextCell === this.at[id])
            return;
        this.unlink(id);
        if (nextCell === -1)
            return;
        const h = this.head[nextCell];
        this.head[nextCell] = id;
        this.next[id] = h;
        this.prev[id] = -1;
        this.at[id] = nextCell;
        if (h !== -1)
            this.prev[h] = id;
    }
    build() {
        this.head.fill(-1);
        this.at.fill(-1);
        this.next.fill(-1);
        this.prev.fill(-1);
        for (let i = 0; i < this.w.x.length; i++)
            this.update(i);
    }
    visit(q, hit) {
        const b = bounds(q);
        if (!b)
            return;
        for (let cy = b[2]; cy <= b[3]; cy++)
            for (let cx = b[0]; cx <= b[1]; cx++)
                for (let i = this.head[cy * SIDE + cx]; i !== -1; i = this.next[i])
                    if (inside(this.w, i, q))
                        hit(i);
    }
    allocatedBytes() { return this.head.byteLength + this.next.byteLength + this.prev.byteLength + this.at.byteLength; }
}
function results(a, q) { const out = []; a.visit(q, i => out.push(i)); return out.sort((x, y) => x - y); }
function test() {
    const w = { x: new Float64Array(96), y: new Float64Array(96), live: new Uint8Array(96) };
    const a = new Scan(w), b = new Rebuilt(w), c = new Incremental(w);
    const r = rng(0xabcdef12);
    const queries = [{ x: 0, y: 0, r: 0 }, { x: 0, y: 0, r: 32 }, { x: MIN, y: MIN, r: 128 }, { x: MAX, y: MAX, r: 128 },
        { x: 31.999, y: 32, r: 32 }, { x: MIN + 0.01, y: MAX - 0.01, r: 0.1 }, { x: 512, y: -512, r: 2048 }];
    const verify = () => { for (const q of queries) {
        const expected = results(a, q);
        assert.deepEqual(results(b, q), expected, 'rebuilt');
        assert.deepEqual(results(c, q), expected, 'incremental');
    } };
    verify(); // Empty world
    for (let i = 0; i < w.x.length; i++) {
        w.x[i] = MIN + 0.5 + r() * (MAX - MIN - 1);
        w.y[i] = MIN + 0.5 + r() * (MAX - MIN - 1);
        w.live[i] = 1;
        c.update(i);
    }
    w.x[0] = w.x[1] = 0;
    w.y[0] = w.y[1] = 0;
    c.update(0);
    c.update(1); // duplicates
    w.x[2] = MIN;
    w.y[2] = MIN;
    c.update(2);
    w.x[3] = MAX - 0.001;
    w.y[3] = MAX - 0.001;
    c.update(3);
    w.x[4] = 0;
    w.y[4] = 0;
    c.update(4);
    w.x[5] = 32;
    w.y[5] = 32;
    c.update(5); // cell boundaries
    b.build();
    verify();
    for (let t = 0; t < 80; t++) {
        const id = Math.floor(r() * w.x.length);
        const op = t % 7;
        if (op === 0)
            w.live[id] = 0;
        else {
            w.live[id] = 1;
            w.x[id] = wrap(w.x[id] + (r() - .5) * 400);
            w.y[id] = wrap(w.y[id] + (r() - .5) * 400);
        }
        if (t % 11 === 0) {
            w.x[id] = MIN;
            w.y[id] = MAX - 0.001;
        }
        c.update(id);
        b.build();
        verify();
        const q = { x: MIN + r() * (MAX - MIN), y: MIN + r() * (MAX - MIN), r: [0, 8, 32, 64, 128, 600][t % 6] };
        assert.deepEqual(results(b, q), results(a, q));
        assert.deepEqual(results(c, q), results(a, q));
    }
    console.log('PASS: deterministic differential tests (empty, duplicates, boundaries, negative coordinates, spawn/despawn, teleports, dense and sparse radii)');
}
function makePlan(w, churn, dist, seed) {
    const r = rng(seed), n = w.x.length, count = Math.max(1, Math.round(n * churn)), total = WARMUP + MEASURED;
    const x = w.x.slice(), y = w.y.slice(), plan = [];
    for (let t = 0; t < total; t++) {
        const ids = new Int32Array(count), xx = new Float64Array(count), yy = new Float64Array(count);
        const shift = (t * count) % n;
        for (let k = 0; k < count; k++) {
            const id = (shift + k) % n, step = dist === 'clustered' ? 10 : 60;
            ids[k] = id;
            xx[k] = wrap(x[id] + (r() - .5) * step);
            yy[k] = wrap(y[id] + (r() - .5) * step);
            x[id] = xx[k];
            y[id] = yy[k];
        }
        const qs = [];
        for (let j = 0; j < QUERIES; j++)
            qs.push({ x: MIN + r() * (MAX - MIN), y: MIN + r() * (MAX - MIN), r: [16, 48, 128][(j + t) % 3] });
        plan.push({ ids, xx, yy, queries: qs });
    }
    return plan;
}
function percentile(arr, p) { const sorted = [...arr].sort((a, b) => a - b); return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)]; }
function checkPlannedWorld(start, plan) {
    // Full set equality at both a pre-benchmark checkpoint and the final tick.
    const w = copy(start), oracle = new Scan(w), rebuilt = new Rebuilt(w), incremental = new Incremental(w);
    for (let t = 0; t < plan.length; t++) {
        const z = plan[t];
        for (let k = 0; k < z.ids.length; k++) {
            const i = z.ids[k];
            w.x[i] = z.xx[k];
            w.y[i] = z.yy[k];
            incremental.update(i);
        }
        rebuilt.build();
        if (t !== 0 && t !== plan.length - 1 && t % 25 !== 0)
            continue;
        for (const q of z.queries) {
            const expected = results(oracle, q);
            assert.deepEqual(results(rebuilt, q), expected);
            assert.deepEqual(results(incremental, q), expected);
        }
    }
}
function runOne(start, plan, alg) {
    const w = copy(start);
    const index = alg === 'brute' ? new Scan(w) : alg === 'rebuilt' ? new Rebuilt(w) : new Incremental(w);
    const moveMs = [], indexMs = [], queryMs = [], totalMs = [];
    let checksum = 0, visitCount = 0;
    const hit = (id) => { checksum = (checksum + Math.imul(id + 1, 0x9e3779b1)) >>> 0; visitCount++; };
    for (let t = 0; t < plan.length; t++) {
        const tick = plan[t], begin = perf.now();
        for (let k = 0; k < tick.ids.length; k++) {
            const id = tick.ids[k];
            w.x[id] = tick.xx[k];
            w.y[id] = tick.yy[k];
        }
        const afterMove = perf.now();
        if (alg === 'rebuilt')
            index.build();
        else if (alg === 'incremental')
            for (let k = 0; k < tick.ids.length; k++)
                index.update(tick.ids[k]);
        const afterIndex = perf.now();
        for (const q of tick.queries)
            index.visit(q, hit);
        const end = perf.now();
        if (t >= WARMUP) {
            moveMs.push(afterMove - begin);
            indexMs.push(afterIndex - afterMove);
            queryMs.push(end - afterIndex);
            totalMs.push(end - begin);
        }
    }
    const stats = (v) => ({ p50_ms: percentile(v, .5), p95_ms: percentile(v, .95), p99_ms: percentile(v, .99), sum_ms: v.reduce((a, b) => a + b, 0) });
    return { total: stats(totalMs), movement: stats(moveMs), maintenance: stats(indexMs), queries: stats(queryMs),
        checksum, visit_count: visitCount, estimated_index_typed_array_bytes: alg === 'brute' ? 0 : index.allocatedBytes() };
}
function bench() {
    const wallStart = perf.now(), memStart = process.memoryUsage();
    const report = { schema_version: 1, experiment: 'EXP-001', authored: 'independent TypeScript implementation; NOT Veloren source translation',
        source_revision: '131d1193387861d35c74655662148f303c22c5b4', seed: '0xdeadbeef',
        measurement_protocol: { entities: [384, 1536], churn: [0.02, 0.70], distributions: ['uniform', 'clustered'], queries_per_tick: QUERIES,
            query_radii: [16, 48, 128], warmup_ticks: WARMUP, measured_ticks: MEASURED, repeats: REPEATS,
            includes: 'position movement + index rebuild/maintenance + exact radius queries', max_wall_ms: 45000 },
        environment: { node: process.version, platform: process.platform, arch: process.arch, cpu: os.cpus()[0]?.model, logical_cpus: os.cpus().length,
            total_memory_bytes: os.totalmem() }, correctness: 'PASS', results: [], memory_note: 'RSS and heap deltas are noisy, NOT allocation-per-tick evidence. Typed-array bytes count only index buffers.' };
    const names = ['brute', 'rebuilt', 'incremental'];
    outer: for (const n of [384, 1536])
        for (const churn of [0.02, 0.70])
            for (const distribution of ['uniform', 'clustered']) {
                const seed = (BASE_SEED ^ n ^ Math.round(churn * 1000) ^ (distribution === 'clustered' ? 0x3456 : 0)) >>> 0;
                const start = makeWorld(n, distribution, seed), plan = makePlan(start, churn, distribution, seed ^ 0x157eff);
                checkPlannedWorld(start, plan);
                const samples = { n, churn, distribution, queries_per_tick: QUERIES, algorithms: {} };
                for (const name of names) {
                    const runs = [];
                    for (let rep = 0; rep < REPEATS; rep++)
                        runs.push(runOne(start, plan, name));
                    assert.ok(runs.every(r => r.checksum === runs[0].checksum && r.visit_count === runs[0].visit_count));
                    samples.algorithms[name] = { runs, total_p50_ms: percentile(runs.map(r => r.total.p50_ms), .5),
                        total_p95_ms: percentile(runs.map(r => r.total.p95_ms), .95), total_p99_ms: percentile(runs.map(r => r.total.p99_ms), .99) };
                }
                const base = samples.algorithms.brute.runs[0];
                for (const name of names)
                    assert.equal(samples.algorithms[name].runs[0].checksum, base.checksum, 'checksum mismatched');
                for (const name of names)
                    assert.equal(samples.algorithms[name].runs[0].visit_count, base.visit_count, 'query results mismatched');
                report.results.push(samples);
                console.log(`${n} / ${distribution} / churn ${churn}: median ms brute=${samples.algorithms.brute.total_p50_ms.toFixed(3)}, rebuild=${samples.algorithms.rebuilt.total_p50_ms.toFixed(3)}, incremental=${samples.algorithms.incremental.total_p50_ms.toFixed(3)}`);
                if (perf.now() - wallStart > 45000) {
                    report.truncated_by_budget = true;
                    break outer;
                }
            }
    report.elapsed_wall_ms = perf.now() - wallStart;
    report.memory_before = memStart;
    report.memory_after = process.memoryUsage();
    report.memory_warning = 'No proof of zero allocations, GC frequency or portability to Apple Silicon. p99 per 100 ticks is low confidence.';
    const out = path.resolve(process.cwd(), 'experiments/exp-001-spatial-grid/results-exp-001.json');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
    console.log(`Wrote ${out} (${report.results.length} workload cases, elapsed ${Math.round(report.elapsed_wall_ms)} ms)`);
}
if (require.main === module) {
    const arg = process.argv[2] || '--bench';
    if (arg === '--test')
        test();
    else if (arg === '--bench') {
        test();
        bench();
    }
    else
        throw Error('Use --test or --bench');
}
