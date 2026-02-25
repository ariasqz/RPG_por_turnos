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
    }

    takeDamage(amount) {
        this.hp = Math.max(0, this.hp - amount);
    }

    getStatus() {
        return `${this.name} - HP: ${this.hp}/${this.maxHp}`;
    }
}

class Hero extends Character {
    constructor(name, hp, attack, defense, mana) {
        super(name, hp, attack, defense);
        this.mana = mana;
        this.maxMana = mana;
        this.level = 1;
        this.xp = 0;
        this.xpNeeded = 30;
        this.regenAmount = 5;
    }

    getStatus() {
        return `${super.getStatus()} | Mana: ${this.mana}/${this.maxMana} | Nv ${this.level}`;
    }

    regen() {
        const amount = Math.min(this.regenAmount, this.maxHp - this.hp);
        this.hp += amount;
        return amount;
    }

    castSpell(enemy) {
        const cost = 20;
        if (this.mana < cost) return null;
        this.mana -= cost;
        const damage = Math.max(1, this.attack * 2 - enemy.defense);
        enemy.takeDamage(damage);
        return damage;
    }

    heal() {
        const cost = 15;
        if (this.mana < cost) return null;
        this.mana -= cost;
        const amount = 25;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return amount;
    }

    gainXp(amount) {
        this.xp += amount;
        if (this.xp >= this.xpNeeded) {
            this.levelUp();
            return true;
        }
        return false;
    }

    levelUp() {
        this.level++;
        this.xp = this.xp - this.xpNeeded;
        this.xpNeeded = Math.floor(this.xpNeeded * 1.5);
        this.maxHp += 20;
        this.hp = this.maxHp;
        this.attack += 5;
        this.defense += 2;
        this.maxMana += 10;
        this.mana = this.maxMana;
        this.regenAmount += 2;
    }
}

class Enemy extends Character {
    constructor(name, hp, attack, defense, reward) {
        super(name, hp, attack, defense);
        this.reward = reward;
    }

    getStatus() {
        return `${super.getStatus()} | Recompensa: ${this.reward}g`;
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

const ENEMIES = [
    { name: 'Goblin', hp: 40, attack: 15, defense: 5, reward: 10, xp: 20 },
    { name: 'Esqueleto', hp: 60, attack: 22, defense: 8, reward: 20, xp: 35 },
    { name: 'Troll', hp: 100, attack: 30, defense: 15, reward: 40, xp: 60 },
    { name: 'Dragon', hp: 180, attack: 45, defense: 20, reward: 100, xp: 120 },
];

let hero = new Hero('Gandalf', 100, 30, 10, 50);
let enemy = null;
let battle = null;
let selectedEnemyIndex = 0;

const heroNameEl = document.getElementById('hero-name');
const heroHpText = document.getElementById('hero-hp-text');
const heroHpBar = document.getElementById('hero-hp-bar');
const heroManaText = document.getElementById('hero-mana-text');
const heroManaBar = document.getElementById('hero-mana-bar');
const heroAtk = document.getElementById('hero-atk');
const heroDef = document.getElementById('hero-def');
const heroXp = document.getElementById('hero-xp');
const heroLevelBadge = document.getElementById('hero-level-badge');

const enemyNameEl = document.getElementById('enemy-name');
const enemyHpText = document.getElementById('enemy-hp-text');
const enemyHpBar = document.getElementById('enemy-hp-bar');
const enemyAtkEl = document.getElementById('enemy-atk');
const enemyDefEl = document.getElementById('enemy-def');
const enemyRewardEl = document.getElementById('enemy-reward');

const logEl = document.getElementById('log');
const btnAttack = document.getElementById('btn-attack');
const btnSpell = document.getElementById('btn-spell');
const btnHeal = document.getElementById('btn-heal');
const btnRestart = document.getElementById('btn-restart');
const heroPanel = document.getElementById('hero-panel');
const enemyPanel = document.getElementById('enemy-panel');
const enemyListEl = document.getElementById('enemy-list');

function buildEnemySelector() {
    enemyListEl.innerHTML = '';
    ENEMIES.forEach((e, i) => {
        const btn = document.createElement('button');
        btn.className = 'enemy-btn' + (i === selectedEnemyIndex ? ' active' : '');
        btn.textContent = e.name;
        btn.onclick = () => {
            selectedEnemyIndex = i;
            document.querySelectorAll('.enemy-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            startBattle();
        };
        enemyListEl.appendChild(btn);
    });
}

function startBattle() {
    hero.hp = hero.maxHp;
    hero.mana = hero.maxMana;
    const data = ENEMIES[selectedEnemyIndex];
    enemy = new Enemy(data.name, data.hp, data.attack, data.defense, data.reward);
    battle = new Battle(hero, enemy);
    setLog(`<span class="log-system">${hero.name} vs ${enemy.name}. Que comience el combate!</span>`);
    setButtons(true);
    btnRestart.style.display = 'none';
    updateUI();
}

function updateUI() {
    heroNameEl.textContent = hero.name;
    heroHpText.textContent = `${hero.hp}/${hero.maxHp}`;
    heroManaText.textContent = `${hero.mana}/${hero.maxMana}`;
    heroAtk.textContent = hero.attack;
    heroDef.textContent = hero.defense;
    heroXp.textContent = `${hero.xp}/${hero.xpNeeded}`;
    heroLevelBadge.textContent = `Nv ${hero.level}`;

    const heroHpPct = (hero.hp / hero.maxHp) * 100;
    const heroManaPct = (hero.mana / hero.maxMana) * 100;

    heroHpBar.style.width = heroHpPct + '%';
    heroManaBar.style.width = heroManaPct + '%';

    heroHpBar.className = 'bar-fill hp-fill';
    if (heroHpPct <= 25) heroHpBar.classList.add('danger');
    else if (heroHpPct <= 50) heroHpBar.classList.add('warning');

    if (!enemy) return;
    enemyNameEl.textContent = enemy.name;
    enemyHpText.textContent = `${enemy.hp}/${enemy.maxHp}`;
    enemyAtkEl.textContent = enemy.attack;
    enemyDefEl.textContent = enemy.defense;
    enemyRewardEl.textContent = `${enemy.reward}g`;

    const enemyHpPct = (enemy.hp / enemy.maxHp) * 100;
    enemyHpBar.style.width = enemyHpPct + '%';

    enemyHpBar.className = 'bar-fill hp-fill';
    if (enemyHpPct <= 25) enemyHpBar.classList.add('danger');
    else if (enemyHpPct <= 50) enemyHpBar.classList.add('warning');

    btnSpell.disabled = hero.mana < 20 || !battle || battle.isOver();
    btnHeal.disabled = hero.mana < 15 || !battle || battle.isOver();
}

function enemyTurn() {
    if (!enemy.isAlive()) return '';
    const dmg = battle.enemyAttacks();
    shakePanel(heroPanel);
    spawnFloatDamage(heroPanel, `-${dmg}`, '#e74c3c');
    const regenAmount = hero.regen();
    let msg = `<span class="log-enemy">${enemy.name} contraataca por ${dmg} de daño.</span>`;
    if (regenAmount > 0) {
        spawnFloatDamage(heroPanel, `+${regenAmount}`, '#52be80');
        msg += ` <span class="log-heal">${hero.name} regenera ${regenAmount} HP.</span>`;
    }
    return msg;
}

function checkEnd() {
    if (!battle.isOver()) return false;
    setButtons(false);
    btnRestart.style.display = 'block';
    if (!hero.isAlive()) {
        setTimeout(() => showResult('Derrota', `${enemy.name} te ha vencido. Descansa, guerrero.`), 600);
    } else {
        const data = ENEMIES[selectedEnemyIndex];
        const leveled = hero.gainXp(data.xp);
        updateUI();
        let msg = `Victoria! +${data.reward}g, +${data.xp}xp.`;
        if (leveled) msg += ` <span class="log-level">Subiste al nivel ${hero.level}!</span>`;
        setLog(`<span class="log-hero">${msg}</span>`);
        setTimeout(() => showResult('Victoria!', `Has derrotado a ${enemy.name} y ganado ${data.reward} monedas de oro.`), 600);
    }
    return true;
}

btnAttack.addEventListener('click', () => {
    const dmg = battle.heroAttacks();
    shakePanel(enemyPanel);
    spawnFloatDamage(enemyPanel, `-${dmg}`, '#f0d080');
    let msg = `<span class="log-hero">${hero.name} ataca por ${dmg} de daño.</span>`;
    updateUI();
    if (checkEnd()) { setLog(msg); return; }
    msg += ' ' + enemyTurn();
    updateUI();
    checkEnd();
    setLog(msg);
});

btnSpell.addEventListener('click', () => {
    const dmg = hero.castSpell(enemy);
    if (dmg === null) return;
    shakePanel(enemyPanel);
    spawnFloatDamage(enemyPanel, `-${dmg}`, '#bb8fce');
    let msg = `<span class="log-mana">${hero.name} lanza un hechizo por ${dmg} de daño.</span>`;
    updateUI();
    if (checkEnd()) { setLog(msg); return; }
    msg += ' ' + enemyTurn();
    updateUI();
    checkEnd();
    setLog(msg);
});

btnHeal.addEventListener('click', () => {
    const amount = hero.heal();
    if (amount === null) return;
    spawnFloatDamage(heroPanel, `+${amount}`, '#52be80');
    let msg = `<span class="log-heal">${hero.name} se cura ${amount} HP.</span>`;
    updateUI();
    msg += ' ' + enemyTurn();
    updateUI();
    checkEnd();
    setLog(msg);
});

btnRestart.addEventListener('click', () => {
    startBattle();
});

function setLog(html) {
    logEl.innerHTML = html;
}

function setButtons(active) {
    btnAttack.disabled = !active;
    btnSpell.disabled = !active;
    btnHeal.disabled = !active;
}

function shakePanel(panel) {
    panel.classList.remove('shake');
    void panel.offsetWidth;
    panel.classList.add('shake');
}

function spawnFloatDamage(panel, text, color) {
    const rect = panel.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'float-dmg';
    el.textContent = text;
    el.style.color = color;
    el.style.left = (rect.left + rect.width / 2 - 20) + 'px';
    el.style.top = (rect.top + 20) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
}

function showResult(title, desc) {
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-desc').textContent = desc;
    document.getElementById('result-overlay').classList.add('show');
}

function closeResult() {
    document.getElementById('result-overlay').classList.remove('show');
}

buildEnemySelector();
startBattle();