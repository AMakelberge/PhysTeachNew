# PhysTeach

To do:

- [X] ~~*Add click on graph and display data feature when paused*~~ [2024-01-17]
    - [X] ~~*Get x/y of click on canvas*~~ [2023-12-26]
    - [X] ~~*Get closest point to click in data*~~ [2024-01-29]
        - [X] ~~*Currently buggy, is displayed the point next to the closest one, something wrong with indexing.*~~ [2024-01-17]    
    - [X] ~~*Display data on graph*~~ [2023-12-26]

- [X] ~~*Add variable integration methods*~~ [2023-12-20]
    - [X] ~~*Euler*~~ [2023-12-20]
    - [X] ~~*RK4*~~ [2023-12-20]

- [X] ~~*Add properly scaling stuff and correct height and width of graph canvas*~~ [2023-12-20]
    - [X] ~~*Make sure plotted data is still accurate*~~ [2023-12-20] 
    - [X] ~~*Make the 'padding' scales with the size of the graph*~~ [2023-12-20]

- [X] ~~*Fix the time scaling and stop it speeding up as the sim runs*~~ [2024-01-02]
    - [X] ~~*Make it accurate to the current time*~~ [2024-01-02]

- [X] ~~*Adding the path that the bottom pendulum has taken*~~ [2024-01-30]

- [X] ~~*Add interesting presets*~~ [2024-02-02]
    - [X] ~~*Use a database for this*~~ [2024-02-02]
    - [X] ~~*Simple osscilation (like single pendulum)*~~ [2024-02-02]
    - [X] ~~*Alternating osccilation*~~ [2024-02-02]
    - [X] ~~*Chaotic motion without enough energy to flip over*~~ [2024-02-02]
    - [X] ~~*Chaotic motion with enough energy to flip over*~~ [2024-02-02]

- [ ] Add toggle for damping

- [X] ~~*Show a bar that displays current kinetic and potential energy*~~ [2024-01-30]
    - [ ] Add references to Latex
        - http://www.physics.umd.edu/hep/drew/pendulum2.html#:~:text=which%20after%20some%20algebra%20reduces,≡%20θ%201%20%E2%88%92%20θ%202%20.
    - [X] ~~*Calculate the energies*~~ [2024-01-29]
    - [X] ~~*Display the energies on a bar next to the pendulum*~~ [2024-01-30]

- [ ] Export the graph to other format
    - [ ] Excel
    - [ ] PDF

- [X] ~~*Fix the energy bars so energy is actually correct*~~ [2024-02-02]

- [X] ~~*Make the page look nice with proper css*~~ [2024-02-28]

- [X] ~~*Add ability to click and drag the pendulum and move it around*~~ [2024-01-29]
    - https://www.youtube.com/watch?v=7PYvx8u_9Sk 
    - [X] ~~*Fix the angles*~~ [2024-01-29]
        - [X] ~~*Use the dot product to calculate the angle*~~ [2024-01-29]
    
- [X] ~~*Add page for the n-body problem*~~ [2024-01-17]

- [X] ~~*Separate into different files for cleaner reading*~~ [2023-12-20]
    - [X] ~~*Integration methods*~~ [2023-12-20]
    - [X] ~~*Differentials/Maths*~~ [2023-12-20]
    - [X] ~~*Graph*~~ [2023-12-20]
    - [X] ~~*Main running*~~ [2023-12-20]

Latex:

Analysis:
- [ ] Talk about what it wont/can't do but ideas for the future
    - [ ] Confirm with Marsh whether this is actually a good idea
- [ ] Data flow diagram
- [ ] Talk about what libraries I'll be using
    - [ ] Talk about how routing and client-server is too complex so import it
- [ ] IPSO (Input Process Storage Output) diagram
    - [ ] For a simple IPSO (Input Process Storage Output) diagram, just use a 2x2 table and label each one. Then add an overview of all inputs, processes, data that needs to be stored and outputs.
- [ ] Basic hardware and software that is needed
- [ ] Talk about doing all the drawing by hand

Design:
- [ ] Another more detailed data flow diagram
- [ ] Flow chart of how user navigates throughout system
- [ ] File structure
- [ ] Design what each piece of GUI will look like and display it
- [ ] Rename data structures to data dictionary
    - [ ] Each variable
    - [ ] Its data type
    - [ ] Its function
- [ ] Data structures
    - [ ] Talk about every single data structure used
    - [ ] How is works
    - [ ] Where to find it
    - [ ] What is does
- [ ] Important algorithms
    - [ ] Write algorithms for drawing the stuff to the screen

Coding:
- [ ] Add literally any technique used
- [ ] Double check the comments to make sure they are needed but not unneccessary
- [ ] Do the defensive programming for inputting the values
- [ ] Maybe rewrite code to make it properly nice
- [ ] Appendix at the bottom that links to libraries and their descriptions

Testing:
Do this once the other sections are done.
Check the word doc for what you need to do:
https://docs.google.com/document/d/1J3559gahN2d9Eh4eJMbPT-6jB7lHTCJa-twuzZWgQS4/edit