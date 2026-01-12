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
        const events = ref([]);
        const currentYear = new Date().getFullYear();

        const categoryStyles = {
            food: { icon: 'fas fa-utensils', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
            fun: { icon: 'fas fa-film', color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
            travel: { icon: 'fas fa-plane', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            birthday: { icon: 'fas fa-birthday-cake', color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' },
            default: { icon: 'far fa-calendar', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' }
        };
        const getStyle = (type) => categoryStyles[type] || categoryStyles.default;

        let fullPoemHTML = '';

        const together = new Date();
        together.setFullYear(2026, 0, 3);
        together.setHours(0, 0, 0, 0);

        let myP5 = null;
        let clockInterval = null;

        const styles = {
            normal: "text-gray-800",
            comment: "text-green-600 font-mono text-sm",
            highlight: "text-pink-600 font-bold",
            break: ""
        };

        const fetchPoem = async () => {
            try {
                const response = await fetch('../poem.json');
                if (!response.ok) throw new Error('Erro ao carregar poema');
                const data = await response.json();
                fullPoemHTML = processPoem(data);

                startTypewriter();
            } catch (error) {
                console.error("Falha ao carregar o poema:", error);
                typedText.value = "<span class='text-red-500'>Erro ao carregar o conteúdo.</span>";
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await fetch('events.json');
                if (!response.ok) throw new Error('Erro ao carregar eventos');
                events.value = await response.json();
            } catch (error) {
                console.error("Falha ao carregar eventos:", error);
            }
        };

        const processPoem = (data) => {
            return data.map(line => {
                if (line.type === 'break') return '<br>';
                return `<span class="${styles[line.type]}">${line.text}</span><br />`;
            }).join('');
        };

        const sketch = (p) => {
            let blooms = [];
            let heartPoints = [];
            let angle = 10;
            let gardenCanvas;

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

            function drawBee(x, y, alpha, angle) {
                p.push();
                p.translate(x, y);
                p.rotate(angle);
                p.scale(0.8);
                p.noStroke();
                p.fill(20, alpha);
                p.ellipse(0, 0, 10, 7);
                p.circle(6, 0, 4);
                p.push();
                p.rotate(p.QUARTER_PI);
                p.ellipse(-2, -6, 6, 10);
                p.ellipse(2, -6, 6, 10);
                p.pop();
                p.pop();
            }

            function drawButterfly(x, y, alpha, angle) {
                p.push();
                p.translate(x, y);
                p.rotate(angle);
                p.scale(0.7);
                p.noStroke();
                p.fill(20, alpha);
                p.ellipse(0, 0, 3, 12);
                p.push();
                p.rotate(p.radians(-20));
                p.ellipse(-6, -6, 10, 10);
                p.ellipse(6, -6, 10, 10);
                p.pop();
                p.push();
                p.rotate(p.radians(10));
                p.ellipse(-5, 4, 7, 9);
                p.ellipse(5, 4, 7, 9);
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
                    let offsetDist = p.random(12, 20);
                    let offsetAng = p.random(p.TWO_PI);
                    this.insectOffset = p.createVector(p.cos(offsetAng) * offsetDist, p.sin(offsetAng) * offsetDist);
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

                    if (this.insectType && this.life > 0) {
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
                let safetyMargin = 0.75;
                let scaleFactor = 1;

                if (p.width < 700) {
                    scaleFactor = (p.width / 700) * safetyMargin;
                } else {
                    scaleFactor = safetyMargin;
                }

                let x = (19.5 * scaleFactor) * (16 * Math.pow(Math.sin(t), 3));
                let y = - (20 * scaleFactor) * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                return p.createVector((p.width / 2) + x, (p.height / 2 - 55) + y);
            }

            function createRandomBloom(pos, sizeModifier = 1, allowInsects = false) {
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
                let pc = p.floor(p.random(4, 101));

                let maxStretch = 3.0;
                if (p.width < 700) maxStretch = 1.5;
                let stretchModifier = p.random(0.5, maxStretch);

                let insectType = null;
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
                    stretchModifier,
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
                            createRandomBloom(target, 1, false);

                            if (p.random() < 0.35) {
                                let extraBlooms = p.floor(p.random(1, 4));
                                for (let i = 0; i < extraBlooms; i++) {
                                    let offsetX = p.randomGaussian(0, 20);
                                    let offsetY = p.randomGaussian(0, 20);
                                    let newPos = p.createVector(target.x + offsetX, target.y + offsetY);
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
            const str = fullPoemHTML;

            const timer = setInterval(() => {
                const current = str.substr(progress, 1);
                if (current === '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++;
                }

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
            elapsedTime.value = `Cúmplices neste mundo há <br /><span class="font-digit text-4xl font-bold">${days}</span> dias`;
        };

        onMounted(() => {
            timeElapse();
            clockInterval = setInterval(timeElapse, 500);

            fetchPoem();
            fetchEvents();

            myP5 = new p5(sketch, gardenContainer.value);
        });

        onBeforeUnmount(() => {
            clearInterval(clockInterval);
            if (myP5) myP5.remove();
        });

        return {
            showCode, typedText, typingFinished,
            showMessages, showLoveU, elapsedTime,
            gardenContainer, loveHeartRef, events,
            currentYear, getStyle
        };
    }
}).mount('#app');