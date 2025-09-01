# What is APEX
APEX is a system in Houdini that separates the parameters and execution of nodes. In a normal Houdini network, nodes have parameters that controls the function of each node, and each output of the node is piped into the input of the next node. This allows you to view the network and output at any point. APEX is a framework of creating a graph (which is a node network) and only needing to execute it once at the end.

# Why APEX
APEX was originally created to solve the performance issues of very complex rigs but it has now extended to include the functionality of many SOPs nodes, COPs and even other contexts.![[sopsvsapex.png]]

The APEX network contains the exact same nodes and functionality as the SOP network, the difference is in the interface and execution. This APEX graph does not execute or output anything when you build the network, the graph only executes once you *Invoke* it. 

This lack of needing to keep the intermediary results live means performance gains because Houdini does not have to move the geometry between different memory locations, and instead executes the entire graph as one big *compiled* operation. 

# APEX vs Rig VOPS / VEX
This whole APEX graph and execution concept already exists within Houdini. A VOP or VEX network essentially also contains code/nodes that is compiled and runs in one execution. The difference is VEX is designed for controlling points and geometry, and as such only contains atomic functions for doing so. 

APEX graphs then can be described as being designed for controlling the node network itself, by encapsulating entire nodes and networks, and also the idea of meta-programming by creating subgraphs (templates) and substituting or grafting it into your main APEX graph (template substitution).

You can create procedural rigs with very high performance by leveraging these APEX features. Imagine creating a IK rig for a 16 legged creature and the most simplest way to do it in KineFX would require you to setup the transforms logics and transforms one by one with a rig VOP. With APEX, you could create a sub-graph that contains the logic and IK setup with controls for one leg, and then apply it to any number of legs procedurally, and because the functionality of the rig is only executed once, you can achieve a very high performance even with hundreds of legs.

![[apexbase2.svg]]
> [!info] You cannot edit this graph right on this Autorig Component node
> APEX is designed with the idea of combining multiple Components together to create a Rig. In order to modify this graph we have multiple methods which will be covered after this.


# Editing the Graph Destructively with Edit Graph
![[apexeditgraph.svg]]

The APEX graph itself is stored in a prim with the name `Base.rig`. If we want to edit the graph, we first use unpack folder to split it out and then now we can use the `Edit Graph` SOP to edit it.
Then we need to use the `Pack Folder` SOP to pack back the rig into the main Folder.

This is not the recommended way to edit the APEX graph cause it is not procedural and reusable. However, this is a good way to prototype a setup before you set it up properly as a Component Script.

# Creating a Component Script
[Video From Max Rose that I learned from](https://www.youtube.com/watch?v=qxXyJUQ26gQ)

![[apex_component_script_basics.mp4]]
A component script is a graph that you run on the main rig that allows you to manipulate the parent graph itself. You can create new nodes, connect new nodes based on the name and even create parameters for this component script itself. 

> [!info] The APEX Autorig Component is basically a set of built-in Component Scripts that SideFX provided to make it easier to get started with your rig.

By having a consistent naming convention on your skeleton and rig, you can create reusable Component Scripts that can work with any rig you make.

![[spotlight_apexcomponent.png]]

An APEX Component Script I made that creates a look-at constraint with a constrained up-axis. The script looks for a `head`,`pivot` and `target` points and creates and set's up the appropriate constraints and transforms to create a rig for a concert spotlight.

![[spotlight_component_result.png]]

Because I used a component script, now I can use this setup for any rigs that have the same naming conventions and I can duplicate as many spotlights I want and it will still work.