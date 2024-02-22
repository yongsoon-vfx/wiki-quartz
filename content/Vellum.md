---
title: Vellum 👗
draft: false
tags:
 - simulation
---

### Bro wtf is vellum

## Overview

[https://www.youtube.com/watch?v=NwabG-znu9Y&ab_channel=Houdini](https://www.youtube.com/watch?v=NwabG-znu9Y&ab_channel=Houdini)

Vellum is basically a POP system but with constraints between each network of points. You use POP related nodes to control vellum forces (POP Wind, POP Force, POP VOP, etc.). Using POP VOPs allows you to use various noises as forces.

> [!important]  
> The vellum SOP solver only takes into account the attributes set at the initialization of the sim. This means that you cannot animate any attributes at the SOP level of the solver. Instead you have to dive into the solver SOP and animate the nodes within. Important nodes to use when animating constraints: Vellum Constraints , Vellum Constraints Properties.  

The bigger the scale of the cloth the larger the values you have to use for your constraints to work properly.

Vellum has two modes it can run in; Vellum Cloth and Vellum Grains.

## Basic Vellum Setup

1. Create curve with Curve SOP
2. Resample SOP to create more resolution (use subdivide to smooth + add res)
3. Create _sweep_ SOP with mode set to ribbon and adjust parameters
4. Create group node named _pin_ **Remember to set group type as points**
5. Do any transformations on the _pin_ group
6. Attach vellum cloth constraints SOP and set pin points as _pin_

> Pin Types

- Permanent (permanent pin)
- Stopped (pin with _stopped_ attribute to control pinning)
- Soft (zero length dist constraint used)

1. Add Vellum solver SOP

## How to dynamically pin and unpin

1. Make sure pin type is set to **stopped**
2. Dive into the vellum solver SOP and wire a POP Wrangle into Forces
    
    ```C
    //Set to only affect pin Group
    int unpinframe = chi('Unpin_Frame');
    if(@Frame>unpinframe){
    	i@stopped=0;
    }
    ```
    
      
    

## Dynamically controlling constraints using attributes that change at SOP level

This was one of the most frustrating parts of Vellum for me figuring out how to affect the constraints with dynamic attributes.

Let’s say you wanted to change the stretch constraint with a changing attribute map driven by noise or whatever. You cannot just set the stretch constraint to scale by an attribute within the SOP constraint node as **Vellum SOP solver only reads the attribute of the geo at initialization.**

So the next logical step would be to dive into the Vellum SOP and wire in a vellum constraint property and use a vexpression to drive the constraints right? You’re on the right track but it is not so simple.

Turns out, the vellum constraint properties node within DOPs is only reading attributes on the ConstraintGeometry itself. Any attributes that you set at the SOP level are not inherited by the constraint network that Vellum sets up for you.

So for the solution is to add the SOP with the animated attributes into the third input on the constraint property node. And then add the following vexpression to read the attribute from the third input

```C
stiffness = 1e-1 * point(2,'noise',@ptnum);
//reads the noise attribute from the third input 
```