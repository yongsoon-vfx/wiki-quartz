## Allocating an array

`int myarray[100];`
`int *myarray = new int[100];`

| **Feature**          | **int myarray[100];**                     | **int *myarray = new int[100];**              |
| -------------------- | ----------------------------------------- | --------------------------------------------- |
| **Memory Region**    | **Stack**                                 | **Heap** (Dynamic Store)                      |     
| **Allocation Speed** | Very fast (just moves the stack pointer). | Slower (requires finding free memory).        |     
| **Cleanup**          | Automatic (when scope ends).              | Manual (requires `delete[]`).                 |     
| **Size Limit**       | Limited (Small stack size).               | Very Large (System RAM).                      |     
| **Variable Size**    | No (Size must be constant).               | Yes (Size can be a variable).                 |     
| **Safety**           | Safe from leaks, risky for overflows.     | Risky for leaks (if `delete[]` is forgotten). |     
 
