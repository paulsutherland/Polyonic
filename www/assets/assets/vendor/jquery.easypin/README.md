jQuery easypin
===================

Simple and fast image pinning plugin. There are dependencies with the library jQuery easing plugin.
Supported lowest jQuery version 1.8

DEMO
========
[Demo Page 1 (responsive)](http://atayahmet.github.io/jquery.easypin/demo1.html)

[Demo Page 2 ](http://atayahmet.github.io/jquery.easypin/demo2.html)

[Demo Page 3 ](http://atayahmet.github.io/jquery.easypin/demo3.html)

Quick Start
==============

### bower install
```sh
bower install jquery.easypin
```

### npm install
```sh
npm install jquery.easypin
```

### Load libraries

First, include the jQuery and jQuery easing plugin javascript files.
```html
<script src="jquery.min.js"></script>
<script src="jquery.easing.min.js"></script>
<script src="jquery.easypin.min.js"></script>
```
### Pin picture:
```html
<img src="example.jpg" class="pin" width="800" easypin-id="example_image1" />
```


|      option                  | type                    | description                                   |
| ---------------------------- | ----------------------- | --------------------------------------------- |
| easypin-id                   | `attribute`             | It will be the default value if not defined   |                                    

### Dialog window for pin contents
```html
<div class="easy-modal" style="display:none;" modal-position="free">
    <form>
        type something: <input name="content" type="text">
        <input type="button" value="save pin!" class="easy-submit">
    </form>
</div>
```

|      option                  | type                    | description                                      |
| ---------------------------- | ----------------------- | ------------------------------------------------ |
| easy-submit                  | `class`                 | Class must be defined to close the dialog window |    
| modal-position               | `attribute`             | Dialog window free position (default: none)      |    


### Popover
```html
<div style="display:none;" width="130" shadow="true" popover>
    <div style="width:100%;text-align:center;">{[content]}</div>
</div>
```

|      option                  | type                    | description                          |
| ---------------------------- | ----------------------- | ------------------------------------ |
| popover                      | `attribute`             | Popover initializer attribute (MUST) |    
| width                        | `attribute`             | Popover width size (default: 200px)  |  
| shadow                       | `attribute`             | Popover show style (default: false)  |

### Initialize the pictures:
```javascript
// Back-end pin process
$('.pin').easypin();
```

To access the coordinates after pinning:
```javascript
var $instance = $('.pin').easypin({
    done: function(element) {
        return true;
    }
});

// set the 'get.coordinates' event
$instance.easypin.event( "get.coordinates", function($instance, data, params ) {

    console.log(data, params);

});
```

Then you can run this event with a button click event
```html
<input class="coords" type="button" value="Get coordinates!" />
```

```javascript
$( ".coords" ).click(function(e) {
    $instance.easypin.fire( "get.coordinates", {param1: 1, param2: 2, param3: 3}, function(data) {
        return JSON.stringify(data);
    });
});
```

We pass parameters when calling the above coordinate the event. Before the callback to run.

[Click for .easypin({}) options](#easypin-options)

.easypinShow()
=============
 We do first pin on the picture, now we show these pins to users on user interface.

**Pin image:**
 ```html
 <img src="example.jpg" class="pin" width="800" easypin-id="example_image1" />
 ```
> **Note:** If you want to get the width of the parent element's do not need define

**Pin container and popover template:**
```html
<div style="display:none;" easypin-tpl>
    <popover>
        <div style="width:140px;height:auto;background-color:orange;">
            {[content]}
        </div>
    </popover>

    <marker>
        <div style="border:solid 1px #000;width:20px;height:20px;background-color:red;">&nbsp;</div>
    </marker>
</div>
```

|      option                  | type                    | description                          |
| ---------------------------- | ----------------------- | ------------------------------------ |
| easypin-tpl                  | `attribute`             | Marker and Popover container element |    
| popover                      | `html tag`              | Popover container element            |
| marker                       | `html tag`              | Marker container element             |

**and run the .easypinShow() method:**
```javascript
$('.pin').easypinShow({
    data: {
            "example_image1":{
            "0":{
                "content":"Hello World!",
                "coords":{
                    "lat":"530",
                    "long":"179"
                }
            },
            "canvas":{
                "src":"example.jpg","width":"800","height":"562"
            }
        }
    }
});
```

That's it!


.easypin({}) options
=================

|      option                  | type                    | description                                                                |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| [init](#init)                | `object or json string` | initialize the pin coordinates                                             |
| [markerSrc](#markerSrc)      | `string`                | Change the default marker image                                             |
| [modalWidth](#modalWidth)  | `string/numeric`          | Change the default modal width (default: 200px)                                         |
| [editSrc](#editSrc)          | `string`                | Change the default edit button image                                             |
| [deleteSrc](#deleteSrc)      | `string`                | Change the default delete button image                                             |
| [popover](#popover)          | `functions into object` | set callback all template variables                                        |
| [popoverStyle](#popoverStyle)| `object`                | popover styles (it just pass to jquery .css() method of the object)        |
| [limit](#limit)              | `integer`               | limited pin (default 0)                                                    |
| [exceeded](#exceeded)        | `function`              | limit exceeded event                                                       |
| [drop](#drop)                | `function`              | pin dropped event                                                          |
| [drag](#drag)                | `function`              | pin dragging event                                                         |
| [done](#done)                | `function`              | closing of the dialog window is depend to this function                    |


#### init
Initialize the pin coordinates.
```javascript
$('.pin').easypin({
    init: {
        "example_image1":{
            "0":{
                "content":"Captan America",
                "coords":{
                    "lat":"530",
                    "long":"179"
                }
            },
            "canvas":{
                "src":"example.jpg","width":"1000","height":"562"
            }
        }
    }
});
```

#### markerSrc
Change the default marker image
```javascript
$('.pin').easypin({
    markerSrc: 'path/or/url/example-marker.jpg'
});
```

#### modalWidth
Change the default modal width
```javascript
$('.pin').easypin({
    modalWidth: 300
});
```

#### editSrc
Change the default edit button image
```javascript
$('.pin').easypin({
    editSrc: 'path/or/url/example-edit.jpg'
});
```

#### deleteSrc
Change the default delete button image
```javascript
$('.pin').easypin({
    deleteSrc: 'path/or/url/example-delete.jpg'
});
```

#### popover
Set callback all template variables
```javascript
$('.pin').easypin({
    popover: {
        content: function(value) {
            return value.replace(/\s+/g, ' ');
        }
    }
});
```
> It **content** variable is form input name

#### popoverStyle
Popover styles (it just pass to jquery .css() method)
```javascript
$('.pin').easypin({
    popover: {
        content: function(value) {
            return value.replace(/\s+/g, ' ');
        }
    },
    popoverStyle: {
        'background-color': 'orange',
        'color': 'black'
    }
});
```

#### limit
Limited pin (default 0) 0 for limitless
```javascript
$('.pin').easypin({
    limit: 2
});
```
> Set 0 for limitless pin

#### exceeded()
Limit exceeded event
```javascript
$('.pin').easypin({
    limit: 2,
    exceeded: function(type) {
        // do samething...
    }
});
```

#### drop()
Pin dropped event

```javascript
$('.pin').easypin({
    drop: function(x, y, element) {
        console.log(x, y, element);
    }
});
```

#### drag()
Pin dragging event
```javascript
$('.pin').easypin({
    drop: function(x, y, element) {
        console.log(x, y, element);
    },
    drag: function(x, y, element) {
        console.log(x, y, element);
    }
});
```

#### done()
Closing of the dialog window is depend to this function. Return true if the result dialog window will be closed
```javascript
$('.pin').easypin({
    done: function(element) {

        return true;

    }
});
```
> Will return the form objects if the dialog box contains the form objects. Otherwise the dialog box will return the objects


.easypinShow({}) options
=================

|      option                  | type                      | description                                                                |
| ---------------------------- | ------------------------- | -------------------------------------------------------------------------- |
| [data](#data)                | `object or json string`   | Pin data and coordinates                                                   |
| [responsive](#responsive)    | `boolean (default: false)`| Reponsive canvas for mobile                                                |
| [variables](#variables)      | `functions into object`   | Set callback all template variables                                        |
| [popover](#popover)          | `object`                  | There is two child element. show/animate (default: false)                  |
| [each](#each)                | `function`                | Each element works before replacing                                        |
| [error](#error)              | `function`                | Process error event                                                        |
| [success](#success)          | `function`                | Process success event                                                      |

#### data
Pin data and coordinates
```javascript
$('.pin').easypinShow({
    data: {
        "example_image1":{
            "0":{
                "content":"Hello World!",
                "coords":{
                    "lat":"530",
                    "long":"179"
                }
            },
            "canvas":{
                "src":"example.jpg","width":"800","height":"562"
            }
        }
    }
});
```

### responsive
Reponsive canvas for mobile (dfault: false)
```javascript
$('.pin').easypinShow({
    data: {/*json object*/},
    responsive: true
});
```

### variables
Reponsive canvas for mobile
```javascript
$('.pin').easypinShow({
    data: {/*json object*/},
    responsive: true,
    variables: {
        content: function(canvas_id, pin_id, data) {

            // do something...
            // and return
            return data;
        }
    }
});
```
> **content** is a template variable.

### popover
There is two child element. show/animate (default: false)
```javascript
$('.pin').easypinShow({
    data: {/*json object*/},
    responsive: true,
    variables: {
        content: function(canvas_id, pin_id, data) {

            // do something...
            // and return
            return data;
        }
    },
    popover: {
        show: true,
        animate: true
    }
});
```

### each()
Each element works before replacing.
```javascript
$('.pin').easypinShow({
    data: {/*json object*/},
    responsive: true,
    variables: {
        content: function(canvas_id, pin_id, data) {

            // do something...
            // and return
            return data;
        }
    },
    popover: {
        show: true,
        animate: true
    },
    each: function(index, data) {

        // do something
        // and return
        return data;
    }
});
```

### error()
Process error event
```javascript
$('.pin').easypinShow({
    data: {/*json object*/},
    responsive: true,
    variables: {
        content: function(canvas_id, pin_id, data) {

            // do something...
            // and return
            return data;
        }
    },
    popover: {
        show: true,
        animate: true
    },
    each: function(index, data) {

        // do something
        // and return
        return data;
    },
    error: function(e) {
        // do something...
    }
});
```

### success()
Process success event
```javascript
$('.pin').easypinShow({
    data: {/*json object*/},
    responsive: true,
    variables: {
        content: function(canvas_id, pin_id, data) {

            // do something...
            // and return
            return data;
        }
    },
    popover: {
        show: true,
        animate: true
    },
    each: function(index, data) {

        // do something
        // and return
        return data;
    },
    error: function(e) {
        // do something...
    },
    success: function() {

    }
});
```
