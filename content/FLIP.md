### So wtf are FLIPs

## Overview

FLIP (Fluid-Implicit-Particle) is a way of simulating fluids using particles as a way of representing the fluid. In Houdini, a FLIP setup is a hybrid of a POP sim and a volume sim.

Turns out particles are really bad at conserving volume because spheres have empty spaces between them, so the volume is used as a sort of advection field, post-velocity from whatever forces, to push the particles back into a grid that conserves the total volume.

> [!important]  
> If you use popsource for sourcing, you can control the emission, velocity and activation of the sim using familiar parameters from POPs.  

## Skeleton of a FLIP setup (in DOPs)

![[image7.png]]

  

First connection to the _dopnet_ should be a _flipsource_ node.

Set _flipobject_ input type to Surface SOP and leave SOP Path empty.

Make sure particle separation is the same as the _flipsource_ node in sops and the voxel size should be _particleseparation_ * gridscale.

  

> [!important]  
> Enable Viscosity under the FLIP Solver > Volume Motion > Viscosity so that the solver actually uses the viscosity attribute  
  
> [!important]  
> Another pro-tip is to enable surface tension. It allows you to create more realistic beading effects, I don’t know why this isn’t enabled by default.  

## How to add bubbles inside any FLIP simulation

Bubbles are just pockets of air trapped within the fluid and get affected by the movement of the fluid just like each of the flip particles. In order to create air bubbles, all we need to do is to delete all but some points of the simulation to keep as bubbles.

However, we will face a problem wherein some of the random particles that are chosen will be too close to the surface of the fluid, causing random indentations when we mesh.

The solution is to calculate each particle’s depth within the fluid volume and set a threshold for the pscale to be 0 if it is too close to the surface.

If a surface SDF’s scalar value is positive, it is outside of the volume, if negative, inside.

```C
f@depth = volumesample(1,’surface’,v@P);
if(@depth>0){
	removepoint(0,@ptnum); //delete points that are outside the mesh
}

float sMin = chf(‘minimum_value’);
float sMax = chf(‘maximum_value’);
f@pscale *= fit(@depth,sMax,0,1,0);
//all points over the threshold of sMax will have a pscale of 0
```

  

[Melting things with FLIP](https://youtu.be/B3W-S0EW9xw)