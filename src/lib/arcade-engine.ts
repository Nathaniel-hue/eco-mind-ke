import Phaser from "phaser";
import type { ActionGameId } from "./arcade";
export type ArcadeControls = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  action: boolean;
};
export function createArcade(
  parent: HTMLElement,
  mode: ActionGameId,
  controls: ArcadeControls,
  report: (score: number, ended: boolean) => void,
) {
  const W = 600,
    H = 420;
  const styles = getComputedStyle(parent);
  const color = (name: string) => styles.getPropertyValue(name).trim();
  const toHex = (name: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "#000000";
    ctx.fillStyle = color(name);
    ctx.fillRect(0, 0, 1, 1);
    const rgb = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[rgb[0], rgb[1], rgb[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };
  const palette = {
    bg: toHex("--background"),
    fg: toHex("--foreground"),
    leaf: toHex("--leaf"),
    sky: toHex("--sky"),
    muted: toHex("--muted"),
    danger: toHex("--destructive"),
  };
  class EcoScene extends Phaser.Scene {
    player?: Phaser.GameObjects.Text;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    objects: {
      sprite: Phaser.GameObjects.Text;
      kind: string;
      vx: number;
      vy: number;
      passed?: boolean;
    }[] = [];
    snake = {
      body: [
        { x: 8, y: 7 },
        { x: 7, y: 7 },
        { x: 6, y: 7 },
      ],
      dx: 1,
      dy: 0,
      food: { x: 13, y: 7 },
    };
    snakeDraw?: Phaser.GameObjects.Graphics;
    score = 0;
    ended = false;
    clock = 0;
    spawn = 0;
    velocity = 0;
    lastAction = false;
    lastDirection = false;
    shot = 0;
    elapsed = 0;
    ball?: Phaser.Physics.Arcade.Image;
    paddle?: Phaser.Physics.Arcade.Image;
    bricks?: Phaser.Physics.Arcade.StaticGroup;
    create() {
      this.cursors = this.input.keyboard?.createCursorKeys();
      this.add.rectangle(
        W / 2,
        H / 2,
        W,
        H,
        Phaser.Display.Color.HexStringToColor(palette.bg).color,
      );
      const landscape = this.add.graphics();
      landscape.fillStyle(Phaser.Display.Color.HexStringToColor(palette.sky).color, 0.12);
      landscape.fillRect(0, 0, W, H);
      landscape.fillStyle(Phaser.Display.Color.HexStringToColor(palette.leaf).color, 0.2);
      for (let i = 0; i < 10; i++) {
        landscape.fillTriangle(i * 70 - 20, 390, i * 70 + 20, 310, i * 70 + 60, 390);
      }
      this.add.text(
        14,
        12,
        mode === "snake"
          ? "COMPOST PATCH"
          : mode === "frog"
            ? "WETLAND AHEAD"
            : "LITTLE PLANET ARCADE",
        { fontSize: "12px", color: palette.fg },
      );
      if (mode === "breakout") {
        this.makeBreakout();
        return;
      }
      if (mode === "snake") {
        this.snakeDraw = this.add.graphics();
        this.drawSnake();
        return;
      }
      const emoji =
        mode === "flappy"
          ? "🐝"
          : mode === "runner"
            ? "🦊"
            : mode === "catch"
              ? "🧺"
              : mode === "frog"
                ? "🐸"
                : "🌬️";
      this.player = this.add
        .text(
          mode === "flappy" || mode === "runner" ? 100 : 300,
          mode === "flappy" ? 190 : mode === "frog" ? 390 : 370,
          emoji,
          { fontSize: "32px" },
        )
        .setOrigin(0.5);
      if (mode === "frog") {
        for (let lane = 0; lane < 4; lane++) {
          this.add.rectangle(
            300,
            100 + lane * 70,
            600,
            48,
            Phaser.Display.Color.HexStringToColor(palette.muted).color,
          );
          for (let i = 0; i < 2; i++)
            this.addObject(
              i * 310 + lane * 50,
              100 + lane * 70,
              "🚗",
              "car",
              lane % 2 ? 110 : -100,
              0,
            );
        }
        this.player.setDepth(5);
        this.add.text(300, 40, "🌿  🌿  🌿  🌿  🌿", { fontSize: "28px" }).setOrigin(0.5);
      }
      if (mode === "invaders") this.wave();
      report(0, false);
    }
    addObject(x: number, y: number, emoji: string, kind: string, vx: number, vy: number) {
      const sprite = this.add
        .text(x, y, emoji, { fontSize: kind === "shot" ? "23px" : "32px" })
        .setOrigin(0.5);
      this.objects.push({ sprite, kind, vx, vy });
      return sprite;
    }
    wave() {
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 7; c++) this.addObject(80 + c * 65, 65 + r * 43, "☁️", "smog", 45, 7);
    }
    finish() {
      if (this.ended) return;
      this.ended = true;
      this.physics.pause();
      report(this.score, true);
    }
    points(n: number) {
      this.score += n;
      report(this.score, false);
    }
    drawSnake() {
      const g = this.snakeDraw;
      if (!g) return;
      g.clear();
      g.fillStyle(Phaser.Display.Color.HexStringToColor(palette.muted).color);
      g.fillRect(30, 50, 540, 330);
      g.fillStyle(Phaser.Display.Color.HexStringToColor(palette.leaf).color);
      this.snake.body.forEach((p) =>
        g.fillRoundedRect(30 + p.x * 30 + 2, 50 + p.y * 30 + 2, 26, 26, 6),
      );
      g.fillStyle(Phaser.Display.Color.HexStringToColor(palette.danger).color);
      g.fillCircle(45 + this.snake.food.x * 30, 65 + this.snake.food.y * 30, 10);
    }
    makeBreakout() {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(Phaser.Display.Color.HexStringToColor(palette.leaf).color);
      g.fillRect(0, 0, 80, 12);
      g.generateTexture("paddle", 80, 12);
      g.clear();
      g.fillStyle(Phaser.Display.Color.HexStringToColor(palette.fg).color);
      g.fillCircle(8, 8, 8);
      g.generateTexture("ball", 16, 16);
      g.clear();
      g.fillStyle(Phaser.Display.Color.HexStringToColor(palette.danger).color);
      g.fillRoundedRect(0, 0, 60, 20, 4);
      g.generateTexture("brick", 60, 20);
      g.destroy();
      this.paddle = this.physics.add
        .image(300, 390, "paddle")
        .setImmovable(true)
        .setCollideWorldBounds(true);
      this.ball = this.physics.add
        .image(300, 300, "ball")
        .setBounce(1)
        .setCollideWorldBounds(true)
        .setVelocity(160, -230);
      this.physics.world.setBoundsCollision(true, true, true, false);
      this.bricks = this.physics.add.staticGroup();
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 8; c++) this.bricks.create(65 + c * 67, 65 + r * 28, "brick");
      this.physics.add.collider(this.ball, this.paddle, () => {
        if (this.ball && this.paddle) this.ball.setVelocityX((this.ball.x - this.paddle.x) * 6);
      });
      this.physics.add.collider(this.ball, this.bricks, (_ball, brick) => {
        brick.destroy();
        this.points(10);
        if (this.bricks?.countActive() === 0) this.finish();
      });
      this.add.text(300, 345, "🪸   🐠   🪸   🐢   🪸", { fontSize: "27px" }).setOrigin(0.5);
    }
    update(_time: number, delta: number) {
      if (this.ended) return;
      const dt = Math.min(delta, 40) / 1000;
      this.clock += dt;
      this.elapsed += dt;
      this.spawn += dt;
      this.shot += dt;
      const left = controls.left || this.cursors?.left.isDown,
        right = controls.right || this.cursors?.right.isDown,
        up = controls.up || this.cursors?.up.isDown,
        down = controls.down || this.cursors?.down.isDown;
      const action = controls.action || this.cursors?.space.isDown || up;
      const pressed = action && !this.lastAction;
      this.lastAction = Boolean(action);
      if (mode === "breakout") {
        if (this.paddle)
          this.paddle.x = Phaser.Math.Clamp(
            this.paddle.x + ((right ? 1 : 0) - (left ? 1 : 0)) * 340 * dt,
            40,
            560,
          );
        if (this.ball && this.ball.y > 430) this.finish();
        return;
      }
      if (mode === "snake") {
        if (left && this.snake.dx !== 1) {
          this.snake.dx = -1;
          this.snake.dy = 0;
        } else if (right && this.snake.dx !== -1) {
          this.snake.dx = 1;
          this.snake.dy = 0;
        } else if (up && this.snake.dy !== 1) {
          this.snake.dx = 0;
          this.snake.dy = -1;
        } else if (down && this.snake.dy !== -1) {
          this.snake.dx = 0;
          this.snake.dy = 1;
        }
        if (this.clock > 0.18) {
          this.clock = 0;
          const head = {
            x: this.snake.body[0].x + this.snake.dx,
            y: this.snake.body[0].y + this.snake.dy,
          };
          const eat = head.x === this.snake.food.x && head.y === this.snake.food.y;
          const body = eat ? this.snake.body : this.snake.body.slice(0, -1);
          if (
            head.x < 0 ||
            head.x >= 18 ||
            head.y < 0 ||
            head.y >= 11 ||
            body.some((p) => p.x === head.x && p.y === head.y)
          ) {
            this.finish();
            return;
          }
          this.snake.body.unshift(head);
          if (eat) {
            this.points(10);
            const available = [];
            for (let x = 0; x < 18; x++)
              for (let y = 0; y < 11; y++)
                if (!this.snake.body.some((p) => p.x === x && p.y === y)) available.push({ x, y });
            if (!available.length) {
              this.finish();
              return;
            }
            this.snake.food = Phaser.Utils.Array.GetRandom(available);
          } else this.snake.body.pop();
          this.drawSnake();
        }
        return;
      }
      if (!this.player) return;
      if (mode === "flappy") {
        if (pressed) this.velocity = -245;
        this.velocity += 680 * dt;
        this.player.y += this.velocity * dt;
        if (this.player.y < 25 || this.player.y > 400) {
          this.finish();
          return;
        }
        if (this.spawn > 1.8) {
          this.spawn = 0;
          const gap = Phaser.Math.Between(125, 290);
          const top = this.addObject(640, gap - 125, "🌳", "trunk-top", -150, 0);
          top.setFontSize(50);
          top.setData("gap", gap);
          const bottom = this.addObject(640, gap + 125, "🌳", "trunk-bottom", -150, 0);
          bottom.setFontSize(50);
        }
      } else if (mode === "runner") {
        if (pressed && this.player.y >= 368) this.velocity = -410;
        this.velocity += 1000 * dt;
        this.player.y = Math.min(370, this.player.y + this.velocity * dt);
        if (this.player.y === 370) this.velocity = 0;
        if (this.spawn > 1.45) {
          this.spawn = 0;
          this.addObject(640, 375, "🗑️", "rubbish", -220 - Math.min(this.score, 100), 0);
        }
      } else if (mode === "catch" || mode === "invaders") {
        this.player.x = Phaser.Math.Clamp(
          this.player.x + ((right ? 1 : 0) - (left ? 1 : 0)) * 330 * dt,
          25,
          575,
        );
        if (mode === "catch" && this.spawn > 0.7) {
          this.spawn = 0;
          const litter = Math.random() > 0.3;
          this.addObject(
            Phaser.Math.Between(30, 570),
            -20,
            litter ? "🧴" : "🐠",
            litter ? "litter" : "fish",
            0,
            130 + Math.min(this.score, 90),
          );
        }
        if (mode === "invaders" && action && this.shot > 0.25) {
          this.shot = 0;
          this.addObject(this.player.x, this.player.y - 25, "🍃", "shot", 0, -380);
        }
      } else if (mode === "frog") {
        const direction = left || right || up || down;
        if (direction && !this.lastDirection) {
          this.player.x = Phaser.Math.Clamp(this.player.x + (right ? 40 : left ? -40 : 0), 20, 580);
          this.player.y += up ? -35 : down ? 35 : 0;
          this.player.y = Math.min(390, this.player.y);
          if (this.player.y < 55) {
            this.points(50);
            this.player.setPosition(300, 390);
          }
        }
        this.lastDirection = Boolean(direction);
      }
      for (const o of [...this.objects]) {
        if (!o.sprite.active) continue;
        o.sprite.x += o.vx * dt;
        o.sprite.y += o.vy * dt;
        if (o.kind === "car") {
          if (o.sprite.x < -40) o.sprite.x = 640;
          if (o.sprite.x > 640) o.sprite.x = -40;
        }
        if (o.kind === "smog") {
          if (o.sprite.x > 570 || o.sprite.x < 30) o.vx = -o.vx;
          if (o.sprite.y > 335) {
            this.finish();
            return;
          }
        }
        if (o.kind === "trunk-top") {
          const gap = Number(o.sprite.getData("gap"));
          if (
            Math.abs(o.sprite.x - this.player.x) < 35 &&
            (this.player.y < gap - 75 || this.player.y > gap + 75)
          ) {
            this.finish();
            return;
          }
          if (!o.passed && o.sprite.x < this.player.x - 30) {
            o.passed = true;
            this.points(10);
          }
        }
        if (
          o.kind === "rubbish" &&
          Math.abs(o.sprite.x - this.player.x) < 28 &&
          this.player.y > 335
        ) {
          this.finish();
          return;
        }
        if (o.kind === "rubbish" && !o.passed && o.sprite.x < 70) {
          o.passed = true;
          this.points(10);
        }
        if (
          (o.kind === "litter" || o.kind === "fish") &&
          Math.abs(o.sprite.x - this.player.x) < 30 &&
          Math.abs(o.sprite.y - this.player.y) < 25
        ) {
          if (o.kind === "fish") {
            this.finish();
            return;
          }
          this.points(10);
          o.sprite.destroy();
        }
        if (o.kind === "litter" && o.sprite.y > 445) {
          this.finish();
          return;
        }
        if (
          o.kind === "car" &&
          Math.abs(o.sprite.x - this.player.x) < 32 &&
          Math.abs(o.sprite.y - this.player.y) < 25
        ) {
          this.finish();
          return;
        }
        if (o.kind === "shot") {
          const enemy = this.objects.find(
            (e) =>
              e.kind === "smog" &&
              e.sprite.active &&
              Math.abs(e.sprite.x - o.sprite.x) < 25 &&
              Math.abs(e.sprite.y - o.sprite.y) < 22,
          );
          if (enemy) {
            enemy.sprite.destroy();
            o.sprite.destroy();
            this.points(10);
          }
        }
        if (o.sprite.active && (o.sprite.x < -60 || o.sprite.y < -50 || o.sprite.y > 460))
          o.sprite.destroy();
      }
      this.objects = this.objects.filter((o) => o.sprite.active);
      if (mode === "invaders" && !this.objects.some((o) => o.kind === "smog")) this.wave();
    }
  }
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: W,
    height: H,
    backgroundColor: palette.bg,
    physics: { default: "arcade", arcade: { debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: EcoScene,
    audio: { noAudio: true },
    render: { antialias: true },
  });
  return {
    destroy: () => game.destroy(true),
    pause: (paused: boolean) => {
      if (paused) game.scene.pause("default");
      else game.scene.resume("default");
    },
  };
}
