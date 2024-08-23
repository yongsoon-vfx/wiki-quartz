---
title: OpenCL
draft: false
tags:
  - code
  - math
---

# OpenCL
>OpenCL™ (Open Computing Language) is an open, royalty-free standard for cross-platform, parallel programming of diverse accelerators found in supercomputers, cloud servers, personal computers, mobile devices and embedded platforms. OpenCL greatly improves the speed and responsiveness of a wide spectrum of applications in numerous market categories including professional creative tools, scientific and medical software, vision processing, and neural network training and inferencing.
\- From the official Khronos Group OpenCL website

## Kernels, Work-Items and Work-Groups
A **Kernel** is a program that is to be run on every **Work-Item**.

A **Work-Item** is a singular element of what the program is processing. Example for an image-processing algorithm, a single work item would be a single pixel, or in more general terms, a single element in an array. **Work-Items** can be run in parallel on the GPU with thousands of cores which contributes to its speed, but also results in some limitations and important considerations in your code.

A **Work-Group** is a group of set of work-items that can make progress in the presence of barriers. Eg: each work-item uses the same group of memory. This means that a singular **Work-Group** can share locally constructed memory, and that **Work-Groups** cannot synchronize with each other. [Or at least that is how I understand it from this stack-overflow answer.](https://stackoverflow.com/questions/26804153/opencl-work-group-concept) This also means that work-units that share the same global variables, can make a cache in local memory for faster access. For our purposes, Work-Groups will not be relevant.

## OpenCL vs OpenGL
A program that only acts on a pixels is called a Shader and usually OpenGL is used. OpenCL however is usually used for more general purpose compute and can be used to solved problems that contain large arrays or vectors that can be processed in parallel.

# Houdini
You can use OpenCL code in Houdini SOPs and COPs. VEX is usually the better choice when you are dealing with geometry and OpenCL is usually more suited for working with volumes.

OpenCL will almost always be **slower** than VEX in doing simple geo-based functions due to the overhead of using the GPU. 

>[!warning]
>OpenCL is also way more prone to crashing due to its nature. It is very easy to write code that will result in an instant crash.

On this page, I will be mainly talking about SideFX's implementation of OpenCL within Houdini, mainly within the new Copernicus context introduced in 20.5. All the code snippets here will only work within Houdini.

## OpenCL vs VEX Syntax

### Swizzle Vectors
You can swizzle vectors in both **VEX** and **OpenCL**
```c title="OpenCL"
float3 x = (1.0f,2.0f,3.0f);
float3 y = x.zyx; // You can also use x.rgb variant

//y will be equal to (3.0,2.0,1.0)
```
OpenCL also supports additional swizzling options
```c
float4 x = (1.0f,2.0f,3.0f,4.0f);

float2 y = x.lo; //Bottom half of vector
float2 y = x.hi; //Top half of vector

float3 z = x.s01; //Equals to slice 0:1 which is also x.xy
float4 z = x.s03; //Slice 0:3 which is x.xyzw

float16 w = a_float16.s0f 
// To slice above 9 use a/A to f/F for 10-15
//This last one is relevant because you can go up to a float16
```


### Type-Casting
**VEX** Implicit Type-Casting
```c
float y = 10.0;
vector x = y;
//This works
```
**OpenCL** Explicit Type-Casting
```c
float y = 10f;
float3 x = (float3)(y,y,y);
```



### Cellular Noise in OpenCL COPS
Algorithm converted from OpenGL from [The Book of Shaders: More Noise](https://thebookofshaders.com/12/)
```c
#bind layer !&dst
#bind parm scale float val=1
#bind parm offset float2
#import "random.h"
#import "xnoise.h"
@KERNEL
{
    global const void *theXNoise;
    float2 uv = @P.texture;
    uv *= @scale;
    float2 tile_coord , tile_id;
    tile_coord = fract(uv, &tile_id);
    tile_id += @offset;
    float m_dist = 1.0f;
    for (int y = -1; y<=1; y++){
        for (int x = -1; x <= 1; x++){
            float2 query_offset = (float2)(x,y);
            float2 query_tile = tile_id + query_offset;
            float3 point3 = xnoisev2(theXNoise,query_tile);
            float2 point = point3.xy;
            point += query_offset;
            float dist = distance(point,tile_coord);
            m_dist = min(m_dist,dist);
        }
    }
    float dist = m_dist;
    float4 clr = (float4)(dist,dist,dist,1.0f);
    @dst.set(clr);
}
```



## More Resources & References
[Houdini OpenCL Documentation](https://www.sidefx.com/docs/houdini/vex/ocl.html)

For Shader Algorithms:
[The Book of Shaders](https://thebookofshaders.com/)