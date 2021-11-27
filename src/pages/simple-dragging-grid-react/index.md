---
title: Simplest Drag and Drop setup in React, in 10 lines of code with SortableJS
date: '2021-11-27'
spoiler: In only less than 10 more lines in your code, for a grid, sortable tree, multi-column...
cover: ./sortablejs.png
cta: 'JavaScript'
tags: 'JavaScript'
---

# TDLR

[SortableJS](https://github.com/SortableJS/Sortable) make things really easy !
For those who just want the final result, here is the code and a demo just below

### Code

```jsx
import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import './style.css';

const initData = Array.from({ length: 15 }, (_, i) => ({
  _id: (i + 1).toString(),
  content: (i + 1).toString(),
}));

const SortableGrid = () => {
  const gridRef = useRef(null);
  const sortableJsRef = useRef(null);

  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('my-grid')) || initData);

  const onListChange = () => {
    const newData = [...gridRef.current.children]
      .map(i => i.dataset.id)
      .map(id => data.find(item => item._id === id));

    sessionStorage.setItem('my-grid', JSON.stringify(newData));
    setData(data);
  };

  useEffect(() => {
    sortableJsRef.current = new Sortable(gridRef.current, {
      animation: 150,
      onEnd: onListChange,
    });
  }, []);

  return (
    <div ref={gridRef} id="gridDemo">
      {data.map(({ _id, content }) => (
        <div key={_id} data-id={_id} className="grid-square">
          {content}
        </div>
      ))}
    </div>
  );
};

export default SortableGrid;
```

### Demo

Demo available [on my personal blog](https://www.javolution.io/simple-dragging-grid-react/#demo).

# So many DragNDrop libs out int the react ecosystem...

...and yet no easy solution for any of them !

- [React Beautiful Dnd](https://github.com/atlassian/react-beautiful-dnd): build by Atlassian for Trello, it's reliable BUT

> This library continues to be relied upon heavily by Atlassian products, but we are focused on other priorities right now and have no current plans for further feature development or improvements.

and also, not so easy to setup for someone who just want easy drag and drop

- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout): quite easy to setup, and quite powerful also. But I wanted to be able to move items in a grid so that it takes the position of another item in the grid and the grid keeps the same shape at the end of the drag/drop action - the defauilt behavior of this lib being to "make space" for the dragged item and break the grid layout. After spending one hour on it, I still couldn't find the way to achieve my goal, I quit.

-[React DND](https://react-dnd.github.io/react-dnd/about): it seems also a powerful lib, but the API is sooooo ccomplicated ! And you have to [read their tutorial](https://react-dnd.github.io/react-dnd/docs/tutorial) to setup anything, which is also giving headaches... I tried to implement the API, but after 200 lines of coding and 1 hours spent, I was lost, I tried something else

-[react-draggable](https://www.npmjs.com/package/react-draggable): I must say I didn't see that one, and didn't try.

-[react-grid-dnd](https://github.com/bmcmahen/react-grid-dnd): it looked like an easy setup and exactly want I was looking for, but... it's not maintained, and not working with npm7+ because it has react 16 as a dependency. So I had all the code setup before installing the lib, and I was quite fed up and tired when I discovered I would need to change my npm version to use it, or do some tricks here and there...

-[react-sortablejs](https://github.com/SortableJS/react-sortablejs): I didn't try because it says as an introduction

> Please note that this is not considered ready for production, as there are still a number of bugs being sent through.

Then I thought : damn, there _should_ be out there a JavaScript library doing the simple thing I've asked for ! And I saw in this last [react-sortablejs](https://github.com/SortableJS/react-sortablejs) that it was a "React bindings to SortableJS".

I went to look for [SortableJS](https://github.com/SortableJS/Sortable), clicked on the [demo](https://sortablejs.github.io/Sortable/), scrolled to the [grid example](http://sortablejs.github.io/Sortable/#grid) which was doing _exactly_ the simple stuff I was looking for.

I checked in the dev tools, there was nothing else than a `div#gridDemo` and some `div.square-items` inside. I checkd for `gridDemo` in the source code, and found out the code for that example:

```jsx
// Grid demo
new Sortable(gridDemo, {
  animation: 150,
  ghostClass: 'blue-background-class',
});
```

I couldn't believe it... only those three lines of code and that's it ?
And the [api](https://github.com/SortableJS/Sortable#options) looks straight forward too : the `onEnd` function seems doing the job I needed.

I had to try it by myself !

# Start with a simple grid

I wrote the React initial code : an array of items display in a grid layout.

```jsx
import React, { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import './style.css';

const initData = Array.from({ length: 15 }, (_, i) => ({
  _id: (i + 1).toString(),
  content: (i + 1).toString(),
}));

const SortableGrid = () => {
  const [data, setData] = useState(initData);

  return (
    <div id="gridDemo">
      {data.map(({ _id, content }) => (
        <div key={_id} data-id={_id} className="grid-square">
          {content}
        </div>
      ))}
    </div>
  );
};

export default SortableGrid;
```

I then just added:

- one ref for the grid container
- one ref for the SortableJS element
- one Effect to initiate SortableJs
- one function to handle the drag and drop
- `data-id` to all of the items in the grid layout
- a bit of refacto to save the new layout in storage (or in your back-end most probably)

so that the code would be the [one I wrote at the beginning](#code), and as you can see, [it works !](#demo)
