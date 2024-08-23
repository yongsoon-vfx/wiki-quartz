---
title: VEX 🖥️
draft: false
tags:
  - code
  - vex
created: 2024-02-26T00:11
updated: 2024-02-26T00:14
---

## [VEX Attribute Glossary by John Kunz](https://wiki.johnkunz.com/index.php?title=VEX_Attribute_Glossary#What_is_VEX.3F)

## String Manipulation

String formatting In VEX is derived from C. Where each variable to be passed into the string is formatted based on a specific format in the string.

#### Example in Python

```python
this_str = f"My position:{position}, and this is my age: {age}"
```

#### VS VEX

```c
string this_str = sprintf("My position: %g, and this is my age: %f",v@P,f@age)
```

The attributes `v@P` and `f@age` as passed in as arguments and replace `%g` and `%f` respectively.
The general form of the argument is given as `[flags][width][.precision][format]`

##### Possible Flags:

-: Left justify the result
+: Prefix numbers with + if positive, also strings will be surrounded with quotes
0: Pad zeros for numeric values

##### Width:

Number specifying number of spaces of the value including the decimal point. I'm not fully clear how it works with floats but `int i = 100` has a width of 3, and setting it any higher will add spaces to pad the front, unless `0` flag is active, then it will pad with 0s or if `-` flag is active, it will pad from the end. If set to `*` it will take the first argument as the width.

##### Precision:

Number specifying number of decimal points, meaning `412.1492` has a precision of 4. If set to `*`it will take the either the first argument or the second argument if width is also set to `*`.

##### Formats:

`%g, %p, %c` Integer, float, vector, vector4, matrix3, matrix, string (General)
`%f, %e, %E` Float, vector, vector4, matrix3, matrix (Floating Point)
`%s` String
`%d, %i` Integer in decimal format
`%x, %X` Integer in hexadecimal
`%o` Integer in octal
`%%` Literal percent

##### Example

```c
int i = 100;
printf("frame%04d.jpg",i);
//Output: frame0100.jpg

string str = "this is";
string str2 = "a string";
printf("%s %s",str,str2);
//Output: this is a string

float f = 24.1
printf("%.2g%%",f)
//Output: 24.10%
```

##### VEX also contains built-in functions for regex string searching and matching!

## Geting random Vectors

If you are trying to get random vectors in VEX, your first thought might be to use `vector v = rand(@ptnum)` however, this has a tendency towards positive vectors and generally does not give a good result. The solution is to use built in sample functions.

## Getting OBJ level transforms to VEX

The following sample code is getting a position of a camera into the wrangle.

```c
matrix xform = optransform(ch('cam_node'));
//where cam_node can be a string or operator path parameter
vector camera_pos = xform * {0,0,0};
//in the case of a camera, the position of the point is
//exactly at 0,0,0.
```

## Instancing Alembics and modifying it’s frame offset

[SideFX Documentation](https://www.sidefx.com/docs/houdini/nodes/sop/alembicprimitive.html)

The current frame of an alembic primitive is stored within a intrinsic primitive attribute called ‘abcframe’.

You can pack alembics and instance it to points and you can randomize the current frame of each alembic by controlling the abcframe primintrinsic using a vex function

```c
float seed = rand(@ptnum);
int offset = fit01(seed,0,10); //Convert 0-1 float to a int for frame values
setprimintrinsic(0, "abcframe", @ptnum, @Frame+offset);
//Set current frame of alembic to current frame + random offset
```

## Center UV islands

For a mesh with multiple islands, do it in a for-each connected pieces

### Before

![[uvs-uncentered.png]]

### After

![[uvs-centered.png]]

```c
v@P = v@uv; //move point transforms to uv coords
						//so that we can use built in pos functions


vector uvcenter = {0.5,0.5,0}; //bottom left is 0,0
vector bboxcenter = getbbox_center(0);

@uv +=(uvcenter - bboxcenter); //move bbox_center to uv center
```

## Generate Heading Vector from 2 Points / 1 Edge

![[weird-quaternion.png]]

Not sure how I would describe what I was trying to accomplish, but basically I was trying to generate a heading vector that pointed in the same direction as each of these lines, while keeping the orientation of each vector to correspond to the midpoint of this whole curve.

```c
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

```c
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

```c
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
