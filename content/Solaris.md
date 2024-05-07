---
title: Solaris
draft: false
tags:
  - solaris
created: 2024-02-24T22:50
updated: 2024-02-25T23:54
---
## Restructure Scene Graph LOP
>Reparent Primitives  
>Rename Primitives  
>Remove Primitives  

## Prune LOP
>Used for making primitives invisible or deactivated  
>Invisible means that other primitives in your scene can still interface with the invisible prim, for example, for constraints  
>Inactive essentially suspends the prim and it is unable to be affected by any operations until you reactivate it  

## Configure Primitive LOP
>Used for changing basically every USD property of a prim  
>Most importantly, you use this node to **change the active/visibility state** of a prim  

## Store Parameter Values LOP
 >Workaround by Houdini to create and store temporary values  
 >Creates a prim at `/HoudiniLayerInfo` with the attributes  
 >This prim is not saved out when saving out the USD with `USD ROP` 
 >
 >You can access the attribute in an expression with a helper function in `loputils` or you can access it manually using [[python#Example Code to get a Usd.Prim and attribute|Python]].
 >```python
>import loputils
>this_node = hou.pwd()
>input_node = this_node.inputs()[0]
>val = loputils.fetchParameterValues(input_node,"yourValue")
>
>return str(val)
 >```



## [[python#Accessing a USD class with Python|Accessing Usd Prims with Python]]
