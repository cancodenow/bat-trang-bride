import Phaser from "phaser";
import { preloadUIAssets, preloadLevelAssets, createImageButton, createModalFrame, createFrame, createDishCard, createDevSkipButton , createBackButton } from "../UIHelpers";

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
      "Shiitake mushrooms",
      "Pork ribs"
    ];

    ingredients.forEach(ingredient => {
      const key = ingredient.toLowerCase().replace(/\s+/g, "-");
      this.load.image(key, `/assets/ingredients/${key}.png`);
    });

    preloadUIAssets(this);
    preloadLevelAssets(this, 1);
  }

  create() {
    const { width, height } = this.scale;
    this.width = width;
    this.height = height;

    this.cameras.main.setBackgroundColor("#ffffff");

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
        cardKey: "lv1-dish-card-chicken",
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
        cardKey: "lv1-dish-card-kohlrabi",
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
        cardKey: "lv1-dish-card-shrimp-rolls",
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
        cardKey: "lv1-dish-card-pigeon",
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
        cardKey: "lv1-dish-card-bamboo",
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
        cardKey: "lv1-dish-card-pork-puff",
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
      { name: "Shiitake mushrooms", price: 35 },
      { name: "Pork ribs", price: 32 }

    ];

    this.stalls = [
      {
        title: "Stall 1",
        items: [
          { name: "Dried bamboo shoots", yOffset: 40, xOffset: 520 },
          { name: "Kohlrabi",            yOffset: -70,  xOffset: 150  },
          { name: "Lime leaves",         yOffset: -130,  xOffset: 340   },
          { name: "Carrot",              yOffset: -70,  xOffset: -270   },
        ]
      },
      {
        title: "Stall 2",
        items: [
          { name: "Dried squid",         yOffset: 40,  xOffset: 40  },
          { name: "Dried pork skin",     yOffset: -100,  xOffset: -5   },
          { name: "Shiitake mushrooms",  yOffset: 20,  xOffset: -820   },
          { name: "Pork ribs",   yOffset: -70,  xOffset: 150   },
        ]
      },
      {
        title: "Stall 3",
        items: [
          { name: "Fresh shrimp",        yOffset: -70,  xOffset: 20   },
          { name: "Vietnamese chicken",  yOffset: -70,  xOffset: -380   },
          { name: "Pigeon",              yOffset: -70,  xOffset: -590   },
          { name: "Dried lotus seeds",   yOffset: 20,  xOffset: -1600  },
        ]
      }
    ];

    // Game state
    this.currentDish = this.allDishes[0];
    this.selectedIngredients = {};
    this.completedDishes = {};

    // Background visible behind the instruction modal
    this.add.image(width / 2, height / 2, "marketBg").setDisplaySize(width, height).setDepth(0);

    this.showInstructionModal(); // TEMP: skipped
    this.createGameUI();
  }

  // ===================== INSTRUCTION MODAL =====================

  showInstructionModal() {
    const { width, height } = this.scale;

    const { container } = createModalFrame(this, 0, 0, { overlayAlpha: 0.7 });
    this.instructionModal = container;

    // How-to-play image centred on screen
    const howToPlay = this.add.image(width / 2, height / 2 - 40, "lv1-how-to-play")
      .setDisplaySize(700, 420);

    const BUTTON_SCALE = 0.2;
    const startButton = this.add
      .image(width / 2, height / 2 + 230, "continue_button")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => {
        this.instructionModal.destroy();
        this.createGameUI();
      });

    this.instructionModal.add([howToPlay, startButton]);
  }

  // ===================== MAIN GAME UI =====================

  createGameUI() {
    this.createSidebar();
    this.createMarketWorld();
    this.populateMarketItems();
    this.setupHoverScrolling();
    this.updateSidebar();
    this.updateBasketPanel();
    createDevSkipButton(this, "BuyRibsIntroScene");
    createBackButton(this);
  }

  // ===================== LEFT SIDEBAR =====================

  createSidebar() {
    const { height } = this.scale;
    const sw = this.SIDEBAR_W;

    // ── SIDEBAR LAYOUT CONSTANTS ──────────────────────────────
    // Adjust these Y values to reposition each block.
    const TITLE_Y        = 16;   // "Đi chợ" header
    const DIVIDER_1_Y    = 46;   // line under title
    const DISH_VIET_Y    = 56;   // current dish Vietnamese name
    const DISH_ENG_Y     = 76;   // current dish English name
    const BUDGET_Y       = 96;   // budget / selected total row
    const DIVIDER_2_Y    = 120;  // line under budget
    const PROGRESS_LBL_Y = 128;  // "Dish Progress" label
    const DISH_START_Y   = 150;  // first dish row top
    const DISH_ROW_H     = 58;   // height of each dish row
    // afterDishY is computed from DISH_START_Y + 6 rows
    const BASKET_LBL_OFF = 8;    // offset from afterDishY → "Basket" label
    const BASKET_ITEM_OFF= 28;   // offset from afterDishY → basket items list
    const BASKET_TTL_OFF = 140;  // offset from afterDishY → total line
    // ─────────────────────────────────────────────────────────

    // Sidebar background
    this.add.rectangle(sw / 2, height / 2, sw, height, 0x141e2b);
    this.add.rectangle(sw, height / 2, 2, height, 0x3a5a7a);

    // --- Title block ---
    this.add
      .text(sw / 2, TITLE_Y, "Đi chợ / Market Challenge", {
        fontSize: "21px",
        color: "#bb9882",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5, 0);

    // Divider
    this.add.rectangle(sw / 2, DIVIDER_1_Y, sw - 30, 1, 0x3a5a7a);

    // --- Current dish block ---
    this.sidebarDishViet = this.add
      .text(15, DISH_VIET_Y, "", { fontSize: "19px", color: "#ffffff", fontFamily: "SVN-Pequena Neo", fontStyle: "bold" });
    this.sidebarDishEng = this.add
      .text(15, DISH_ENG_Y, "", { fontSize: "16px", color: "#bb9882", fontFamily: "SVN-Pequena Neo" });
    this.sidebarBudget = this.add
      .text(15, BUDGET_Y, "", { fontSize: "17px", color: "#ffffff", fontFamily: "SVN-Pequena Neo" });
    this.sidebarTotal = this.add
      .text(sw - 15, BUDGET_Y, "", { fontSize: "17px", color: "#bb9882", fontFamily: "SVN-Pequena Neo" })
      .setOrigin(1, 0);

    // Divider
    this.add.rectangle(sw / 2, DIVIDER_2_Y, sw - 30, 1, 0x3a5a7a);

    // --- Dish progress block ---
    this.add
      .text(15, PROGRESS_LBL_Y, "Dish Progress", {
        fontSize: "17px",
        color: "#bb9882",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
      });

    this.dishProgressTexts = [];
    this.dishProgressBoxes = [];

    this.allDishes.forEach((dish, i) => {
      const y = DISH_START_Y + i * DISH_ROW_H;

      const box = this.add
        .image(sw / 2 - 10, y + DISH_ROW_H / 2, "ui-box-infobox")
        .setDisplaySize(sw + 40, DISH_ROW_H + 2)
        .setInteractive({ useHandCursor: true })
        .on("pointerover", function () { this.setTint(0xaaccff); })
        .on("pointerout",  function () { this.clearTint(); })
        .on("pointerdown", () => this.showDishHoverCard(dish));
      this.dishProgressBoxes.push(box);

      const nameT = this.add
        .text(sw * 0.3, y + DISH_ROW_H / 2, dish.vietnameseName, {
          fontSize: "18px",
          color: "#ffffff",
          fontFamily: "SVN-Pequena Neo",
        })
        .setOrigin(0.5, 0.5);

      const statusT = this.add
        .text(sw * 0.78, y + DISH_ROW_H / 2, "NOT STARTED", {
          fontSize: "17px",
          color: "#ffffff",
          fontFamily: "SVN-Pequena Neo",
        })
        .setOrigin(0.5, 0.5);

      this.dishProgressTexts.push({ nameT, statusT, box });
    });

    // Divider after dish list
    const afterDishY = DISH_START_Y + 6 * DISH_ROW_H + 6;
    this.add.rectangle(sw / 2, afterDishY, sw - 30, 1, 0x3a5a7a);

    // --- Basket block ---
    this.add
      .text(15, afterDishY + BASKET_LBL_OFF, "Basket", {
        fontSize: "17px",
        color: "#bb9882",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
      });

    this.sidebarBasketItems = this.add
      .text(15, afterDishY + BASKET_ITEM_OFF, "(empty)", {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "SVN-Pequena Neo",
        wordWrap: { width: sw - 30 },
        lineSpacing: 4,
      });

    this.sidebarBasketTotal = this.add
      .text(15, afterDishY + BASKET_TTL_OFF, "Total: 0K", {
        fontSize: "18px",
        color: "#bb9882",
        fontFamily: "SVN-Pequena Neo",
        fontStyle: "bold",
      });

    // --- Action button ---
    const btnY = height - 60;
    const BUTTON_SCALE = 0.2;

    this.confirmButton = this.add
      .image(sw / 2, btnY, "lv1-opt-buy-check")
      .setScale(BUTTON_SCALE)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.validateSelection());
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
          fontSize: "24px",
          color: "#bb9882",
          fontFamily: "SVN-Pequena Neo",
          fontStyle: "bold",
          align: "center",
        })
        .setOrigin(0.5, 1);
      this.marketWorld.add(stallSign);

      // Place ingredients along a row in the lower portion (counter level)
      const itemCount = stall.items.length;
      const spacing = this.STALL_W / (itemCount + 1);
      const baseY = height * 0.62;

      stall.items.forEach((item, i) => {
        const ingredientData = this.availableIngredients.find(ing => ing.name === item.name);
        const ix = stallX + spacing * (i + 1) + (item.xOffset ?? 0);
        const iy = baseY + (item.yOffset ?? 0);

        const entry = this.createIngredientEntry(ix, iy, item.name, ingredientData);
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
        fontSize: "16px",
        color: isSelected ? "#aaffaa" : "#ffffff",
        fontFamily: "SVN-Pequena Neo",
        align: "center",
        wordWrap: { width: 120 },
      })
      .setOrigin(0.5, 0);
    this.marketWorld.add(nameT);

    // Price label
    const priceT = this.add
      .text(cx, cy + imgSize * 0.75 / 2 + 50, ingredientData.price + "K", {
        fontSize: "17px",
        color: isSelected ? "#ffff66" : "#ffffff",
        fontFamily: "SVN-Pequena Neo",
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
    const keep = 1; // only the bg image remains
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
    this.sidebarTotal.setColor(total > dish.budget ? "#ff6666" : "#bb9882");

    // Dish progress
    this.allDishes.forEach((d, i) => {
      const entry = this.dishProgressTexts[i];
      const done = this.completedDishes[d.id];
      const isCurrent = d.id === this.currentDish.id;
      entry.statusT.setText(done ? "DONE ✓" : "NOT STARTED");
      entry.statusT.setColor(done ? "#bb9882" : "#ffffff");
      entry.nameT.setColor(isCurrent ? "#bb9882" : "#ffffff");
      entry.box.clearTint();
      if (done) entry.box.setTint(0x66ff66);
      else if (isCurrent) entry.box.setTint(0x66ccff);
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
      this.sidebarBasketTotal.setColor("#bb9882");
    }
  }

  // ===================== DISH SWITCHING =====================

  // ===================== DISH HOVER CARD =====================

  showDishHoverCard(dish) {
    const { width, height } = this.scale;

    // Dismiss any existing card first
    if (this._dishCard) {
      this._dishCard.destroy();
      this._dishCard = null;
    }

    const cardX = this.SIDEBAR_W + (width - this.SIDEBAR_W) / 2;
    const cardY = height / 2;

    const container = this.add.container(0, 0).setDepth(300);

    // Dim overlay — click anywhere to close
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setInteractive();
    overlay.on("pointerdown", () => {
      container.destroy();
      this._dishCard = null;
    });
    container.add(overlay);

    // Dish card image — scaled to native PNG size
    const cardImg = createDishCard(this, cardX, cardY - 40, dish.cardKey, { scale: 0.2 });
    container.add(cardImg);

    // Dish name
    const nameViet = this.add.text(cardX, cardY + 150, dish.vietnameseName, {
      fontSize: "22px",
      color: "#bb9882",
      fontFamily: "SVN-Pequena Neo",
      fontStyle: "bold",
      align: "center",
    }).setOrigin(0.5);
    container.add(nameViet);

    const nameEng = this.add.text(cardX, cardY + 180, dish.englishName, {
      fontSize: "15px",
      color: "#ffffff",
      fontFamily: "SVN-Pequena Neo",
      align: "center",
    }).setOrigin(0.5);
    container.add(nameEng);

    // Budget + ingredients
    const ingredientList = dish.correctIngredients.map(i => `${i.name}  ${i.price}K`).join("   •   ");
    const info = this.add.text(cardX, cardY + 210, `Budget: ${dish.budget}K  |  ${ingredientList}`, {
      fontSize: "13px",
      color: "#bb9882",
      fontFamily: "SVN-Pequena Neo",
      align: "center",
      wordWrap: { width: 480 },
    }).setOrigin(0.5);
    container.add(info);

    // "Select this dish" button
    const { bg: selectBtn } = createImageButton(this, cardX, cardY + 270, "Select this dish", {
      fontSize: "18px",
      onClick: () => {
        container.destroy();
        this._dishCard = null;
        this.setCurrentDish(dish);
      },
    });
    container.add(selectBtn);

    this._dishCard = container;
  }

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
        fontFamily: "SVN-Pequena Neo",
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
      textureKey: "ui-success-modal",
    });

    const title = this.add
      .text(width / 2, height / 2 - 210, "Dish Details", {
        fontSize: "22px",
        color: "#bb9882",
        fontFamily: "SVN-Pequena Neo",
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
          fontFamily: "SVN-Pequena Neo",
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
        color: "#bb9882",
        fontFamily: "SVN-Pequena Neo",
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

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6).setDepth(199);

    createFrame(this, width / 2, height / 2, {
      textureKey: "lv1-finish", scale: 0.5,
    }).setDepth(200);

    const BUTTON_SCALE = 0.15;
    this.add
      .image(width / 2, height / 2 + 90, "continue_button")
      .setScale(BUTTON_SCALE)
      .setDepth(201)
      .setInteractive({ useHandCursor: true })
      .on("pointerover", function () { this.setScale(BUTTON_SCALE * 1.08); })
      .on("pointerout",  function () { this.setScale(BUTTON_SCALE); })
      .on("pointerdown", () => this.scene.start("BuyRibsIntroScene"));
  }
}
