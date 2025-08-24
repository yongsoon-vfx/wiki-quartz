# What is APEX
APEX is a system in Houdini that separates the parameters and execution of nodes. In a normal Houdini network, nodes have parameters that controls the function of each node, and each output of the node is piped into the input of the next node. This allows you to view the network and output at any point. APEX is a framework of creating a graph (which is a node network) and only needing to execute it once at the end.

# Why APEX
APEX was originally created to solve the performance issues of very complex rigs but it has now extended to include the functionality of many SOPs nodes, COPs and even other contexts.![[sopsvsapex.png]]

The APEX network contains the exact same nodes and functionality as the SOP network, the difference is in the interface and execution. This APEX graph does not execute or output anything when you build the network, the graph only executes once you *Invoke* it. 

This lack of needing to keep the intermediary results live means performance gains because Houdini does not have to move the geometry between different memory locations, and instead executes the entire graph as one big *compiled* operation. 

This whole APEX graph and execution concept already exists within Houdini. A VOP or VEX network essentially also contains code/nodes that is compiled and runs in one execution. The difference is VEX is designed for controlling points and geometry, and as such only contains atomic functions for doing so. 

APEX graphs then can be described as being designed for controlling the node network itself, by encapsulating entire nodes and networks, and also the idea of meta-programming by creating subgraphs (templates) and substituting or grafting it into your main APEX graph (template substitution).

You can create procedural rigs with very high performance by leveraging these APEX features. Imagine creating a IK rig for a 16 legged creature and the most simplest way to do it in KineFX would require you to setup the transforms logics and transforms one by one with a rig VOP. With APEX, you could create a sub-graph that contains the logic and IK setup with controls for one leg, and then apply it to any number of legs procedurally, and because the functionality of the rig is only executed once, you can achieve a very high performance even with hundreds of legs.

