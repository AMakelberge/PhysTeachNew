# PhysTeach

This is a physics simulation of the Double Pendulum Problem. 

# How to run

Current this needs to be run on a localhost.
Download Node and download all of the dependencies.
Copy the repository. 
Type into the terminal Node App.js
It will prompt you for a password to access the database. Ask the author directly for the password.
Once running it will tell you.
On Chrome (designed to look the best there) go to localhost:3000

# Features

- Pendulum
    - Click on the pendulum to set it's position to where you have clicked

- Sliders on the right
    - That box can scroll and gives you many options on how to control the simulation
    - Gravity
        - The gravity that the simulation uses set to 9.81 by default
    - m1 
        - The mass of the first pendulum
    - m2
        - The mass of the second penulum
    - l1 
        - The length of the first pendulum
    - l2
        - The length of the second pendulum
    - h
        - The step height used in the integration
        - Also control the speed that the simulation runs at
    - Add a preset
        - Add you own custom preset
        - Will update the database and add a new preset
        - Reloads the website when the submit button is presed
    - Select a preset
        - Sets the pendulum to one of the custom presets from the database
        - Will change to the preset when preset is selected in dropdown
    - y-variable
        - Control what variable will be graphed on the y-axis of the graph
    - x-variable
        - Control what variable will be graph on the x-axis of the graph
    - Integration method
        - 2 options, RK4 or Euler
        - Different methods used to numerically integrate the pendulum's position
        - RK4 more accurate, Euler faster
    - Pause
        - Button that when pressed will pause the simulation
        - Allows you to click on the graph and show the closest point and its value
    - Restart graph
        - Will keep the slider values all the same
        - Resets the graph to empty and puts the pendulum's position back
    - Restart variabels and graph
        - Will also reset slider values to their defaults
        - Use if the pendulum goes nuts

- Graph
    - Graphs different variables as they progress

- Energy bars
    - Blue represets the potential energy of the pendulum
    - Red represents the kinetic energy of the pendulum
    