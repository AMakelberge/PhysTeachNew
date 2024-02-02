from scipy import constants
import numpy as np
G = constants.G
white = (255,255,255)
black = (0,0,0)
red = (255,0,0)
blue = (0,0,255)
yellow = (255,255,0)
width = 1920
height = 1080

def generate_gradient(from_color, to_color, height, width):
    channels = []
    for channel in range(3):
        from_value, to_value = from_color[channel], to_color[channel]
        channels.append(
            np.tile(
                np.linspace(from_value, to_value, width), [height, 1],
            ),
        )
    return np.dstack(channels)

class Vector():
    def __init__(self):
        pass

class System():
    def __init__(self):
        self.__planets = []

    def createPlanet(self, mass: int, position: tuple, velocity: tuple, radius):
        self.__planets.append(Planet(mass, position, velocity, radius))

    def getPlanets(self):
        return self.__planets

class Planet():
    def __init__(self, mass: int, position: tuple, velocity: tuple, radius):
        self.mass = mass
        self.position = list(position)
        self.radius = radius
        self.velocity = list(velocity)
        self.maxPathLength = 500
        self.allPos = [tuple(position)]
        self.pathColour = white #generate_gradient(black, white, 600, self.maxPathLength)

    def updatePosition(self, planets, frameRate):
        forceX = 0
        forceY = 0
        for planet in planets:
            try:
                distance = ((planet.position[0]-self.position[0])**2 + (planet.position[1]-self.position[1])**2)**0.5
                distanceX = (planet.position[0]-self.position[0])
                distanceY = (planet.position[1]-self.position[1])
                minDist = 10
                force = 0
                if abs(distance) < minDist:
                    if distance < 0:
                        distance = -minDist
                    else:
                        distance = minDist
                elif distance >= 0:
                    force = planet.mass/(distance**2)
                elif distance < 0:
                    force = planet.mass/-(distance**2)
                forceX += force * (distanceX/distance)
                forceY += force * (distanceY/distance)
            except ZeroDivisionError:
                pass
        accelerationX = G * forceX * 1e-8
        accelerationY = G * forceY * 1e-8
        self.velocity[0] += accelerationX/frameRate
        self.velocity[1] += accelerationY/frameRate
        self.position[0] += (self.velocity[0]/(frameRate))
        self.position[1] += (self.velocity[1]/(frameRate))

        while len(self.allPos) >= self.maxPathLength:
            self.allPos.pop(0)
        self.allPos.append((self.position[0],self.position[1]))

    
earth = Planet(5.97219e24, (540, 260), (0, 325), 500)
sun = Planet(5.97219e24, (1280,820), (0,-325), 500)
venus = Planet(5.97219e25, (1060, 540), (0,0), 500)

import pygame

pygame.init()


screen = pygame.display.set_mode((width,height))
clock = pygame.time.Clock()
frameRate = 60
run = True

while run:
    clock.tick(frameRate)
    screen.fill(black)

    earth.updatePosition([sun, venus], frameRate)
    pygame.draw.lines(screen, (earth.pathColour), False, earth.allPos)
    pygame.draw.circle(screen, (blue), earth.position, earth.radius/100)
    
    sun.updatePosition([earth, venus], frameRate)
    pygame.draw.lines(screen, (sun.pathColour), False, sun.allPos)
    pygame.draw.circle(screen, (red), sun.position, sun.radius/100)
    
    venus.updatePosition([earth, sun], frameRate)
    pygame.draw.lines(screen, (venus.pathColour), False, venus.allPos)
    pygame.draw.circle(screen, (yellow), venus.position, venus.radius/100)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            run = False
    
    pygame.display.flip()
pygame.quit()
