/*
 * app.js - Vue 3 + p5.js + Tailwind
 * Atualização: Insetos Nítidos (Silhuetas Pretas) inspirados nas referências
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

            // --- CONFIGURAÇÃO GENÉTICA ---
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

            const colorPalettes = {
                'rosa': { r: [220, 255], g: [20, 100], b: [100, 180] },
                'amarelo': { r: [230, 255], g: [200, 240], b: [0, 50] },
                'vermelho': { r: [200, 255], g: [0, 30], b: [0, 30] },
                'jade': { r: [0, 50], g: [180, 220], b: [130, 180] },
                'roxo': { r: [100, 160], g: [0, 50], b: [180, 240] },
                'azul': { r: [0, 60], g: [80, 150], b: [200, 255] },
                'branco': { r: [245, 255], g: [245, 255], b: [245, 255], isWhite: true }
            };

            const options = {
                bloomRadius: { min: 8, max: 12 }
            };

            // --- DESENHO VETORIAL DE INSETOS (Silhuetas Nítidas) ---

            function drawBee(x, y, alpha, angle) {
                p.push();
                p.translate(x, y);
                p.rotate(angle); // Rotação aleatória
                p.scale(0.8); // Ajuste de tamanho global

                p.noStroke();
                p.fill(20, alpha); // Preto quase sólido (levemente suave para não serrilhar)

                // Corpo (Oval robusto)
                p.ellipse(0, 0, 10, 7);

                // Cabeça (Círculo na ponta)
                p.circle(6, 0, 4);

                // Asas (Forma de gota apontando para trás/cima)
                p.push();
                p.rotate(p.QUARTER_PI); // Inclina as asas
                p.ellipse(-2, -6, 6, 10); // Asa 1
                p.ellipse(2, -6, 6, 10);  // Asa 2
                p.pop();

                p.pop();
            }

            function drawButterfly(x, y, alpha, angle) {
                p.push();
                p.translate(x, y);
                p.rotate(angle);
                p.scale(0.7); // Borboletas delicadas

                p.noStroke();
                p.fill(20, alpha); // Preto sólido

                // Corpo Central
                p.ellipse(0, 0, 3, 12);

                // Asas Superiores (Grandes e arredondadas)
                p.push();
                p.rotate(p.radians(-20));
                p.ellipse(-6, -6, 10, 10); // Esq Sup
                p.ellipse(6, -6, 10, 10);  // Dir Sup
                p.pop();

                // Asas Inferiores (Menores)
                p.push();
                p.rotate(p.radians(10));
                p.ellipse(-5, 4, 7, 9);  // Esq Inf
                p.ellipse(5, 4, 7, 9);   // Dir Inf
                p.pop();

                p.pop();
            }

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
                        p.stroke(60, 60, 70, currentAlpha);
                        p.strokeWeight(0.8);
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
                constructor(pos, r, c, pc, stretchMin, stretchMax, growMin, growMax, isWhite, stretchModifier, insectType) {
                    this.pos = pos;
                    this.r = r;
                    this.c = c;
                    this.pc = pc;
                    this.stretchMin = stretchMin * stretchModifier;
                    this.stretchMax = stretchMax * stretchModifier;
                    this.growMin = growMin;
                    this.growMax = growMax;
                    this.isWhite = isWhite || false;
                    this.insectType = insectType;
                    // Offset maior para garantir que o inseto fique ao redor, não em cima
                    let offsetDist = p.random(12, 20);
                    let offsetAng = p.random(p.TWO_PI);
                    this.insectOffset = p.createVector(p.cos(offsetAng) * offsetDist, p.sin(offsetAng) * offsetDist);
                    // Ângulo de rotação do inseto (para onde ele aponta)
                    this.insectAngle = p.random(p.TWO_PI);
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
                            p.random(this.growMin, this.growMax),
                            this
                        ));
                    }
                }

                decreaseLife() {
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

                    // Desenha o inseto usando a posição relativa e o ciclo de vida da flor
                    if (this.insectType && this.life > 0) {
                        // O inseto só aparece quando a flor já cresceu um pouco (vida > 200) para não "brotar" estranho
                        if (this.petals[0].r > this.r * 0.5) {
                            if (this.insectType === 'bee') {
                                drawBee(this.pos.x + this.insectOffset.x, this.pos.y + this.insectOffset.y, this.life, this.insectAngle);
                            } else if (this.insectType === 'butterfly') {
                                drawButterfly(this.pos.x + this.insectOffset.x, this.pos.y + this.insectOffset.y, this.life, this.insectAngle);
                            }
                        }
                    }
                }
            }

            function getHeartPoint(ang) {
                let t = ang / Math.PI;
                let scaleFactor = p.width < 700 ? p.width / 700 : 1;
                let x = (19.5 * scaleFactor) * (16 * Math.pow(Math.sin(t), 3));
                let y = - (20 * scaleFactor) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                return p.createVector((p.width / 2) + x, (p.height / 2 - 55) + y);
            }

            // Função atualizada para aceitar modificadores e insetos
            function createRandomBloom(pos, sizeModifier = 1, allowInsects = false) {
                // Ainda escolhemos uma espécie base para pegar velocidades de crescimento e cores
                let species = p.random(flowerTypes);
                let colorKeys = Object.keys(colorPalettes);
                let colorName = p.random(colorKeys);
                let palette = colorPalettes[colorName];

                let c = p.color(
                    p.random(palette.r[0], palette.r[1]),
                    p.random(palette.g[0], palette.g[1]),
                    p.random(palette.b[0], palette.b[1])
                );

                let r = p.random(options.bloomRadius.min, options.bloomRadius.max) * sizeModifier;

                // --- MUDANÇA 1: Contagem de Pétalas Altamente Randômica ---
                // Ignora os limites da espécie e define um intervalo global de 4 a 100.
                // p.floor(p.random(min, max_exclusivo))
                let pc = p.floor(p.random(4, 101));

                // --- MUDANÇA 2: "Espichamento" Mais Extremo ---
                // Aumentamos o alcance do modificador.
                // 0.5 = metade do tamanho normal (bem comprimida)
                // 3.0 = triplo do tamanho normal (muito espichada)
                let stretchModifier = p.random(0.5, 3.0);

                let insectType = null;
                // Chance de 40% de ter inseto nas flores secundárias
                if (allowInsects && p.random() < 0.4) {
                    insectType = p.random(['bee', 'butterfly']);
                }

                blooms.push(new Bloom(
                    pos, r, c, pc,
                    species.stretchMin,
                    species.stretchMax,
                    species.growMin,
                    species.growMax,
                    palette.isWhite,
                    stretchModifier, // Passa o novo modificador extremo
                    insectType
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
                p.background(255, 255, 238, 3);

                if (startHeart.value) {
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
                            createRandomBloom(target, 1, false); // Flor principal sem insetos

                            if (p.random() < 0.35) {
                                let extraBlooms = p.floor(p.random(1, 4));
                                for (let i = 0; i < extraBlooms; i++) {
                                    let offsetX = p.randomGaussian(0, 20);
                                    let offsetY = p.randomGaussian(0, 20);
                                    let newPos = p.createVector(target.x + offsetX, target.y + offsetY);
                                    // Flor secundária COM chance de inseto
                                    createRandomBloom(newPos, 0.7, true);
                                }
                            }
                        }

                        if (angle >= 30) {
                            angle = 10;
                            heartPoints = [];
                            if (!showMessages.value) {
                                showMessages.value = true;
                                setTimeout(() => { showLoveU.value = true; }, 3000);
                            }
                        } else {
                            angle += 0.06;
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