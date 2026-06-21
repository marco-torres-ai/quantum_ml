# Quantum Machine Learning (QML) Experiments

This repository contains implementation details, code cells, training outputs, and visualizations for two quantum machine learning (QML) models using PennyLane, PyTorch, and Scikit-Learn.

The notebooks have been fully debugged, optimized for fast simulation execution, and pre-run to preserve all training logs and visualizations.

---

## Repository Structure

```bash
├── code/
│   └── chapter5_qnn/
│       └── data/
│           └── optdigits.tra       # Optical Recognition of Handwritten Digits dataset (subset of '5')
├── quatum_classifier.ipynb         # Quantum Neural Network (QNN) Binary Classifier for the Wine dataset
├── quantum_patch_gan.ipynb         # Quantum Patch Generative Adversarial Network (GAN) for digit generation
├── .gitignore                      # Standard Python and Virtual Environment exclusions
└── README.md                       # Project documentation (this file)
```

---

## 1. Quantum Binary Classifier
File: [quatum_classifier.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quatum_classifier.ipynb)

* **Objective**: Train a Parameterized Quantum Circuit (PQC) acting as a Quantum Neural Network (QNN) to classify Wine dataset samples into two classes.
* **Pipeline**:
  1. **Preprocessing**: Load the wine dataset from Scikit-Learn, normalize features between $[0, \pi]$, split into train/test subsets, and map labels to $\{-1, 1\}$.
  2. **Encoding**: Encode 13 classical features into quantum states using PennyLane's `AngleEmbedding` with `CNOT` entanglement.
  3. **Model**: A multi-layer parameterized ansatz featuring single-qubit rotations (`qml.Rot`) and circular entanglement.
  4. **Optimization**: Train using Autograd and the PennyLane `AdamOptimizer` (MSE Loss) for 50 epochs.
* **Outputs**: Displays the quantum circuit layout, training cost evolution, and classification accuracy curves for both training and validation sets.

---

## 2. Quantum Patch GAN
File: [quantum_patch_gan.ipynb](file:///c:/Users/User/OneDrive/Desktop/quantum_ml/quantum_patch_gan.ipynb)

* **Objective**: Train a hybrid Quantum-Classical Generative Adversarial Network where a quantum circuit generator produces patches of a handwritten digit '5' and a classical discriminator evaluates them.
* **Pipeline**:
  1. **Preprocessing**: Load handwritten digit images from the UCI `optdigits` dataset, filter for digit '5', and normalize pixel values to $[0, 1]$.
  2. **Generator**: A `PatchQuantumGenerator` combining outputs from 4 separate 5-qubit PQCs. It uses angle encoding of latent variables and partial measurements of ancillary qubits.
  3. **Discriminator**: A classical PyTorch feed-forward neural network (`ClassicalDiscriminator`) that classifies real vs. fake 8x8 images.
  4. **Training**: Alternately optimize the PyTorch generator and discriminator parameters using SGD over 5 epochs (on a curated subset of 20 samples to ensure fast convergence).
* **Outputs**: Displays loss metrics for both models per epoch, and visualizes the generated digits grid progressing through the training epochs.

---

## Local Setup & Execution

A local virtual environment has been configured in the repository root containing all the required dependencies.

### 1. Activate the Virtual Environment
Activate the environment in your shell of choice:

* **PowerShell**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
* **Git Bash / Bash**:
  ```bash
  source .venv/Scripts/activate
  ```

### 2. Run the Notebooks
To run the notebooks using the local virtual environment kernel, start Jupyter Lab or Jupyter Notebook:
```bash
jupyter notebook
```
Select the `.venv` kernel (marked as local virtual environment) to run the notebooks.
