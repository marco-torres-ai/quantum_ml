# Documentación Técnica: Aprendizaje Automático Cuántico (QML)

Este repositorio contiene experimentos prácticos sobre modelos híbridos clásicos-cuánticos y circuitos cuánticos parametrizados (PQCs) aplicados al aprendizaje automático. Se presentan dos arquitecturas clave:
1. **Clasificador Binario Cuántico (QNN)** para el dataset de vinos de Scikit-Learn.
2. **Quantum Patch GAN** para la generación híbrida de imágenes del dígito '5'.

---

## 1. Clasificador Binario Cuántico (Vinos)

### Objetivo y Dataset
El objetivo es clasificar muestras de vino en dos clases utilizando un circuito cuántico parametrizado (PQC) como un clasificador de red neuronal cuántica (QNN). El dataset contiene 13 características clásicas (contenido de alcohol, ácido málico, ceniza, etc.).

### Preprocesamiento y Codificación
Dado que las características del vino tienen magnitudes y rangos muy dispares, se aplican los siguientes pasos antes de la codificación cuántica:
1. **Normalización Min-Max**: Escalar cada característica en el rango $[0, \pi]$ para servir de ángulos de rotación de compuertas cuánticas:
   $$x'_i = \pi \cdot \frac{x_i - \min(x)}{\max(x) - \min(x)}$$
2. **Mapeo de Etiquetas**: Las etiquetas de clase $\{0, 1\}$ del dataset original se transforman a $\{-1, 1\}$ para alinearse con los valores esperados de las mediciones del operador de Pauli $Z$ ($\langle Z \rangle \in [-1, 1]$).
3. **Codificación de Ángulo (Angle Embedding)**: Las 13 características normalizadas se codifican en un estado cuántico de 13 qubits mediante compuertas de rotación $R_x(x'_i)$ seguidas de un entrelazador lineal de compuertas CNOT para correlacionar las variables.

```
       ┌────────────────────────┐
 |0⟩ ──┤ Rx(x'_0)  ├─────■──────┤ ...
       ├─────────────────┤ │ ┌──┴──┐
 |0⟩ ──┤ Rx(x'_1)  ├─────┴─┤  X  ├─── ...
       └─────────────────┘   └─────┘
```

### Arquitectura de la Red Neuronal Cuántica (QNN)
El clasificador consta de un circuito parametrizado estructurado en capas (ansatz). Cada capa consta de:
1. **Rotaciones Unitarias Parametrizadas**: Compuertas `qml.Rot` para cada qubit, controladas por tres parámetros ajustables $\alpha, \beta, \gamma$:
   $$R(\alpha, \beta, \gamma) = R_z(\gamma) R_y(\beta) R_z(\alpha)$$
2. **Bloque Entrelazador**: Compuertas CNOT en cascada lineal que conectan qubits contiguos ($q_j$ y $q_{j+1}$) para inducir entrelazamiento cuántico multi-qubit.

### Optimización y Pérdida
El observable medido al final del circuito es el valor esperado del operador Pauli $Z$ en el primer qubit:
$$\hat{y}(\vec{x}, \vec{\theta}) = \langle \psi(\vec{x}, \vec{\theta}) | Z_0 | \psi(\vec{x}, \vec{\theta}) \rangle$$

La optimización se realiza minimizando la función de costo del error cuadrático medio (MSE Loss):
$$\mathcal{L}(\vec{\theta}) = \frac{1}{N} \sum_{k=1}^N \left( \hat{y}(\vec{x}^{(k)}, \vec{\theta}) - y^{(k)} \right)^2$$

El modelo se entrena usando el optimizador **Adam** con una tasa de aprendizaje $\eta = 0.01$ y un tamaño de lote (batch size) de 4 a lo largo de 50 épocas.

---

## 2. Quantum Patch GAN (Generación de Dígitos)

### Concepto de Patch GAN Cuántico
Las limitaciones de qubits en simuladores y hardware cuántico actual (NISQ) dificultan la generación de imágenes de alta resolución. Para generar una imagen de $8\times 8$ píxeles (64 valores), un generador cuántico estándar requeriría al menos 6 qubits para codificación de amplitudes de estados base ($2^6=64$), o 64 qubits para codificación individual de estados. 

El modelo **Patch GAN** divide la imagen de $8\times 8$ en **4 parches independientes de $4\times 4$ píxeles (16 valores cada uno)**. Cuatro subgeneradores cuánticos de 5 qubits generan un parche de 16 valores cada uno, reduciendo drásticamente la dimensión del espacio de Hilbert requerido en cada simulación.

```
       ┌────────────────────────────────────────────────────────┐
 z ───►│                     GENERADOR CUÁNTICO                 │
       │  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐  │
       │  │ PQC #1  │   │ PQC #2  │   │ PQC #3  │   │ PQC #4  │  │
       │  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘  │
       │       ▼            ▼            ▼            ▼          │
       │   Parche 1     Parche 2     Parche 3     Parche 4       │
       │   (16 px)      (16 px)      (16 px)      (16 px)        │
       └───────┼────────────┼────────────┼────────────┼──────────┘
               ▼            ▼            ▼            ▼
       ┌────────────────────────────────────────────────────────┐
       │             Imagen Reconstruida (8x8 Píxeles)           │
       └───────────────────────────┬────────────────────────────┘
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │            DISCRIMINADOR CLÁSICO (MLP PyTorch)         │
       └───────────────────────────┬────────────────────────────┘
                                   ▼
                          ¿Real o Sintética?
```

### Arquitectura del Generador Cuántico
Cada subgenerador consta de un circuito cuántico de 5 qubits ($q_0$ a $q_4$):
1. **Codificación del Estado Latente**: El vector de ruido latente $z \in \mathbb{R}^5$ (donde $z_i \sim \mathcal{U}(0, \pi)$) se codifica aplicando compuertas de rotación $R_y(z_i)$ en cada uno de los 5 qubits.
2. **Circuito Cuántico Parametrizado (PQC)**: Consta de 6 capas repetidas de:
   - Rotaciones parametrizadas generales `qml.Rot` sobre cada uno de los 5 qubits.
   - Compuertas de control de fase `CZ` para entrelazar qubits vecinos adyacentes ($q_j$ y $q_{j+1}$).
3. **Medición y Post-procesamiento**:
   - Se realiza una medición parcial en el qubit ancila ($q_4$) usando `qml.measure`.
   - Se calcula la distribución de probabilidad de los 4 qubits restantes ($q_0$ a $q_3$), lo que devuelve un vector de $2^4 = 16$ probabilidades.
   - Estas 16 probabilidades se re-escalan linealmente para representar las intensidades de los píxeles de un parche de $4\times 4$.

### Arquitectura del Discriminador Clásico
El discriminador es una red clásica perceptrón multicapa (MLP) construida en PyTorch:
- **Entrada**: Imagen aplanada de 64 dimensiones (8x8 píxeles).
- **Capa Oculta 1**: Lineal (64 $\to$ 256), activación ReLU y Dropout para regularización.
- **Capa Oculta 2**: Lineal (256 $\to$ 128), activación ReLU y Dropout.
- **Salida**: Lineal (128 $\to$ 1), activación Sigmoide para calcular la probabilidad de que la imagen sea real.

### Función de Pérdida Adversaria y Entrenamiento
El discriminador $D$ y el generador cuántico $G$ se entrenan de forma alterna utilizando una función de pérdida de entropía cruzada binaria (BCE Loss):

$$\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[ \log D(x) ] + \mathbb{E}_{z \sim p_{z}}[ \log(1 - D(G(z))) ]$$

- **Discriminador**: Maximiza la probabilidad de asignar la etiqueta correcta tanto a imágenes reales del dataset UCI `optdigits` como a las imágenes falsas generadas.
- **Generador**: Minimiza la probabilidad de que el discriminador detecte sus imágenes sintéticas como falsas (optimizando directamente los parámetros $\vec{\theta}$ del PQC cuántico a través de PyTorch y PennyLane).

---

## Ejecución Local y Requisitos

### Requisitos del Sistema
- Python 3.9 o superior.
- PennyLane.
- PyTorch (con Autograd integrado).
- Scikit-Learn y Matplotlib.

### Pasos para Ejecutar
1. Instalar dependencias en el entorno virtual activo:
   ```bash
   pip install -r requirements.txt
   ```
2. Ejecutar Jupyter Lab/Notebook:
   ```bash
   jupyter lab
   ```
3. Abrir y ejecutar las celdas de [quatum_classifier.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quatum_classifier.ipynb) y [quantum_patch_gan.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quantum_patch_gan.ipynb).
