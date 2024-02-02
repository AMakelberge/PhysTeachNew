from scipy import constants
import math
import pygame

g = constants.G
pi = constants.pi
white = (255,255,255)
black = (0,0,0)
width = 800
height = 400 #screen size
h = 0.2 #step size
stepsPerFrame = 1
timeScale = 100 #speed of simulation

m1 = 5;   #mass first bob
m2 = 5;   #mass second bob
l1 = 100 #length first rod
l2 = 100 #length second rod
th1 = 90 * (pi / 180) #angle first
th2 = 30 * (pi / 180) #angle second
om1 = 0  #angular velocity first
om2 = 0  #angular velocity second

x0 = width/2 #base points
y0 = height/5

#clamps angles for propper size
def normalizeAngle(angle):
    angle %= (2*pi)
    if angle > pi:
        angle -= 2*pi
    elif angle < pi:
        angle += 2*pi
    return angle

#differential equation
def differential(th1, th2, om1, om2):
    delta = th2-th1
    den1 = (m1 + m2) * l1 - m2 * l1 * math.cos(delta) * math.cos(delta)
    den2 = (l2 / l1) * den1
    dotom1 = ((m2 * l2 * om2 * om2 * math.sin(delta) * math.cos(delta)
        + m2 * g * math.sin(th2) * math.cos(delta)
        + m2 * l2 * om2 * om2 * math.sin(delta)
        - (m1 + m2) * g * math.sin(th1))
        / den1)
    dotom2 = ((-l1 / l2) * om1 * om1 * math.sin(delta) * math.cos(delta)
        + (m1 + m2) * g * math.sin(th1) * math.cos(delta)
        - (m1 + m2) * l1 * om1 * om1 * math.sin(delta)
        - (m1 + m2) * g * math.sin(th2))/ den2
    return [om1, om2, dotom1, dotom2]

#numerical estimation of next value
def rk4Integration(h, th1, th2, om1, om2):
    k1_th1, k1_th2, k1_om1, k1_om2 = differential(th1, th2, om1, om2)
    k2_th1, k2_th2, k2_om1, k2_om2 = differential(
        th1 + 0.5 * h * k1_th1,
        th2 + 0.5 * h * k1_th2,
        om1 + 0.5 * h * k1_om1,
        om2 + 0.5 * h * k1_om2)
    k3_th1, k3_th2, k3_om1, k3_om2 = differential(
        th1 + 0.5 * h * k2_th1,
        th2 + 0.5 * h * k2_th2,
        om1 + 0.5 * h * k2_om1,
        om2 + 0.5 * h * k2_om2)
    k4_th1, k4_th2, k4_om1, k4_om2 = differential(
        th1 + h * k3_th1,
        th2 + h * k3_th2,
        om1 + h * k3_om1,
        om2 + h * k3_om2)
    
    dth1 = (h / 6) * (k1_th1 + 2 * k2_th1 + 2 * k3_th1 + k4_th1)
    dth2 = (h / 6) * (k1_th2 + 2 * k2_th2 + 2 * k3_th2 + k4_th2)
    dom1 = (h / 6) * (k1_om1 + 2 * k2_om1 + 2 * k3_om1 + k4_om1)
    dom2 = (h / 6) * (k1_om2 + 2 * k2_om2 + 2 * k3_om2 + k4_om2)

    print(dth1, dth2, dom1, dom2)

    return dth1, dth2, dom1, dom2

#initialises pygame
pygame.init()
screen = pygame.display.set_mode((width,height)) #instantiates the display
clock = pygame.time.Clock()
frameRate = 60
run = True

lastTime = 0
while run:
    clock.tick(frameRate)
    screen.fill(white)

    #allows for more accurate running
    stepsForThisFrame = int(stepsPerFrame * timeScale)
    for x in range(stepsForThisFrame):
        (dth1, dth2, dom1, dom2) = rk4Integration(h, th1, th2, om1, om2)
        th1 += dth1
        th2 += dth2
        om1 += dom1
        om2 += dom2

    #calculates position of pendulum arms
    x1 = x0 + l1 * math.sin(normalizeAngle(th1))
    y1 = y0 + l1 * math.cos(normalizeAngle(th1))
    x2 = x1 + l2 * math.sin(normalizeAngle(th2))
    y2 = y1 + l2 * math.cos(normalizeAngle(th2))

    #draws to the screen
    pygame.draw.lines(screen, black, False, [(x0,y0),(x1,y1),(x2,y2)])

    for event in pygame.event.get():#stops simulation if you exit the screen
        if event.type == pygame.QUIT:
            run = False
    
    pygame.display.flip()
pygame.quit()
