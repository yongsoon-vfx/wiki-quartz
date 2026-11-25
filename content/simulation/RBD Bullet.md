# Overview
Houdini comes with 2 different solvers for doing rigid body destructions, the **RBD Solver** and the **RBD Bullet Solver**.

## Bullet Solver
The **Bullet Solver** is a third party physics simulation library and works by approximating collision by simplifying the volume representation using boxes, spheres or convex hulls. This makes the bullet solver much faster than the alternative old-school RBD solver but comes with the trade-off of inaccurate collisions.

## RBD Solver
This is Houdini's native solver and it uses a more accurate volumetric representation of the objects in order to calculate it's collisions. The main benefit of this solver other than accuracy, is you can use it to affect other Houdini native solvers such as FLIP. This accuracy comes at the cost of speed.

## Important Information:
### Getting Better Sim Results
All the other simulation engines in Houdini work best when you are working in real world scale, however, for the RBD Solver, generally a bigger scale will give you better results that are less jittery and collisions work better. 


### Inheriting Velocity
If you use the RBD Solver DOP, you will not inherit the initial velocity from your source and you will need to use workarounds to properly initialise the velocity.
On the other hand, if you use the RBD Bullet Solver SOP, the sourcing of the initial velocity is handled for you.

### Modifying Packed RBD and Reapplying Animation
Use transformpieces SOP.


[https://youtu.be/L1zcS2hNIEE](https://youtu.be/L1zcS2hNIEE)
