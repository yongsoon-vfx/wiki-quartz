---
title: Stable Diffusion
draft: false
---

## Ways to controlling the sampler:
### Controlnets
Controlnets allow you to control your final image by allowing you to inject concepts into the prompt.
Common usage include, using a input image to generate a depth map, outlines via canny edge detection, or poses, then using the output from the preprocessor to control the prompting.
Parameters:
Strength -> Dictates how strongly the controlnet will affect the result
Start & End Percent -> Dictates when in the denoising process in the sampler will the controlnet be active, eg; start_percent: 0.0 & end_percent 0.5 - will result in the controlnet being active for the first 50% of the sampling steps


### IPAdaptor
IPAdaptors allow you to use an image as a prompt to control the style or composition of the final image.