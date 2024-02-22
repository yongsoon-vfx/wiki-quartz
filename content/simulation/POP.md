## Simulating a huge POP sim using wedging

Credits to Doxia Studio for this trick

> [!info] Houdini Tutorial: Millions of Particles (Wedge Trick)  
> Hi everyone!  
> [https://www.youtube.com/watch?v=und4rC8aqI4](https://www.youtube.com/watch?v=und4rC8aqI4)  

The gist of it is as follows; it is faster to simulate 100k particles 10 times than to simulate a huge 1 million particle sim once.

So the trick here is to cache each simulation 10 times using wedges to change the seed of the sourcing each time in order to have particles in different positions.

This workflow is improved in H19 with the introduction of the filecache::2.0 node (which currently exists in the form of the Labs File Cache)

  

1. Setup your particle simulation normally
2. Pipe in the Labs File Cache node after the dopnet
3. Enable Wedging and setup a seed parameter with the desired settings> [!important]  
    > You can reference a wedge attribute by prefixing it with @ similar to vex; eg: @seed. You can also refer to it within the DOP context as well.  
    
4. In your particle sourcing node, reference the wedge attribute in the seed
5. Under the Load settings in the file cache node, set it to merge all wedges
6. Click Save in Background in order to evaluate all wedges; also you can change the scheduling settings to use more cores to evaluate faster.