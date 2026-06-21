# ⚛️ Aprendizaje Automático Cuántico (QML) - Laboratorio de Experimentos

[![PennyLane](https://img.shields.io/badge/PennyLane-0.34%2B-blueviolet?style=for-the-badge&logo=pennylane)](https://pennylane.ai/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-orange?style=for-the-badge&logo=pytorch)](https://pytorch.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.2%2B-blue?style=for-the-badge&logo=scikitlearn)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)](https://www.python.org/)

Este repositorio alberga el código fuente, notebooks optimizados y explicaciones matemáticas detalladas para dos modelos de vanguardia en el campo del **Aprendizaje Automático Cuántico (QML)**. Los experimentos combinan computación cuántica simulada con redes neuronales clásicas para resolver tareas de clasificación y generación de imágenes.

---

## 🚀 Portal de Documentación Interactiva (Recomendado)

> [!TIP]
> **¡Experimenta el potencial cuántico visualmente!**
> Hemos desarrollado un portal de documentación interactiva en **Modo Oscuro** con diseño *Glassmorphism* que puedes abrir de forma local en tu navegador.
> 
> * **Archivo del Portal**: [docs/index.html](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/docs/index.html)
> * **Cómo abrirlo**: Simplemente haz doble clic en `docs/index.html` o ábrelo en tu navegador.
> * **Funcionalidades del Portal**:
>   - **Visualización de Circuitos**: Diagrama vectorial interactivo de qubits con explicaciones de compuertas cuánticas.
>   - **Gráficos de Entrenamiento Dinámicos**: Curvas interactivas de costo (MSE) y precisión con valores al pasar el cursor.
>   - **Visualizador GAN Progresivo**: Slider interactivo para ver la reconstrucción del dígito '5' de la época 0 a la 5.
>   - **Consola Sandbox**: Modifica hiperparámetros (lr, batch size) y simula el entrenamiento en vivo con logs en tiempo real.

---

## 🔬 Experimentos Implementados

### 1. Clasificador Cuántico QNN (Wine Dataset)
* **Notebook**: [quatum_classifier.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quatum_classifier.ipynb)
* **Objetivo**: Clasificación binaria de muestras químicas del dataset Wine de Scikit-Learn.
* **Modelo Cuántico**: Circuito Cuántico Parametrizado (PQC) de 13 qubits y 2 capas entrelazadas.

```mermaid
graph LR
    A[Características del Vino x ∈ ℝ¹³] --> B[Normalización Min-Max a [0, π]]
    B --> C[Angle Embedding Rx en 13 Qubits]
    C --> D[Entrelazador CNOT Lineal]
    D --> E[Capa Parametrizada Rot(α,β,γ)]
    E --> F[Entrelazamiento CNOT Circular]
    F --> G[Medición del Valor Esperado ⟨Z₀⟩]
    G --> H[Predicción de Clase [-1, 1]]
```

### 2. Quantum Patch GAN (Generación de Dígitos)
* **Notebook**: [quantum_patch_gan.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quantum_patch_gan.ipynb)
* **Objetivo**: Sintetizar imágenes de $8\times 8$ píxeles del dígito manuscrito '5'.
* **Modelo Cuántico-Clásico**: Generador cuántico dividido en parches (4 sub-circuitos de 5 qubits con ancilas) y un discriminador clásico PyTorch perceptrón multicapa (MLP).

```mermaid
graph TD
    subgraph Generador Cuántico (G)
        A[Vector Latente z ∈ [0, π]⁵] --> B1[Sub-PQC 1]
        A --> B2[Sub-PQC 2]
        A --> B3[Sub-PQC 3]
        A --> B4[Sub-PQC 4]
        B1 --> C1[Medición Parcial de Ancila]
        B2 --> C2[Medición Parcial de Ancila]
        B3 --> C3[Medición Parcial de Ancila]
        B4 --> C4[Medición Parcial de Ancila]
        C1 --> D1[Parche 1: 4x4 px]
        C2 --> D2[Parche 2: 4x4 px]
        C3 --> D3[Parche 3: 4x4 px]
        C4 --> D4[Parche 4: 4x4 px]
        D1 & D2 & D3 & D4 --> E[Imagen Generada 8x8 px]
    end
    E --> F[Discriminador Clásico MLP PyTorch]
    G[Imagen Real 8x8 optdigits] --> F
    F --> H[Clasificación Real/Sintética]
```

---

## 📐 Fundamentos Matemáticos

### Codificación de Características
Para introducir variables reales en el estado cuántico $|\psi\rangle$, se utiliza **Angle Embedding**. Las características se mapean a rotaciones en la Esfera de Bloch:
$$|\psi(\vec{x})\rangle = \bigotimes_{j=1}^n R_x(x_j) |0\rangle^{\otimes n}$$
Donde la compuerta elemental se define como $R_x(\theta) = \exp\left(-i \frac{\theta}{2} X\right)$.

### Ansatz Parametrizado (Capas del QNN)
Cada qubit es rotado bajo tres ángulos controlables $\vec{\theta} = \{\alpha, \beta, \gamma\}$ mediante la compuerta general unitaria `Rot`:
$$R(\alpha, \beta, \gamma) = R_z(\gamma) R_y(\beta) R_z(\alpha)$$
El entrelazamiento circular utiliza compuertas CNOT de acoplamiento periódico para entrelazar el espacio de Hilbert completo.

### Reducción Cuántica en Patch GAN
Para generar un parche de 16 píxeles con solo 5 qubits, se utiliza una medición proyectiva en la ancila ($q_4$). Las probabilidades se calculan sobre la densidad de estado reducida:
$$P(x_0 \dots x_3) = \text{Tr}_{q_4} \left( |\psi\rangle \langle \psi | \otimes |1\rangle\langle 1|_{q_4} \right)$$
Esto produce una salida de $2^4 = 16$ intensidades escaladas que reconstruyen el parche $4\times 4$ de la imagen.

---

## 📊 Comparativa de Modelos

| Métrica / Atributo | Clasificador QNN (Wine) | Quantum Patch GAN (Digits) |
| :--- | :--- | :--- |
| **Dataset** | Wine Dataset (Scikit-Learn) | optdigits (Handwritten '5') |
| **Tipo de Tarea** | Clasificación Binaria | Generación Adversaria |
| **Qubits Totales** | 13 qubits | 20 qubits (4x PQCs de 5 qubits) |
| **Parámetros Ajustables** | 78 parámetros | 36 parámetros |
| **Optimizador** | Adam ($\eta = 0.01$) | SGD ($\eta = 0.01$) |
| **Función de Pérdida** | MSE Loss | Binary Cross Entropy (BCE) |
| **Métrica Final** | Precisión de Test: **~92%** | D Loss: **~1.32** / G Loss: **~0.70** |

---

## 🛠️ Configuración y Ejecución Local

Se ha provisto un entorno virtual preconfigurado (`.venv`) en la raíz del repositorio con todas las bibliotecas instaladas.

### 1. Activar el Entorno Virtual
Abre tu shell preferido en el directorio del proyecto y ejecuta:

* **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
* **Git Bash / WSL / Linux / macOS**:
  ```bash
  source .venv/Scripts/activate
  ```

### 2. Iniciar Jupyter Lab
Inicia el entorno Jupyter para ejecutar los notebooks:
```bash
jupyter lab
```

> [!IMPORTANT]
> **Kernel Jupyter**: Al abrir cualquiera de los notebooks (`quatum_classifier.ipynb` o `quantum_patch_gan.ipynb`), asegúrate de seleccionar el kernel del entorno virtual local (`.venv`) en la esquina superior derecha de Jupyter Lab para evitar problemas de dependencias faltantes.

---

## 📂 Estructura de Directorios

```bash
├── code/
│   └── chapter5_qnn/
│       └── data/
│           └── optdigits.tra       # Dataset original UCI de dígitos escritos a mano
├── docs/
│   ├── index.html                  # Portal web de documentación interactiva (HTML5/JS)
│   ├── styles.css                  # Estilos premium (Glassmorphism & Neon Glow)
│   ├── app.js                      # Controlador JS del portal, sliders y simulador
│   └── README.md                   # Documentación teórica y matemática formal (Markdown)
├── quatum_classifier.ipynb         # Notebook con el clasificador binario Wine
├── quantum_patch_gan.ipynb         # Notebook con el generador de parches de dígitos GAN
├── .gitignore                      # Exclusiones estándar del repositorio Git
└── README.md                       # Presentación general del laboratorio (este archivo)
```

---

## 🔍 Solución de Problemas

* **Error de importación de PennyLane o PyTorch**: Asegúrate de haber activado el entorno virtual (`.venv`) antes de lanzar Jupyter.
* **Simulaciones Cuánticas Lentas**: 
  - El simulador del clasificador utiliza `default.qubit` sobre 13 qubits. El cálculo de gradientes por autograd puede demorar unos minutos.
  - El Patch GAN utiliza `lightning.qubit` para optimizar el rendimiento de simulación en hardware moderno. Si dispones de recursos avanzados, puedes alternar los dispositivos para evaluar la aceleración física.

---

## 🔮 Líneas de Investigación Futura
- **Ansätze Convolucionales Cuánticos (QCNN)**: Reducir la dimensionalidad de entrada mediante compuertas de pooling cuántico para datasets de mayor escala (como MNIST completo).
- **Ejecución en Hardware Físico**: Configurar tokens de acceso a dispositivos QPUs reales de IBM Quantum o Rigetti a través del plugin `pennylane-qiskit`.
