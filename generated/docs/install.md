## reactopya_examples installation

## JupyterLab and Jupyter Notebook

To use reactopya_examples within JupyterLab and in Jupyter Notebook you will first need to install the reactopya_jup notebook extension.

As a prerequisite (for JupyterLab) you need the ipywidgets lab extension:

```
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

Next, install the the latest reactopya_jup Python package:

```
pip install --upgrade reactopya_jup==0.4.3
```

For JupyterLab, install the lab extension:

```
jupyter labextension install reactopya_jup@0.4.3
```

For Jupyter Notebook, install and enable the notebook extension:

```
jupyter nbextension install --sys-prefix --py reactopya_jup
jupyter nbextension enable reactopya_jup --py --sys-prefix
```

Finally, install the Jupyter Python package for reactopya_examples:

```
pip install reactopya_examples==0.4.1
```
