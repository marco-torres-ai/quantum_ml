# ⚛️ Aprendizaje Automático Cuántico (QML) - Experimentos de Laboratorio

Este repositorio contiene implementaciones optimizadas de modelos de **Aprendizaje Automático Cuántico (QML)** utilizando el stack de **PennyLane**, **PyTorch** y **Scikit-Learn**. Se abordan dos problemas fundamentales de la inteligencia artificial moderna: **Clasificación Binaria Cuántica** (red neuronal cuántica discriminativa) y **Quantum Patch GAN** (red generativa adversaria para síntesis de imágenes).

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

## 🔬 Descripción de Experimentos

### 1. Clasificador Cuántico QNN (Wine Dataset)
* **Notebook**: [quatum_classifier.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quatum_classifier.ipynb)
* **Objetivo**: Clasificación binaria de muestras químicas de vinos en base a 13 variables fisicoquímicas.
* **Modelo Cuántico**: Circuito Cuántico Parametrizado (PQC) con Angle Embedding y entrelazamiento circular CNOT.

```mermaid
graph LR
    A[Datos Clásicos x ∈ ℝ¹³] --> B[Normalización Min-Max a [0, π]]
    B --> C[Angle Embedding Rx en 13 Qubits]
    C --> D[Entrelazador CNOT Lineal]
    D --> E[Capa Parametrizada Rot(α,β,γ)]
    E --> F[Entrelazamiento CNOT Circular]
    F --> G[Medición del Valor Esperado ⟨Z₀⟩]
    G --> H[Predicción de Clase [-1, 1]]
```

#### Código Núcleo:
```python
# Codificación y Ansatz del Clasificador Cuántico
def data_encoding(x):
    n_qubit = len(x)
    qml.AngleEmbedding(features=x, wires=range(n_qubit), rotation='X')
    for i in range(n_qubit):
        if i + 1 < n_qubit:
            qml.CNOT(wires=[i, i + 1])

def classifier(param, x=None):
    data_encoding(x)
    n_layer, n_qubit = param.shape[0], param.shape[1]
    for i in range(n_layer):
        for j in range(n_qubit):
            qml.Rot(param[i, j, 0], param[i, j, 1], param[i, j, 2], wires=j)
        for j in range(n_qubit):
            if j + 1 < n_qubit:
                qml.CNOT(wires=[j, j + 1])
    return qml.expval(qml.PauliZ(0))
```

---

### 2. Quantum Patch GAN (Generación de Dígitos)
* **Notebook**: [quantum_patch_gan.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quantum_patch_gan.ipynb)
* **Objetivo**: Generar imágenes sintéticas de $8\times 8$ píxeles del dígito manuscrito '5'.
* **Modelo**: Generador cuántico dividido en 4 parches independientes de 16 píxeles (cada uno alimentado por un PQC de 5 qubits con 1 qubit ancila medido parcialmente) y un discriminador clásico PyTorch MLP.

```mermaid
graph TD
    subgraph Generador Cuántico por Parches (G)
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

#### Código Núcleo:
```python
# Generador cuántico por parches y Discriminador clásico
class PatchQuantumGenerator(nn.Module):
    def __init__(self, qnode_generator, n_generator, n_qubit, n_qubit_a, n_layer):
        super().__init__()
        self.params_generator = nn.ParameterList([
            nn.Parameter(torch.rand((n_layer, n_qubit, 3)), requires_grad=True)
            for _ in range(n_generator)
        ])
        self.qnode_generator = qnode_generator
        self.n_qubit_a = n_qubit_a
        
    def forward(self, z):
        images_generated = []
        for x in z:
            patches = []
            for i in range(len(self.params_generator)):
                # Ejecuta cada circuito cuántico parametrizado
                probs = self.qnode_generator(self.params_generator[i], x)
                patches.append(probs)
            images_generated.append(torch.cat(patches))
        return torch.stack(images_generated)

class ClassicalDiscriminator(nn.Module):
    def __init__(self, input_shape):
        super().__init__()
        self.model = nn.Sequential(
            nn.Flatten(),
            nn.Linear(int(np.prod(input_shape)), 256),
            nn.ReLU(),
            nn.Dropout(),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )
```

---

## 📐 Ecuaciones y Fundamentos Teóricos

### 1. Codificación Cuántica (State Encoding)
Mapea el vector real clásico $x$ al espacio de Hilbert mediante rotaciones cuánticas unitarias:
$$|\psi(\vec{x})\rangle = \bigotimes_{j=1}^n R_x(x_j) |0\rangle^{\otimes n}$$
Donde la compuerta cuántica unitaria $R_x(\theta)$ se expresa matricialmente en la base computacional como:
$$R_x(\theta) = \exp\left(-i \frac{\theta}{2} X\right) = \begin{pmatrix} \cos(\theta/2) & -i\sin(\theta/2) \\ -i\sin(\theta/2) & \cos(\theta/2) \end{pmatrix}$$

### 2. Capas Variacionales (Ansätze)
Cada compuerta parametrizada de rotación tridimensional general `qml.Rot` se define como:
$$R(\alpha, \beta, \gamma) = R_z(\gamma) R_y(\beta) R_z(\alpha)$$
El entrelazamiento cuántico multi-qubit acopla las fases y amplitudes mediante compuertas CNOT de control circular periódico:
$$U_{\text{ent}} = \text{CNOT}_{n-1, 0} \prod_{j=0}^{n-2} \text{CNOT}_{j, j+1}$$

### 3. Reducción Cuántica en Patch GAN
Para generar un parche de 16 píxeles con solo 5 qubits, se utiliza una medición proyectiva en la ancila ($q_4$). Las probabilidades se calculan sobre la densidad de estado reducida:
$$P(x_0 \dots x_3) = \text{Tr}_{q_4} \left( |\psi\rangle \langle \psi | \otimes |1\rangle\langle 1|_{q_4} \right)$$
Esto produce una salida de $2^4 = 16$ intensidades escaladas que reconstruyen el parche $4\times 4$ de la imagen.

### 4. Función de Pérdida del GAN Híbrido
La optimización alternada del generador cuántico $G$ y el discriminador clásico $D$ se formula mediante la entropía cruzada binaria (BCE Loss):
$$\min_G \max_D V(D, G) = \mathbb{E}_{x \sim p_{\text{data}}}[ \log D(x) ] + \mathbb{E}_{z \sim p_{z}}[ \log(1 - D(G(z))) ]$$

---

## 📊 Comparativa de Experimentos

La siguiente tabla resume los aspectos técnicos y arquitectónicos de ambos experimentos:

| Atributo | Clasificador QNN (Wine) | Quantum Patch GAN (Digits) |
| :--- | :--- | :--- |
| **Dataset** | Wine Dataset (Scikit-Learn) | optdigits (Handwritten '5' de UCI) |
| **Tipo de Tarea** | Clasificación Binaria | Generación de Imágenes ($8\times 8$) |
| **Qubits Totales** | 13 qubits | 20 qubits (4x PQCs de 5 qubits) |
| **Parámetros Ajustables** | 78 parámetros | 36 parámetros |
| **Optimizador** | Adam ($\eta = 0.01$) | SGD ($\eta = 0.01$) |
| **Función de Pérdida** | MSE Loss | Binary Cross Entropy (BCE) |
| **Métrica Final** | Precisión de Test: **~92%** | D Loss: **~1.32** / G Loss: **~0.70** |

---

## 🛠️ Instalación y Configuración Local

Se incluye un entorno virtual preconfigurado (`.venv`) en la raíz del repositorio con todas las bibliotecas de QML requeridas.

### 1. Activar el Entorno Virtual
Abra su terminal en la raíz del repositorio y ejecute el comando correspondiente:

* **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
* **Git Bash / WSL / Linux / macOS**:
  ```bash
  source .venv/Scripts/activate
  ```

### 2. Instalar Dependencias (Opcional si se requiere reinstalación)
Si necesita reconstruir el entorno, ejecute:
```bash
pip install -r requirements.txt
```
*Las dependencias principales son: `torch`, `pennylane`, `pennylane-lightning`, `scikit-learn` y `matplotlib`.*

### 3. Ejecución de los Notebooks
Lance el servidor Jupyter:
```bash
jupyter lab
```

> [!IMPORTANT]
> **Kernel Jupyter**: Al abrir cualquiera de los notebooks (`quatum_classifier.ipynb` o `quantum_patch_gan.ipynb`), asegúrate de seleccionar el kernel del entorno virtual local (`.venv`) en la esquina superior derecha de Jupyter Lab para evitar problemas de dependencias faltantes.

---

## 🔍 Solución de Problemas

* **Errores de módulo faltante (`ModuleNotFoundError`)**: Ocurre si Jupyter Lab no está usando el kernel correcto. Verifique que la terminal donde inició Jupyter tenga activada la variable de entorno `.venv` y que el notebook esté asignado al kernel `.venv` local.
* **Cálculo de Gradientes Lento**:
  - En el clasificador binario, se calculan derivadas de 78 parámetros sobre 13 qubits usando `default.qubit` (simulador puro en Python). Esto puede tomar unos minutos por época.
  - En Patch GAN, el simulador se ha migrado a `lightning.qubit` para acelerar las operaciones del estado vector en C++.

---

## 📚 Recursos Académicos y Referencias

Para profundizar en la teoría de computación cuántica y aprendizaje automático cuántico aplicados en este proyecto, se recomiendan las siguientes publicaciones:

1. **Quantum GANs para Generación de Imágenes**:
   * Dallaire-Demers, P. L., & Killoran, N. (2018). *Quantum generative adversarial networks for learning and providing natural distributions*. [arXiv:1804.08639](https://arxiv.org/abs/1804.08639).
2. **Entrenamiento de Ansätze Parametrizados**:
   * Mitarai, K., Negoro, M., Kitagawa, M., & Fujii, K. (2018). *Quantum machine learning in feature Hilbert spaces*. [Physical Review A, 98(3), 032309](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.98.032309).
3. **Regla de Parameter-Shift**:
   * Schuld, M., Bergholm, V., Gogolin, C., & Izaac, J. (2019). *Evaluating analytic gradients on quantum hardware*. [Physical Review A, 99(3), 032331](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.99.032331).
4. **PennyLane Documentation**:
   * Guías y tutoriales oficiales sobre optimización cuántica, embeddings y redes híbridas en [PennyLane Docs](https://pennylane.ai/qml/).
