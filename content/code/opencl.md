---
title: OpenCL
draft: false
tags:
  - code
  - math
---
# OpenCL

You can use OpenCL code in Houdini SOPs and COPs. VEX is usually the better choice when you are dealing with geometry and OpenCL is usually more suited for working with volumes.

OpenCL will almost always be **slower** than VEX in doing simple geo-based functions due to the overhead of passing memory to and from the GPU.

>[!warning]
>OpenCL is also way more prone to crashing due to its nature. It is very easy to write code that will result in an instant crash.

On this page, I will be mainly talking about SideFX's implementation of OpenCL within Houdini, which provides some headers that are automatically included, as well as helpful preprocessor features to make it easier to write.

# OpenCL vs VEX 

OpenCL is a lower-level language than VEX and such it will have less functions and primitives types defined. For example, `matrix` primitive types are not defined in standard OpenCL and are instead provided by type-definitions from SideFX to make code easier to write. 

A specific quirk is that a matrix3 `mat3` is actually a 12-element type as there is no native 12-element type.

## Getting Current Element ID
If running over `First Writeable Attribute` in SOPs
`int idx = get_global_id(0)`
`idx` will be equal to the current point number
## Swizzle Vectors

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

## Type-Casting

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

## Matrices

Matrices are defined row-major meaning given a matrix m = 

$m = \begin{bmatrix}a{1} & a{2} & a{3} \\b{1} & b{2} & b{3} \\c{1} & c{2} & c{3}\end{bmatrix}$

`m[0]` will be equal to `{a1,a2,a3}`

You can use the [functions defined in matrix.h](https://www.sidefx.com/docs/houdini/vex/ocl.html#matrix-functions) to work on matrices.

## Pointers and Arrays

Arrays are defined as pointers to the start of the array (you are writing in C), and you need to do bounds-checking or you might get undefined behavior when you try to access the array out-of-bounds. 

In order to get an array into a function you pass the array pointer into the arguments
```C
#bind point &result float
#bind detail myarray float[]

float myFunction(float *array, int index){
	return array[index];
}

@KERNEL
{
	float value = myFunction(@myarray,0);
	@result.set(value);
}
```
Study pointers and C to get a deeper understanding of this.

## WRITEBACK Kernel

Use a writeback kernel in order to write data to prevent race-conditions where a work-item is writing to a attribute that another work-item will be reading
```c
@KERNEL
{
float result = doSomething();
@__temp__.set(result);
}

@WRITEBACK
{
@final.set(@__temp__)
}
```

## Useful Types that don't exist in VEX
#### `size_t`
is an unsigned integer that can store the theoretical maximum size of an integer on any given system

#### `fpreal` and `exint`
is a float/int type respectively that has variable precisions (16/32/64 bit) that allows code to be written once but work in multiple precisions

#### `int *ptr, float *ptr` and others
[you will never ask about pointers again after watching this video](https://www.youtube.com/watch?v=2ybLD6_2gKM)





### Worley Noise in OpenCL COPS
Algorithm converted from OpenGL from [The Book of Shaders: More Noise](https://thebookofshaders.com/12/)
You can also straight up just use the worley noise from the `mtlx_noise_internal.h` library but this is a good exercise.
```c
#bind layer !&dst
#bind parm scale float val=10
#bind parm octaves int val=8
#bind parm lacunarity float val=0.5
#bind parm diminish float val=0.5
#bind parm offset float2 val=(0.5,0.5)
#import "mtlx_noise_internal.h"

@KERNEL
{
    global const void *theXNoise;
    float2 uv = @P.texture;
    uv *= @scale;
    
    float2 tile_coord , tile_id;
    tile_coord = fract(uv, &tile_id);
    tile_id += @offset;
    
    float m_dist = 1.0f;
    
    for (int y = -3; y<=3; y++){
        for (int x = -2; x <= 2; x++){
            float2 query_offset = (float2)(x,y);
            float2 query_tile = tile_id + query_offset;
            
            int3 period = (1000,1000,1000);
            float3 p = (float3)(query_tile,0.0f);
            int octaves = @octaves;
            float lacunarity = @lacunarity;
            float diminish = @diminish;
            
	        float2 point = mx_fractal_noise_float2(p,octaves,lacunarity,diminish,period);
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







### Addendum
#### Kernels, Work-Items and Work-Groups
A **Kernel** is a program that is to be run on every **Work-Item**.

A **Work-Item** is a singular element of what the program is processing. Example for an image-processing algorithm, a single work item would be a single pixel, or in more general terms, a single element in an array. **Work-Items** can be run in parallel on the GPU with thousands of cores which contributes to its speed, but also results in some limitations and important considerations in your code.

A **Work-Group** is a group of set of work-items that can make progress in the presence of barriers. Eg: each work-item uses the same group of memory. This means that a singular **Work-Group** can share locally constructed memory, and that **Work-Groups** cannot synchronize with each other. [Or at least that is how I understand it from this stack-overflow answer.](https://stackoverflow.com/questions/26804153/opencl-work-group-concept) This also means that work-units that share the same global variables, can make a cache in local memory for faster access. For our purposes, Work-Groups will not be relevant.