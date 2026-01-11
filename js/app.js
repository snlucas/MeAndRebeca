/*
 * app.js - Vue 3 + p5.js + Tailwind Classes
 */

const { createApp, ref, onMounted, onBeforeUnmount } = Vue;

createApp({
    setup() {
        // --- ESTADO REATIVO ---
        const showCode = ref(true);
        const showMessages = ref(false);
        const showLoveU = ref(false);
        const typingFinished = ref(false);
        const startHeart = ref(false);
        const typedText = ref('');
        const elapsedTime = ref('');
        const loveHeartRef = ref(null);
        const gardenContainer = ref(null);

        // --- POEMA COM CLASSES TAILWIND ---
        // Alteramos as classes CSS manuais para utilitários do Tailwind
        const fullPoem = `
            <span class="text-gray-800">Oi, Meu Amor!</span><br />
            <span class="text-gray-800">Você lembra do dia em que nos conhecemos?</span><br />
            <span class="text-green-600 font-mono text-sm">// Foi um momento único.</span><br />
            <span class="text-gray-800">Desde aquele dia, algo mudou em mim;</span><br />
            <span class="text-green-600 font-mono text-sm">// Seu rosto, sua voz, seu jeito.</span><br />
            <span class="text-gray-800">Tudo em você ficou gravado no meu coração.</span><br />
            <span class="text-gray-800">Conforme o tempo passou,</span><br />
            <span class="text-gray-800">O nosso laço ficou mais e mais forte.</span><br />
            <span class="text-gray-800">Viajamos juntos um longo caminho.</span><br />
            <span class="text-gray-800">Houve momentos difíceis;</span><br />
            <span class="text-green-600 font-mono text-sm">// E tenho certeza que superaremos outros.</span><br />
            <span class="text-gray-800">Mas nosso amor sempre volta mais forte.</span><br />
            <br>
            <span class="text-gray-800">Tudo que eu quero dizer é:</span><br />
            <span class="text-pink-600 font-bold">Rebeca, eu vou te amar para sempre.</span><br />
            <br>`;

        // --- CONFIGURAÇÃO DA DATA ---
        const together = new Date();
        together.setFullYear(2026, 0, 3);
        together.setHours(0, 0, 0, 0);

        let myP5 = null;
        let clockInterval = null;

        // ============================================================
        // LÓGICA DO P5.JS (Igual à versão anterior)
        // ============================================================
        const sketch = (p) => {
            let blooms = [];
            let heartPoints = [];
            let angle = 10;
            let animationFinished = false;
            let gardenCanvas;

            const options = {
                petalCount: { min: 5, max: 7 },
                petalStretch: { min: 0.5, max: 2.5 },
                growFactor: { min: 0.1, max: 1 },
                bloomRadius: { min: 8, max: 12 },
                growSpeed: 1,
                color: {
                    rmin: 180, rmax: 255,
                    gmin: 0, gmax: 80,
                    bmin: 80, bmax: 200,
                    opacity: 15
                }
            };

            class Petal {
                constructor(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
                    this.stretchA = stretchA;
                    this.stretchB = stretchB;
                    this.startAngle = startAngle;
                    this.angle = angle;
                    this.bloom = bloom;
                    this.growFactor = growFactor;
                    this.r = 1;
                    this.isfinished = false;
                }

                display() {
                    let v1 = p.createVector(0, this.r).rotate(p.radians(this.startAngle));
                    let v2 = v1.copy().rotate(p.radians(this.angle));
                    let v3 = v1.copy().mult(this.stretchA);
                    let v4 = v2.copy().mult(this.stretchB);

                    p.noFill();
                    p.stroke(this.bloom.c);
                    p.strokeWeight(0.5);
                    p.beginShape();
                    p.vertex(v1.x, v1.y);
                    p.bezierVertex(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
                    p.endShape();
                }

                render() {
                    if (this.r <= this.bloom.r) {
                        this.r += this.growFactor;
                        this.display();
                    } else {
                        this.isfinished = true;
                    }

                    this.display();
                }
            }

            class Bloom {
                constructor(pos, r, c, pc) {
                    this.pos = pos;
                    this.r = r;
                    this.c = c;
                    this.pc = pc;
                    this.petals = [];
                    this.init();
                }

                init() {
                    let angle = 360 / this.pc;
                    let startAngle = p.random(0, 90);
                    for (let i = 0; i < this.pc; i++) {
                        this.petals.push(new Petal(
                            p.random(options.petalStretch.min, options.petalStretch.max),
                            p.random(options.petalStretch.min, options.petalStretch.max),
                            startAngle + i * angle,
                            angle,
                            p.random(options.growFactor.min, options.growFactor.max),
                            this
                        ));
                    }
                }

                draw() {
                    let isfinished = true;
                    p.push();
                    p.translate(this.pos.x, this.pos.y);
                    for (let petal of this.petals) {
                        petal.render();
                        if (!petal.isfinished) isfinished = false;
                    }
                    p.pop();
                    return isfinished;
                }
            }

            function getHeartPoint(ang) {
                let t = ang / Math.PI;
                let scaleFactor = 1;
                // Ajuste responsivo baseado na largura da tela
                if (p.width < 700) {
                    scaleFactor = p.width / 700;
                }

                let x = (19.5 * scaleFactor) * (16 * Math.pow(Math.sin(t), 3));
                let y = - (20 * scaleFactor) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

                return p.createVector((p.width / 2) + x, (p.height / 2 - 55) + y);
            }

            function createRandomBloom(pos) {
                let r = p.random(options.bloomRadius.min, options.bloomRadius.max);
                let red = p.random(options.color.rmin, options.color.rmax);
                let green = p.random(options.color.gmin, options.color.gmax);
                let blue = p.random(options.color.bmin, options.color.bmax);
                if (Math.abs(red - green) < 20 && Math.abs(green - blue) < 20) {
                    red = 255; green = 100; blue = 100;
                }
                let c = p.color(red, green, blue, options.color.opacity);
                let pc = p.floor(p.random(options.petalCount.min, options.petalCount.max));
                blooms.push(new Bloom(pos, r, c, pc));
            }

            p.setup = () => {
                let w = gardenContainer.value.clientWidth;
                let h = gardenContainer.value.clientHeight;
                gardenCanvas = p.createCanvas(w, h);
                p.background('#ffe'); // Mantendo o fundo creme via p5
                p.frameRate(60);
                p.blendMode(p.BLEND);
            };

            p.draw = () => {
                if (startHeart.value && !animationFinished) {
                    if (p.frameCount % 2 === 0) {
                        let target = getHeartPoint(angle);
                        let draw = true;
                        for (let pt of heartPoints) {
                            if (p.dist(pt.x, pt.y, target.x, target.y) < options.bloomRadius.max * 1.3) {
                                draw = false;
                                break;
                            }
                        }
                        if (draw) {
                            heartPoints.push(target);
                            createRandomBloom(target);
                        }
                        if (angle >= 30) {
                            animationFinished = true;
                            showMessages.value = true;
                            setTimeout(() => { showLoveU.value = true; }, 3000);
                        } else {
                            angle += 0.2;
                        }
                    }
                }
                for (let i = blooms.length - 1; i >= 0; i--) {
                    blooms[i].draw();
                }
            };

            p.windowResized = () => {
                if (gardenContainer.value) {
                    p.resizeCanvas(gardenContainer.value.clientWidth, gardenContainer.value.clientHeight);
                    p.background('#ffe');
                }
            };
        };

        const startTypewriter = () => {
            setTimeout(() => {
                startHeart.value = true;
            }, 3000);

            let progress = 0;
            const str = fullPoem;
            const timer = setInterval(() => {
                const current = str.substr(progress, 1);
                if (current === '<') progress = str.indexOf('>', progress) + 1;
                else progress++;

                typedText.value = str.substring(0, progress) + (progress & 1 ? '_' : '');

                if (progress >= str.length) {
                    clearInterval(timer);
                    typedText.value = str.substring(0, progress);
                    typingFinished.value = true;
                }
            }, 75);
        };

        const timeElapse = () => {
            const current = new Date();
            const seconds = (current.getTime() - together.getTime()) / 1000;
            const days = Math.floor(seconds / (3600 * 24));
            elapsedTime.value = `Juntos há <span class="font-digit text-4xl font-bold">${days}</span> dias`;
        };

        onMounted(() => {
            timeElapse();
            clockInterval = setInterval(timeElapse, 500);
            startTypewriter();
            myP5 = new p5(sketch, gardenContainer.value);
        });

        onBeforeUnmount(() => {
            clearInterval(clockInterval);
            if (myP5) myP5.remove();
        });

        return {
            showCode, typedText, typingFinished,
            showMessages, showLoveU, elapsedTime,
            gardenContainer, loveHeartRef
        };
    }
}).mount('#app');