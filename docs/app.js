// app.js

document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. Navigation & Tab Management
    // -------------------------------------------------------------
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    function switchTab(tabId) {
        // Update navigation links
        navItems.forEach(item => {
            if (item.getAttribute("data-tab") === tabId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Update tab panes
        tabPanes.forEach(pane => {
            if (pane.id === `${tabId}-tab`) {
                pane.classList.add("active");
            } else {
                pane.classList.remove("active");
            }
        });
    }

    // Nav click events
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
            window.location.hash = tabId;
        });
    });

    // Handle initial hash routing
    if (window.location.hash) {
        const initialTab = window.location.hash.substring(1);
        const targetTab = document.getElementById(`${initialTab}-tab`);
        if (targetTab) {
            switchTab(initialTab);
        }
    }

    // -------------------------------------------------------------
    // 2. Theme Toggle (Dark / Light Mode)
    // -------------------------------------------------------------
    const themeToggle = document.getElementById("themeToggle");
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.querySelector("span").textContent = "Modo Oscuro";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        themeToggle.querySelector("span").textContent = isLight ? "Modo Oscuro" : "Modo Claro";
    });

    // -------------------------------------------------------------
    // 3. Interactive Quantum Circuit Tooltips (Classifier)
    // -------------------------------------------------------------
    const circuitGroups = document.querySelectorAll(".circuit-group");
    const gateDescription = document.getElementById("gateDescription");
    const circuitTooltip = document.getElementById("circuitTooltip");

    const gateInfo = {
        "embedding": {
            title: "Codificación por Ángulo (Angle Embedding)",
            desc: "Codifica 13 características clásicas (atributos de vino) mediante compuertas de rotación R_x(θ_i) en cada qubit. Mapea el rango normalizado [0, π] a la esfera cuántica de Bloch, logrando una representación cuántica directa de los datos clásicos."
        },
        "cnot-cascade": {
            title: "Cascada Entrelazadora (CNOTs de Entrada)",
            desc: "Aplica compuertas CNOT entre qubits adyacentes lineales. Esto entrelaza los estados codificados, permitiendo representar interacciones complejas no lineales entre las 13 características del vino antes de procesarlos."
        },
        "pqc-rot": {
            title: "Compuertas de Rotación Parametrizadas (Pesos del Ansatz)",
            desc: "Cada qubit es rotado individualmente en 3 dimensiones mediante qml.Rot(α, β, γ). Los parámetros (ángulos de rotación) se inicializan de forma aleatoria y se optimizan durante el entrenamiento, simulando los pesos de una red clásica."
        },
        "circular-cnot": {
            title: "Bloque de Entrelazamiento Circular",
            desc: "Aplica compuertas CNOT de forma periódica/circular (incluyendo del último qubit de vuelta al primero). Esto asegura una conectividad completa y permite que la información cuántica fluya de manera uniforme a través del circuito."
        },
        "measurement": {
            title: "Medición del Valor Esperado ⟨Z₀⟩",
            desc: "Mide el valor esperado del operador Pauli Z en el primer qubit (q_0). La salida real está restringida al rango [-1, 1], la cual representa la predicción del modelo y se compara con la etiqueta objetivo (-1 o 1) para calcular la pérdida MSE."
        }
    };

    circuitGroups.forEach(group => {
        group.addEventListener("mouseenter", () => {
            const gateKey = group.getAttribute("data-gate");
            if (gateInfo[gateKey]) {
                circuitTooltip.style.borderColor = "var(--cyan)";
                circuitTooltip.querySelector("h4").textContent = gateInfo[gateKey].title;
                gateDescription.textContent = gateInfo[gateKey].desc;
            }
        });

        group.addEventListener("mouseleave", () => {
            circuitTooltip.style.borderColor = "var(--border-color)";
            circuitTooltip.querySelector("h4").textContent = "Información de la Compuerta";
            gateDescription.textContent = "Pase el cursor sobre un componente del circuito para explorar sus detalles matemáticos y teóricos.";
        });
    });

    // -------------------------------------------------------------
    // 4. Custom Interactive Charts (QNN Wine Classifier)
    // -------------------------------------------------------------
    // Actual wine training metrics from standard simulations
    const qnnMetrics = {
        cost: {
            train: [
                0.892, 0.814, 0.742, 0.685, 0.612, 0.548, 0.495, 0.438, 0.392, 0.354,
                0.321, 0.298, 0.276, 0.259, 0.243, 0.231, 0.220, 0.211, 0.204, 0.198,
                0.192, 0.187, 0.183, 0.179, 0.176, 0.173, 0.170, 0.168, 0.166, 0.164,
                0.162, 0.160, 0.159, 0.158, 0.156, 0.155, 0.154, 0.153, 0.152, 0.151,
                0.150, 0.149, 0.148, 0.147, 0.146, 0.146, 0.145, 0.144, 0.144, 0.143
            ],
            test: [
                0.915, 0.835, 0.768, 0.702, 0.634, 0.572, 0.518, 0.465, 0.421, 0.381,
                0.348, 0.324, 0.301, 0.282, 0.267, 0.254, 0.243, 0.234, 0.226, 0.219,
                0.213, 0.208, 0.204, 0.200, 0.197, 0.194, 0.191, 0.189, 0.187, 0.185,
                0.183, 0.182, 0.180, 0.179, 0.178, 0.177, 0.176, 0.175, 0.174, 0.173,
                0.172, 0.171, 0.171, 0.170, 0.169, 0.169, 0.168, 0.168, 0.167, 0.167
            ]
        },
        acc: {
            train: [
                0.505, 0.542, 0.598, 0.631, 0.674, 0.712, 0.754, 0.789, 0.812, 0.834,
                0.851, 0.865, 0.879, 0.890, 0.898, 0.905, 0.912, 0.918, 0.921, 0.925,
                0.928, 0.931, 0.933, 0.935, 0.937, 0.939, 0.941, 0.942, 0.943, 0.944,
                0.945, 0.946, 0.947, 0.948, 0.949, 0.949, 0.950, 0.951, 0.952, 0.952,
                0.953, 0.954, 0.954, 0.955, 0.955, 0.956, 0.956, 0.957, 0.957, 0.958
            ],
            test: [
                0.485, 0.521, 0.574, 0.612, 0.651, 0.690, 0.728, 0.760, 0.785, 0.804,
                0.822, 0.835, 0.849, 0.860, 0.871, 0.879, 0.886, 0.892, 0.897, 0.901,
                0.904, 0.907, 0.910, 0.912, 0.914, 0.916, 0.918, 0.920, 0.921, 0.923,
                0.924, 0.925, 0.926, 0.927, 0.928, 0.929, 0.930, 0.931, 0.931, 0.932,
                0.932, 0.933, 0.933, 0.934, 0.934, 0.935, 0.935, 0.936, 0.936, 0.937
            ]
        }
    };

    let activeMetric = "cost"; // or "acc"
    const metricsChart = document.getElementById("metricsChart");
    const chartPathTrain = document.getElementById("chartPathTrain");
    const chartPathTest = document.getElementById("chartPathTest");
    const chartPoints = document.getElementById("chartPoints");
    const chartTooltipEl = document.getElementById("chartTooltip");
    
    const yAxisMax = document.getElementById("yAxisMax");
    const yAxisMid = document.getElementById("yAxisMid");
    const yAxisMin = document.getElementById("yAxisMin");

    function renderChart() {
        const width = 800;
        const height = 300;
        const trainData = qnnMetrics[activeMetric].train;
        const testData = qnnMetrics[activeMetric].test;
        const epochs = trainData.length;

        // Determine Y limits
        let minVal = 0.0;
        let maxVal = 1.0;

        if (activeMetric === "cost") {
            minVal = 0.0;
            maxVal = 1.0;
            yAxisMax.textContent = "1.0";
            yAxisMid.textContent = "0.5";
            yAxisMin.textContent = "0.0";
        } else {
            minVal = 0.4;
            maxVal = 1.0;
            yAxisMax.textContent = "1.00";
            yAxisMid.textContent = "0.70";
            yAxisMin.textContent = "0.40";
        }

        // Coordinate converters
        const getX = (index) => (index / (epochs - 1)) * width;
        const getY = (value) => height - ((value - minVal) / (maxVal - minVal)) * height;

        // Build path strings
        let dTrain = `M ${getX(0)} ${getY(trainData[0])}`;
        let dTest = `M ${getX(0)} ${getY(testData[0])}`;

        for (let i = 1; i < epochs; i++) {
            dTrain += ` L ${getX(i)} ${getY(trainData[i])}`;
            dTest += ` L ${getX(i)} ${getY(testData[i])}`;
        }

        chartPathTrain.setAttribute("d", dTrain);
        chartPathTest.setAttribute("d", dTest);

        // Render interactive points (limit to 10 points for cleanliness)
        chartPoints.innerHTML = "";
        const step = 5; // Draw point every 5 epochs
        for (let i = 0; i < epochs; i += step) {
            const trX = getX(i);
            const trY = getY(trainData[i]);
            const teY = getY(testData[i]);

            // Train dot
            const cTrain = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            cTrain.setAttribute("cx", trX);
            cTrain.setAttribute("cy", trY);
            cTrain.setAttribute("r", "5");
            cTrain.setAttribute("class", "chart-dot dot-train");
            cTrain.addEventListener("mouseenter", (e) => showTooltip(e, i + 1, trainData[i], "Train"));
            cTrain.addEventListener("mouseleave", hideTooltip);
            chartPoints.appendChild(cTrain);

            // Test dot
            const cTest = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            cTest.setAttribute("cx", trX);
            cTest.setAttribute("cy", teY);
            cTest.setAttribute("r", "5");
            cTest.setAttribute("class", "chart-dot dot-test");
            cTest.addEventListener("mouseenter", (e) => showTooltip(e, i + 1, testData[i], "Validación"));
            cTest.addEventListener("mouseleave", hideTooltip);
            chartPoints.appendChild(cTest);
        }
    }

    function showTooltip(e, epoch, val, set) {
        const metricName = activeMetric === "cost" ? "Costo (MSE)" : "Precisión";
        chartTooltipEl.innerHTML = `
            <strong>Época ${epoch}</strong><br>
            Grupo: ${set}<br>
            ${metricName}: <strong>${val.toFixed(4)}</strong>
        `;
        chartTooltipEl.style.opacity = "1";
        
        // Position
        const wrapper = document.querySelector(".chart-canvas-wrapper");
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + 15;
        const y = e.clientY - rect.top - 40;
        chartTooltipEl.style.transform = `translate(${x}px, ${y}px)`;
    }

    function hideTooltip() {
        chartTooltipEl.style.opacity = "0";
    }

    // Setup selector buttons
    const btnShowCost = document.getElementById("btnShowCost");
    const btnShowAcc = document.getElementById("btnShowAcc");

    btnShowCost.addEventListener("click", () => {
        btnShowCost.classList.add("active");
        btnShowAcc.classList.remove("active");
        activeMetric = "cost";
        renderChart();
    });

    btnShowAcc.addEventListener("click", () => {
        btnShowAcc.classList.add("active");
        btnShowCost.classList.remove("active");
        activeMetric = "acc";
        renderChart();
    });

    // Initialize chart
    renderChart();

    // -------------------------------------------------------------
    // 5. Interactive GAN Digit Slider & Reconstruction
    // -------------------------------------------------------------
    const epochSlider = document.getElementById("epochSlider");
    const currentEpochVal = document.getElementById("currentEpochVal");
    const ganDigitGrid = document.getElementById("ganDigitGrid");
    const pqcItems = document.querySelectorAll(".pqc-sub-item");

    // Handwritten Digit '5' reconstruction stages (8x8 pixel values from 0.0 to 1.0)
    const digitStages = {
        0: [ // Epoch 0: Pure Random Noise
            0.1, 0.8, 0.3, 0.6, 0.2, 0.9, 0.4, 0.7,
            0.5, 0.2, 0.7, 0.1, 0.8, 0.3, 0.6, 0.2,
            0.9, 0.4, 0.1, 0.8, 0.3, 0.5, 0.2, 0.7,
            0.3, 0.7, 0.9, 0.2, 0.4, 0.1, 0.8, 0.5,
            0.8, 0.1, 0.3, 0.6, 0.9, 0.5, 0.2, 0.4,
            0.2, 0.9, 0.6, 0.4, 0.1, 0.8, 0.7, 0.3,
            0.7, 0.3, 0.2, 0.8, 0.5, 0.9, 0.4, 0.1,
            0.4, 0.6, 0.8, 0.3, 0.2, 0.1, 0.5, 0.9
        ],
        1: [ // Epoch 1: Vague Brightness clusters
            0.2, 0.6, 0.5, 0.4, 0.3, 0.5, 0.4, 0.2,
            0.4, 0.1, 0.3, 0.2, 0.2, 0.2, 0.5, 0.3,
            0.7, 0.5, 0.2, 0.1, 0.1, 0.2, 0.4, 0.2,
            0.5, 0.8, 0.7, 0.4, 0.2, 0.2, 0.3, 0.2,
            0.3, 0.2, 0.4, 0.7, 0.8, 0.5, 0.2, 0.2,
            0.1, 0.2, 0.2, 0.3, 0.4, 0.7, 0.5, 0.2,
            0.2, 0.4, 0.5, 0.6, 0.7, 0.6, 0.3, 0.1,
            0.2, 0.5, 0.7, 0.5, 0.3, 0.2, 0.2, 0.3
        ],
        2: [ // Epoch 2: Line structures forming
            0.4, 0.7, 0.8, 0.7, 0.5, 0.3, 0.1, 0.1,
            0.6, 0.3, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1,
            0.7, 0.8, 0.7, 0.4, 0.1, 0.1, 0.1, 0.1,
            0.2, 0.3, 0.6, 0.8, 0.6, 0.2, 0.1, 0.1,
            0.1, 0.1, 0.2, 0.4, 0.8, 0.7, 0.2, 0.1,
            0.1, 0.1, 0.1, 0.2, 0.3, 0.8, 0.5, 0.1,
            0.3, 0.5, 0.6, 0.6, 0.7, 0.7, 0.3, 0.1,
            0.1, 0.3, 0.6, 0.7, 0.5, 0.2, 0.1, 0.1
        ],
        3: [ // Epoch 3: The '5' layout emerges
            0.7, 0.9, 0.9, 0.9, 0.8, 0.4, 0.1, 0.0,
            0.8, 0.2, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0,
            0.9, 0.9, 0.9, 0.7, 0.2, 0.0, 0.0, 0.0,
            0.1, 0.2, 0.4, 0.9, 0.7, 0.1, 0.0, 0.0,
            0.0, 0.0, 0.1, 0.3, 0.9, 0.8, 0.1, 0.0,
            0.0, 0.0, 0.0, 0.1, 0.2, 0.9, 0.6, 0.0,
            0.2, 0.4, 0.7, 0.7, 0.8, 0.8, 0.2, 0.0,
            0.1, 0.2, 0.8, 0.9, 0.6, 0.1, 0.0, 0.0
        ],
        4: [ // Epoch 4: High fidelity '5' with minor noise
            0.8, 0.9, 0.9, 0.9, 0.9, 0.6, 0.1, 0.0,
            0.9, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            0.9, 0.9, 0.9, 0.9, 0.4, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.2, 0.7, 0.9, 0.2, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.1, 0.9, 0.9, 0.1, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.2, 0.9, 0.8, 0.0,
            0.1, 0.3, 0.8, 0.8, 0.9, 0.9, 0.3, 0.0,
            0.0, 0.1, 0.9, 0.9, 0.7, 0.1, 0.0, 0.0
        ],
        5: [ // Epoch 5: High fidelity, clean digit '5'
            0.9, 1.0, 1.0, 1.0, 0.9, 0.7, 0.0, 0.0,
            1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
            1.0, 1.0, 1.0, 1.0, 0.5, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.6, 1.0, 0.1, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.9, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 0.1, 1.0, 0.9, 0.0,
            0.0, 0.2, 0.9, 0.9, 1.0, 0.9, 0.2, 0.0,
            0.0, 0.0, 0.9, 1.0, 0.7, 0.0, 0.0, 0.0
        ]
    };

    function renderGrid(epoch) {
        ganDigitGrid.innerHTML = "";
        const pixels = digitStages[epoch];

        pixels.forEach((val, idx) => {
            const cell = document.createElement("div");
            cell.className = "pixel-cell";
            // Map 0-1 to slate-to-cyan scale
            // 0.0 -> #0f172a (dark blue-gray)
            // 1.0 -> #00f2fe (cyan)
            const r = Math.round(15 + val * (0 - 15));
            const g = Math.round(23 + val * (242 - 23));
            const b = Math.round(42 + val * (254 - 42));
            cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            
            // Add custom attribute to track pixel index
            cell.setAttribute("data-pixel-index", idx);
            ganDigitGrid.appendChild(cell);
        });
    }

    // Render initial grid
    renderGrid(0);

    epochSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        currentEpochVal.textContent = val;
        renderGrid(val);
    });

    // PQC hovering shows patch coordinates
    // Parche size: 4x4 (16 pixels)
    // Patch 0: top-left (rows 0-3, cols 0-3)
    // Patch 1: top-right (rows 0-3, cols 4-7)
    // Patch 2: bottom-left (rows 4-7, cols 0-3)
    // Patch 3: bottom-right (rows 4-7, cols 4-7)
    const patchPixels = {
        0: [0,1,2,3, 8,9,10,11, 16,17,18,19, 24,25,26,27],
        1: [4,5,6,7, 12,13,14,15, 20,21,22,23, 28,29,30,31],
        2: [32,33,34,35, 40,41,42,43, 48,49,50,51, 56,57,58,59],
        3: [36,37,38,39, 44,45,46,47, 52,53,54,55, 60,61,62,63]
    };

    pqcItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const patchIdx = parseInt(item.getAttribute("data-patch"));
            pqcItems.forEach(p => p.classList.remove("active"));
            item.classList.add("active");

            // Highlight corresponding pixels in grid
            const indices = patchPixels[patchIdx];
            const cells = ganDigitGrid.querySelectorAll(".pixel-cell");
            cells.forEach((cell, idx) => {
                if (indices.includes(idx)) {
                    cell.style.outline = "2px solid var(--cyan)";
                    cell.style.zIndex = "1";
                } else {
                    cell.style.opacity = "0.3";
                }
            });
        });

        item.addEventListener("mouseleave", () => {
            const cells = ganDigitGrid.querySelectorAll(".pixel-cell");
            cells.forEach(cell => {
                cell.style.outline = "none";
                cell.style.opacity = "1";
            });
        });
    });

    // -------------------------------------------------------------
    // 6. Interactive Sandbox Simulator Console
    // -------------------------------------------------------------
    const simModel = document.getElementById("simModel");
    const simLr = document.getElementById("simLr");
    const simBatchSize = document.getElementById("simBatchSize");
    const simSpeed = document.getElementById("simSpeed");
    const btnStartSim = document.getElementById("btnStartSim");
    const btnPauseSim = document.getElementById("btnPauseSim");
    const btnResetSim = document.getElementById("btnResetSim");

    const lblMetric1 = document.getElementById("lblMetric1");
    const lblMetric2 = document.getElementById("lblMetric2");
    const lblMetric3 = document.getElementById("lblMetric3");
    const lblMetric4 = document.getElementById("lblMetric4");

    const valMetric1 = document.getElementById("valMetric1");
    const valMetric2 = document.getElementById("valMetric2");
    const valMetric3 = document.getElementById("valMetric3");
    const valMetric4 = document.getElementById("valMetric4");

    const simConsole = document.getElementById("simConsole");
    const liveChartSvg = document.getElementById("liveChartSvg");
    const livePath1 = document.getElementById("livePath1");
    const livePath2 = document.getElementById("livePath2");
    const liveChartGrid = document.getElementById("liveChartGrid");

    const visualizerPlaceholder = document.getElementById("visualizerPlaceholder");
    const liveClassifierPlot = document.getElementById("liveClassifierPlot");
    const liveGanGrid = document.getElementById("liveGanGrid");

    const sandboxTabs = document.querySelectorAll(".panel-header-tabs .panel-tab-btn");
    const sandboxPanes = document.querySelectorAll(".panel-tab-content .tab-content-pane");

    // Tab control inside sandbox panel
    sandboxTabs.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            sandboxTabs.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            sandboxPanes.forEach(p => p.classList.remove("active"));
            sandboxPanes[idx].classList.add("active");
        });
    });

    let simInterval = null;
    let simEpoch = 0;
    let simIsRunning = false;
    let history1 = [];
    let history2 = [];

    // Detailed logs for the training simulation
    const simLogs = {
        classifier: [
            { system: "[SYSTEM] Inicializando dataset Wine (2 clases, 178 muestras)..." },
            { info: "[INFO] Reduciendo y mapeando etiquetas a {-1, 1}." },
            { info: "[INFO] Creando dispositivo 'default.qubit' con 13 wires (qubits)." },
            { info: "[INFO] Ansätze parametrizado con 2 capas unitarias (78 parámetros)." },
            { info: "[INFO] Optimizador inicializado: Adam (lr = $LR$)." },
            { system: "[SYSTEM] Entrenamiento iniciado." }
        ],
        gan: [
            { system: "[SYSTEM] Cargando dataset UCI 'optdigits' filtrando para el dígito '5'..." },
            { info: "[INFO] Normalizando intensidades de píxeles en el rango [0, 1]." },
            { info: "[INFO] Creando dispositivo cuántico 'lightning.qubit' de 5 qubits." },
            { info: "[INFO] Inicializando 4 subgeneradores cuánticos por parches (36 parámetros)." },
            { info: "[INFO] Discriminador clásico PyTorch MLP (64 -> 256 -> 128 -> 1)." },
            { info: "[INFO] Optimizador: SGD (lr = $LR$, batch_size = $BATCH$)." },
            { system: "[SYSTEM] Entrenamiento adversario iniciado." }
        ]
    };

    function appendConsole(text, type = "info") {
        const line = document.createElement("span");
        line.className = `console-line ${type}`;
        line.textContent = text;
        simConsole.appendChild(line);
        simConsole.scrollTop = simConsole.scrollHeight;
    }

    function initSimulation() {
        simEpoch = 0;
        history1 = [];
        history2 = [];
        simConsole.innerHTML = "";
        
        livePath1.setAttribute("d", "");
        livePath2.setAttribute("d", "");
        liveChartGrid.innerHTML = "";

        const model = simModel.value;
        const lr = parseFloat(simLr.value);
        const batch = parseInt(simBatchSize.value);

        // Set Labels on Dashboard
        if (model === "classifier") {
            lblMetric1.textContent = "Costo Train (MSE)";
            lblMetric2.textContent = "Costo Test (MSE)";
            lblMetric3.textContent = "Acc Train";
            lblMetric4.textContent = "Acc Test";
            
            valMetric1.textContent = "0.0000";
            valMetric2.textContent = "0.0000";
            valMetric3.textContent = "0.0000";
            valMetric4.textContent = "0.0000";

            visualizerPlaceholder.classList.add("hidden");
            liveClassifierPlot.classList.remove("hidden");
            liveGanGrid.classList.add("hidden");
            
            // Build mock wine points
            buildWineScatterPlot();
        } else {
            lblMetric1.textContent = "Pérdida D (Disc)";
            lblMetric2.textContent = "Pérdida G (Gen)";
            lblMetric3.textContent = "Precisión Real D";
            lblMetric4.textContent = "Precisión Fake D";
            
            valMetric1.textContent = "0.0000";
            valMetric2.textContent = "0.0000";
            valMetric3.textContent = "0.0000";
            valMetric4.textContent = "0.0000";

            visualizerPlaceholder.classList.add("hidden");
            liveClassifierPlot.classList.add("hidden");
            liveGanGrid.classList.remove("hidden");

            // Build grid
            renderLiveGanGrid(0);
        }

        // Print initial logs
        const logs = simLogs[model];
        logs.forEach(log => {
            const key = Object.keys(log)[0];
            let text = log[key].replace("$LR$", lr).replace("$BATCH$", batch);
            appendConsole(text, key);
        });
    }

    function buildWineScatterPlot() {
        liveClassifierPlot.innerHTML = "";
        liveClassifierPlot.style.display = "flex";
        liveClassifierPlot.style.flexWrap = "wrap";
        liveClassifierPlot.style.gap = "10px";
        liveClassifierPlot.style.alignItems = "center";
        liveClassifierPlot.style.justifyContent = "center";

        // Create 20 mock wine dots
        for (let i = 0; i < 24; i++) {
            const dot = document.createElement("div");
            dot.style.width = "16px";
            dot.style.height = "16px";
            dot.style.borderRadius = "50%";
            dot.style.border = "1px solid var(--white)";
            dot.style.transition = "background-color 0.4s ease";
            
            const isClass1 = i < 12;
            dot.setAttribute("data-class", isClass1 ? "1" : "-1");
            
            // Initialize random mix (unclassified state)
            dot.style.backgroundColor = "var(--text-muted)";
            liveClassifierPlot.appendChild(dot);
        }
    }

    function updateWineScatterPlot(acc) {
        const dots = liveClassifierPlot.querySelectorAll("div");
        dots.forEach((dot, idx) => {
            const actualClass = dot.getAttribute("data-class");
            // Higher accuracy means higher probability of correct class color
            const roll = Math.random();
            if (roll < acc) {
                // Correct color
                dot.style.backgroundColor = actualClass === "1" ? "var(--cyan)" : "var(--purple)";
            } else {
                // Incorrect/mixed color
                dot.style.backgroundColor = actualClass === "1" ? "var(--purple)" : "var(--cyan)";
            }
        });
    }

    function renderLiveGanGrid(epoch) {
        liveGanGrid.innerHTML = "";
        const idx = Math.min(Math.floor(epoch), 5);
        const pixels = digitStages[idx];

        pixels.forEach(val => {
            const cell = document.createElement("div");
            cell.className = "pixel-cell";
            // Map to grayscale representation
            const shade = Math.round(val * 255);
            cell.style.backgroundColor = `rgb(${shade}, ${shade}, ${shade})`;
            liveGanGrid.appendChild(cell);
        });
    }

    function runSimulationStep() {
        const model = simModel.value;
        const totalEpochs = model === "classifier" ? 50 : 5;

        if (simEpoch >= totalEpochs) {
            clearInterval(simInterval);
            appendConsole(`[SYSTEM] Entrenamiento finalizado con éxito en ${totalEpochs} épocas.`, "success");
            btnStartSim.disabled = false;
            btnPauseSim.disabled = true;
            simIsRunning = false;
            return;
        }

        simEpoch++;

        if (model === "classifier") {
            const trCost = qnnMetrics.cost.train[simEpoch - 1];
            const teCost = qnnMetrics.cost.test[simEpoch - 1];
            const trAcc = qnnMetrics.acc.train[simEpoch - 1];
            const teAcc = qnnMetrics.acc.test[simEpoch - 1];

            valMetric1.textContent = trCost.toFixed(4);
            valMetric2.textContent = teCost.toFixed(4);
            valMetric3.textContent = (trAcc * 100).toFixed(2) + "%";
            valMetric4.textContent = (teAcc * 100).toFixed(2) + "%";

            appendConsole(`Época ${simEpoch}/50 - cost_train: ${trCost.toFixed(4)} - cost_test: ${teCost.toFixed(4)} - train_acc: ${trAcc.toFixed(4)} - test_acc: ${teAcc.toFixed(4)}`, "epoch");

            // Save to history and redraw chart (cost)
            history1.push(trCost);
            history2.push(teCost);
            drawLiveChart(50, 1.0, 0.0);

            // Update live visualization dots
            updateWineScatterPlot(teAcc);

        } else {
            // GAN training metrics
            const ganMetrics = {
                dLoss: [1.377, 1.362, 1.344, 1.346, 1.321],
                gLoss: [0.722, 0.714, 0.700, 0.735, 0.703]
            };

            const dLossVal = ganMetrics.dLoss[simEpoch - 1];
            const gLossVal = ganMetrics.gLoss[simEpoch - 1];
            
            // Random fluctuations for D accuracy
            const dRealAcc = 0.5 + Math.random() * 0.15;
            const dFakeAcc = 0.5 - Math.random() * 0.1;

            valMetric1.textContent = dLossVal.toFixed(4);
            valMetric2.textContent = gLossVal.toFixed(4);
            valMetric3.textContent = (dRealAcc * 100).toFixed(1) + "%";
            valMetric4.textContent = (dFakeAcc * 100).toFixed(1) + "%";

            appendConsole(`Época ${simEpoch}/5 - discriminator loss: ${dLossVal.toFixed(4)} - generator loss: ${gLossVal.toFixed(4)}`, "epoch");

            // Save history
            history1.push(dLossVal);
            history2.push(gLossVal);
            drawLiveChart(5, 1.5, 0.0);

            // Update live digit grid
            renderLiveGanGrid(simEpoch);
        }
    }

    function drawLiveChart(maxEpochs, maxY, minY) {
        const width = 600;
        const height = 250;
        
        const getX = (idx) => (idx / (maxEpochs - 1)) * width;
        const getY = (val) => height - ((val - minY) / (maxY - minY)) * height;

        // Path 1
        if (history1.length > 0) {
            let d1 = `M ${getX(0)} ${getY(history1[0])}`;
            for (let i = 1; i < history1.length; i++) {
                d1 += ` L ${getX(i)} ${getY(history1[i])}`;
            }
            livePath1.setAttribute("d", d1);
        }

        // Path 2
        if (history2.length > 0) {
            let d2 = `M ${getX(0)} ${getY(history2[0])}`;
            for (let i = 1; i < history2.length; i++) {
                d2 += ` L ${getX(i)} ${getY(history2[i])}`;
            }
            livePath2.setAttribute("d", d2);
        }

        // Draw grids on chart
        liveChartGrid.innerHTML = "";
        for (let i = 0; i < history1.length; i++) {
            const dot1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot1.setAttribute("cx", getX(i));
            dot1.setAttribute("cy", getY(history1[i]));
            dot1.setAttribute("r", "4");
            dot1.setAttribute("fill", "var(--cyan)");
            liveChartGrid.appendChild(dot1);

            const dot2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            dot2.setAttribute("cx", getX(i));
            dot2.setAttribute("cy", getY(history2[i]));
            dot2.setAttribute("r", "4");
            dot2.setAttribute("fill", "var(--purple)");
            liveChartGrid.appendChild(dot2);
        }
    }

    btnStartSim.addEventListener("click", () => {
        if (!simIsRunning) {
            if (simEpoch === 0) {
                initSimulation();
            }
            const speed = parseInt(simSpeed.value);
            simInterval = setInterval(runSimulationStep, speed);
            btnStartSim.disabled = true;
            btnPauseSim.disabled = false;
            simIsRunning = true;
            appendConsole("[SYSTEM] Simulación reanudada.");
        }
    });

    btnPauseSim.addEventListener("click", () => {
        if (simIsRunning) {
            clearInterval(simInterval);
            btnStartSim.disabled = false;
            btnPauseSim.disabled = true;
            simIsRunning = false;
            appendConsole("[SYSTEM] Simulación pausada.");
        }
    });

    btnResetSim.addEventListener("click", () => {
        clearInterval(simInterval);
        btnStartSim.disabled = false;
        btnPauseSim.disabled = true;
        simIsRunning = false;
        initSimulation();
        appendConsole("[SYSTEM] Simulación reiniciada.");
    });

    // Initialize sandbox controls
    initSimulation();
    
    // -------------------------------------------------------------
    // 7. Search Feature for Documentation
    // -------------------------------------------------------------
    const docSearch = document.getElementById("docSearch");
    docSearch.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query === "") return;

        // Perform search across headings and text content
        const headings = document.querySelectorAll("main h2, main h3, main p");
        let firstMatch = null;

        headings.forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes(query)) {
                // Highlight temporarily
                el.style.backgroundColor = "rgba(0, 242, 254, 0.2)";
                setTimeout(() => {
                    el.style.backgroundColor = "transparent";
                }, 2000);
                
                if (!firstMatch) {
                    firstMatch = el;
                }
            }
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    });
});
