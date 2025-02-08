---
title: Javascript, HTML, CSS and Webstudio
draft: false
tags:
  - code
---

Method of extracting specific elements into JS
### 1. Query Selector
```js
const mydiv = document.querySelector("mydiv");
```
This first method traverses the document and finds all elements with the specified CSS selector
### 2. Get Element By ID
```js
const mydiv = document.getElementById("mydiv");
```
This second method searches for the elements with the specified ID, this is usually faster as it only looks for one object (IDs are supposed to be unique)


## Creating interaction between Parent and Children in Webstudio
You can create interactions between the current state of an object and it's children by utilizing CSS variables.
1. Create a CSS variables in the parent object in the Advanced tag in a specific token
2. Reference the same CSS variables in the child objects that you want to create an interaction for
3. Switch the token state on the parent object to a different one, like hover, and change the values of the CSS variables  