## Important Information:
### Getting Better Sim Results
All the other simulation engines in Houdini work best when you are working in real world scale, however, for the Bullet Solver, generally a bigger scale will give you better results that are less jittery and collisions work better. 


### Inheriting Velocity
If you use the RBD Solver DOP, you will not inherit the initial velocity from your source and you will need to use workarounds to properly initialise the velocity.
On the other hand, if you use the RBD Bullet Solver SOP, the sourcing of the initial velocity is handled for you.

### Modifying Packed RBD and Reapplying Animation
Use transformpieces SOP.


[https://youtu.be/L1zcS2hNIEE](https://youtu.be/L1zcS2hNIEE)
