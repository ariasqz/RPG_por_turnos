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
    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
    };
    getStatus() {
        return `${this.name} - HP: ${this.hp}/${this.maxHp}`;
    }
}

class Hero extends Character {
    constructor(name, hp, attack, defense, mana) {
        super(name, hp, attack, defense);
        this.mana = mana;
    }

    getStatus() {
        return `${super.getStatus()} | mana: ${this.mana}`;
    }

}

class Enemy extends Character {
    constructor(name, hp, attack, defense, reward) {
        super(name, hp, attack, defense);
        this.reward = reward;
    }
    getStatus() {
        return `${super.getStatus()} | reward: ${this.reward}g`;
    }
}

class Battle {
    constructor(hero, enemy) {
        this.hero = hero;
        this.enemy = enemy;
    }

    heroAttacks() {
        const damage = Math.max(1, this.hero.attack - this.enemy.defense);
        this.enemy.takeDamage(damage);
        return damage;
    }

    enemyAttacks() {
        const damage = Math.max(1, this.enemy.attack - this.hero.defense);
        this.hero.takeDamage(damage);
        return damage;
    }

    isOver() {
        return !this.hero.isAlive() || !this.enemy.isAlive();
    }
}

const hero = new Hero("Gandalf", 100, 30, 10, 50);
const enemy = new Enemy("Goblin", 40, 15, 5, 10);
const battle = new Battle(hero, enemy);

const heroStatus = document.getElementById('hero-status');
const enemyStatus = document.getElementById('enemy-status');
const log = document.getElementById('log');
const attackBtn = document.getElementById('attack-btn');

function updateUI() {
    heroStatus.textContent = hero.getStatus();
    enemyStatus.textContent = enemy.getStatus();
}

attackBtn.addEventListener('click', () => {

    // 1. El héroe ataca 
    const heroDamage = battle.heroAttacks();
    log.textContent = `Gandalf ataca por ${heroDamage} de daño`;

    if (battle.isOver()) {
        log.textContent += ' | ¡Goblin derrotado!';
        attackBtn.disabled = true; 
    
    } else {
        const enemyDamage = battle.enemyAttacks();
        log.textContent += ` | Goblin ataca por ${enemyDamage} de daño`;
    }

    updateUI(); 
});

updateUI(); 