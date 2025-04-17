# Project phase 2
This Report outlines the created product's results and what changes might have been done differently from the initial project plan.

## 1. Environment

* Changes : 
    * For hosting the website, AWS was used as in the initial plan, but a **Github self hosted action runner** was implemented to automatically pull a commit from Github.
    * The free-tier VM was also little limiting on the frontend especially when installing with node package manager, the vm would often freeze when installing packages. 
    For this reason, the frontend package manager was changed to yarn that is little bit more lightweight.
    * The vm has scripts and services to automatically start the website on boot.

## 2. Backend

#### Backend has a pretty clear execution flow:
#### request -> Check client has required access
#### -> router forwards request to proper data handler
#### -> data handler calls functions from db handler 
#### -> db handler uses db connector to query db
### Flow back 
#### db query result -> returns to db handler
#### db handler  wraps result in a clean object
#### db handler returns result to data handler
#### data handler compiles data
#### -> data is returned back to client with status codes
* Changes:
    * Few additional packages were installed : cors for communication to backend and jsonwebtoken for token authentication.

* Data handlers all execute similar to each other:
     data handler calls dbhandler for data from database and does necessary checks for the result, before returning the data and possibly parsing if needed.

* Backend structure is the following:
    ## Router
    ![alt text](image-2.png)
    router.js contains all of the routes on the backend, and each route is forwarded to the appropriate data handler (loginHandler, mainHandler, itemHandler).

        * The router also has a middleware used to authenticate request origin for tokens:
        ![alt text](image-5.png)

    ## data handlers

    ![alt text](image-8.png)
   
    mainHandler handles data that has to do with shelfs or shelf items (**main** coming from main page).

    ![alt text](image-11.png)
    loginHandler has functions related to login and users.

    ![alt text](image-12.png)
    itemHandler has functions related to items.

    ## db handler

    ![alt text](image-13.png)
    dbHandler contains all functions needed in the app to query database.
    The file declares all possible queries at the top of the file:
    ![alt text](image-14.png)
    And these are executed on the database with parametrized queries where possible.
    dbHandler sometimes also chains it's functions to get to a result (
        create shelf -> generate new shelf name -> execute query to create shelf table with generated name
    )

    dbHandler must be initialized before it can be used. For this it uses two
    different database connectors depending on are you running tests or production.
    ![alt text](image-15.png) <br />
    This enables dbHandler to work with different databases without creating duplicate code.

    ## db connector

    ![alt text](image-16.png)
    <br /> This is the production connector, both connectors are almost identical but they use different object from the credentials file:
    ![alt text](image-17.png)


## 3. Frontend

* Changes:
    * Initial plan had some dialog-style popups for editing information on the website, but these were changed to unique sites for the time it would take to learn these style of elements would have taken too much, as there is no previous experience with react.
    * Some packages were installed that are not in the initial plan: crypto-js for hashing user password before further processing it over http and react-router for easier routing of frontend pages.
    * The node package manager had to be changed to yarn, as the npm would often hang due to small RAM size(1GB).

### The frontend routing
Routing would start from login page, where user would always be redirected if accessing a page without active token. <br /> 
![alt text](image-18.png)

Each page has been seperated into it's own components, which are then rendered based on route.

Each page has access to context data, that is initialised and changed in the main file with all the routes, such as user role, username, functions for when authentication is needed (redirect to login page).

### The general execution flow of page:
#### -> client accesses page
#### -> if page has data that needs to be displayed, fetch them from backend
#### -> display data 
#### -> User input received -> site stores updated value states
#### -> A "confirm" action has been executed by user eg. Create item
#### -> make a request to backend with saved state values
#### -> "reset" page by fetching displayed data again

### Example Shelfs page:
![alt text](image-19.png)
function for fetching shelfs from database

![alt text](image-20.png)
function for fetching items stored in a specific shelf

Now this is where it gets a little complicated:
![alt text](image-21.png)

* Some groundwork <br />
useEffect fires everytime the given dependency is changed (dependency is one that uses **useState()** to keep it's value between renders and what's change causes re-render)
if the useEffect is not given a dependency array, it fires when the page is mounted ( or loaded). <br />

So what happens if you use the page load useEffect (without dependencies) to: <br />
getShelfs -> loop through each shelf to get each shelf's items?
<br /> 
First the needed functions: <br /> 
getShelfs -> this sets a state variable "shelfs" with all of the shelfs in an array 
<br />
-> getShelfs() -> shelfs = ["shelf1", "shelf2" ...]
![alt text](image-22.png)

<br /> 
function to get a shelf's items and set state variable shelfsItems: <br />

![alt text](image-23.png)


-> Get all shelfs -> loop through each shelf in shelfs **in a single useEffect call**
![alt text](image-24.png)


result = loop executes zero times in useEffect()?!?!

This displays that the useState() setting of a variable is not indeed instant...

Fix:
Use TWO useEffect() calls:
![alt text](image-25.png)


Now the second useEffect executes when the **shelfs** state variable has been updated. <br /> 

But still no luck. One or two shelf's items might flash on the screen momentarily and then disappear.

We still have the same problem with state update not being instant here:
![alt text](image-26.png)

When we are copying the item's from the existing object, the state might not always have updated from our previous loop, which means we are not actually copying anything. <br />

And then we set the object again, with none of the already added items...
<br />
Fix: <br /> 
Use THREE useEffect() calls, useRef and a queue: <br />

![alt text](image-27.png) <br />
Queue implementation
<br /> 

useRef stores the object in a state that is not wiped clean on re-render as with normal variables. You can access the item via the **current** attribute: 
![alt text](image-28.png)
<br /> Add each shelf to the queue. <br />

And then the useEffect calls:
![alt text](image-29.png)

Now, The first useEffect when the page is mounted, fetches the shelfs.
<br /> -> shelfs useEffect() fires because shelfs is set in the first useEffect<br />
-> The second useEffect get's the first shelf's items and updates the **shelfsItems** state variable <br />
-> the shelfsItems useEffect() fires because we just updated the **shelfsItems** state variable.<br />
the **shelfsItems** useEffect() loops until the queue is empty. <br />

Now the **shelfsItems** should be updated only once the previous state has been set right?!!?

<br /> 

# NO

<br />

<br />

<br />

<br />

<br />


<br />

<br />

<br />

<br />


<br />

<br />

<br />


<br />

<br />

<br />

<br />

<br />

<br />


<br />

<br />

<br />

<br />


<br />

<br />



![alt text](ok.webp)

<br />
Seems the useEffect might fire little bit before the state has actually updated in the state variable. 

Well... What now? <br />

Luckily, there is a way to get the latest state from the state variable : <br />

![alt text](image-31.png)


This passes a callback function into the state variable's set function. <br /> 
Which means, even though the value of the state variable has not updated yet to the getter, you get the latest value (set last GetShelfItems() call). <br />


#### So long story short
This is why shelfs contains a queue logic, even though it doesn't need one, there 
has been no energy to crunch refactoring shelfs page to this version.













    

## 4. Database

* Changes:
    Database schema has not really changed, the dbHandler does initiate the database on each boot with this sql file:
    ![alt text](image-30.png)

    The dbHandler file contains a function that parses the file to seperate commands and executes it on the database.
    Additionally to this schema, there is the shelf table schema that is created dynamically: 
    ![alt text](image-32.png)

    inserting the table name returned from the frontend seems scary, but luckily the table creation algorithm only creates tables with chars between a-z. <br />
    So the tablename can be checked for all other special characters or spaces to prevent sql injection:
    ![alt text](image-33.png)

    The generation algorithm for new shelfname looks like this:
    ![alt text](image-34.png)
    The algorithm takes in the last created shelf (largest id in shelfs table) and then generates a new id. <br /> z becomes aa and az becomes ba and so on...



## 6. Functionalities

All functionalities of the application has been done that were specified in the initial plan:


## 7. Code quality and documentation

Add something

## 8. Testing and error handling

Add something

## 9. User interface and interaction

Add something