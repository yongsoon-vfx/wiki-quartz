MPM vs FLIP
MPM has the same data structure with particles and background grids

MPM and FLIP vs PBD ( Vellum Grains )
PBD uses discrete geometry (ie tracking the position of all grains) 
MPM and FLIP uses samples where points are used to sample and track information of a continous material

MPM vs FEM
MPM supports solids so it will support both elastic and plastic deformation
Fractures in MPM will look more organic than tets ( FEM )

Two-way coupling
Solids can interact with liquids and vice-versa

MPM is very good at keeping large chunks of material together

Deformation Gradient F 3x3 Matrix
F = `Fp * Fe`
F represents the local deformation

Fp - the plastic deformation
Fe - the elastic deformation

In Houdini only Fe is maintained because the Fp will update the rest position of the material, so there is no reason to track Fp. So in Houdini F is equal to Fe

The advantage of a 3x3 matrix is that it can capture the rotation scaling and shear.
Can also be compressed into a vector4 quaternion if only orient is needed
 
Stretching and compression is from the determinant J
J = ` Jp * Je`
In Houdini Jp and Je is precomputed for you.

> [!info] Determinant of a Matrix
> The determinant of a identity matrix is equal to 1. Which means that any other value other than 1 means that the transformation is either under compression or being stretched


![[mpm_deformation_explanation.excalidraw.svg]]

MPM uses explicit integration, which means it may require a lot of substeps.
Great for accurate collisions and friction

Speed stiffness and resolution will influence the amount of substeps that you need. 
Two parameters CFL and Material Conditions
And it supports dynamic substeps with Min and Max limits


## CFL Condition

![[mpm_cfl_condition.png]]

The CFL Condition is a limit on the amount of voxels a particle is allowed to travel in 1 timestep.
With a CFL condition above 1 the particle is allowed to travel more than 1 voxel which creates instability.

## Material Condition

![[mpm_impulse_propogation.gif]]
Material Condition sets how fast the impulse wave travels through an object by setting the substeps appropriately. This means that a object with twice the resolution requires twice the number of substeps to have the impulse propagate at the same speed.!

![[mpm_stability_substeps.excalidraw.svg]]

At high amounts of force, F can sometimes get inverted which causes instability. Having more timesteps will divide the force by smaller amounts so the solver will only allow small amounts of deformation per substep.


# MPM Source
Compression Hardening -> Increase the stiffness of the material as it is being compressed
Volume Preservation -> Makes the materials more explosive

# MPM Collider
Collider Types:
Static
Animated (Rigid)
for solid objects with  a rigid transformation
Animated (Deforming)
for deforming objects eg; character animation, bending, organic animation

> [!info] Variable Friction
> MPM does not support a collider having variable friction on 1 singular mesh so it is necessary to decompose a collider into multiple parts in order to have multiple friction values 

# MPM Container

# MPM Solver
The Global Substeps is the substeps of the DOP and is not indicative of the number of substeps the MPM solver actually runs.
The main reason you would increase this global substeps if there is stepping in the sourcing from sources that are moving very quickly, or to evaluate nodes inside the dive target more than once.

Deformation Gradient F is not output by default to save disk space.