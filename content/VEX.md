---
title: VEX 🖥️
draft: false
tags:
 -code
---


## [VEX Attribute Glossary by John Kunz](https://wiki.johnkunz.com/index.php?title=VEX_Attribute_Glossary#What_is_VEX.3F)

  

## Instancing Alembics and modifying it’s frame offset

[SideFX Documentation](https://www.sidefx.com/docs/houdini/nodes/sop/alembicprimitive.html)

The current frame of an alembic primitive is stored within a intrinsic primitive attribute called ‘abcframe’.

You can pack alembics and instance it to points and you can randomize the current frame of each alembic by controlling the abcframe primintrinsic using a vex function

```C
float seed = rand(@ptnum);
int offset = fit01(seed,0,10); //Convert 0-1 float to a int for frame values
setprimintrinsic(0, "abcframe", @ptnum, @Frame+offset);
//Set current frame of alembic to current frame + random offset
```

## Center UV islands


### Before
![[uvs-uncentered.png]]
### After
![[uvs-centered.png]]
```C
v@P = v@uv; //move point transforms to uv coords
						//so that we can use built in pos functions


vector uvcenter = {0.5,0.5,0}; //bottom left is 0,0
vector bboxcenter = getbbox_center(0);

@uv +=(uvcenter - bboxcenter); //move bbox_center to uv center
```

## Generate Heading Vector from 2 Points / 1 Edge

![[weird-quaternion.png]]

Not sure how I would describe what I was trying to accomplish, but basically I was trying to generate a heading vector that pointed in the same direction as each of these lines, while keeping the orientation of each vector to correspond to the midpoint of this whole curve.

```C
//Get neighbouring point
int nbpt = neighbour(0,@ptnum,2);
vector nbpos = point(0,"P",nbpt);

//Generate heading vector
vector head = normalize(@P - nbpos);
vector up = {0,1,0};

//You can stop here if all you need is the heading vector
//But I wanted each of the points to have a specific orientation

v@up = cross(cross(@head,@P),@head);
//As this circle looking spline is centered at (0,0)
//@P is a vector that points towards the middle
//Using the double cross product I create a third vector
//that points outwards and is also 90 degrees to the heading vector

matrix3 xform = maketransform(-@head,@up);
p@orient = quaternion(xform);
//make transform generates a transform matrix using various params
//here I create it using two axes (green and blue axes on the screenshot)
//then I make the quaternion using the transformation matrix
```

  

## Generate Oriented Bounding Boxes

The math is currently over my head but the code and explanation is here

Credits to Andy Nicholas

> [!info] Oriented Bounding Boxes in VEX  
> A step-by-step tutorial on using VEX to calculate the oriented bounding box of geometry.  
> [https://www.andynicholas.com/post/oriented-bounding-boxes-in-vex](https://www.andynicholas.com/post/oriented-bounding-boxes-in-vex)  

## Create Index by marching across a loop

Across Prims

```C
i@index = 0;
int pPrim = 0;
int initPrim = chi('First_Prim');
for(int i = 0;i< @numprim;i++){
    setprimattrib(0,'index',initPrim,i,'set');
    int nb[] = polyneighbours(0,initPrim);
    for(int a = 0;a<len(nb);a++){
        if(nb[a]!=pPrim){
            pPrim = initPrim;
            initPrim = nb[a];
        
        }
    }
}
```

Across Points

```C
int pPoint = 0;
int ttlPoints = npoints(0);
int initPoint = chi('First_Prim');
for(int i = 0;i< ttlPoints;i++){
    setpointattrib(0,'index',initPoint,i,'set');
    int nb[] = neighbours(0,initPoint);
    for(int a = 0;a<len(nb);a++){
        if(nb[a]!=pPoint){
            pPoint = initPoint;
            initPoint = nb[a];       
        }
    }
}
```