// CANVAS STUFSD
const canvas = document.getElementById('canvas');
canvas.width = 400;
canvas.height = 400;

const log = document.getElementById('log');
log.innerHTML = 'Hello log!';

let gravity = .2;

const c = canvas.getContext('2d');

c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite
{
    constructor(width, height, posX, posY, xSpeed, ySpeed, image = null, name = '')
    {
        this.name = name;
        this.width = width;
        this.height = height;
        this.scrollX = 0;
        this.scrollY = 0;
        this.posX = posX;
        this.posY = posY;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.scroll = 1;
        this.origX = this.posX;
        this.origY = this.posY;
        this.origXspeed = this.xSpeed;
        this.origYspeed = this.ySpeed;
        
        if(image != null)
        {
            this.image = new Image();
            this.image.src = image;
            this.image.width = this.width;
            this.image.height = this.height;
        }
        else
        {
            this.image = null;
        }
    }
    
    draw()
    {
        if(this.image != null)
        {
            c.drawImage(this.image, this.posX + this.scrollX, this.posY + this.scrollY, this.image.width, this.image.height);
        }
        else
        {
            c.fillStyle = 'blue';
            c.fillRect(this.posX + this.scrollX, this.posY + this.scrollY, this.width, this.height);
        }
    }
    
    update()
    {
        this.draw();
        
        this.posX += this.xSpeed;
        this.posY += this.ySpeed;
    }
    
    reset()
    {
        this.posX = this.origX;
        this.posY = this.origY;
        this.xSpeed = this.origXspeed;
        this.ySpeed = this.origYspeed;
        this.scrollX = 0;
        this.scrollY = 0;
        player.xSpeed = 0;
        player.ySpeed = 0;
    }
}

function rectangularCollision(x1, x2, y1, y2, h1, h2, w1, w2)
{
    return x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2;
}

let player = new Sprite(50, 50, 0, 0, 0, 0, 'Karel.png');
player.draw();
player.grounded = false;
player.jump = true;
player.reserve = 1000;
player.lastDirection = 1;
player.dRight = true;
let bulletCount = 0;

let sky = new Sprite(1029, 686, 0, 0, 0, 0, 'Skybox.png');
let sky2 = new Sprite(1029, 686, -1029, 0, 0, 0, 'Skybox.png');
let sky3 = new Sprite(1029, 686, 0, -686, 0, 0, 'Skybox.png');
let sky4 = new Sprite(1029, 686, -1029, -686, 0, 0, 'Skybox.png');
let sky5 = new Sprite(1029, 686, 1029, 0, 0, 0, 'Skybox.png');
let sky6 = new Sprite(1029, 686, 0, 686, 0, 0, 'Skybox.png');
let sky7 = new Sprite(1029, 686, 1029, 686, 0, 0, 'Skybox.png');
let sky8 = new Sprite(1029, 686, 1029, -686, 0, 0, 'Skybox.png');
let sky9 = new Sprite(1029, 686, -1029, 686, 0, 0, 'Skybox.png');

sky.scroll = .5;
sky2.scroll = .5;
sky3.scroll = .5;
sky4.scroll = .5;
sky5.scroll = .5;
sky6.scroll = .5;
sky7.scroll = .5;
sky8.scroll = .5;
sky9.scroll = .5;

let rock = new Sprite (80, 50, 250, 200, 0, 0);

let rock2 = new Sprite (200, 50, -250, 350, 2, 0);
rock2.time = 7000;
rock2.switch = true;

let rock3 = new Sprite (80, 50, 500, 50, 0, 0);
let rock4 = new Sprite (50, 50, 700, 600, 0, 0);
let rock5 = new Sprite (120, 50, 100, 650, 0, 0);
let rock6 = new Sprite (80, 50, 300, 460, 0, 0);

let enemy1 = new Sprite (80, 50, 100, 200, 0, 0, 'Enemy.png');

let health = new Sprite(180, 180, 700, 160, 0, 0, 'health.jpg');

let Sprites = [sky, sky2, sky3, sky4, sky5, sky6, sky7, sky8, sky9, player, rock, rock2, rock3, rock4, rock5, rock6, enemy1, health];
let platforms = [rock, rock2, rock3, rock4, rock5, rock6];
let movingPlatforms = [rock2];
let enemies = [enemy1];
let healthDudes = [health];
let bullets = [];

function scroll(distanceY, distanceX)
{
    for(let i = 0; i < Sprites.length; i++)
    {
        Sprites[i].scrollY -= distanceY * Sprites[i].scroll;
        Sprites[i].scrollX -= distanceX * Sprites[i].scroll;
    }
}

function destroyObject(name, array)
{
    for(let i = 0; i < array.length; i++)
    {
        if(array[i].name == name)
        {
            array.splice(i, 1);
        }
    }
}

function shoot()
{
    if(player.dRight)
    {
        bulletSpeed = 12;
    }
    else
    {
        bulletSpeed = -12;
    }
    
    bulletCount++;
    let bullet = new Sprite (40, 10, player.posX + player.scrollX, player.posY + player.scrollY, bulletSpeed, 0, null, 'bullet' + bulletCount);
    Sprites.push(bullet);
    bullets.push(bullet);
    setTimeout(() => {destroyObject(bullet.name, Sprites); destroyObject(bullet.name, bullets);}, 1000);
}

function resetGame()
{
    player.posX = 50;
    player.posY = 50;
    
    for(let i = 0; i < Sprites.length; i++)
    {
        Sprites[i].scrollX = 0;
        Sprites[i].scrollY = 0;
        Sprites[i].reset();
    }
    
    player.width = 50;
    player.height = 50;
    player.image.width = player.width;
    player.image.height = player.height;
}

function mainLoop()
{
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    player.ySpeed += gravity;
    
    
    // Platforms
    for(i = 0; i < platforms.length; i++)
    {
        let platform = platforms[i];
        
        if(rectangularCollision(player.posX + player.xSpeed, platform.posX, player.posY + player.ySpeed, platform.posY, player.height + 1, platform.height, player.width, platform.width))
        {
            if(player.posY + player.height < platform.posY +30)
            {
                player.posY = platform.posY - player.height;
                player.ySpeed = 0;
                player.reserve = 1000;
                
                if(player.xSpeed == 0 || !(player.xSpeed == 5 + platform.xSpeed || player.xSpeed == -5 + platform.xSpeed || player.xSpeed == platform.xSpeed))
                {
                    if(platform.xSpeed == 0)
                    {
                        player.xSpeed = platform.xSpeed;
                    }
                    else
                    {
                        player.xSpeed += platform.xSpeed;
                    }
                    
                }
            }
            else
            {
                player.ySpeed = 5;
                player.xSpeed *= -1;
                player.xSpeed += platform.xSpeed;
            }
            gravity = 0;
            
            
        }
        else
        {
            player.grounded = false;
            gravity  = .2;
        }
    }
    
    for(let i = 0; i < movingPlatforms.length; i++)
    {
        if(movingPlatforms[i].switch)
        {
            setTimeout(() => {movingPlatforms[i].xSpeed *= -1; movingPlatforms[i].switch = true;}, movingPlatforms[i].time);
            movingPlatforms[i].switch = false;
        }
    }
    
    for(let i = 0; i < Sprites.length; i++)
    {
        Sprites[i].update();
    }
    
    for(let i = 0; i < enemies.length; i++)
    {
        let enemy = enemies[i];
        if(rectangularCollision(player.posX, enemy.posX, player.posY, enemy.posY, player.height, enemy.height, player.width, enemy.width))
        {
            player.width -= 5;
            player.height -= 5;
            player.posX += 2.5;
            player.posY += 2.5;
            player.image.width = player.width;
            player.image.height = player.height;
            
            if(player.width <= 0)
            {
                resetGame();
                player.width = 50;
                player.height = 50;
                player.image.width = player.width;
                player.image.height = player.height;
            }
            
            player.xSpeed *= -1;
            player.ySpeed *= -1;
            
        }
    }
    
    // Healers
    for(let i = 0; i < healthDudes.length; i++)
    {
        let dude = healthDudes[i];
        if(rectangularCollision(player.posX, dude.posX, player.posY, dude.posY, player.height, dude.height, player.width, dude.width))
        {
            if(player.width + 5 <= 50)
            {
                player.width += 5;
                player.height += 5;
                player.posX -= 2.5;
                player.posY -= 2.5;
                player.image.width = player.width;
                player.image.height = player.height;
            }
            
            player.xSpeed *= -1;
            player.ySpeed *= -1;
            player.posY += player.ySpeed * 2;
            player.posX += player.xSpeed * 2;
            
        }
    }
    
    // SCROLLING
    if(player.posY + player.height + player.scrollY > 300)
    {
        scroll(.5 * (player.posY + player.height + player.scrollY - 300), 0);
    }
    
    if(player.posY + player.scrollY < 100)
    {
        scroll(.5 * (player.posY + player.scrollY - 101), 0);
    }
    
    // Borders
    
    if(player.posY < -686 * 2 + 100 + player.ySpeed || player.posY + player.ySpeed > 686 * 4 - 420 || player.posX < -1029 * 2 + 400 || player.posX > 1029 * 4 -400)
    {
        player.posX = 50;
        player.posY = 50;
        
        resetGame();
    }
    
    
    if(player.posX + player.xSpeed + player.scrollX < 300 && player.lastDirection < 0)
    {
        scroll(0, .05 * 1.01 * (player.posX + player.xSpeed + player.scrollX - 301));
    }
    
    if(player.posX + player.width + player.xSpeed + player.scrollX > 100 && player.lastDirection > 0)
    {
        scroll(0, .05 * 1.01 * (player.posX + player.width + player.xSpeed + player.scrollX - 99));
    }
    
    // UPDATE PLAYER DIRECTION
    if(player.xSpeed != 0)
    {
        player.lastDirection = player.xSpeed;
    }
    
    // LOG VALUES
    log.innerHTML = player.posX + '<br>' + player.xSpeed + '<br>' + player.scrollX;
    
    window.requestAnimationFrame(mainLoop);
}

mainLoop();

window.addEventListener('keydown', (event) =>
{
    switch(event.key)
    {
        case 'ArrowUp':
            if(player.jump)
            {
                player.ySpeed = -4;
                player.posY -= 2;
               player.jump = false;
            }
            
            if(player.ySpeed >= -15)
            {
                player.ySpeed -= 1.5;  
            }
            break;
        case 'ArrowDown':
            player.ySpeed += 3;
            break;
        case 'ArrowLeft':
            player.dRight = false;
            player.xSpeed = -5;
            player.image.src = 'Karel-Left.png';
            break;
        case 'ArrowRight':
            player.dRight = true;
            player.xSpeed = 5;
            player.image.src = 'Karel.png';
            break;
        case 's':
            shoot();
            break;
    }
});

window.addEventListener('keyup', (event) =>
{
    switch(event.key)
    {
        case 'ArrowUp':
            player.jump = true;
            break;
        case 'ArrowDown':
            break;
        case 'ArrowLeft':
            player.xSpeed = 0;
            break;
        case 'ArrowRight':
            player.xSpeed = 0;
            break;
    }
});
