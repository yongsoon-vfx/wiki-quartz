---
title: Realistic Paint Mixing in Houdini
draft: false
tags:
  - code
  - python
  - vex
  - opencl
created: 2024-02-24T22:50
updated: 2024-02-24T23:29
---

This is a short write-up walking through how I converted the Mixbox color blending library for use in Houdini.


## The Problem
Blending colour in digital programs is usually done with a simple linear interpolation or mix.

For each component of the colour vector,
$\text{lerp}(a, b, t) = a + (b - a) * t$
a = original value
b = mixing value 
t = mixing factor 

This simple implementation will result in an inaccurate colour as colour pigments do not mix linearly. For example, lerping a blue RGB(0,0,1) with a yellow RGB(1,1,0) results in a gray RGB(0.5,0.5,0.5). We know that from mixing pigments in real life, the actual result should be a green ~RGB(0,1,0).

> ![[NaiveImplementation.mp4|100]]
> Naive Colour Mixing using a attribtransfer to mix 2 different colours in a fluid. It is essentially doing a weighted lerp on proximity points.

There are a few methods out there to approximate realistic colour mixing but I've chosen the [MixBox: Pigment-Based Color Mixing](https://github.com/scrtwpns/mixbox) to take the code from.

Looking at the current code available in the repository, the language that would be most similar to VEX/OpenCL for implementation in Houdini is one of the shader languages, and for this I chose the [GLSL](https://github.com/scrtwpns/mixbox/blob/master/shaders/mixbox.glsl) code to reference.

## Transpiling GLSL to VEX
There are many math functions that exist and work with the same parameters in both GLSL and VEX, we will not have to modify most of the function calls in that case. The main difference will be the difference in declaration of types.

| GLSL | VEX     |
| ---- | ------- |
| vec3 | vector  |
| vec2 | vector2 |
| mat3 | matrix3 |

The code also includes processing the colors from linear to srgb and vice-versa. But the code currently uses preprocessor macros to determine whether the colorspace is in linear. We will change it to check for `ch("is_linear")` instead. This way we can create a checkbox parameter to control it.

### Row-Major vs Column Major
In the GLSL source code, `mixbox_latent` is a typedef for `mat3` so in our VEX code we will substitute all `mixbox_latent`s with `matrix3`

Another very important difference is that GLSL matrices are column-major while VEX matrices are row-major. I made sure to manually assign each component of the matrix the same way GLSL would, and I made a function to get specific column vectors - we will need this in the code.

Setting each component column-wise:
```c
        return set(
                   c.r , rgb.r , 0.0,
                   c.g , rgb.g , 0.0,
                   c.b , rgb.b , 0.0
                   );
```
Function to get each vector column-wise:
```c
vector get_column_vec(int i;matrix3 m){
//i = column 
        return set(getcomp(m,0,i),getcomp(m,1,i),getcomp(m,2,i));
}
```
### Reading in a image LUT in VEX
The GLSL code makes use of reading a LUT at certain parts via a call to `MIXBOXLUT(UV)` which itself is a type-def for `texture2D(mixbox_lut,UV)`.

Reading the documentation on `texture2D`, we can find out that this is a function we use to sample a image at a specified UV coordinate and returns the color at that location. With this information, we can implement the same function into VEX.

```c
vector MIXBOX_LUT(vector uvw){
	string LUT_PATH = "PATH-TO-LUT/mixbox_lut.png";
	return rawcolormap(LUT_PATH,uvw);
}
```

### Multi-Colour Mixing
Mixing multiple colours is described in the block-comment at the front of the glsl code.

```c
//   MULTI-COLOR MIXING
//
//      mixbox_latent z1 = mixbox_rgb_to_latent(rgb1);
//      mixbox_latent z2 = mixbox_rgb_to_latent(rgb2);
//      mixbox_latent z3 = mixbox_rgb_to_latent(rgb3);
//
//      // mix 30% of rgb1, 60% of rgb2, and 10% of rgb3
//      mixbox_latent z_mix = 0.3*z1 + 0.6*z2 + 0.1*z3;
//
//      vec3 rgb_mix = mixbox_latent_to_rgb(z_mix);
```

We will implement this into a function that accepts an array of colors with a corresponding array of weights.

```c
vector mixbox_multi_lerp(vector colors[]; float weights[]){
        float total_weight = sum(weights);
        matrix3 mix = set(0);

        for(int i = 0;i<len(colors);i++){
                mix += (mixbox_rgb_to_latent(colors[i]) * (weights[i]/total_weight));
        }
        return mixbox_latent_to_rgb(mix);
}
```

### [The Result](https://github.com/yongsoon-vfx/mixbox-houdini-native/blob/main/vex_mixbox.vfl)

| ![[NaiveImplementation.mp4]] | ![[MixboxImplementation.mp4]] |     |
| ---------------------------- | ----------------------------- | --- |
| Naive Implementation         | MixBox Implementation         |     |

## Performance Considerations
Our code runs at an acceptable speed with a modest amount of points, but scales extremely poorly. If we want to run our mixing on a high resolution flip sim.



Run on a point cloud with specified point count in a solver for 240 frames.

The solution — Rewrite the code again but in OpenCL

| Particle Count | Time to Process|
|----|----|
|1,437|5.286s|
|10,243|14.848s|
| 149,143|25.543s|
| 1,160,197|1m38.7s|



OpenCL speed

| Particle Count | Time to Process|
|----|----|
|1,437|13.325s|
|10,243|14.848s|
| 149,143|25.543s|
| 1,160,197|1m38.7s|