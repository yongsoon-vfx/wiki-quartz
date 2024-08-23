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

A **Work-Group** is a group of set of work-items that can make progress in the presence of barriers. Eg: each work-item uses the same group of memory. This means that a singular **Work-Group** can share locally constructed memory, and that **Work-Groups** cannot synchronize with each other. [Or at least that is how I understand it from this stack-overflow answer.](https://stackoverflow.com/questions/26804153/opencl-work-group-concept) For our purposes, Work-Groups will not be relevant.




## OpenCL vs OpenGL
A program that only acts on a pixels is called a Shader and usually OpenGL is used. OpenCL however is usually used for more general purpose compute and can be used to solved problems that contain large arrays or vectors that can be processed in parallel.