---
Title: Miscellaneous Notes
---



## Setting DPI Metadata on PNGs that Photoshop can read
Using exiftool cli, run the following command:
```
exiftool -overwrite_original -PixelUnits=meters -PixelsPerUnitX=ppm -PixelsPerUnitY=ppm inputfile.png
```
Where PPM is Pixels Per Meters. You can convert from DPI to PPM by multiplying the DPI number by `39.3701`
##### 300 DPI is = floor(300 * 39.3701) = 11811 PPM

