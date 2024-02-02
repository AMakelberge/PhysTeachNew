from scipy import constants
import numpy as np
G = constants.G #newton's gravitational constant
white = (255,255,255)
black = (0,0,0)
red = (255,0,0)
blue = (0,0,255)
yellow = (255,255,0) #instantiate some colours for simpler code
width = 1920
height = 1080 #height and width of the screen that pygame will use

class Planet(): #planet class that stores all of the information of all the planets
    def __init__(self, mass: int, position: tuple, velocity: tuple, radius):
        self.mass = mass #mass of the planet
        self.position = list(position) #the position of the planet in 2D space stored as a list
        self.radius = radius #radius of the planet (used for rendering)
        self.velocity = list(velocity) #velocity of the planet in 2D space stored as component speeds in each dimension

    def updatePosition(self, planets, frameRate):
        forceX = 0
        forceY = 0 #instantiate forces in each direction
        for planet in planets: #loops through all the other planets that are not itself
            try:
                distance = ((planet.position[0]-self.position[0])**2 + (planet.position[1]-self.position[1])**2)**0.5 #calculates the distance from one planet to the next planet
                distanceX = (planet.position[0]-self.position[0]) #gets x component of distance
                distanceY = (planet.position[1]-self.position[1]) #gets y component of distance
                minDist = 10 #makes sure there are no divideByZero erros
                force = 0 #magnitude of the force applied on planet
                if abs(distance) < minDist:
                    if distance < 0:
                        distance = -minDist
                    else:
                        distance = minDist #if distance is less than minDist, then it sets it to minDist
                elif distance >= 0:
                    force = planet.mass/(distance**2) #uses Newton's law of gravitation to calculate force
                elif distance < 0:
                    force = planet.mass/-(distance**2) #sets it to negative if it's negative
                forceX += force * (distanceX/distance) #gets x component of force
                forceY += force * (distanceY/distance) #gets y component of force
            except ZeroDivisionError:
                pass
        accelerationX = G * forceX * 1e-8 #calculates acceleration on planet
        accelerationY = G * forceY * 1e-8
        self.velocity[0] += accelerationX/frameRate #calculates velocity on planet
        self.velocity[1] += accelerationY/frameRate
        self.position[0] += (self.velocity[0]/(frameRate)) #changes the position of the planet
        self.position[1] += (self.velocity[1]/(frameRate))

    
mars = Planet(5.97219e24, (540, 260), (0, 325), 500) #instantiates 3 planet objects
earth = Planet(5.97219e24, (1280,820), (0,-325), 500)
sun = Planet(5.97219e25, (1060, 540), (0,0), 500)

import pygame

pygame.init()


screen = pygame.display.set_mode((width,height)) #instantiates the display
clock = pygame.time.Clock()
frameRate = 60
run = True

while run:
    clock.tick(frameRate)
    screen.fill(black)

    earth.updatePosition([sun, mars], frameRate)#update then render the planet on each frame
    pygame.draw.circle(screen, (blue), earth.position, earth.radius/100)
    
    sun.updatePosition([earth, mars], frameRate)
    pygame.draw.circle(screen, (yellow), sun.position, sun.radius/100)
    
    mars.updatePosition([earth, sun], frameRate)
    pygame.draw.circle(screen, (red), mars.position, mars.radius/100)

    for event in pygame.event.get():#stops simulation if you exit the screen
        if event.type == pygame.QUIT:
            run = False
    
    pygame.display.flip()
pygame.quit()
