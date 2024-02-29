
class Pendulum {
    #g;
    #m1;
    #m2;
    #l1;
    #l2;
    #h;
    #th1;
    #th2;
    #om1;
    #om2;
    #maxEnergyLabel;
    #potentialEnergy;
    #kineticEnergy;
    constructor(g, m1, m2, l1, l2, h, th1, th2, om1, om2) {
        this.#g = g;
        this.#m1 = m1;
        this.#m2 = m2;
        this.#l1 = l1;
        this.#l2 = l2;
        this.#h = h;
        this.#th1 = th1;
        this.#th2 = th2;
        this.#om1 = om1;
        this.#om2 = om2;
        this.#kineticEnergy = this.#getKineticEnergy();
        this.#potentialEnergy = this.#getPotentialEnergy();
        this.#maxEnergyLabel = this.#getMaxEnergyLabel();
    }

    #getKineticEnergy(){
        
    }

    #getPotentialEnergy(){

    }

    #getMaxEnergyLabel(){
        totEnergy = this.#getKineticEnergy() + this.#getPotentialEnergy()
        return totEnergy
    }
}