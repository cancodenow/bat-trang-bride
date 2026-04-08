import Phaser from "phaser";
import {
    preloadUIAssets,
    preloadLevelAssets,
    preloadSoundAssets,
    createImageButton,
    createContinueButton,
    createModalFrame,
    createCompletionBoard,
    createDishCard,
    createDevSkipButton,
    createBackButton,
    getResponsiveMetrics,
    bindResponsiveScene,
    playMusic,
    goToScene,
} from "../UIHelpers";
import { updateCheckpoint } from "../progress.js";

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
            "Pork ribs",
        ];

        ingredients.forEach((ingredient) => {
            const key = ingredient.toLowerCase().replace(/\s+/g, "-");
            this.load.image(key, `/assets/ingredients/${key}.png`);
        });

        preloadUIAssets(this);
        preloadLevelAssets(this, 1);
        preloadSoundAssets(this);
    }

    create(data = {}) {
        updateCheckpoint("MarketIngredientSelectionScene", "level1.market-selection");
        const { width, height } = this.scale;
        this.width = width;
        this.height = height;
        this.metrics = getResponsiveMetrics(this);
        this._hasInstructionModal = data.showInstruction !== false;

        playMusic(this, "market-music");

        this.cameras.main.setBackgroundColor("#ffffff");

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
                    { name: "Lime leaves", price: 10 },
                ],
            },
            {
                id: 2,
                cardKey: "lv1-dish-card-kohlrabi",
                vietnameseName: "Su hào xào mực",
                englishName: "Stir-fried Kohlrabi with Squid",
                budget: 95,
                correctIngredients: [
                    { name: "Kohlrabi", price: 15 },
                    { name: "Dried squid", price: 80 },
                ],
            },
            {
                id: 3,
                cardKey: "lv1-dish-card-shrimp-rolls",
                vietnameseName: "Nem tôm",
                englishName: "Crispy Shrimp Rolls",
                budget: 120,
                correctIngredients: [
                    { name: "Fresh shrimp", price: 70 },
                    { name: "Carrot", price: 50 },
                ],
            },
            {
                id: 4,
                cardKey: "lv1-dish-card-pigeon",
                vietnameseName: "Chim hầm hạt sen",
                englishName: "Slow-braised Pigeon with Lotus Seeds",
                budget: 130,
                correctIngredients: [
                    { name: "Pigeon", price: 95 },
                    { name: "Dried lotus seeds", price: 35 },
                ],
            },
            {
                id: 5,
                cardKey: "lv1-dish-card-bamboo",
                vietnameseName: "Canh măng mực",
                englishName: "Bamboo Shoot & Shredded Squid Soup",
                budget: 120,
                correctIngredients: [
                    { name: "Dried bamboo shoots", price: 40 },
                    { name: "Dried squid", price: 80 },
                ],
            },
            {
                id: 6,
                cardKey: "lv1-dish-card-pork-puff",
                vietnameseName: "Canh bóng",
                englishName: "Pork Puff Skin Soup",
                budget: 95,
                correctIngredients: [
                    { name: "Dried pork skin", price: 60 },
                    { name: "Shiitake mushrooms", price: 35 },
                ],
            },
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
            { name: "Pork ribs", price: 32 },
        ];

        this.stalls = [
            {
                title: "Stall 1",
                items: [
                    { name: "Shiitake mushrooms", slotX: 0.01, slotY: 0.65, scale: 0.78, priceDy: 40 },
                    { name: "Carrot", slotX: 0.15, slotY: 0.55, scale: 0.85 },
                    { name: "Dried lotus seeds", slotX: 0.32, slotY: 0.5, scale: 0.85, labelWidth: 100, priceDy: 40 },
                    { name: "Kohlrabi", slotX: 0.40, slotY: 0.55, scale: 0.85, labelWidth: 130 },
                    { name: "Lime leaves", slotX: 0.80, slotY: 0.48, scale: 0.75, nameDy: 2 },
                    { name: "Dried bamboo shoots", slotX: 0.78, slotY: 0.68, scale: 0.95, priceDy: 40 },
                    { name: "Dried squid", slotX: 0.89, slotY: 0.68, scale: 0.92, labelWidth: 80, priceDy: 40 },
                    { name: "Dried pork skin", slotX: 0.94, slotY: 0.52, scale: 0.98 },
                ],
            },
            {
                title: "Stall 2",
                items: [
                    { name: "Pigeon", slotX: 0.05, slotY: 0.57, scale: 0.88, labelWidth: 110 },
                    { name: "Vietnamese chicken", slotX: 0.14, slotY: 0.57, scale: 0.95, labelWidth: 120, priceDy: 40 },
                    { name: "Pork ribs", slotX: 0.3, slotY: 0.57, scale: 0.90, labelWidth: 120 },
                    { name: "Fresh shrimp", slotX: 0.5, slotY: 0.57, scale: 0.88, labelWidth: 120 },
                ],
            },
        ];

        // Game state
        this.currentDish = this.allDishes.find((dish) => dish.id === data.currentDishId) || this.allDishes[0];
        this.selectedIngredients = { ...(data.selectedIngredients || {}) };
        this.completedDishes = { ...(data.completedDishes || {}) };

        this.createGameUI();

        if (this._hasInstructionModal) {
            this.showInstructionModal();
        }

        // bindResponsiveScene(this, () => this.scene.restart(this.getSceneState()));
    }

    getSceneState() {
        return {
            showInstruction: this._hasInstructionModal,
            currentDishId: this.currentDish?.id,
            selectedIngredients: this.selectedIngredients,
            completedDishes: this.completedDishes,
        };
    }

    applyLayoutMetrics() {
        const { width, height } = this.scale;
        this.width = width;
        this.height = height;
        this.metrics = getResponsiveMetrics(this);
        this.SIDEBAR_W = Math.min(400, Math.round(width * 0.26)) * this.metrics.dpr;
        this.SIDEBAR_X = 0;
        this.TOP_PANEL_H = height;
        this.BOTTOM_PANEL_H = 0;
        this.MARKET_GAP_W = Math.round(32 * this.metrics.dpr);
        this.MARKET_X = this.SIDEBAR_W;
        this.MARKET_Y = 0;
        this.MARKET_VIEW_W = Math.max(0, width - this.MARKET_X);
        this.MARKET_VIEW_H = height;
        this.BOTTOM_PANEL_Y = height;
    }

    // ===================== INSTRUCTION MODAL =====================

    showInstructionModal() {
        const { width, modal, buttonScale } = this.metrics;

        const { container } = createModalFrame(this, modal.width, modal.height, {
            overlayAlpha: 0.7,
            textureKey: "lv1-how-to-play",
            fitTexture: true,
        });
        this.instructionModal = container;

        const { bg: startButton } = createContinueButton(this, width / 2, modal.buttonY, {
            onClick: () => {
                this._hasInstructionModal = false;
                this.instructionModal.destroy();
            },
            scale: buttonScale,
        });

        this.instructionModal.add([startButton]);
    }

    // ===================== MAIN GAME UI =====================

    createGameUI() {
        this.applyLayoutMetrics();
        this.createSidebar();
        this.createMarketWorld();
        this.populateMarketItems();
        this.setupMarketScrolling();
        this.updateSidebar();
        this.updateBasketPanel();
        createDevSkipButton(this, "BuyRibsIntroScene");
        createBackButton(this);
    }

    // ===================== LEFT SIDEBAR =====================

    createSidebar() {
        const { height } = this.scale;
        const sw = this.SIDEBAR_W;
        const panelX = this.SIDEBAR_X;
        const panelY = 0;
        const panelH = height;
        const dpr = this.metrics.dpr;
        const titleFont = this.metrics.fs(21);
        const bodyFont = this.metrics.fs(17);
        const progressRowHeight = Math.round(58 * dpr);
        const progressStartY = Math.round(150 * dpr);
        const sidePad = Math.round(15 * dpr);
        const dividerW = sw - Math.round(30 * dpr);

        // ── SIDEBAR LAYOUT CONSTANTS ──────────────────────────────
        // Adjust these Y values to reposition each block.
        const TITLE_Y = Math.round(16 * dpr); // "Đi chợ" header
        const DIVIDER_1_Y = Math.round(46 * dpr); // line under title
        const DISH_VIET_Y = Math.round(56 * dpr); // current dish Vietnamese name
        const DISH_ENG_Y = Math.round(76 * dpr); // current dish English name
        const BUDGET_Y = Math.round(96 * dpr); // budget / selected total row
        const DIVIDER_2_Y = Math.round(120 * dpr); // line under budget
        const PROGRESS_LBL_Y = Math.round(128 * dpr); // "Dish Progress" label
        const DISH_START_Y = Math.round(150 * dpr); // first dish row top
        const DISH_ROW_H = Math.round(58 * dpr); // height of each dish row
        // afterDishY is computed from DISH_START_Y + 6 rows
        const BASKET_LBL_OFF = Math.round(8 * dpr); // offset from afterDishY → "Basket" label
        const BASKET_ITEM_OFF = Math.round(28 * dpr); // offset from afterDishY → basket items list
        const BASKET_TTL_OFF = Math.round(140 * dpr); // offset from afterDishY → total line
        // ─────────────────────────────────────────────────────────

        // Sidebar background
        this.add.rectangle(panelX + sw / 2, panelY + panelH / 2, sw, panelH, 0x141e2b);

        // --- Title block ---
        this.add
            .text(panelX + sw / 2, panelY + TITLE_Y, "Đi chợ / Market Challenge", {
                fontSize: titleFont,
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5, 0);

        // Divider
        this.add.rectangle(panelX + sw / 2, panelY + DIVIDER_1_Y, dividerW, Math.round(1 * dpr), 0x3a5a7a);

        // --- Current dish block ---
        this.sidebarDishViet = this.add.text(panelX + sidePad, panelY + DISH_VIET_Y, "", {
            fontSize: this.metrics.fs(19),
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
            fontStyle: "bold",
        });
        this.sidebarDishEng = this.add.text(panelX + sidePad, panelY + DISH_ENG_Y, "", {
            fontSize: this.metrics.fs(16),
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
        });
        this.sidebarBudget = this.add.text(panelX + sidePad, panelY + BUDGET_Y, "", {
            fontSize: bodyFont,
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
        });
        this.sidebarTotal = this.add
            .text(panelX + sw - sidePad, panelY + BUDGET_Y, "", {
                fontSize: bodyFont,
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
            })
            .setOrigin(1, 0);

        // Divider
        this.add.rectangle(panelX + sw / 2, panelY + DIVIDER_2_Y, dividerW, Math.round(1 * dpr), 0x3a5a7a);

        // --- Dish progress block ---
        this.add.text(panelX + sidePad, panelY + PROGRESS_LBL_Y, "Dish Progress", {
            fontSize: bodyFont,
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
            fontStyle: "bold",
        });

        this.dishProgressTexts = [];
        this.dishProgressBoxes = [];

        this.allDishes.forEach((dish, i) => {
            const y = panelY + progressStartY + i * progressRowHeight;

            const box = this.add
                .image(panelX + sw / 2 - 10, y + progressRowHeight / 2, "ui-box-infobox")
                .setDisplaySize(sw + Math.round(40 * dpr), progressRowHeight + Math.round(2 * dpr))
                .setInteractive({ useHandCursor: true })
                .on("pointerover", function () {
                    this.setTint(0xaaccff);
                })
                .on("pointerout", function () {
                    this.clearTint();
                })
                .on("pointerdown", () => this.showDishHoverCard(dish));
            this.dishProgressBoxes.push(box);

            const nameT = this.add
                .text(panelX + sw * 0.3, y + progressRowHeight / 2, dish.vietnameseName, {
                    fontSize: this.metrics.fs(18),
                    color: "#ffffff",
                    fontFamily: "SVN-Pequena Neo",
                })
                .setOrigin(0.5, 0.5);

            const statusT = this.add
                .text(panelX + sw * 0.8, y + progressRowHeight / 2, "NOT STARTED", {
                    fontSize: this.metrics.fs(17),
                    color: "#ffffff",
                    fontFamily: "SVN-Pequena Neo",
                })
                .setOrigin(0.5, 0.5);

            this.dishProgressTexts.push({ nameT, statusT, box });
        });

        // Divider after dish list
        const afterDishY = panelY + progressStartY + 6 * progressRowHeight + Math.round(6 * dpr);
        this.add.rectangle(panelX + sw / 2, afterDishY, dividerW, Math.round(1 * dpr), 0x3a5a7a);

        const basketY = afterDishY;

        this.add.text(panelX + sidePad, basketY + BASKET_LBL_OFF, "Basket", {
            fontSize: bodyFont,
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
            fontStyle: "bold",
        });

        this.sidebarBasketItems = this.add.text(panelX + sidePad, basketY + BASKET_ITEM_OFF, "(empty)", {
            fontSize: this.metrics.fs(16),
            color: "#ffffff",
            fontFamily: "SVN-Pequena Neo",
            wordWrap: { width: dividerW },
            lineSpacing: Math.round(4 * dpr),
        });

        this.sidebarBasketTotal = this.add.text(panelX + sidePad, basketY + BASKET_TTL_OFF, "Total: 0K", {
            fontSize: this.metrics.fs(18),
            color: "#bb9882",
            fontFamily: "SVN-Pequena Neo",
            fontStyle: "bold",
        });

        const btnY = height - Math.round(60 * dpr);
        const BUTTON_SCALE = this.metrics.secondaryButtonScale;

        const { bg: confirmButton } = createImageButton(
            this,
            panelX + sw / 2,
            btnY,
            "",
            { textureKey: "lv1-opt-buy-check", scale: BUTTON_SCALE, onClick: () => this.validateSelection() },
        );
        this.confirmButton = confirmButton;
    }

    // ===================== MARKET WORLD =====================
    createMarketWorld() {
        const viewportCenterY = this.MARKET_Y + this.MARKET_VIEW_H / 2;

        const stallCount = this.stalls.length;
        const stallWidth = Math.round(800 * this.metrics.dpr);
        const stallGap = Math.round(60 * this.metrics.dpr);
        this.MARKET_CONTENT_X = 90 * this.metrics.dpr; // Stalls start at 50 within marketWorld container
        this.MARKET_WORLD_W =
            stallCount * stallWidth + (stallCount - 1) * stallGap + Math.round(160 * this.metrics.dpr);
        this.STALL_W = stallWidth;
        this.STALL_GAP = stallGap;

        this.marketWorld = this.add.container(this.MARKET_X, 0);

        const bgImg = this.add
            .image(this.MARKET_WORLD_W / 2, viewportCenterY, "marketBg")
            .setDisplaySize(this.MARKET_WORLD_W, this.MARKET_VIEW_H);
        this.marketWorld.add(bgImg);

        // Clip mask so only the viewport right of sidebar is visible
        const maskShape = this.make.graphics();
        maskShape.fillRect(this.MARKET_X, this.MARKET_Y, this.MARKET_VIEW_W, this.MARKET_VIEW_H);
        const mask = maskShape.createGeometryMask();
        this.marketWorld.setMask(mask);
    }

    populateMarketItems() {
        this.ingredientEntries = [];

        let stallX = this.MARKET_CONTENT_X;

        this.stalls.forEach((stall) => {
            const centerX = stallX + this.STALL_W / 2;

            // Stall sign — small label floating above the counter area
            const stallSign = this.add
                .text(centerX, this.MARKET_Y + this.MARKET_VIEW_H * 0.32, stall.title, {
                    fontSize: this.metrics.fs(24),
                    color: "#bb9882",
                    fontFamily: "SVN-Pequena Neo",
                    fontStyle: "bold",
                    align: "center",
                })
                .setOrigin(0.5, 1);
            this.marketWorld.add(stallSign);

            // Place ingredients along a row in the lower portion (counter level)
            const itemCount = stall.items.length;

            stall.items.forEach((item, i) => {
                const ingredientData = this.availableIngredients.find(
                    (ing) => ing.name === item.name,
                );
                const fallbackSlotX = (i + 1) / (itemCount + 1);
                const ix =
                    stallX +
                    this.STALL_W * (item.slotX ?? fallbackSlotX) +
                    Math.round((item.offsetX ?? 0) * this.metrics.dpr);
                const iy =
                    this.MARKET_Y +
                    this.MARKET_VIEW_H * (item.slotY ?? 0.58) +
                    Math.round((item.offsetY ?? 0) * this.metrics.dpr);

                const entry = this.createIngredientEntry(
                    ix,
                    iy,
                    item.name,
                    ingredientData,
                    item,
                );
                this.ingredientEntries.push(entry);
            });

            stallX += this.STALL_W + this.STALL_GAP;
        });
    }

    createIngredientEntry(cx, cy, itemName, ingredientData, layout = {}) {
        const isSelected = this.selectedIngredients[itemName] !== undefined;
        const ingredientKey = itemName.toLowerCase().replace(/\s+/g, "-");
        const scale = layout.scale ?? 1;
        const labelDx = Math.round((layout.labelDx ?? 0) * this.metrics.dpr);
        const labelWidth = Math.round((layout.labelWidth ?? 120) * this.metrics.dpr);
        const nameDy = Math.round((layout.nameDy ?? 2) * this.metrics.dpr);
        const priceDy = Math.round((layout.priceDy ?? 30) * this.metrics.dpr);

        // Ingredient image — the main visual
        const baseSize = Math.round(100 * this.metrics.dpr * scale);
        const imgSize = isSelected ? baseSize + Math.round(10 * this.metrics.dpr) : baseSize;
        const imgHeight = imgSize;
        // Anchor offset: keeps image bottom at the same canvas position as the original
        // squashed (4:3) layout that the xOffset/yOffset values were calibrated for.
        const anchorCy = cy - (imgHeight - imgSize * 0.75) / 2;

        // Selection highlight — soft glowing ellipse under the item
        let glow = null;
        if (isSelected) {
            glow = this.add.ellipse(
                cx,
                anchorCy + Math.round(20 * this.metrics.dpr),
                Math.round(120 * this.metrics.dpr * scale),
                Math.round(30 * this.metrics.dpr * Math.max(0.85, scale)),
                0x66ff66,
                0.25,
            );
            this.marketWorld.add(glow);
        }

        const img = this.add
            .image(cx, anchorCy, ingredientKey)
            .setDisplaySize(imgSize, imgHeight);
        this.marketWorld.add(img);

        // Name label
        const nameT = this.add
            .text(cx + labelDx, anchorCy + imgHeight / 2 + nameDy, itemName, {
                fontSize: this.metrics.fs(16),
                color: isSelected ? "#aaffaa" : "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
                wordWrap: { width: labelWidth },
            })
            .setOrigin(0.5, 0);
        this.marketWorld.add(nameT);

        // Price label
        const priceT = this.add
            .text(
                cx + labelDx,
                anchorCy + imgHeight / 2 + priceDy,
                ingredientData.price + "K",
                {
                    fontSize: this.metrics.fs(17),
                    color: isSelected ? "#ffff66" : "#ffffff",
                    fontFamily: "SVN-Pequena Neo",
                    fontStyle: "bold",
                    align: "center",
                },
            )
            .setOrigin(0.5, 0);
        this.marketWorld.add(priceT);

        // Clickable hit zone — invisible rectangle covering image + labels
        const hitW = Math.max(this.metrics.minTouchTarget, Math.round(140 * this.metrics.dpr));
        const hitH = Math.max(this.metrics.minTouchTarget, imgHeight + Math.round(70 * this.metrics.dpr));
        const hitZone = this.add.rectangle(
            cx,
            anchorCy + 10,
            hitW,
            hitH,
            0xffffff,
            0,
        );
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
            const hoverSize = imgSize + Math.round(12 * this.metrics.dpr);
            img.setDisplaySize(hoverSize, hoverSize);
        });
        hitZone.on("pointerout", () => {
            img.setDisplaySize(imgSize, imgHeight);
        });

        return { img, nameT, priceT, glow, hitZone, itemName, ingredientData };
    }

    refreshMarketItems() {
        // Destroy all ingredient entries
        this.ingredientEntries.forEach((e) => {
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

    setupMarketScrolling() {
        // Clamp bounds
        this._maxWorldX = this.MARKET_X;
        this._minWorldX =
            this.MARKET_X - (this.MARKET_WORLD_W - this.MARKET_VIEW_W);
        if (this._minWorldX > this._maxWorldX)
            this._minWorldX = this._maxWorldX;

        this._scrollVelocity = 0;

        // Track pointer position each frame
        this.input.on("pointermove", (pointer) => {
            this._lastPointerX = pointer.x;
            this._lastPointerY = pointer.y;
            if (this._dragStartX !== undefined && pointer.isDown) {
                const delta = pointer.x - this._dragStartX;
                const newX = Phaser.Math.Clamp(
                    this._dragWorldStartX + delta,
                    this._minWorldX,
                    this._maxWorldX,
                );
                this.marketWorld.x = newX;
            }
        });

        this._lastPointerX = this.MARKET_X + this.MARKET_VIEW_W / 2;
        this._lastPointerY = this.height / 2;

        this.input.on("pointerdown", (pointer) => {
            if (!this.isPointerInMarket(pointer.x, pointer.y)) return;
            this._dragStartX = pointer.x;
            this._dragWorldStartX = this.marketWorld.x;
        });

        this.input.on("pointerup", () => {
            this._dragStartX = undefined;
        });

        // Mouse wheel scrolling
        this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
            if (!this.isPointerInMarket(pointer.x, pointer.y)) return;
            let newX = this.marketWorld.x - deltaY * 1.5;
            newX = Phaser.Math.Clamp(newX, this._minWorldX, this._maxWorldX);
            this.marketWorld.x = newX;
        });
    }

    isPointerInMarket(x, y) {
        return (
            x >= this.MARKET_X &&
            x <= this.MARKET_X + this.MARKET_VIEW_W &&
            y >= this.MARKET_Y &&
            y <= this.MARKET_Y + this.MARKET_VIEW_H
        );
    }

    update() {
        if (!this.marketWorld) return;

        this.updateHoverScrolling();
    }

    updateHoverScrolling() {
        const px = this._lastPointerX;

        // Only scroll when pointer is inside the market viewport
        if (!this.isPointerInMarket(px, this._lastPointerY)) {
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

        const total = this.getSelectedTotal();
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
        const lines = Object.entries(this.selectedIngredients)
            .map(([name, price]) => "• " + name + "  " + price + "K")
            .join("\n");

        const total = this.getSelectedTotal();
        this.sidebarBasketItems.setText(lines || "(empty)");
        this.sidebarBasketTotal.setText("Total: " + total + "K VND");
        this.sidebarBasketTotal.setColor(total > this.currentDish.budget ? "#ff6666" : "#bb9882");
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

        const cardX = this.MARKET_X + this.MARKET_VIEW_W / 2;
        const cardY = height / 2;

        const container = this.add.container(0, 0).setDepth(300);

        // Dim overlay — click anywhere to close
        const overlay = this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
            .setInteractive();
        overlay.on("pointerdown", () => {
            container.destroy();
            this._dishCard = null;
        });
        container.add(overlay);

        // Rounded card cover behind the content
        const dpr = this.metrics.dpr;
        const coverW = Math.round(560 * dpr);
        const coverH = Math.round(520 * dpr);
        const coverTop = cardY - Math.round(210 * dpr);
        const cardCover = this.add.graphics();
        cardCover.fillStyle(0x1a2536, 1);
        cardCover.fillRoundedRect(cardX - coverW / 2, coverTop, coverW, coverH, Math.round(16 * dpr));
        container.add(cardCover);

        // Dish card image — scaled to native PNG size
        const cardImg = createDishCard(this, cardX, cardY - Math.round(40 * this.metrics.dpr), dish.cardKey, {
            scale: 0.2,
        });
        container.add(cardImg);

        // Dish name
        const nameViet = this.add
            .text(cardX, cardY + Math.round(150 * this.metrics.dpr), dish.vietnameseName, {
                fontSize: this.metrics.fs(22),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);
        container.add(nameViet);

        const nameEng = this.add
            .text(cardX, cardY + Math.round(180 * this.metrics.dpr), dish.englishName, {
                fontSize: this.metrics.fs(15),
                color: "#ffffff",
                fontFamily: "SVN-Pequena Neo",
                align: "center",
            })
            .setOrigin(0.5);
        container.add(nameEng);

        // Budget + ingredients
        const ingredientList = dish.correctIngredients
            .map((i) => `${i.name}  ${i.price}K`)
            .join("   •   ");
        const info = this.add
            .text(
                cardX,
                cardY + Math.round(210 * this.metrics.dpr),
                `Budget: ${dish.budget}K  |  ${ingredientList}`,
                {
                    fontSize: this.metrics.fs(13),
                    color: "#bb9882",
                    fontFamily: "SVN-Pequena Neo",
                    align: "center",
                    wordWrap: { width: Math.round(480 * this.metrics.dpr) },
                },
            )
            .setOrigin(0.5);
        container.add(info);

        // "Select this dish" button
        const { bg: selectBtn } = createImageButton(
            this,
            cardX,
            cardY + Math.round(270 * this.metrics.dpr),
            "Select this dish",
            {
                fontSize: this.metrics.fs(18),
                onClick: () => {
                    container.destroy();
                    this._dishCard = null;
                    this.setCurrentDish(dish);
                },
            },
        );
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

    getSelectedTotal() {
        let total = 0;
        for (const price of Object.values(this.selectedIngredients))
            total += price;
        return total;
    }

    toggleIngredientSelection(item) {
        if (this.selectedIngredients[item.name] !== undefined) {
            delete this.selectedIngredients[item.name];
        } else {
            this.selectedIngredients[item.name] = item.price;
        }
    }

    // ===================== VALIDATION =====================

    validateSelection() {
        const total = this.getSelectedTotal();

        if (total > this.currentDish.budget) {
            this.showImmediateFeedback("OVER BUDGET!", "#ff6666");
            return;
        }

        const selectedNames = Object.keys(this.selectedIngredients);
        const correctNames = this.currentDish.correctIngredients.map(
            (ing) => ing.name,
        );

        const isCorrect =
            selectedNames.length === correctNames.length &&
            selectedNames.every((name) => correctNames.includes(name)) &&
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
        const feedbackY = this.MARKET_Y + Math.round(60 * this.metrics.dpr);

        this.feedbackText = this.add
            .text(cx, feedbackY, message, {
                fontSize: this.metrics.fs(24),
                color: color,
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                backgroundColor: "#000000",
                padding: {
                    left: Math.round(20 * this.metrics.dpr),
                    right: Math.round(20 * this.metrics.dpr),
                    top: Math.round(10 * this.metrics.dpr),
                    bottom: Math.round(10 * this.metrics.dpr),
                },
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
        const { width, height } = this.metrics;
        const modalWidth = Math.min(this.metrics.modal.width, Math.round(520 * this.metrics.dpr));
        const wrapWidth = modalWidth - Math.round(40 * this.metrics.dpr);

        const { container: modalContainer } = createModalFrame(this, modalWidth, this.metrics.modal.height, {
            textureKey: "ui-success-modal",
        });

        const title = this.add
            .text(width / 2, height / 2 - Math.round(210 * this.metrics.dpr), "Dish Details", {
                fontSize: this.metrics.fs(22),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                fontStyle: "bold",
                align: "center",
            })
            .setOrigin(0.5);

        modalContainer.add(title);

        let yPos = height / 2 - Math.round(170 * this.metrics.dpr);
        this.allDishes.forEach((dish) => {
            const isCompleted = this.completedDishes[dish.id];
            const status = isCompleted ? " ✓" : "";
            const label =
                dish.vietnameseName + " — " + dish.englishName + status;

            const row = this.add
                .text(width / 2, yPos, label, {
                    fontSize: this.metrics.fs(13),
                    fontFamily: "SVN-Pequena Neo",
                    color: isCompleted ? "#66ff66" : "#ffffff",
                    backgroundColor: isCompleted ? "#264026" : "#2a3a50",
                    padding: {
                        left: Math.round(12 * this.metrics.dpr),
                        right: Math.round(12 * this.metrics.dpr),
                        top: Math.round(6 * this.metrics.dpr),
                        bottom: Math.round(6 * this.metrics.dpr),
                    },
                    align: "center",
                    wordWrap: { width: wrapWidth },
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

        const budgetInfo = this.allDishes
            .map(
                (d) =>
                    d.vietnameseName +
                    ": Budget " +
                    d.budget +
                    "K — " +
                    d.correctIngredients
                        .map((i) => i.name + " " + i.price + "K")
                        .join(", "),
            )
            .join("\n");

        const infoText = this.add
            .text(width / 2, yPos + 10, budgetInfo, {
                fontSize: this.metrics.fs(10),
                color: "#bb9882",
                fontFamily: "SVN-Pequena Neo",
                align: "left",
                wordWrap: { width: wrapWidth },
                lineSpacing: Math.round(4 * this.metrics.dpr),
            })
            .setOrigin(0.5, 0);
        modalContainer.add(infoText);

        const { bg: closeButton } = createImageButton(
            this,
            width / 2,
            height / 2 + Math.round(210 * this.metrics.dpr),
            "Close",
            {
                fontSize: this.metrics.fs(16),
                onClick: () => modalContainer.destroy(),
            },
        );

        modalContainer.add(closeButton);
    }

    showLevelCompleteModal() {
        const { width, height, dpr } = this.metrics;

        this.confirmButton.disableInteractive();

        this.add
            .rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
            .setDepth(199);

        const layout = createCompletionBoard(this, "lv1-finish", {
            depth: 200,
            maxWidthRatio: 0.68,
            maxHeightRatio: 0.56,
            contentHeightRatio: 0.5,
        });

        const hint = this.add
            .text(layout.centerX, layout.buttonY, "▼ Tap to continue", {
                fontSize: this.metrics.fs(18),
                color: "#fff4c2",
                fontFamily: "SVN-Pequena Neo",
                stroke: "#6f5630",
                strokeThickness: Math.round(3 * dpr),
            })
            .setOrigin(0.5)
            .setShadow(0, 2, "#000000", Math.round(6 * dpr), false, true)
            .setDepth(201);

        this.tweens.add({
            targets: hint,
            alpha: 0.35,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 650,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut",
        });

        this.input.once("pointerdown", () => goToScene(this, "BuyRibsIntroScene"));
    }
}
