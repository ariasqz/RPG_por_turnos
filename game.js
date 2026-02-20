class Character {
    constructor(name, hp, attack, defense) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.attack = attack;
        this.defense = defense;
    }

    isAlive() {
        return this.hp > 0;
    };
    takeDamage(amount){
        this.hp = Math.max(0, this.hp - amount);
    };
    getStatus(){
        return `${this.name} - HP: ${this.hp}/${this.maxHp}`;
    }





}
