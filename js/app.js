/*
 * app.js - Vue 3 + p5.js + Tailwind
 * Atualização: Cores vibrantes, Animação lenta e Explosão de diversidade (flores secundárias)
 */

const { createApp, ref, onMounted, onBeforeUnmount } = Vue;

createApp({
    setup() {
        const showCode = ref(true);
        const showMessages = ref(false);
        const showLoveU = ref(false);
        const typingFinished = ref(false);
        const startHeart = ref(false);
        const typedText = ref('');
        const elapsedTime = ref('');
        const loveHeartRef = ref(null);
        const gardenContainer = ref(null);

        // --- POEMA ---
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

        const together = new Date();
        together.setFullYear(2026, 0, 3);
        together.setHours(0, 0, 0, 0);

        let myP5 = null;
        let clockInterval = null;

        const sketch = (p) => {
            let blooms = [];
            let heartPoints = [];
            let angle = 10;
            let gardenCanvas;

            // --- CONFIGURAÇÃO GENÉTICA (VELOCIDADES LENTAS) ---
            // Adicionei growMin/growMax para controlar a velocidade de desabrochar por espécie
            const flowerTypes = [
                { name: 'Tulipa', pcMin: 5, pcMax: 6, stretchMin: 1.5, stretchMax: 2.0, growMin: 0.03, growMax: 0.06 },
                { name: 'Rosa', pcMin: 10, pcMax: 15, stretchMin: 0.8, stretchMax: 1.2, growMin: 0.02, growMax: 0.05 },
                { name: 'Falsa Era', pcMin: 4, pcMax: 5, stretchMin: 2.5, stretchMax: 3.5, growMin: 0.04, growMax: 0.08 },
                { name: 'Carnation', pcMin: 12, pcMax: 20, stretchMin: 0.5, stretchMax: 1.0, growMin: 0.02, growMax: 0.04 },
                { name: 'Alstroemeria', pcMin: 3, pcMax: 6, stretchMin: 1.8, stretchMax: 2.2, growMin: 0.03, growMax: 0.07 },
                { name: 'Iris', pcMin: 3, pcMax: 3, stretchMin: 2.0, stretchMax: 3.0, growMin: 0.04, growMax: 0.08 },
                { name: 'Magnolia', pcMin: 6, pcMax: 9, stretchMin: 1.2, stretchMax: 1.5, growMin: 0.02, growMax: 0.05 },
                { name: 'Begonia', pcMin: 4, pcMax: 4, stretchMin: 1.0, stretchMax: 1.3, growMin: 0.03, growMax: 0.06 },
                { name: 'Zinia', pcMin: 15, pcMax: 25, stretchMin: 0.3, stretchMax: 0.6, growMin: 0.01, growMax: 0.03 },
                { name: 'Petunia', pcMin: 5, pcMax: 5, stretchMin: 0.6, stretchMax: 0.9, growMin: 0.03, growMax: 0.06 }
            ];

            // --- CORES VIBRANTES E PROFISSIONAIS ---
            // Intervalos RGB mais estreitos e saturados
            const colorPalettes = {
                'rosa': { r: [220, 255], g: [20, 100], b: [100, 180] }, // Rosa choque/magenta
                'amarelo': { r: [230, 255], g: [200, 240], b: [0, 50] },    // Amarelo ouro
                'vermelho': { r: [200, 255], g: [0, 30], b: [0, 30] },    // Vermelho sangue
                'jade': { r: [0, 50], g: [180, 220], b: [130, 180] }, // Verdeazulado profundo
                'roxo': { r: [100, 160], g: [0, 50], b: [180, 240] }, // Roxo real
                'azul': { r: [0, 60], g: [80, 150], b: [200, 255] }, // Azul oceano
                'branco': { r: [245, 255], g: [245, 255], b: [245, 255], isWhite: true }
            };

            const options = {
                bloomRadius: { min: 8, max: 12 }
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

                display(currentAlpha) {
                    let v1 = p.createVector(0, this.r).rotate(p.radians(this.startAngle));
                    let v2 = v1.copy().rotate(p.radians(this.angle));
                    let v3 = v1.copy().mult(this.stretchA);
                    let v4 = v2.copy().mult(this.stretchB);

                    p.noFill();

                    let c = this.bloom.c;

                    if (this.bloom.isWhite) {
                        // Branco Profissional: Borda cinza chumbo elegante, não preto chapado
                        p.stroke(60, 60, 70, currentAlpha);
                        p.strokeWeight(0.8);
                        // Preenchimento branco sutil para destacar do fundo
                        p.fill(255, 255, 255, currentAlpha * 0.8);
                    } else {
                        c.setAlpha(currentAlpha);
                        p.stroke(c);
                        p.strokeWeight(0.8);
                    }

                    p.beginShape();
                    p.vertex(v1.x, v1.y);
                    p.bezierVertex(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
                    p.endShape();
                }

                render() {
                    if (this.r <= this.bloom.r) {
                        this.r += this.growFactor;
                    } else {
                        this.isfinished = true;
                    }
                    this.display(this.bloom.life);
                }
            }

            class Bloom {
                constructor(pos, r, c, pc, stretchMin, stretchMax, growMin, growMax, isWhite) {
                    this.pos = pos;
                    this.r = r;
                    this.c = c;
                    this.pc = pc;
                    this.stretchMin = stretchMin;
                    this.stretchMax = stretchMax;
                    this.growMin = growMin;
                    this.growMax = growMax;
                    this.isWhite = isWhite || false;
                    this.petals = [];
                    this.life = 255;
                    this.init();
                }

                init() {
                    let angle = 360 / this.pc;
                    let startAngle = p.random(0, 90);
                    for (let i = 0; i < this.pc; i++) {
                        this.petals.push(new Petal(
                            p.random(this.stretchMin, this.stretchMax),
                            p.random(this.stretchMin, this.stretchMax),
                            startAngle + i * angle,
                            angle,
                            // Usa a velocidade de crescimento específica da espécie
                            p.random(this.growMin, this.growMax),
                            this
                        ));
                    }
                }

                decreaseLife() {
                    // Desvanecimento mais lento para acompanhar a animação lenta
                    this.life -= 0.6;
                }

                isDead() {
                    return this.life < 0;
                }

                draw() {
                    p.push();
                    p.translate(this.pos.x, this.pos.y);
                    for (let petal of this.petals) {
                        petal.render();
                    }
                    p.pop();
                }
            }

            function getHeartPoint(ang) {
                let t = ang / Math.PI;
                let scaleFactor = p.width < 700 ? p.width / 700 : 1;
                let x = (19.5 * scaleFactor) * (16 * Math.pow(Math.sin(t), 3));
                let y = - (20 * scaleFactor) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                return p.createVector((p.width / 2) + x, (p.height / 2 - 55) + y);
            }

            // Função atualizada para aceitar um modificador de tamanho (para flores secundárias)
            function createRandomBloom(pos, sizeModifier = 1) {
                let species = p.random(flowerTypes);
                let colorKeys = Object.keys(colorPalettes);
                let colorName = p.random(colorKeys);
                let palette = colorPalettes[colorName];

                let c = p.color(
                    p.random(palette.r[0], palette.r[1]),
                    p.random(palette.g[0], palette.g[1]),
                    p.random(palette.b[0], palette.b[1])
                );

                // Aplica o modificador de tamanho (flores secundárias são menores)
                let r = p.random(options.bloomRadius.min, options.bloomRadius.max) * sizeModifier;
                let pc = p.floor(p.random(species.pcMin, species.pcMax));

                blooms.push(new Bloom(
                    pos, r, c, pc,
                    species.stretchMin,
                    species.stretchMax,
                    species.growMin,
                    species.growMax,
                    palette.isWhite
                ));
            }

            p.setup = () => {
                let w = gardenContainer.value.clientWidth;
                let h = gardenContainer.value.clientHeight;
                gardenCanvas = p.createCanvas(w, h);
                p.background('#ffe');
                p.frameRate(60);
                p.blendMode(p.BLEND);
            };

            p.draw = () => {
                // Fade muito sutil para manter as cores vibrantes por mais tempo
                p.background(255, 255, 238, 1.5);

                if (startHeart.value) {
                    // Frequência de desenho aumentada (a cada 3 frames) para compensar a lentidão
                    if (p.frameCount % 3 === 0) {
                        let target = getHeartPoint(angle);
                        let draw = true;

                        for (let pt of heartPoints) {
                            if (p.dist(pt.x, pt.y, target.x, target.y) < options.bloomRadius.max * 1.1) {
                                draw = false;
                                break;
                            }
                        }

                        if (draw) {
                            heartPoints.push(target);
                            // Cria a flor principal do caminho
                            createRandomBloom(target);

                            // --- LÓGICA DE EXPLOSÃO DE DIVERSIDADE ---
                            // 35% de chance de gerar flores secundárias ao redor
                            if (p.random() < 0.35) {
                                let extraBlooms = p.floor(p.random(1, 4)); // 1 a 3 flores extras
                                for (let i = 0; i < extraBlooms; i++) {
                                    // Usa distribuição Gaussiana para agrupar organicamente ao redor do ponto principal
                                    let offsetX = p.randomGaussian(0, 20); // Espalhamento de ~20px
                                    let offsetY = p.randomGaussian(0, 20);
                                    let newPos = p.createVector(target.x + offsetX, target.y + offsetY);
                                    // Cria flor secundária (0.7x do tamanho normal)
                                    createRandomBloom(newPos, 0.7);
                                }
                            }
                        }

                        // Loop Flow Lento
                        if (angle >= 30) {
                            angle = 10;
                            heartPoints = [];
                            if (!showMessages.value) {
                                showMessages.value = true;
                                setTimeout(() => { showLoveU.value = true; }, 3000);
                            }
                        } else {
                            // VELOCIDADE DO CORAÇÃO: Muito mais lenta agora
                            angle += 0.02;
                        }
                    }
                }

                for (let i = blooms.length - 1; i >= 0; i--) {
                    let b = blooms[i];
                    b.draw();
                    b.decreaseLife();
                    if (b.isDead()) blooms.splice(i, 1);
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
            clockInterval = setInterval(timeElapse, 300);
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