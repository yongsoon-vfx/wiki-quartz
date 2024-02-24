---
title: Useful Nodes
draft: false
---

These are a list of nodes that I’ve found to be very helpful but are not particularly easy to find.

## Ray SOP

[![](https://i.imgur.com/JqCGLGN.png)](https://i.imgur.com/JqCGLGN.png)

Functions similar to a shrinkwrap modifier in Blender, Pulls all points from a target mesh to the closest point on a collision mesh. Also has a different mode that uses ray projections.

## Carve SOP

[![](https://i.imgur.com/eGZxlQG.png)](https://i.imgur.com/eGZxlQG.png)

Uses curveu attribute to trim the start and end of a spline, similar to trim paths in After Effects

  

## Enumerate SOP

![[extending-menu-example.png]]

Enumerate SOP allows you to create point numbers relative to within a group, while normally @ptnum would refer to the point number relative to the whole geometry

## Invoke and Compile Block SOP

![[compile-block.png]]

The invoke SOP is used when you need to apply a set of operations to many different objects, and changing the operation changes the output for all of the affected objects.

Set the input name on the invoke SOP as the same as the input name of the compile begin SOP

Uncompilable nodes are not supported by the compile block, such as Python SOPs.

  

## Group by Attribute SOP

Group by attribute creates groups with the same name as the value of a specified attribute; A very good use case is using a connectivity sop to create a class attribute and then you can use this node to create groups based on connectivity.

## Fetch , Rivet and Extract Transform

**Fetch** is a /obj node that allows you to parent two different nodes in the /obj network which may be in different levels.

**Rivet** is another /obj node which allows you to parent a /obj level to an object within SOP level, it does not inherit orientation by default unless you enable **==_Use Point Vector Attributes for Rivet Frame (using up and N)_==**

==**Extract Transform**== is a sop level node that takes an /obj level node and outputs a single point containing it’s position, orientation and pivot. Use copy to points to transfer it’s animation onto another geometry.