# Overview
Pyro is the built-in Houdini solver for simulating smoke, dust and explosion effects. There are two main modes of the Pyro solver, Dense and Sparse.
* ## Dense Simulation
simulates the entire container, useful as the velocity values are maintained even in areas with no visible smoke
* ## Sparse Simulation
only simulates the active areas of the container, i.e; areas with smoke. Supposedly faster as it only performs computations on areas of interest. Comes with some limitations and caveats.
### Notes on Sparse Solving
- Regions of smoke that are not connected are invisible to each other until they are close enough to merge
- The container will not keep up with fast moving fluids by default, unless `Expand by Velocity` is enabled
- This means that by default, simulations with high velocity fields will look very different in Sparse and Dense mode
- Sparse solving is especially suited for simulations like missile trails, where you would otherwise have to simulate a very large region in Dense mode


## tt


[Comparison of Shape Settings by Vladimer Castaneto on Youtube](https://www.youtube.com/watch?v=3JrBwycqZks)

### Comparison of Pyro Params in different contexts by FAB
[Billowy Smoke](https://www.youtube.com/watch?v=A3o2ZD_S5xE)
[Campfire](https://www.youtube.com/watch?v=grsev1LXOF0)
[Explosion](https://www.youtube.com/watch?v=eMQYLipwFiM)

[80lv Article with some good pyro info](https://80.lv/articles/simulating-smoke-populating-forests-in-houdini/)

[Creating Incense Smoke](https://youtu.be/s64k55T0_Kc)

[Flamethrower](https://youtu.be/Fm7q1i1-SZo)

[CGForge Pyro 1 ( Mug Steam )](https://www.bilibili.com/video/av543703612?from=search&seid=8433719845902713906&spm_id_from=333.337.0.0)