# Creating Work Items from files in Subdirectories

Let’s say you have a folder with the following struct:

https://app.eraser.io/workspace/83k3lPDurIY7loWDNsN6?origin=share

And you want to do the following:

1. Create a work item for each directory under /home/folder
2. Under each directory, glob all *.jpg files and add it as a array attribute to each respective work item
3. Do some additional processing on the array to split it into different attributes

## Creating Initial Work Items and Array

1. Create a filepattern node and set the **File Types** : **Directories Only ,** then set pattern to /home/folder/* **Enable Output Attribute** and set it as subdirs

> [!important]  
> This creates 3 work items for each of the folders under /home/folder with two attributes, filename and subdir. filename will be the base name of the folder; eg. files1 while subdirs will be the full path to the folder  

1. Create a second filepattern node and set **File Types : Files Only** , and disable **Split Files into Separate Items.** This will disable the creation of additional work items and instead append all files returned by the node into an array attribute.
2. Set the pattern to `` `@subdirs`\*.jpg `` This will look for all files with a jpg extension under each subdir work item. Enable Output Attribute and set it to images.

> [!important]  
> @subdir has to be enclosed in back-ticks as pattern is a string parameter.  

1. Now you have 3 work items with an array attribute with all the nested jpgs. The only good way to manipulate the attribute array is with Python.

```Python
\#The current work item is automatically assigned to the variable work_item
\#Importing a attribute from work_items 
images = work_item.fileAttribArray('images')
for image in images:
	\#do stuff
\#Creating a new attribute and writing to it
work_item.addAttrib("diffuse_texture",pdg.attribType.File)
work_item.setFileAttrib("diffuse_texture", somefile)
\#use .addMessage() method for stdout into the worker log
work_item.addMessage("Created diffuse_texture attribute")

\#Random Note
\#To get a path of pdg.File class aka the elements in images
\#You have to use pdg.File.path; in this case in the for loop
\#it would be image.path which returns: /home/folder/files1/eg.jpg
```