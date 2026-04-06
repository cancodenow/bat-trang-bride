import Phaser from "phaser";
import { preloadUIAssets, createImageButton, createPanel, createModalFrame, createDialogueBox } from "../UIHelpers";

export default class MarketIngredientSelectionScene extends Phaser.Scene {
  constructor() {
    super("MarketIngredientSelectionScene");
  }

  preload() {
    this.load.image("marketBg", "/assets/background/market-bg.png");

    const ingredients = [
      "Vietnamese chicken",
      "Lime leaves",
      "Kohlrabi",
      "Dried squid",
      "Fresh shrimp",
      "Carrot",
      "Pigeon",
      "Dried lotus seeds",
      "Dried bamboo shoots",
      "Dried pork skin",
      "Shiitake mushrooms"
    ];

    ingredients.forEach(ingredient => {
      const key = ingredient.toLowerCase().replace(/\s+/g, "-");
      this.load.image(key, `/assets/ingredients/${key}.png`);
    });

    preloadUIAssets(this);
  }

  create() {
    const { width, height } = this.scale;
    this.width = width;
    this.height = height;

    this.cameras.main.setBackgroundColor("#103c5a");

    // Layout constants
    this.SIDEBAR_W = 400;
    this.MARKET_X = this.SIDEBAR_W;
    this.MARKET_VIEW_W = width - this.SIDEBAR_W;

    // Hover scroll constants
    this.SCROLL_EDGE_ZONE = 180;
    this.SCROLL_MAX_SPEED = 8;

    // Full dish data
    this.allDishes = [
      {
        id: 1,
        vietnameseName: "Gà hấp lá chanh",
        englishName: "Poached Chicken with Lime Leaves",
        budget: 130,
        correctIngredients: [
          { name: "Vietnamese chicken", price: 120 },
          { name: "Lime leaves", price: 10 }
        ]
      },
      {
        id: 2,
        vietnameseName: "Su hào xào mực",
        englishName: "Stir-fried Kohlrabi with Squid",
        budget: 95,
        correctIngredients: [
          { name: "Kohlrabi", price: 15 },
          { name: "Dried squid", price: 80 }
        ]
      },
      {
        id: 3,
        vietnameseName: "Nem tôm",
        englishName: "Crispy Shrimp Rolls",
        budget: 120,
        correctIngredients: [
          { name: "Fresh shrimp", price: 70 },
          { name: "Carrot", price: 50 }
        ]
      },
      {
        id: 4,
        vietnameseName: "Chim hầm hạt sen",
        englishName: "Slow-braised Pigeon with Lotus Seeds",
        budget: 130,
        correctIngredients: [
          { name: "Pigeon", price: 95 },
          { name: "Dried lotus seeds", price: 35 }
        ]
      },
      {
        id: 5,
        vietnameseName: "Canh măng mực",
        englishName: "Bamboo Shoot & Shredded Squid Soup",
        budget: 120,
        correctIngredients: [
          { name: "Dried bamboo shoots", price: 40 },
          { name: "Dried squid", price: 80 }
        ]
      },
      {
        id: 6,
        vietnameseName: "Canh bóng",
        englishName: "Pork Puff Skin Soup",
        budget: 95,
        correctIngredients: [
          { name: "Dried pork skin", price: 60 },
          { name: "Shiitake mushrooms", price: 35 }
        ]
      }
    ];

    this.availableIngredients = [
      { name: "Vietnamese chicken", price: 120 },
      { name: "Lime leaves", price: 10 },
      { name: "Kohlrabi", price: 15 },
      { name: "Dried squid", price: 80 },
      { name: "Fresh shrimp", price: 70 },
      { name: "Carrot", price: 50 },
      { name: "Pigeon", price: 95 },
      { name: "Dried lotus seeds", price: 35 },
      { name: "Dried bamboo shoots", price: 40 },
      { name: "Dried pork skin", price: 60 },
      { name: "Shiitake mushrooms", price: 35 }
    ];

    this.stalls = [
      {
        title: "Stall 1",
        items: ["Dried bamboo shoots", "Kohlrabi", "Lime leaves", "Carrot"]
      },
      {
        title: "Stall 2",
        items: ["Dried squid", "Dried pork skin", "Shiitake mushrooms"]
      },
      {
        title: "Stall 3",
        items: ["Fresh shrimp", "Vietnamese chicken", "Pigeon", "Dried lotus seeds"]
      }
    ];

    // Game state
    this.currentDish = this.allDishes[0];
    this.selectedIngredients = {};
    this.completedDishes = {};

    this.showInstructionModal();
  }

  // ===================== INSTRUCTION MODAL =====================

  showInstructionModal() {
    const { width, height } = this.scale;

    const { container } = createModalFrame(this, 600, 300, {
      fillColor: 0x334455,
      strokeColor: 0xffffff,
      strokeWidth: 2,
    });
    this.instructionModal = container;

    const title = this.add
      .text(width / 2, height / 2 - 80, "Market Shopping Challenge", {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5);

    const desc = this.add
      .text(width / 2, height / 2 - 10, "Choose ingredients for all 6 dishes.\nMove your mouse to the edges to browse stalls.\nStay within each dish's budget.", {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 550 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const { bg: startButton } = createImageButton(this, width / 2, height / 2 + 100, "Start Shopping", {
      fontSize: "22px",
      onClick: () => {
        this.instructionModal.destroy();
        this.createGameUI();
      },
    });

    this.instructionModal.add([title, desc, startButton]);
  }

  // ===================== MAIN GAME UI =====================

  createGameUI() {
    this.createSidebar();
    this.createMarketWorld();
    this.populateMarketItems();
    this.setupHoverScrolling();
    this.updateSidebar();
    this.updateBasketPanel();
  }

  // ===================== LEFT SIDEBAR =====================

  createSidebar() {
    const { height } = this.scale;
    const sw = this.SIDEBAR_W;

    // Sidebar background
    this.add.rectangle(sw / 2, height / 2, sw, height, 0x141e2b);
    this.add.rectangle(sw, height / 2, 2, height, 0x3a5a7a);

    // --- Title block ---
    this.add
      .text(sw / 2, 16, "Đi chợ / Market Challenge", {
        fontSize: "17px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5, 0);

    // Divider
    this.add.rectangle(sw / 2, 46, sw - 30, 1, 0x3a5a7a);

    // --- Current dish block ---
    this.sidebarDishViet = this.add
      .text(15, 56, "", { fontSize: "15px", color: "#ffffff", fontFamily: "Arial", fontStyle: "bold" });
    this.sidebarDishEng = this.add
      .text(15, 76, "", { fontSize: "12px", color: "#aaaaaa", fontFamily: "Arial" });
    this.sidebarBudget = this.add
      .text(15, 96, "", { fontSize: "13px", color: "#66ccff", fontFamily: "Arial" });
    this.sidebarTotal = this.add
      .text(sw - 15, 96, "", { fontSize: "13px", color: "#ffcc00", fontFamily: "Arial" })
      .setOrigin(1, 0);

    // Divider
    this.add.rectangle(sw / 2, 120, sw - 30, 1, 0x3a5a7a);

    // --- Dish progress block ---
    this.add
      .text(15, 128, "Dish Progress", {
        fontSize: "13px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      });

    this.dishProgressTexts = [];
    this.dishProgressBoxes = [];
    const dishStartY = 150;
    const dishRowH = 34;

    this.allDishes.forEach((dish, i) => {
      const y = dishStartY + i * dishRowH;

      const box = this.add.rectangle(sw / 2, y + dishRowH / 2, sw - 24, dishRowH - 4, 0x222e3c);
      box.setInteractive({ useHandCursor: true });
      box.on("pointerdown", () => this.setCurrentDish(dish));
      box.on("pointerover", () => box.setFillStyle(0x2a3a4e));
      box.on("pointerout", () => {
        const done = this.completedDishes[dish.id];
        box.setFillStyle(done ? 0x264026 : 0x222e3c);
      });
      this.dishProgressBoxes.push(box);

      const nameT = this.add
        .text(24, y + 5, dish.vietnameseName, {
          fontSize: "12px",
          color: "#ffffff",
          fontFamily: "Arial",
        });

      const statusT = this.add
        .text(sw - 24, y + 5, "NOT STARTED", {
          fontSize: "11px",
          color: "#777777",
          fontFamily: "Arial",
        })
        .setOrigin(1, 0);

      this.dishProgressTexts.push({ nameT, statusT, box });
    });

    // Divider after dish list
    const afterDishY = dishStartY + 6 * dishRowH + 6;
    this.add.rectangle(sw / 2, afterDishY, sw - 30, 1, 0x3a5a7a);

    // --- Basket block ---
    this.add
      .text(15, afterDishY + 8, "Basket", {
        fontSize: "13px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      });

    this.sidebarBasketItems = this.add
      .text(15, afterDishY + 28, "(empty)", {
        fontSize: "12px",
        color: "#cccccc",
        fontFamily: "Arial",
        wordWrap: { width: sw - 30 },
        lineSpacing: 4,
      });

    this.sidebarBasketTotal = this.add
      .text(15, afterDishY + 140, "Total: 0K", {
        fontSize: "14px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
      });

    // --- Action buttons ---
    const btnY = height - 60;

    this.confirmButton = createImageButton(this, sw / 2, btnY, "Check Ingredients", {
      fontSize: "15px",
      onClick: () => this.validateSelection(),
    }).bg;

    // Dish details button
    this.add
      .text(sw / 2, btnY + 32, "View Dish Details", {
        fontSize: "12px",
        fontFamily: "Arial",
        color: "#aaccee",
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.openDishListModal());
  }

  // ===================== MARKET WORLD =====================

  createMarketWorld() {
    const { height } = this.scale;

    const stallCount = this.stalls.length;
    const stallWidth = 500;
    const stallGap = 80;
    this.MARKET_WORLD_W = stallCount * stallWidth + (stallCount - 1) * stallGap + 160;
    this.STALL_W = stallWidth;
    this.STALL_GAP = stallGap;

    this.marketWorld = this.add.container(this.MARKET_X, 0);

    // Background stretched across full market world
    const bgImg = this.add.image(this.MARKET_WORLD_W / 2, height / 2, "marketBg");
    bgImg.setDisplaySize(this.MARKET_WORLD_W, height);
    this.marketWorld.add(bgImg);

    // Light overlay for readability
    const overlay = this.add.rectangle(this.MARKET_WORLD_W / 2, height / 2, this.MARKET_WORLD_W, height, 0x000000, 0.2);
    this.marketWorld.add(overlay);

    // Clip mask so only the viewport right of sidebar is visible
    const maskShape = this.make.graphics();
    maskShape.fillRect(this.MARKET_X, 0, this.MARKET_VIEW_W, height);
    const mask = maskShape.createGeometryMask();
    this.marketWorld.setMask(mask);
  }

  populateMarketItems() {
    const { height } = this.scale;
    this.ingredientEntries = [];

    let stallX = 80;

    this.stalls.forEach((stall) => {
      const centerX = stallX + this.STALL_W / 2;

      // Stall sign — small label floating above the counter area
      const stallSign = this.add
        .text(centerX, height * 0.48, stall.title, {
          fontSize: "20px",
          color: "#ffdd44",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5, 1);
      this.marketWorld.add(stallSign);

      // Place ingredients along a row in the lower portion (counter level)
      const itemCount = stall.items.length;
      const spacing = this.STALL_W / (itemCount + 1);
      const baseY = height * 0.62;

      stall.items.forEach((itemName, i) => {
        const ingredientData = this.availableIngredients.find(ing => ing.name === itemName);
        const ix = stallX + spacing * (i + 1);
        const iy = baseY;

        const entry = this.createIngredientEntry(ix, iy, itemName, ingredientData);
        this.ingredientEntries.push(entry);
      });

      stallX += this.STALL_W + this.STALL_GAP;
    });
  }

  createIngredientEntry(cx, cy, itemName, ingredientData) {
    const isSelected = this.selectedIngredients[itemName] !== undefined;
    const ingredientKey = itemName.toLowerCase().replace(/\s+/g, "-");

    // Selection highlight — soft glowing ellipse under the item
    let glow = null;
    if (isSelected) {
      glow = this.add.ellipse(cx, cy + 20, 120, 30, 0x66ff66, 0.25);
      this.marketWorld.add(glow);
    }

    // Ingredient image — the main visual
    const imgSize = isSelected ? 110 : 100;
    const img = this.add.image(cx, cy, ingredientKey).setDisplaySize(imgSize, imgSize * 0.75);
    this.marketWorld.add(img);

    // Name label
    const nameT = this.add
      .text(cx, cy + imgSize * 0.75 / 2 + 8, itemName, {
        fontSize: "12px",
        color: isSelected ? "#aaffaa" : "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 120 },
      })
      .setOrigin(0.5, 0);
    this.marketWorld.add(nameT);

    // Price label
    const priceT = this.add
      .text(cx, cy + imgSize * 0.75 / 2 + 26, ingredientData.price + "K", {
        fontSize: "13px",
        color: isSelected ? "#ffff66" : "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5, 0);
    this.marketWorld.add(priceT);

    // Clickable hit zone — invisible rectangle covering image + labels
    const hitW = 140;
    const hitH = imgSize * 0.75 + 50;
    const hitZone = this.add.rectangle(cx, cy + 10, hitW, hitH, 0xffffff, 0);
    hitZone.setInteractive({ useHandCursor: true });
    this.marketWorld.add(hitZone);

    // Click to toggle selection
    hitZone.on("pointerdown", () => {
      this.toggleIngredientSelection(ingredientData);
      this.refreshMarketItems();
      this.updateBasketPanel();
      this.updateSidebar();
    });

    // Hover effect — slight scale bump
    hitZone.on("pointerover", () => {
      img.setDisplaySize(imgSize + 12, (imgSize + 12) * 0.75);
    });
    hitZone.on("pointerout", () => {
      img.setDisplaySize(imgSize, imgSize * 0.75);
    });

    return { img, nameT, priceT, glow, hitZone, itemName, ingredientData };
  }

  refreshMarketItems() {
    // Destroy all ingredient entries
    this.ingredientEntries.forEach(e => {
      e.img.destroy();
      e.nameT.destroy();
      e.priceT.destroy();
      if (e.glow) e.glow.destroy();
      if (e.hitZone) e.hitZone.destroy();
    });
    this.ingredientEntries = [];

    // Remove everything except bg image and overlay (first 2 children)
    const keep = 2;
    while (this.marketWorld.list.length > keep) {
      this.marketWorld.list[keep].destroy();
    }

    this.populateMarketItems();
  }

  // ===================== HOVER SCROLLING =====================

  setupHoverScrolling() {
    // Clamp bounds
    this._maxWorldX = this.MARKET_X;
    this._minWorldX = this.MARKET_X - (this.MARKET_WORLD_W - this.MARKET_VIEW_W);
    if (this._minWorldX > this._maxWorldX) this._minWorldX = this._maxWorldX;

    this._scrollVelocity = 0;

    // Track pointer position each frame
    this.input.on("pointermove", (pointer) => {
      this._lastPointerX = pointer.x;
      this._lastPointerY = pointer.y;
    });

    this._lastPointerX = this.MARKET_X + this.MARKET_VIEW_W / 2;
    this._lastPointerY = this.height / 2;

    // Mouse wheel scrolling
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x < this.MARKET_X) return;
      let newX = this.marketWorld.x - deltaY * 1.5;
      newX = Phaser.Math.Clamp(newX, this._minWorldX, this._maxWorldX);
      this.marketWorld.x = newX;
    });
  }

  update() {
    if (!this.marketWorld) return;

    this.updateHoverScrolling();
  }

  updateHoverScrolling() {
    const px = this._lastPointerX;

    // Only scroll when pointer is inside the market viewport
    if (px < this.MARKET_X || px > this.width) {
      this._scrollVelocity = 0;
      return;
    }

    // Normalize pointer position within market viewport: 0 = left edge, 1 = right edge
    const localX = px - this.MARKET_X;
    const norm = localX / this.MARKET_VIEW_W; // 0..1

    const edgeZoneNorm = this.SCROLL_EDGE_ZONE / this.MARKET_VIEW_W;

    if (norm < edgeZoneNorm) {
      // Near left edge — scroll right (increase marketWorld.x)
      const strength = 1 - norm / edgeZoneNorm; // 1 at edge, 0 at threshold
      this._scrollVelocity = this.SCROLL_MAX_SPEED * strength;
    } else if (norm > 1 - edgeZoneNorm) {
      // Near right edge — scroll left (decrease marketWorld.x)
      const strength = (norm - (1 - edgeZoneNorm)) / edgeZoneNorm;
      this._scrollVelocity = -this.SCROLL_MAX_SPEED * strength;
    } else {
      this._scrollVelocity = 0;
    }

    if (this._scrollVelocity !== 0) {
      let newX = this.marketWorld.x + this._scrollVelocity;
      newX = Phaser.Math.Clamp(newX, this._minWorldX, this._maxWorldX);
      this.marketWorld.x = newX;
    }
  }

  // ===================== SIDEBAR UPDATES =====================

  updateSidebar() {
    const dish = this.currentDish;
    this.sidebarDishViet.setText(dish.vietnameseName);
    this.sidebarDishEng.setText(dish.englishName);
    this.sidebarBudget.setText("Budget: " + dish.budget + "K VND");

    let total = 0;
    for (const price of Object.values(this.selectedIngredients)) total += price;
    this.sidebarTotal.setText("Selected: " + total + "K");
    this.sidebarTotal.setColor(total > dish.budget ? "#ff6666" : "#ffcc00");

    // Dish progress
    this.allDishes.forEach((d, i) => {
      const entry = this.dishProgressTexts[i];
      const done = this.completedDishes[d.id];
      const isCurrent = d.id === this.currentDish.id;
      entry.statusT.setText(done ? "DONE ✓" : "NOT STARTED");
      entry.statusT.setColor(done ? "#66ff66" : "#777777");
      entry.nameT.setColor(isCurrent ? "#66ccff" : "#ffffff");
      entry.box.setFillStyle(done ? 0x264026 : isCurrent ? 0x1c3350 : 0x222e3c);
    });
  }

  updateBasketPanel() {
    let total = 0;
    let lines = "";

    for (const [name, price] of Object.entries(this.selectedIngredients)) {
      lines += "• " + name + "  " + price + "K\n";
      total += price;
    }

    this.sidebarBasketItems.setText(lines || "(empty)");
    this.sidebarBasketTotal.setText("Total: " + total + "K VND");

    if (total > this.currentDish.budget) {
      this.sidebarBasketTotal.setColor("#ff6666");
    } else {
      this.sidebarBasketTotal.setColor("#ffcc00");
    }
  }

  // ===================== DISH SWITCHING =====================

  setCurrentDish(dish) {
    this.currentDish = dish;
    this.selectedIngredients = {};
    this.refreshMarketItems();
    this.updateSidebar();
    this.updateBasketPanel();
  }

  switchToNextIncompleteDish() {
    for (const dish of this.allDishes) {
      if (!this.completedDishes[dish.id]) {
        this.setCurrentDish(dish);
        return;
      }
    }
  }

  // ===================== INGREDIENT LOGIC =====================

  toggleIngredientSelection(item) {
    if (this.selectedIngredients[item.name] !== undefined) {
      delete this.selectedIngredients[item.name];
    } else {
      this.selectedIngredients[item.name] = item.price;
    }
  }

  // ===================== VALIDATION =====================

  validateSelection() {
    let total = 0;
    for (const price of Object.values(this.selectedIngredients)) total += price;

    if (total > this.currentDish.budget) {
      this.showImmediateFeedback("OVER BUDGET!", "#ff6666");
      return;
    }

    const selectedNames = Object.keys(this.selectedIngredients);
    const correctNames = this.currentDish.correctIngredients.map(ing => ing.name);

    const isCorrect =
      selectedNames.length === correctNames.length &&
      selectedNames.every(name => correctNames.includes(name)) &&
      total === this.currentDish.budget;

    if (isCorrect) {
      this.completedDishes[this.currentDish.id] = true;
      this.showImmediateFeedback("✓ CORRECT!", "#66ff66");

      this.selectedIngredients = {};
      this.updateBasketPanel();
      this.updateSidebar();
      this.refreshMarketItems();

      this.time.delayedCall(1500, () => {
        this.switchToNextIncompleteDish();
      });

      if (Object.keys(this.completedDishes).length === 6) {
        this.time.delayedCall(2500, () => {
          this.showLevelCompleteModal();
        });
      }
    } else {
      this.showImmediateFeedback("✗ WRONG!", "#ff6666");
    }
  }

  // ===================== FEEDBACK =====================

  showImmediateFeedback(message, color) {
    if (this.feedbackText) this.feedbackText.destroy();

    const cx = this.MARKET_X + this.MARKET_VIEW_W / 2;

    this.feedbackText = this.add
      .text(cx, 60, message, {
        fontSize: "24px",
        color: color,
        fontFamily: "Arial",
        fontStyle: "bold",
        backgroundColor: "#000000",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.time.delayedCall(2000, () => {
      if (this.feedbackText) {
        this.feedbackText.destroy();
        this.feedbackText = null;
      }
    });
  }

  // ===================== MODALS =====================

  openDishListModal() {
    const { width, height } = this.scale;

    const { container: modalContainer } = createModalFrame(this, 520, 480, {
      strokeColor: 0x5a8aaa,
    });

    const title = this.add
      .text(width / 2, height / 2 - 210, "Dish Details", {
        fontSize: "22px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    modalContainer.add(title);

    let yPos = height / 2 - 170;
    this.allDishes.forEach((dish) => {
      const isCompleted = this.completedDishes[dish.id];
      const status = isCompleted ? " ✓" : "";
      const label = dish.vietnameseName + " — " + dish.englishName + status;

      const row = this.add
        .text(width / 2, yPos, label, {
          fontSize: "13px",
          fontFamily: "Arial",
          color: isCompleted ? "#66ff66" : "#ffffff",
          backgroundColor: isCompleted ? "#264026" : "#2a3a50",
          padding: { left: 12, right: 12, top: 6, bottom: 6 },
          align: "center",
          wordWrap: { width: 480 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      row.on("pointerdown", () => {
        this.setCurrentDish(dish);
        modalContainer.destroy();
      });

      modalContainer.add(row);
      yPos += 38;
    });

    const budgetInfo = this.allDishes.map(d =>
      d.vietnameseName + ": Budget " + d.budget + "K — " +
      d.correctIngredients.map(i => i.name + " " + i.price + "K").join(", ")
    ).join("\n");

    const infoText = this.add
      .text(width / 2, yPos + 10, budgetInfo, {
        fontSize: "10px",
        color: "#888888",
        fontFamily: "Arial",
        align: "left",
        wordWrap: { width: 480 },
        lineSpacing: 4,
      })
      .setOrigin(0.5, 0);
    modalContainer.add(infoText);

    const { bg: closeButton } = createImageButton(this, width / 2, height / 2 + 210, "Close", {
      fontSize: "16px",
      onClick: () => modalContainer.destroy(),
    });

    modalContainer.add(closeButton);
  }

  showLevelCompleteModal() {
    const { width, height } = this.scale;

    this.confirmButton.disableInteractive();

    const { container: modal } = createModalFrame(this, 550, 300, {
      textureKey: "ui-success-modal",
      strokeColor: 0xffcc00,
    });

    const title = this.add
      .text(width / 2, height / 2 - 90, "Market Challenge Complete", {
        fontSize: "26px",
        color: "#ffcc00",
        fontFamily: "Arial",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const msg = this.add
      .text(width / 2, height / 2 - 10, "You found the ingredients for all six dishes.\nLet's bring them home and start cooking.", {
        fontSize: "18px",
        color: "#ffffff",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 500 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    const { bg: continueButton } = createImageButton(this, width / 2, height / 2 + 90, "Continue Home", {
      fontSize: "20px",
      bgColor: "#ffcc00",
      hoverBgColor: "#ffee00",
      onClick: () => this.scene.start("BuyRibsIntroScene"),
    });

    modal.add([title, msg, continueButton]);
  }
}
