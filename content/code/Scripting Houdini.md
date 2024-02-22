---
title: Scripting Houdini
draft: false
tags:
 - python
 - xml
 - json
 - code
---


## **Overview**

Summary from Houdini [Documentation](https://www.sidefx.com/docs/houdini/hom/index.html)

> The Houdini Object Model (HOM) is an application programming interface (API) that lets you get information from and control Houdini using the [Python scripting language](http://www.python.org/). In Python, the [hou package](https://www.sidefx.com/docs/houdini/hom/hou/index.html) is the top of a hierarchy of modules, functions, and classes that define the HOM. The `hou` module is automatically imported when you are writing expressions in the [parameter editor](https://www.sidefx.com/docs/houdini/ref/panes/parms.html) and in the `hython` command-line shell.

TL;DR: Use Python when you want to make scripts that interact with the interface

---

## Accessing PDG through Python Shelf Scripts

In order to access a a pdg.Node class you have to use a method on a hou.node class. The documentation is really bad and I couldn’t find reference to this until I found a random forum post talking about it.

> [!info] pythonscript to press button on node per work item | Forums | SideFX  
>  
> [https://www.sidefx.com/forum/topic/73862/?page=1#post-312290](https://www.sidefx.com/forum/topic/73862/?page=1#post-312290)  

```python
top_node = hou.node('/obj/topnet1/genericgenerator1') \#uses hou.TopNode class
pdg_node = top_node.getPDGNode()                      \#uses pdg.Node class
for work_item in pdg_node.workItems:
    print(work_item)

#    use top_node.getSelectedWorkItem() 
#    and top_node.setSelectedWorkItem(id)
#    to get and set the current work item
#  THIS ONLY WORKS IF THE NODE IS ALREADY COOKED OR ELSE workItems will return NONE
#  WHICH YOU CAN COOK USING top_node.cookWorkitems() method
```

  

> [!info] Setting Up A Default Scene In Houdini  
> Support us on Patreon: http://www.  
> [https://www.youtube.com/watch?v=ejZtvwztceU](https://www.youtube.com/watch?v=ejZtvwztceU)  

## Incremental Save

So Houdini has an incremental save feature but with the default customization you can only choose to either go with incremental saves or to overwrite your saves as the only behavior. If you want to have a selectable option for incremental and overwriting your saves, you have to create a script. Luckily its only two lines.

```python
import hou
hou.hipFile.saveAndIncrementFileName()
```

Save this script and add it to your File menu using the following method and you are set.

  

## Adding a Script to Houdini’s built-in main menus

You can control any menu element in Houdini from the xml configuration files located in your Houdini installation’s folder, official documentation [here](https://www.sidefx.com/docs/houdini/basics/config_menus.html).

But the summary is, after you create your script add this to your MainMenuCommon.xml

```xml
<mainMenu>
  <addScriptItem id="h.saveinc">
	 <parent>file_menu</parent>
	 <label>Save Incrmental</label>
	 <scriptPath>$Pipelinetools/scripts/saveIncremental.py</scriptPath>
	 <scriptArgs></scriptArgs>
	<insertAfter>h.save</insertAfter>
  </addScriptItem>
</mainMenu>
```

![[content/images/extending-menu-example.png]]

`<parent>` tag indicates which menu the new item will live under

`<insertAfter>` indicates the placement of of the additional item using the id of the element to insert after

The ids and parent menu names can be found under _$HH/MainMenuCommon.xml or $HFS/houdini/MainMenuCommon.xml_

  

  

## Collect Files (How to package a project)

So, I was making my own script for packaging a project using Python as an excuse to try out and learn Python within Houdini, but I also found out that there’s a script made by Aeoll that already accomplishes what I wanted to make, and also included features that I did not think to include, so [here it is](https://github.com/Aeoll/HipCollector/tree/master).

Regardless, here’s the code that I had typed that will serve as reference for me on how to find specific node types:

```python
import hou
\#returns all instances of nodes of type 'file'
\#use hou.node('path-to-node').type() to return
\#the type of a specific node you need
fileN = hou.sopNodeTypeCategory().nodeType('file').instances()
for node in fileN:
		\#evalParm evaluates the current value of the selected parm
		\#this means that $F or any expressions will return as the
		\#current value, eg. on frame 86 $F will return 86
    path = node.evalParm('file')
    print(path.replace('$HIP',''))
```

This script will print out all directories from the ‘file’ parameter on all file nodes in the Houdini project.