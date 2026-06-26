(() => {
  "use strict";

  const canvas = document.querySelector("#clownStage");
  const ctx = canvas.getContext("2d");
  const toolReadout = document.querySelector("#toolReadout");
  const damageReport = document.querySelector("#damageReport");
  const systemReport = document.querySelector("#systemReport");
  const toolGrid = document.querySelector("#toolGrid");
  const mainMenu = document.querySelector("#mainMenu");
  const characterSelect = document.querySelector("#characterSelect");
  const playButton = document.querySelector("#playButton");
  const sandboxButton = document.querySelector("#sandboxButton");
  const selectClownButton = document.querySelector("#selectClownButton");
  const backToMenuButton = document.querySelector("#backToMenuButton");
  const itemDrawer = document.querySelector("#itemDrawer");
  const itemDrawerToggle = document.querySelector("#itemDrawerToggle");
  const modMenuToggle = document.querySelector("#modMenuToggle");
  const modDrawer = document.querySelector("#modDrawer");
  const modDrawerHandle = document.querySelector("#modDrawerHandle");
  const closeItemDrawer = document.querySelector("#closeItemDrawer");
  const closeModDrawer = document.querySelector("#closeModDrawer");
  const itemSearch = document.querySelector("#itemSearch");
  const itemSearchResults = document.querySelector("#itemSearchResults");
  const characterPickerButton = document.querySelector("#characterPickerButton");
  const characterPalette = document.querySelector("#characterPalette");
  const closeCharacterPalette = document.querySelector("#closeCharacterPalette");
  const characterList = document.querySelector("#characterList");
  const createCharacterButton = document.querySelector("#createCharacterButton");
  const characterEditor = document.querySelector("#characterEditor");
  const closeCharacterEditor = document.querySelector("#closeCharacterEditor");
  const characterNameInput = document.querySelector("#characterNameInput");
  const characterPreviewCanvas = document.querySelector("#characterPreviewCanvas");
  const characterEditorControls = document.querySelector("#characterEditorControls");
  const randomizeCharacterButton = document.querySelector("#randomizeCharacterButton");
  const saveCharacterButton = document.querySelector("#saveCharacterButton");
  const placeEditedCharacterButton = document.querySelector("#placeEditedCharacterButton");
  const characterContextMenu = document.querySelector("#characterContextMenu");
  const editCharacterContextButton = document.querySelector("#editCharacterContextButton");
  const modPanel = document.querySelector("#modPanel");
  const modControls = document.querySelector("#modControls");
  const sandboxCharacterPanel = document.querySelector("#sandboxCharacterPanel");
  const selectedCharacterReadout = document.querySelector("#selectedCharacterReadout");
  const resetButton = document.querySelector("#resetButton");
  const xrayButton = document.querySelector("#xrayButton");
  const slowButton = document.querySelector("#slowButton");
  const debugButton = document.querySelector("#debugButton");
  const autoTestButton = document.querySelector("#autoTestButton");
  const destroyTestButton = document.querySelector("#destroyTestButton");
  const faceTestButton = document.querySelector("#faceTestButton");
  const scoreValue = document.querySelector("#scoreValue");
  const actValue = document.querySelector("#actValue");
  const performanceValue = document.querySelector("#performanceValue");
  const quotaValue = document.querySelector("#quotaValue");
  const setupTimerValue = document.querySelector("#setupTimerValue");
  const placedItemsValue = document.querySelector("#placedItemsValue");
  const storyHudElements = [...document.querySelectorAll(".story-hud")];
  const comboValue = document.querySelector("#comboValue");
  const requestText = document.querySelector("#requestText");
  const reactionText = document.querySelector("#reactionText");
  const performanceStartButton = document.querySelector("#performanceStartButton");
  const performanceResults = document.querySelector("#performanceResults");
  const resultsTitle = document.querySelector("#resultsTitle");
  const resultPerformanceScore = document.querySelector("#resultPerformanceScore");
  const resultTotalScore = document.querySelector("#resultTotalScore");
  const resultItemsActivated = document.querySelector("#resultItemsActivated");
  const resultItemsUnused = document.querySelector("#resultItemsUnused");
  const resultBiggestCombo = document.querySelector("#resultBiggestCombo");
  const resultAudienceReaction = document.querySelector("#resultAudienceReaction");
  const resultPerfectBonus = document.querySelector("#resultPerfectBonus");
  const continuePerformanceButton = document.querySelector("#continuePerformanceButton");

  const TAU = Math.PI * 2;
  const HALF_PI = Math.PI * 0.5;

  const ClownTuning = {
    physics: {
      gravity: 1450,
      particleDamping: 0.994,
      headDamping: 0.992,
      angularDamping: 0.972,
      floorBounce: 0.31,
      wallBounce: 0.42,
      floorFriction: 0.72,
      limbFloorFriction: 0.46,
      shoeFloorFriction: 0.52,
      jointStiffness: 0.88,
      rootJointStiffness: 0.96,
      damagedJointStiffness: 0.43,
      constraintIterations: 5,
      aliveMotorStrength: 0.92,
      aliveMotorDamageFade: 0.006,
      spawnMotorDelay: 0.35,
      spawnMotorRamp: 0.85,
      headRadiusX: 88,
      headRadiusY: 98,
      headMass: 8.4,
    },
    damage: {
      outerBreak: 18,
      fatExpose: 44,
      muscleExpose: 82,
      boneExpose: 128,
      sever: 168,
      gib: 245,
      cutSever: 118,
      boneBreak: 104,
      destroy: 285,
      typeScale: {
        blunt: 0.9,
        slicing: 1.15,
        piercing: 0.95,
        crushing: 1.35,
        burning: 0.52,
        explosion: 1.5,
        electric: 0.95,
        dragging: 0.42,
        stretching: 0.74,
        dismemberment: 1.65,
      },
    },
    blood: {
      amount: 1.36,
      gravity: 1280,
      particleLife: 2.1,
      floorPoolGrowth: 0.55,
      stainFade: 34,
      chunkFade: 18,
      fragmentFade: 24,
      maxDroplets: 250,
      maxStains: 260,
      maxChunks: 105,
      maxFragments: 68,
      smearSpacing: 9,
      selfStainFade: 18,
    },
    organs: {
      spillDamage: 76,
      intestineSegments: 24,
      intestineLength: 21,
      stiffness: 0.68,
      tearTension: 2.35,
      gutRadius: 9,
    },
    face: {
      outerBreak: 16,
      fatExpose: 40,
      muscleExpose: 76,
      boneExpose: 116,
      cavityOpen: 154,
      pieceDestroy: 210,
      organSpillDamage: 68,
      healPerSecond: 10,
      burnHealPerSecond: 7,
      regrowDelay: 3.2,
      patchRegrowSeconds: 7.5,
    },
    audience: {
      comboWindow: 1.65,
      boredomDecay: 0.18,
      boredomPenaltyStep: 0.16,
      scorePerLaughSecond: 34,
      requestBonus: 1400,
    },
    healing: {
      delay: 2.6,
      damagePerSecond: 9,
      surfacePerSecond: 18,
      cutProgressPerSecond: 16,
      crushProgressPerSecond: 12,
      boneHealDelay: 5.5,
      regrowDelay: 3.8,
      regrowSeconds: 6.5,
      destroyedRegrowSeconds: 8.5,
    },
  };

  window.ClownTuning = ClownTuning;

  const LAYER_NAMES = ["Outer", "Fat", "Muscle", "Bone", "Guts"];
  const REGION_META = {
    headShell: { label: "Head" },
    mouthJaw: { label: "Jaw" },
    leftArm: { label: "L Arm" },
    rightArm: { label: "R Arm" },
    leftHand: { label: "L Hand" },
    rightHand: { label: "R Hand" },
    leftLeg: { label: "L Leg" },
    rightLeg: { label: "R Leg" },
    leftFoot: { label: "L Foot" },
    rightFoot: { label: "R Foot" },
    guts: { label: "Guts" },
  };

  const FACE_PIECE_LIBRARY = [
    { id: "forehead", label: "Forehead", region: "headShell", x: 0, y: -56, rx: 47, ry: 25, angle: -0.04, organPocket: true, organType: "brain" },
    { id: "leftEye", label: "L Eye", region: "headShell", x: -36, y: -28, rx: 29, ry: 26, angle: -0.18, organPocket: true, organType: "brain" },
    { id: "rightEye", label: "R Eye", region: "headShell", x: 36, y: -28, rx: 29, ry: 26, angle: 0.18, organPocket: true, organType: "brain" },
    { id: "nose", label: "Nose", region: "headShell", x: 0, y: 2, rx: 26, ry: 24, angle: 0.02, organPocket: true, organType: "heart" },
    { id: "leftCheek", label: "L Cheek", region: "headShell", x: -48, y: 18, rx: 31, ry: 34, angle: -0.26, organPocket: true, organType: "kidney" },
    { id: "rightCheek", label: "R Cheek", region: "headShell", x: 48, y: 18, rx: 31, ry: 34, angle: 0.26, organPocket: true, organType: "kidney" },
    { id: "mouth", label: "Mouth", region: "mouthJaw", x: 0, y: 42, rx: 58, ry: 31, angle: 0.02, organPocket: true, organType: "guts" },
    { id: "chin", label: "Chin", region: "mouthJaw", x: 0, y: 72, rx: 44, ry: 22, angle: 0.04, organPocket: false },
  ];

  const TOOL_COPY = {
    none: "No tool selected",
    hammer: "Hammer ready",
    saw: "Saw ready",
    spike: "Spike ready",
    explosive: "Explosive ready",
    spring: "Spring ready",
    crusher: "Crusher ready",
    fire: "Fire ready",
    rope: "Glove grab ready",
  };

  // The item drawer is generated from this list, so future tools only need one registry entry.
  const ITEM_REGISTRY = [
    { id: "hammer", name: "Hammer", icon: "HIT", description: "Blunt impact and bruising." },
    { id: "saw", name: "Saw", icon: "SAW", description: "Cut, slice, and detach segments." },
    { id: "spike", name: "Spike", icon: "PIN", description: "Piercing hazard." },
    { id: "explosive", name: "Explosive", icon: "BOOM", description: "Radial blast and chunks." },
    { id: "spring", name: "Spring", icon: "UP", description: "Launches characters upward." },
    { id: "crusher", name: "Crusher", icon: "CRSH", description: "Drops a crushing block." },
    { id: "fire", name: "Fire", icon: "FIRE", description: "Burns layers and leaves soot." },
    { id: "rope", name: "Glove Grab", icon: "GRAB", description: "Grab body parts, organs, and chunks." },
  ];

  const PERFORMANCE_ITEM_LIBRARY = [
    { id: "boxingGlove", name: "Boxing Glove", category: "Impact Items", rarity: "Common", icon: "POW", description: "Punches sideways when it receives a signal.", triggerType: "Signal", actionType: "Impact Punch" },
    { id: "anvilDrop", name: "Anvil Drop", category: "Impact Items", rarity: "Common", icon: "ANV", description: "Drops a heavy anvil from above.", triggerType: "Signal", actionType: "Crush Drop" },
    { id: "sawBlade", name: "Saw Blade", category: "Blade / Piercing Items", rarity: "Common", icon: "SAW", description: "Spins up and slices anything close.", triggerType: "Signal or Contact", actionType: "Slice" },
    { id: "spikeWall", name: "Spike Wall", category: "Blade / Piercing Items", rarity: "Common", icon: "SPK", description: "Jabs forward with cartoon spikes.", triggerType: "Signal or Contact", actionType: "Pierce" },
    { id: "springPad", name: "Spring Pad", category: "Launch / Movement Items", rarity: "Common", icon: "UP", description: "Launches the clown upward.", triggerType: "Signal or Contact", actionType: "Launch" },
    { id: "cannon", name: "Cannon", category: "Launch / Movement Items", rarity: "Uncommon", icon: "CAN", description: "Fires a big horizontal blast.", triggerType: "Signal", actionType: "Launch Blast" },
    { id: "wire", name: "Wire", category: "Circuit / Trigger Items", rarity: "Common", icon: "WIR", description: "Passes a signal to the next item.", triggerType: "Signal", actionType: "Signal Pass" },
    { id: "delayBox", name: "Delay Box", category: "Circuit / Trigger Items", rarity: "Common", icon: "DLY", description: "Waits briefly before sending the next signal.", triggerType: "Signal", actionType: "Delay Signal" },
    { id: "pressurePlate", name: "Pressure Plate", category: "Circuit / Trigger Items", rarity: "Common", icon: "PRS", description: "Sends a signal when the clown lands on it.", triggerType: "Contact", actionType: "Signal" },
    { id: "motionSensor", name: "Motion Sensor", category: "Circuit / Trigger Items", rarity: "Common", icon: "EYE", description: "Sends a signal when the clown moves near it.", triggerType: "Motion", actionType: "Signal" },
    { id: "glueFloor", name: "Glue Floor", category: "Hold / Trap Items", rarity: "Common", icon: "GLU", description: "Slows and sticks the clown for a moment.", triggerType: "Signal or Contact", actionType: "Trap" },
    { id: "netLauncher", name: "Net Launcher", category: "Hold / Trap Items", rarity: "Uncommon", icon: "NET", description: "Fires a floppy net that pins the clown.", triggerType: "Signal", actionType: "Hold" },
    { id: "flamethrower", name: "Flamethrower", category: "Element Items", rarity: "Uncommon", icon: "FIR", description: "Burns a cone in front of it.", triggerType: "Signal", actionType: "Burn" },
    { id: "electricCoil", name: "Electric Coil", category: "Element Items", rarity: "Uncommon", icon: "ZAP", description: "Shocks nearby bodies and circuits.", triggerType: "Signal or Contact", actionType: "Shock" },
    { id: "nailLauncher", name: "Nail Launcher", category: "Projectile / Weapon Items", rarity: "Common", icon: "NAI", description: "Shoots a burst of nails.", triggerType: "Signal", actionType: "Projectile Pierce" },
    { id: "fireworkRack", name: "Firework Rack", category: "Projectile / Weapon Items", rarity: "Rare", icon: "FWK", description: "Launches chaotic little explosions.", triggerType: "Signal", actionType: "Explode Launch" },
    { id: "bloodSensor", name: "Blood Sensor", category: "Body Interaction Items", rarity: "Uncommon", icon: "BLD", description: "Sends a signal when blood splashes nearby.", triggerType: "Blood", actionType: "Signal" },
    { id: "screamMicrophone", name: "Scream Microphone", category: "Body Interaction Items", rarity: "Uncommon", icon: "MIC", description: "Sends a signal when the clown takes a painful hit.", triggerType: "Scream", actionType: "Signal" },
    { id: "trapdoorPanel", name: "Trapdoor Panel", category: "Setup / Stage Items", rarity: "Common", icon: "DRP", description: "Kicks open under the clown.", triggerType: "Signal or Contact", actionType: "Drop" },
    { id: "conveyorBelt", name: "Conveyor Belt", category: "Setup / Stage Items", rarity: "Common", icon: "BEL", description: "Pushes anything standing on it sideways.", triggerType: "Signal or Contact", actionType: "Move" },
    { id: "portalDoor", name: "Portal Door", category: "Chaos / Special Items", rarity: "Rare", icon: "PRT", description: "Warps the clown to another spot in the box.", triggerType: "Signal or Contact", actionType: "Teleport" },
    { id: "chaosDice", name: "Chaos Dice", category: "Chaos / Special Items", rarity: "Rare", icon: "D6", description: "Rolls one random contraption effect.", triggerType: "Signal", actionType: "Random" },
  ];

  // Character entries expose construction plus the sandbox options that character knows how to handle.
  const CHARACTER_REGISTRY = [
    {
      id: "clown",
      name: "Clown",
      icon: "CLOWN",
      description: "Giant face body, no torso, bad luck.",
      create: (room) => new ClownActor(room),
      supports: new Set(),
    },
  ];

  const REACTION_OPTIONS = [
    "Ignore",
    "Stare",
    "Panic",
    "Laugh",
    "Run Away",
    "Attack",
    "Gasp",
    "Cheer",
    "Freeze Up",
  ];
  const CLOWN_SKINS = ["Classic Clown", "Sad Clown", "Angry Clown", "Zombie Clown", "Robot Clown", "Alien Clown", "Burnt Clown", "Golden Clown", "Mime Clown", "TV Static Clown", "Toy Clown", "Balloon Clown", "Skeleton Clown", "Candy Clown"];
  const FACE_PAINT_STYLES = ["Classic Smile", "Big Frown", "Star Eyes", "Heart Cheeks", "Jagged Smile", "Melting Makeup", "Cracked Makeup", "Spiral Cheeks", "Scary Smile", "Blank Mime Face"];
  const NOSE_TYPES = ["Red Ball Nose", "Long Nose", "Tiny Nose", "Squeaky Nose", "Broken Nose", "Glowing Nose", "Metal Nose", "Button Nose", "Balloon Nose"];
  const EYE_STYLES = ["Normal Eyes", "Tiny Dot Eyes", "Giant Eyes", "Spiral Eyes", "Button Eyes", "X Eyes", "Glowing Eyes", "Angry Eyes", "Sleepy Eyes", "Crying Eyes"];
  const MOUTH_STYLES = ["Big Smile", "Frown", "Open Scream", "Tiny Mouth", "Sharp Teeth", "Missing Teeth", "Zipper Mouth", "Wobbly Lip", "Deadpan Line"];
  const HAIR_STYLES = ["Side Tufts", "Big Afro", "Mohawk", "Bald", "Rainbow Wig", "Burnt Hair", "Static Hair", "Spiky Hair", "Long Strings"];
  const SHOE_TYPES = ["Big Red Shoes", "Tiny Shoes", "Spring Shoes", "Heavy Boots", "Roller Skates", "Ice Skates", "Sticky Shoes", "Bouncy Shoes", "Rocket Shoes"];
  const GLOVE_TYPES = ["White Gloves", "Boxing Gloves", "Tiny Hands", "Giant Hands", "Sticky Hands", "Metal Hands", "Claw Hands", "Balloon Hands"];
  const PERSONALITY_TYPES = ["Coward", "Maniac", "Sleepy", "Angry", "Dramatic", "Confused", "Hyper", "Tough Guy", "Crybaby", "Show-Off", "Broken Robot"];
  const PAIN_REACTION_STYLES = ["Screams", "Laughs", "Cries", "Gets Angry", "Freezes", "Overacts", "Spins Eyes", "Plays Dead", "Insults Player", "Silent Stare"];
  const IDLE_BEHAVIORS = ["Stand Still", "Nervous Shake", "Look Around", "Tap Foot", "Wave at Audience", "Beg Player to Stop", "Laugh at Player", "Dance", "Pretend Nothing Is Wrong", "Fall Asleep"];
  const BLOOD_TYPES = ["Normal Cartoon Blood", "Rainbow Blood", "Confetti", "Slime", "Oil", "Candy", "Smoke", "Glitter", "Stuffing", "Sparks"];
  const INTERNAL_ANATOMY_TYPES = ["Normal Cartoon Guts", "Balloon Organs", "Robot Parts", "Candy Guts", "Plush Stuffing", "Slime Core", "Clockwork Gears", "Empty Hollow Head", "Confetti Machine"];
  const BONE_TYPES = ["Normal Bones", "Rubber Bones", "Metal Bones", "Glass Bones", "Spring Bones", "No Bones", "Cartoon X-Ray Bones"];
  const DAMAGE_STYLES = ["Gore", "Cartoon Bruises", "Cracks", "Burn Marks", "Dents", "Confetti Bursts", "Paint Splats", "Sparks", "Smoke Puffs"];

  // Sandbox controls are data-driven, then filtered by the selected character's supported keys.
  const MOD_DEFINITIONS = [
    { key: "headSize", label: "Head Size", type: "range", min: 0.5, max: 4, step: 0.05, valueLabel: "x", description: "Scales the clown's main face/body mass." },
    { key: "armLength", label: "Arm Length", type: "range", min: 0.25, max: 3, step: 0.05, valueLabel: "x", description: "Changes upper arm and forearm length." },
    { key: "legLength", label: "Leg Length", type: "range", min: 0.25, max: 3, step: 0.05, valueLabel: "x", description: "Changes thigh and calf length." },
    { key: "health", label: "Health", type: "range", min: 1, max: 10000, step: 1, description: "Higher health delays destruction." },
    { key: "damageResistance", label: "Damage Resistance", type: "range", min: 0, max: 100, step: 1, valueLabel: "%", description: "Reduces incoming damage." },
    { key: "strength", label: "Strength", type: "range", min: 0, max: 300, step: 1, valueLabel: "%", description: "Controls joint resistance." },
    { key: "weight", label: "Weight", type: "range", min: 0.1, max: 10, step: 0.1, valueLabel: "x", description: "Changes character mass." },
    { key: "bounciness", label: "Bounciness", type: "range", min: 0, max: 300, step: 1, valueLabel: "%", description: "Changes bounce response." },
    { key: "friction", label: "Friction", type: "range", min: 0, max: 300, step: 1, valueLabel: "%", description: "Lower friction makes the clown slide farther; this does not add speed." },
    { key: "wobbliness", label: "Wobbliness", type: "range", min: 0, max: 500, step: 1, valueLabel: "%", description: "Makes the clown stretchier, gooier, bouncier, and more unstable." },
    { key: "sugarMode", label: "Sugar Mode", type: "toggle", description: "Makes the clown ricochet around the room with bug-like hyper bounce." },
    { key: "removeBones", label: "Remove Bones", type: "button", description: "Disables skeleton support." },
    { key: "restoreBones", label: "Restore Bones", type: "button", description: "Restores skeleton support." },
    { key: "slowMotion", label: "Slow Motion", type: "range", min: 0.1, max: 1, step: 0.05, valueLabel: "x", description: "Character-local slow motion." },
    { key: "speed", label: "Speed", type: "range", min: 0.1, max: 5, step: 0.05, valueLabel: "x", description: "Reaction speed multiplier." },
    { key: "gravityScale", label: "Gravity Scale", type: "range", min: 0, max: 5, step: 0.05, valueLabel: "x", description: "Controls gravity on this character." },
    { key: "invincible", label: "Invincible", type: "toggle", description: "Prevents death and full destruction." },
    { key: "extraGore", label: "Extra Gore", type: "range", min: 0, max: 500, step: 5, valueLabel: "%", description: "Adds more blood, chunks, duplicate loose organs, and extra gut strands." },
    { key: "noGore", label: "No Gore", type: "toggle", description: "Removes blood, guts, and organs so hits become bruises and cartoon marks." },
    { key: "regenerate", label: "Regenerate", type: "toggle", description: "Heals and regrows extremely fast." },
    { key: "reset", label: "Reset Character", type: "button", description: "Restores this character to original state." },
    { key: "duplicate", label: "Duplicate", type: "button", description: "Creates a copy near the selected character." },
    { key: "delete", label: "Delete", type: "button", description: "Removes selected character from sandbox." },
    { key: "detachLimbs", label: "Detach Limbs", type: "button", description: "Forces arms and legs loose." },
    { key: "reattachLimbs", label: "Reattach Limbs", type: "button", description: "Restores limb connections." },
    { key: "freezeFace", label: "Freeze", type: "toggle", description: "Instantly freezes the selected character in its current position." },
    { key: "eyeFollowMouse", label: "Eye Follow Mouse", type: "toggle", description: "Eyes track the player mouse." },
    { key: "panicMode", label: "Panic Mode", type: "toggle", description: "Makes the clown panic, run from the mouse, jump, and switch directions." },
    { key: "dazedMode", label: "Dazed Mode", type: "toggle", description: "Makes the clown wander randomly like it does not know where it is going." },
    { key: "rabbitClown", label: "Rabbit Clown", type: "toggle", description: "Foams at the mouth, goes wild-eyed, moves extremely fast, and attacks other characters." },
    { key: "explode", label: "Explode", type: "button", description: "Triggers a cartoon explosion." },
    { key: "rainbowGore", label: "Rainbow Gore", type: "toggle", description: "Turns blood, guts, brain, heart, organs, and gore stains bright rainbow colors." },
    { key: "pin", label: "Pin Character", type: "toggle", description: "Pins to the current position." },
    { key: "forceExpression", label: "Force Expression", type: "select", options: ["Normal", "Happy", "Nervous", "Panic", "Pain", "Angry", "Dazed", "Shocked", "Deadpan", "Knocked Out"], description: "Forces a specific face for expression testing." },
    { key: "clownAwareness", label: "Clown Awareness", type: "toggle", description: "Controls whether this clown notices other clowns in the box." },
    { key: "reactionToClowns", label: "New Clown Spawn Reaction", type: "select", options: REACTION_OPTIONS, description: "One-time reaction when another clown is spawned." },
    { key: "friendshipEnabled", label: "Friendship Level", type: "toggle", description: "Shows the friendship meter and makes this clown use friendly social behavior." },
    { key: "friendshipLevel", label: "Friendship Meter", type: "range", min: -100, max: 100, step: 1, description: "Low values make the clown mean; high values make it helpful or clingy." },
    { key: "fearEnabled", label: "Fear of Other Clowns", type: "toggle", description: "Shows the fear meter and makes this clown avoid other clowns." },
    { key: "fearOfClowns", label: "Fear of Other Clowns", type: "range", min: 0, max: 100, step: 1, valueLabel: "%", description: "High fear makes the clown run, tremble, and eventually explode if trapped near another clown." },
    { key: "followClowns", label: "Follow Clowns", type: "toggle", description: "Continuously follows nearby clowns." },
    { key: "protectMode", label: "Protect Clown", type: "toggle", description: "Makes this clown guard one selected clown." },
    { key: "protectTargetId", label: "Protect Target", type: "select", options: ["Nearest Clown"], description: "Selects which live clown this clown protects." },
    { key: "danceTogether", label: "Dance Together", type: "toggle", description: "Turns on disco lighting and makes this clown dance near other clowns." },
    { key: "rivalryMode", label: "Fight Over Space", type: "toggle", description: "Makes this clown defensively shove and attack clowns that get too close." },
    { key: "copycatMode", label: "Copycat Mode", type: "toggle", description: "Copies nearby clown expressions, movement, panic, and big accidents." },
    { key: "groupPanic", label: "Group Panic", type: "toggle", description: "If this clown is hurt, every clown panics temporarily." },
    { key: "clownMagnetism", label: "Clown Magnetism", type: "select", options: ["Off", "Positive", "Negative"], description: "Positive pulls clowns together; Negative pushes them apart." },
    { key: "clownCollisionMode", label: "Clown Collision Mode", type: "select", options: ["Normal Collision", "No Collision", "Bouncy Collision", "Sticky Collision", "Heavy Impact Collision", "Soft Squishy Collision", "Explosive Collision"], description: "Controls how this clown physically bumps into other clowns." },
    { key: "chainLinkClowns", label: "Chain Link Clowns", type: "toggle", description: "Links this clown to nearby clowns with visible elastic chains." },
    { key: "clownSkin", label: "Clown Skin", type: "select", options: CLOWN_SKINS, description: "Changes the selected clown's visual style." },
    { key: "facePaintStyle", label: "Face Paint Style", type: "select", options: FACE_PAINT_STYLES, description: "Changes the clown makeup pattern." },
    { key: "noseType", label: "Nose Type", type: "select", options: NOSE_TYPES, description: "Changes the clown's nose." },
    { key: "eyeStyle", label: "Eye Style", type: "select", options: EYE_STYLES, description: "Changes the clown's eyes." },
    { key: "mouthStyle", label: "Mouth Style", type: "select", options: MOUTH_STYLES, description: "Changes the clown's mouth." },
    { key: "hairStyle", label: "Hair Style", type: "select", options: HAIR_STYLES, description: "Changes the clown's hair." },
    { key: "shoeType", label: "Shoe Type", type: "select", options: SHOE_TYPES, description: "Changes the clown's shoes." },
    { key: "gloveType", label: "Glove Type", type: "select", options: GLOVE_TYPES, description: "Changes the clown's gloves." },
    { key: "facePaintColor", label: "Face Paint Color", type: "color", description: "Custom face paint color." },
    { key: "noseColor", label: "Nose Color", type: "color", description: "Custom nose color." },
    { key: "hairColor", label: "Hair Color", type: "color", description: "Custom hair color." },
    { key: "gloveColor", label: "Glove Color", type: "color", description: "Custom glove color." },
    { key: "shoeColor", label: "Shoe Color", type: "color", description: "Custom shoe color." },
    { key: "bloodColor", label: "Blood Color", type: "color", description: "Custom gore color when Blood Type is normal." },
    { key: "gutColor", label: "Gut Color", type: "color", description: "Custom organ and gut color." },
    { key: "eyeColor", label: "Eye Color", type: "color", description: "Custom iris/glow color." },
    { key: "randomizeAppearance", label: "Randomize Appearance", type: "button", description: "Randomly changes face, colors, hair, eyes, nose, shoes, and gloves." },
    { key: "saveAppearancePreset", label: "Save Appearance Preset", type: "button", description: "Saves this clown's current appearance in this browser." },
    { key: "loadAppearancePreset", label: "Load Appearance Preset", type: "select", options: ["Default", "Saved Preset"], description: "Loads the saved appearance preset." },
    { key: "personality", label: "Personality", type: "select", options: PERSONALITY_TYPES, description: "Changes idle and reaction flavor." },
    { key: "painReactionStyle", label: "Pain Reaction Style", type: "select", options: PAIN_REACTION_STYLES, description: "Changes how the clown reacts when hurt." },
    { key: "idleBehavior", label: "Idle Behavior", type: "select", options: IDLE_BEHAVIORS, description: "Changes what the clown does when nothing is happening." },
    { key: "courage", label: "Courage", type: "range", min: 0, max: 100, step: 1, valueLabel: "%", description: "Low courage scares the clown; high courage keeps it calmer." },
    { key: "anger", label: "Anger", type: "range", min: 0, max: 100, step: 1, valueLabel: "%", description: "High anger makes the clown kick, shake, and retaliate after hits." },
    { key: "dramaLevel", label: "Drama Level", type: "range", min: 0, max: 300, step: 1, valueLabel: "%", description: "Controls how exaggerated expressions, screams, and flailing are." },
    { key: "bloodType", label: "Blood Type", type: "select", options: BLOOD_TYPES, description: "Changes the visual style of splatters, stains, chunks, and organs." },
    { key: "internalAnatomy", label: "Internal Anatomy", type: "select", options: INTERNAL_ANATOMY_TYPES, description: "Changes the visible texture inside the clown's head/body." },
    { key: "boneType", label: "Bone Type", type: "select", options: BONE_TYPES, description: "Changes the visible skeleton texture. Use Remove Bones for physical bone removal." },
    { key: "damageStyle", label: "Damage Style", type: "select", options: DAMAGE_STYLES, description: "Changes how damage appears." },
    { key: "autoClone", label: "Auto Clone", type: "range", min: 0, max: 10, step: 0.1, valueLabel: "x", description: "Creates copies over time with a cooldown; zero turns it off." },
    { key: "miniClownSpawn", label: "Mini Clown Spawn", type: "button", description: "Spawns a tiny copy with scaled face features near this clown." },
    { key: "giantMode", label: "Giant Mode", type: "toggle", description: "Periodically makes this clown huge enough to squash nearby clowns, then returns to normal." },
    { key: "tinyMode", label: "Tiny Mode", type: "toggle", description: "Periodically makes this clown tiny, then returns to normal." },
    { key: "balloonMode", label: "Balloon", type: "toggle", description: "Inflates the clown with balloon physics; hard hits pop it, then it slowly reinflates." },
    { key: "stickyMode", label: "Sticky Mode", type: "toggle", description: "Makes the clown stick to surfaces and other clowns." },
    { key: "slipperyMode", label: "Slippery Mode", type: "toggle", description: "Makes the clown slide around like ice." },
    { key: "electricMode", label: "Electric Mode", type: "toggle", description: "Shocks nearby characters and makes limbs twitch." },
    { key: "fireproof", label: "Fireproof", type: "toggle", description: "Makes this clown immune to fire and electric damage." },
    { key: "explosiveBody", label: "Explosive Body", type: "toggle", description: "Multiple hits in a short burst make the clown explode and then pull itself back together." },
    { key: "chainReactionBody", label: "Chain Reaction Body", type: "toggle", description: "Big damage pushes, scares, or hurts nearby clowns too." },
    { key: "audienceFavorite", label: "Audience Favorite", type: "toggle", description: "Audience reactions become stronger for this clown." },
    { key: "audienceHates", label: "Audience Hates This Clown", type: "toggle", description: "Audience boos more and laughs less for this clown." },
    { key: "funnyMultiplier", label: "Funny Multiplier", type: "range", min: 0, max: 10, step: 0.1, valueLabel: "x", description: "Controls how funny the audience thinks this clown is." },
    { key: "shockValue", label: "Shock Value", type: "range", min: 0, max: 300, step: 1, valueLabel: "%", description: "Controls how much the audience gasps at surprises." },
    { key: "crowdSympathy", label: "Crowd Sympathy", type: "range", min: 0, max: 100, step: 1, valueLabel: "%", description: "High sympathy makes the audience feel bad when damage gets extreme." },
    { key: "boxGravity", label: "Box Gravity", type: "range", min: 0, max: 5, step: 0.05, valueLabel: "x", scope: "world", description: "Changes gravity for the whole sandbox box." },
    { key: "boxBounce", label: "Box Bounce", type: "range", min: 0, max: 300, step: 1, valueLabel: "%", scope: "world", description: "Makes the walls, floor, and ceiling more or less bouncy." },
    { key: "wallStickiness", label: "Wall Stickiness", type: "range", min: 0, max: 100, step: 1, valueLabel: "%", scope: "world", description: "Controls whether clowns stick to the walls after impact." },
    { key: "damageMultiplier", label: "Damage Multiplier", type: "range", min: 0, max: 500, step: 1, valueLabel: "%", scope: "world", description: "Controls how much damage all characters take in sandbox." },
    { key: "globalSlowMotion", label: "Global Slow Motion", type: "range", min: 0.1, max: 1, step: 0.05, valueLabel: "x", scope: "world", description: "Slows down the whole sandbox scene." },
    { key: "resetSandbox", label: "Reset Sandbox", type: "button", scope: "world", description: "Clears spawned characters, items, blood, effects, and resets sandbox." },
  ];

  const REMOVED_MOD_KEYS = new Set(["size", "dragMode", "layerVisibility", "floating", "popMode", "inflate", "deflate", "bodyMaterial"]);
  const CHARACTER_EDITOR_LEGACY_KEYS = new Set(["randomizeAppearance", "saveAppearancePreset", "loadAppearancePreset"]);
  const CHARACTER_EDITOR_KEY_SET = new Set(
    MOD_DEFINITIONS
      .filter((definition) => definition.scope !== "world" && !REMOVED_MOD_KEYS.has(definition.key) && !CHARACTER_EDITOR_LEGACY_KEYS.has(definition.key))
      .map((definition) => definition.key),
  );
  const CHARACTER_EDITOR_DEFINITIONS = MOD_DEFINITIONS.filter(
    (definition) => CHARACTER_EDITOR_KEY_SET.has(definition.key),
  );
  const RUNTIME_MOD_DEFINITIONS = MOD_DEFINITIONS.filter((definition) => definition.scope === "world");

  CHARACTER_REGISTRY[0].supports = new Set(
    CHARACTER_EDITOR_DEFINITIONS.map((definition) => definition.key),
  );

  const DEFAULT_MOD_SETTINGS = {
    headSize: 1,
    armLength: 1,
    legLength: 1,
    health: 245,
    damageResistance: 0,
    strength: 100,
    weight: 1,
    bounciness: 100,
    friction: 100,
    wobbliness: 100,
    sugarMode: false,
    bonesRemoved: false,
    slowMotion: 1,
    speed: 1,
    gravityScale: 1,
    invincible: false,
    extraGore: 100,
    noGore: false,
    regenerate: false,
    freezeFace: false,
    eyeFollowMouse: true,
    panicMode: false,
    dazedMode: false,
    rabbitClown: false,
    rainbowGore: false,
    pin: false,
    forceExpression: "Normal",
  };

  Object.assign(DEFAULT_MOD_SETTINGS, {
    clownAwareness: true,
    reactionToClowns: "Ignore",
    fearEnabled: false,
    friendshipEnabled: false,
    friendshipLevel: 0,
    fearOfClowns: 0,
    followClowns: false,
    protectMode: false,
    protectTargetId: "Nearest Clown",
    danceTogether: false,
    rivalryMode: false,
    copycatMode: false,
    groupPanic: false,
    clownMagnetism: "Off",
    clownCollisionMode: "Normal Collision",
    chainLinkClowns: false,
    clownSkin: "Classic Clown",
    facePaintStyle: "Classic Smile",
    noseType: "Red Ball Nose",
    eyeStyle: "Normal Eyes",
    mouthStyle: "Big Smile",
    hairStyle: "Side Tufts",
    shoeType: "Big Red Shoes",
    gloveType: "White Gloves",
    facePaintColor: "#fff7e8",
    noseColor: "#e73535",
    hairColor: "#23b6c9",
    gloveColor: "#fff6d8",
    shoeColor: "#df3030",
    bloodColor: "#b90f24",
    gutColor: "#f27d9b",
    eyeColor: "#201719",
    loadAppearancePreset: "Default",
    personality: "Coward",
    painReactionStyle: "Screams",
    idleBehavior: "Stand Still",
    courage: 0,
    anger: 0,
    dramaLevel: 100,
    bloodType: "Normal Cartoon Blood",
    internalAnatomy: "Normal Cartoon Guts",
    boneType: "Normal Bones",
    damageStyle: "Gore",
    autoClone: 0,
    giantMode: false,
    tinyMode: false,
    giantActive: false,
    tinyActive: false,
    balloonMode: false,
    inflate: 0,
    stickyMode: false,
    slipperyMode: false,
    electricMode: false,
    fireproof: false,
    explosiveBody: false,
    chainReactionBody: false,
    audienceFavorite: false,
    audienceHates: false,
    funnyMultiplier: 1,
    shockValue: 100,
    crowdSympathy: 0,
  });

  const DEFAULT_WORLD_MOD_SETTINGS = {
    boxGravity: 1,
    boxBounce: 100,
    wallStickiness: 0,
    damageMultiplier: 100,
    globalSlowMotion: 1,
  };

  const COLORS = {
    ink: "#201719",
    outline: "#120d0e",
    face: "#fff7e8",
    faceShadow: "#efdcc0",
    nose: "#e73535",
    mouth: "#5a1015",
    teeth: "#fff9df",
    hairA: "#23b6c9",
    hairB: "#f1ca36",
    hairC: "#8f5df3",
    glove: "#fff6d8",
    shoe: "#df3030",
    shoeSole: "#f2c241",
    sleeveA: "#4fc0d1",
    sleeveB: "#f1c84a",
    pantA: "#8e5be8",
    pantB: "#43bd72",
    fat: "#ffd981",
    muscle: "#e2443f",
    muscleDark: "#8c1b25",
    bone: "#f7f0c9",
    gut: "#f27d9b",
    gutDark: "#9c2642",
    brain: "#f58ab3",
    brainDark: "#bb4f77",
    heart: "#d82038",
    kidney: "#8f2744",
    blood: "#b90f24",
    bloodBright: "#e22a2f",
    soot: "rgba(22, 18, 16, 0.58)",
  };

  const state = {
    width: 1,
    height: 1,
    dpr: 1,
    room: null,
    activeTool: "hammer",
    xray: false,
    slow: false,
    debug: false,
    lastTime: 0,
    gameTime: 0,
    uiTimer: 0,
    screen: "menu",
    mode: "story",
    characters: [],
    nextActorInstanceId: 1,
    customCharacters: [],
    selectedCharacter: null,
    placingCharacterId: null,
    characterEditor: {
      open: false,
      editingId: null,
      lastSavedId: null,
      baseCharacterId: "clown",
      draftMods: null,
      liveActor: null,
    },
    characterContextMenu: {
      actor: null,
      open: false,
    },
    sandboxWorld: { ...DEFAULT_WORLD_MOD_SETTINGS },
    itemDrawerOpen: false,
    modDrawerOpen: false,
    characterPaletteOpen: false,
    discoPulse: 0,
    modDrawerDrag: null,
    performance: null,
    pointer: {
      down: false,
      inside: false,
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      lastDamageAt: 0,
      lastPointerInputAt: 0,
      lastCanvasActionAt: 0,
      grab: null,
    },
  };

  let clown;
  let blood;
  let hazards;
  let audience;
  let scoreManager;
  let comboTracker;
  let requestManager;
  let soundHooks;
  let performanceLoop;
  let playerGloveAssets;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomSign() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function normalize(x, y) {
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }

  function rotatePoint(x, y, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: x * c - y * s, y: x * s + y * c };
  }

  function worldToLocal(point, origin, angle) {
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;
    const c = Math.cos(-angle);
    const s = Math.sin(-angle);
    return { x: dx * c - dy * s, y: dx * s + dy * c };
  }

  function localToWorld(point, origin, angle) {
    const rotated = rotatePoint(point.x, point.y, angle);
    return { x: origin.x + rotated.x, y: origin.y + rotated.y };
  }

  function pointSegmentInfo(point, a, b) {
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const lengthSq = abx * abx + aby * aby || 1;
    const t = clamp(((point.x - a.x) * abx + (point.y - a.y) * aby) / lengthSq, 0, 1);
    const x = a.x + abx * t;
    const y = a.y + aby * t;
    return { x, y, t, distance: Math.hypot(point.x - x, point.y - y) };
  }

  function angleBetween(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  function wrapAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function formatScore(value) {
    return Math.floor(value).toLocaleString("en-US");
  }

  function createDefaultMods() {
    return { ...DEFAULT_MOD_SETTINGS };
  }

  function rainbowColor(seed = 0, alpha = 1) {
    const hue = Math.round((state.gameTime * 140 + seed * 47 + Math.random() * 18) % 360);
    return alpha >= 1 ? `hsl(${hue}, 92%, 64%)` : `hsla(${hue}, 92%, 64%, ${alpha})`;
  }

  function paletteColorFromType(type, seed = 0, fallback = COLORS.blood, alpha = 1) {
    if (type === "Rainbow Blood") return rainbowColor(seed, alpha);
    if (type === "Confetti") return ["#f6ca45", "#39c1d3", "#9b6df2", "#49bf70", "#ff6aa2"][Math.floor(Math.abs(seed * 7)) % 5];
    if (type === "Slime") return alpha >= 1 ? "#63e46d" : `rgba(99, 228, 109, ${alpha})`;
    if (type === "Oil") return alpha >= 1 ? "#17191f" : `rgba(23, 25, 31, ${alpha})`;
    if (type === "Candy") return ["#ff70bd", "#f6ca45", "#8df7ff", "#ff8f5a"][Math.floor(Math.abs(seed * 5)) % 4];
    if (type === "Smoke") return alpha >= 1 ? "#6f6b66" : `rgba(111, 107, 102, ${alpha})`;
    if (type === "Glitter") return ["#fff8c6", "#a9f2ff", "#ffd2f0", "#d7c2ff"][Math.floor(Math.abs(seed * 3)) % 4];
    if (type === "Stuffing") return alpha >= 1 ? "#f2dbc2" : `rgba(242, 219, 194, ${alpha})`;
    if (type === "Sparks") return ["#fff175", "#ff9b36", "#faffd4"][Math.floor(Math.abs(seed * 11)) % 3];
    return fallback;
  }

  function randomHexColor() {
    const value = Math.floor(rand(0x303030, 0xffffff));
    return `#${value.toString(16).padStart(6, "0")}`;
  }

  const CUSTOM_CHARACTER_STORAGE_KEY = "clownInABoxCustomCharactersV1";
  const CUSTOM_CHARACTER_MOD_KEYS = MOD_DEFINITIONS
    .filter((definition) => definition.scope !== "world" && definition.type !== "button" && !REMOVED_MOD_KEYS.has(definition.key) && !CHARACTER_EDITOR_LEGACY_KEYS.has(definition.key))
    .map((definition) => definition.key);

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function makeCustomCharacterId() {
    if (globalThis.crypto?.randomUUID) return `custom-${globalThis.crypto.randomUUID()}`;
    return `custom-${Date.now().toString(36)}-${Math.floor(rand(1000, 9999)).toString(36)}`;
  }

  function sanitizeCharacterName(name, fallback = "Custom Clown") {
    const trimmed = String(name ?? "").trim().replace(/\s+/g, " ");
    return trimmed ? trimmed.slice(0, 32) : fallback;
  }

  function extractSavedMods(mods) {
    const source = { ...createDefaultMods(), ...(mods ?? {}) };
    return Object.fromEntries(CUSTOM_CHARACTER_MOD_KEYS.map((key) => [key, source[key]]));
  }

  function normalizeCustomCharacter(record) {
    if (!record || typeof record !== "object") return null;
    const now = Date.now();
    const baseCharacterId = CHARACTER_REGISTRY.some((entry) => entry.id === record.baseCharacterId) ? record.baseCharacterId : "clown";
    const defaultMods = extractSavedMods({ ...(record.defaultMods ?? {}), ...(record.appearance ?? {}) });
    return {
      id: typeof record.id === "string" && record.id.startsWith("custom-") ? record.id : makeCustomCharacterId(),
      name: sanitizeCharacterName(record.name, "Custom Clown"),
      baseCharacterId,
      appearance: extractAppearanceSettings(defaultMods),
      defaultMods,
      createdAt: Number(record.createdAt) || now,
      updatedAt: Number(record.updatedAt) || now,
    };
  }

  function loadCustomCharacters() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOM_CHARACTER_STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeCustomCharacter).filter(Boolean);
    } catch {
      return [];
    }
  }

  function persistCustomCharacters() {
    try {
      localStorage.setItem(CUSTOM_CHARACTER_STORAGE_KEY, JSON.stringify(state.customCharacters));
      return true;
    } catch {
      toolReadout.textContent = "Custom characters could not be saved in this browser";
      return false;
    }
  }

  function getCustomCharacter(characterId) {
    return state.customCharacters.find((entry) => entry.id === characterId) ?? null;
  }

  function getCharacterEntries() {
    return [
      ...CHARACTER_REGISTRY,
      ...state.customCharacters.map((record) => {
        const base = CHARACTER_REGISTRY.find((entry) => entry.id === record.baseCharacterId) ?? CHARACTER_REGISTRY[0];
        return {
          ...base,
          id: record.id,
          baseCharacterId: record.baseCharacterId,
          name: record.name,
          icon: "CSTM",
          description: "Saved sandbox clown",
          isCustom: true,
          defaultMods: { ...record.defaultMods },
        };
      }),
    ];
  }

  function getCharacterEntry(characterId) {
    const custom = getCustomCharacter(characterId);
    if (custom) {
      const base = CHARACTER_REGISTRY.find((entry) => entry.id === custom.baseCharacterId) ?? CHARACTER_REGISTRY[0];
      return {
        ...base,
        id: custom.id,
        baseCharacterId: custom.baseCharacterId,
        name: custom.name,
        icon: "CSTM",
        description: "Saved sandbox clown",
        isCustom: true,
        defaultMods: { ...custom.defaultMods },
      };
    }
    return CHARACTER_REGISTRY.find((entry) => entry.id === characterId) ?? CHARACTER_REGISTRY[0];
  }

  function getCharacters() {
    return state.characters.length ? state.characters : (clown ? [clown] : []);
  }

  function extractAppearanceSettings(mods) {
    const merged = { ...createDefaultMods(), ...(mods ?? {}) };
    return Object.fromEntries(
      [...CHARACTER_EDITOR_KEY_SET]
        .filter((key) => DEFAULT_MOD_SETTINGS[key] !== undefined && !CHARACTER_EDITOR_LEGACY_KEYS.has(key))
        .map((key) => [key, merged[key]]),
    );
  }

  function randomizeAppearanceMods(mods) {
    const pick = (items) => items[Math.floor(rand(0, items.length))];
    Object.assign(mods, {
      clownSkin: pick(CLOWN_SKINS),
      facePaintStyle: pick(FACE_PAINT_STYLES),
      noseType: pick(NOSE_TYPES),
      eyeStyle: pick(EYE_STYLES),
      mouthStyle: pick(MOUTH_STYLES),
      hairStyle: pick(HAIR_STYLES),
      shoeType: pick(SHOE_TYPES),
      gloveType: pick(GLOVE_TYPES),
      personality: pick(PERSONALITY_TYPES),
      painReactionStyle: pick(PAIN_REACTION_STYLES),
      idleBehavior: pick(IDLE_BEHAVIORS),
      bloodType: pick(BLOOD_TYPES),
      internalAnatomy: pick(INTERNAL_ANATOMY_TYPES),
      boneType: pick(BONE_TYPES),
      damageStyle: pick(DAMAGE_STYLES),
      facePaintColor: randomHexColor(),
      noseColor: randomHexColor(),
      hairColor: randomHexColor(),
      gloveColor: randomHexColor(),
      shoeColor: randomHexColor(),
      bloodColor: randomHexColor(),
      gutColor: randomHexColor(),
      eyeColor: randomHexColor(),
    });
    return mods;
  }

  function getAppearanceColorsForMods(mods = DEFAULT_MOD_SETTINGS) {
    const skinFace = {
      "Sad Clown": "#eef3ff",
      "Angry Clown": "#ffe6dc",
      "Zombie Clown": "#d9f0c8",
      "Robot Clown": "#d8e3ea",
      "Alien Clown": "#daf5ff",
      "Burnt Clown": "#d1c0aa",
      "Golden Clown": "#ffe08a",
      "Mime Clown": "#fffdf5",
      "TV Static Clown": "#d9d9d9",
      "Toy Clown": "#fff0d7",
      "Balloon Clown": "#ffe6f4",
      "Skeleton Clown": "#eee7c8",
      "Candy Clown": "#fff1fb",
    }[mods.clownSkin] ?? mods.facePaintColor ?? COLORS.face;
    return {
      face: mods.facePaintColor && mods.facePaintColor !== DEFAULT_MOD_SETTINGS.facePaintColor ? mods.facePaintColor : skinFace,
      faceShadow: skinFace === COLORS.face ? COLORS.faceShadow : "rgba(0, 0, 0, 0.12)",
      nose: mods.noseColor || COLORS.nose,
      hair: mods.hairColor || COLORS.hairA,
      glove: mods.gloveColor || COLORS.glove,
      shoe: mods.shoeColor || COLORS.shoe,
      eye: mods.eyeColor || COLORS.ink,
    };
  }

  function getBoneColorForMods(mods = DEFAULT_MOD_SETTINGS, seed = 0, alpha = 1) {
    const boneType = mods.boneType ?? "Normal Bones";
    if (boneType === "Rubber Bones") return alpha >= 1 ? "#f3d6a3" : `rgba(243, 214, 163, ${alpha})`;
    if (boneType === "Metal Bones") return alpha >= 1 ? "#c8d1da" : `rgba(200, 209, 218, ${alpha})`;
    if (boneType === "Glass Bones") return alpha >= 1 ? "#bff4ff" : `rgba(191, 244, 255, ${alpha})`;
    if (boneType === "Spring Bones") return alpha >= 1 ? "#f6ca45" : `rgba(246, 202, 69, ${alpha})`;
    if (boneType === "No Bones") return alpha >= 1 ? "#7f6b78" : `rgba(127, 107, 120, ${alpha})`;
    if (boneType === "Cartoon X-Ray Bones") return `hsla(${(seed * 35 + 198) % 360}, 100%, 78%, ${alpha})`;
    return alpha >= 1 ? COLORS.bone : `rgba(247, 240, 201, ${alpha})`;
  }

  function drawBoneTextureDetails(context, boneType = "Normal Bones", fill = true, time = 0) {
    context.save();
    context.beginPath();
    context.ellipse(0, -8, 64, 70, 0, 0, TAU);
    context.roundRect(-38, 30, 76, 36, 13);
    context.clip();
    context.lineJoin = "round";
    context.lineCap = "round";
    if (boneType === "Rubber Bones") {
      context.strokeStyle = "rgba(191, 102, 69, 0.58)";
      context.lineWidth = fill ? 4 : 3;
      for (let y = -58; y <= 58; y += 18) {
        context.beginPath();
        context.moveTo(-54, y);
        for (let x = -42; x <= 58; x += 18) {
          context.quadraticCurveTo(x - 9, y + Math.sin(x * 0.2 + time) * 8, x, y);
        }
        context.stroke();
      }
      context.fillStyle = "rgba(255, 245, 190, 0.42)";
      context.beginPath();
      context.ellipse(-22, -48, 14, 6, -0.4, 0, TAU);
      context.fill();
    } else if (boneType === "Metal Bones") {
      context.strokeStyle = "rgba(57, 89, 105, 0.72)";
      context.lineWidth = 3;
      for (const x of [-42, -12, 18, 48]) {
        context.beginPath();
        context.moveTo(x, -74);
        context.lineTo(x + 12, 70);
        context.stroke();
      }
      context.fillStyle = "#87929b";
      context.strokeStyle = COLORS.outline;
      for (const bolt of [{ x: -42, y: -45 }, { x: 42, y: -45 }, { x: -28, y: 48 }, { x: 28, y: 48 }, { x: 0, y: -4 }]) {
        drawTextureBolt(context, bolt.x, bolt.y, 4);
      }
      context.strokeStyle = "rgba(255,255,255,0.45)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-50, -62);
      context.lineTo(28, 54);
      context.stroke();
    } else if (boneType === "Glass Bones") {
      context.strokeStyle = "rgba(234, 255, 255, 0.74)";
      context.lineWidth = 2.5;
      for (const shard of [
        [-48, -46, -12, -18, -36, 18],
        [8, -62, 48, -35, 22, 2],
        [-12, 10, 36, 34, 4, 66],
        [-48, 38, -12, 55, -34, 67],
      ]) {
        context.beginPath();
        context.moveTo(shard[0], shard[1]);
        context.lineTo(shard[2], shard[3]);
        context.lineTo(shard[4], shard[5]);
        context.closePath();
        context.stroke();
      }
      context.fillStyle = "rgba(191, 244, 255, 0.16)";
      context.fillRect(-70, -78, 140, 150);
    } else if (boneType === "Spring Bones") {
      context.strokeStyle = "rgba(121, 77, 7, 0.64)";
      context.lineWidth = 4;
      for (const coil of [{ x: -33, y: -12 }, { x: 32, y: -12 }, { x: 0, y: 42 }]) {
        context.beginPath();
        for (let i = 0; i < 16; i += 1) {
          const x = coil.x + Math.sin(i * 1.45) * 12;
          const y = coil.y - 22 + i * 3.3;
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
    } else if (boneType === "No Bones") {
      context.globalAlpha *= 0.74;
      context.strokeStyle = "rgba(255, 112, 189, 0.54)";
      context.lineWidth = 5;
      context.setLineDash([12, 9]);
      context.beginPath();
      context.ellipse(0, -6 + Math.sin(time * 3) * 2, 50, 58, Math.sin(time) * 0.06, 0, TAU);
      context.roundRect(-30, 32, 60, 26, 13);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = "rgba(127, 107, 120, 0.18)";
      context.fillRect(-68, -80, 136, 156);
    } else if (boneType === "Cartoon X-Ray Bones") {
      context.strokeStyle = `hsla(${(time * 120 + 195) % 360}, 100%, 72%, 0.76)`;
      context.lineWidth = 4;
      for (let r = 18; r <= 70; r += 18) {
        context.beginPath();
        context.ellipse(0, -8, r * 0.82, r, 0, 0, TAU);
        context.stroke();
      }
      context.fillStyle = "rgba(143, 247, 255, 0.28)";
      for (const spark of [{ x: -45, y: -52 }, { x: 50, y: -18 }, { x: -18, y: 48 }, { x: 34, y: 56 }]) {
        drawStar(context, spark.x, spark.y, 7, 3, context.fillStyle);
      }
    }
    context.restore();
  }

  function setSelectedCharacter(actor) {
    state.selectedCharacter = actor ?? null;
    if (actor) clown = actor;
    renderModControls();
    updateSelectedCharacterReadout();
  }

  function spawnCharacter(characterId, point, options = {}) {
    const entry = getCharacterEntry(characterId);
    const baseEntry = entry.isCustom ? getCharacterEntry(entry.baseCharacterId) : entry;
    const existingActors = [...getCharacters()];
    const actor = baseEntry.create(state.room);
    actor.characterId = entry.id;
    actor.baseCharacterId = entry.baseCharacterId ?? entry.id;
    actor.displayName = entry.name;
    actor.mods = {
      ...createDefaultMods(),
      ...(entry.defaultMods ?? {}),
      ...(options.mods ?? {}),
    };
    actor.applyModSettings({ preserveVelocity: false });
    actor.moveTo(point.x, point.y);
    state.characters.push(actor);
    setSelectedCharacter(actor);
    if (state.mode === "sandbox") {
      for (const other of existingActors) {
        if (other !== actor) other.reactToNewClown?.(actor);
      }
      if (existingActors.length) actor.reactToNewClown?.(existingActors[existingActors.length - 1]);
    }
    return actor;
  }

  function removeCharacter(actor) {
    const index = state.characters.indexOf(actor);
    if (index >= 0) state.characters.splice(index, 1);
    if (!state.characters.length) {
      const point = { x: (state.room.left + state.room.right) * 0.5, y: Math.min(state.room.floor - 330, state.room.top + 240) };
      spawnCharacter("clown", point);
      return;
    }
    setSelectedCharacter(state.characters[Math.min(index, state.characters.length - 1)] ?? state.characters[0]);
  }

  function resetCharactersForMode() {
    state.characters.length = 0;
    clown = spawnCharacter("clown", {
      x: (state.room.left + state.room.right) * 0.5,
      y: Math.min(state.room.floor - 330, state.room.top + 240),
    });
  }

  function findCharacterAt(point, radius = 64) {
    let best = null;
    let bestScore = Infinity;
    for (let index = getCharacters().length - 1; index >= 0; index -= 1) {
      const actor = getCharacters()[index];
      const hits = actor.hitTest(point, radius);
      if (hits.length) {
        const score = distance(point, actor.head) - hits[0].strength * 40;
        if (score < bestScore) {
          best = actor;
          bestScore = score;
        }
      }
    }
    return best;
  }

  function nearestCharacter(point, maxDistance = Infinity) {
    let best = null;
    let bestDistance = maxDistance;
    for (const actor of getCharacters()) {
      const dist = distance(point, actor.head);
      if (dist < bestDistance) {
        best = actor;
        bestDistance = dist;
      }
    }
    return best;
  }

  function updateSandboxCharacterInteractions(dt) {
    if (state.mode !== "sandbox") return;
    const actors = getCharacters();
    state.discoPulse = Math.max(0, state.discoPulse - dt);
    for (let i = 0; i < actors.length; i += 1) {
      for (let j = i + 1; j < actors.length; j += 1) {
        const a = actors[i];
        const b = actors[j];
        resolveClownMagnetism(a, b, dt);
        resolveClownCollision(a, b);
        resolveClownChainLink(a, b, dt);
      }
    }
  }

  function getClownMagnetismStrength(actor) {
    if (actor.mods?.clownAwareness === false) return 0;
    const mode = actor.mods?.clownMagnetism;
    if (mode === "Positive") return 100;
    if (mode === "Negative") return -100;
    if (typeof mode === "number") return clamp(mode, -100, 100);
    return 0;
  }

  function resolveClownMagnetism(a, b, dt) {
    const strength = (getClownMagnetismStrength(a) + getClownMagnetismStrength(b)) * 0.5;
    if (Math.abs(strength) < 1) return;
    const dir = normalize(b.head.x - a.head.x, b.head.y - a.head.y);
    const dist = Math.max(60, distance(a.head, b.head));
    const force = clamp(Math.abs(strength) / 100 * 280 / dist, 0, 2.4) * (strength > 0 ? 1 : -1);
    a.head.applyImpulse(dir.x * force, dir.y * force);
    b.head.applyImpulse(-dir.x * force, -dir.y * force);
  }

  function getPairCollisionMode(a, b) {
    const modes = [
      a.mods?.clownAwareness === false ? "Normal Collision" : a.mods?.clownCollisionMode,
      b.mods?.clownAwareness === false ? "Normal Collision" : b.mods?.clownCollisionMode,
    ];
    if (modes.includes("No Collision")) return "No Collision";
    if (modes.includes("Explosive Collision")) return "Explosive Collision";
    if (modes.includes("Sticky Collision")) return "Sticky Collision";
    if (modes.includes("Bouncy Collision")) return "Bouncy Collision";
    if (modes.includes("Heavy Impact Collision")) return "Heavy Impact Collision";
    if (modes.includes("Soft Squishy Collision")) return "Soft Squishy Collision";
    return "Normal Collision";
  }

  function resolveClownCollision(a, b) {
    const mode = getPairCollisionMode(a, b);
    if (mode === "No Collision") return;
    const dx = b.head.x - a.head.x;
    const dy = b.head.y - a.head.y;
    const dist = Math.hypot(dx, dy) || 1;
    const minDist = (Math.max(a.head.radiusX, a.head.radiusY) + Math.max(b.head.radiusX, b.head.radiusY)) * 0.72;
    if (dist >= minDist) return;
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = minDist - dist;
    const softness = mode === "Soft Squishy Collision" ? 0.18 : 0.5;
    a.head.x -= nx * overlap * softness;
    a.head.y -= ny * overlap * softness;
    b.head.x += nx * overlap * softness;
    b.head.y += ny * overlap * softness;
    const bounce = mode === "Bouncy Collision" ? 15 : mode === "Heavy Impact Collision" ? 7.2 : mode === "Soft Squishy Collision" ? 1.2 : 2.8;
    if (mode === "Sticky Collision" || a.mods?.stickyMode || b.mods?.stickyMode) {
      a.head.prevX = lerp(a.head.prevX, a.head.x, 0.32);
      a.head.prevY = lerp(a.head.prevY, a.head.y, 0.32);
      b.head.prevX = lerp(b.head.prevX, b.head.x, 0.32);
      b.head.prevY = lerp(b.head.prevY, b.head.y, 0.32);
      a.head.squashX = lerp(a.head.squashX, 1.2, 0.2);
      b.head.squashX = lerp(b.head.squashX, 1.2, 0.2);
      a.head.squashY = lerp(a.head.squashY, 0.82, 0.2);
      b.head.squashY = lerp(b.head.squashY, 0.82, 0.2);
    } else {
      a.head.applyImpulse(-nx * bounce, -ny * bounce, b.head);
      b.head.applyImpulse(nx * bounce, ny * bounce, a.head);
    }
    if (mode === "Bouncy Collision") {
      a.head.squashX = 1.28;
      a.head.squashY = 0.72;
      b.head.squashX = 1.28;
      b.head.squashY = 0.72;
      a.head.angularVelocity += -nx * 0.08;
      b.head.angularVelocity += nx * 0.08;
    } else if (mode === "Soft Squishy Collision") {
      a.head.squashX = lerp(a.head.squashX, 1.42, 0.35);
      a.head.squashY = lerp(a.head.squashY, 0.62, 0.35);
      b.head.squashX = lerp(b.head.squashX, 1.42, 0.35);
      b.head.squashY = lerp(b.head.squashY, 0.62, 0.35);
      a.limp = clamp(a.limp + 0.04, 0, 1);
      b.limp = clamp(b.limp + 0.04, 0, 1);
    } else if (mode === "Heavy Impact Collision") {
      const point = { x: (a.head.x + b.head.x) * 0.5, y: (a.head.y + b.head.y) * 0.5 };
      a.applyDamage("blunt", point, { force: 14, radius: 90, direction: { x: -nx, y: -ny } });
      b.applyDamage("blunt", point, { force: 14, radius: 90, direction: { x: nx, y: ny } });
      a.head.squashX = 0.86;
      b.head.squashX = 0.86;
      a.head.squashY = 1.14;
      b.head.squashY = 1.14;
    }
    if (mode === "Explosive Collision" && overlap > minDist * 0.18) {
      const now = state.gameTime;
      if (now - (a.lastCollisionExplosionAt ?? -999) < 0.85 || now - (b.lastCollisionExplosionAt ?? -999) < 0.85) return;
      a.lastCollisionExplosionAt = now;
      b.lastCollisionExplosionAt = now;
      hazards.spawnExplosion((a.head.x + b.head.x) * 0.5, (a.head.y + b.head.y) * 0.5);
    }
  }

  function resolveClownChainLink(a, b, dt) {
    if ((a.mods?.clownAwareness === false || b.mods?.clownAwareness === false) || (!a.mods?.chainLinkClowns && !b.mods?.chainLinkClowns)) return;
    const dist = distance(a.head, b.head);
    if (dist > 520) return;
    const rest = 170;
    const maxDist = 255;
    const dir = normalize(b.head.x - a.head.x, b.head.y - a.head.y);
    const pull = clamp((dist - rest) * 0.022, -1.2, 5.2);
    a.head.applyImpulse(dir.x * pull, dir.y * pull);
    b.head.applyImpulse(-dir.x * pull, -dir.y * pull);
    if (dist > maxDist) {
      const correction = Math.min((dist - maxDist) * 0.42, 36);
      a.head.x += dir.x * correction;
      a.head.y += dir.y * correction;
      a.head.prevX += dir.x * correction * 0.35;
      a.head.prevY += dir.y * correction * 0.35;
      b.head.x -= dir.x * correction;
      b.head.y -= dir.y * correction;
      b.head.prevX -= dir.x * correction * 0.35;
      b.head.prevY -= dir.y * correction * 0.35;
    }
  }

  function layerFromDamage(regionId, damage) {
    if (regionId === "guts" && damage > 12) return 5;
    if (damage >= ClownTuning.damage.gib) return 5;
    if (damage >= ClownTuning.damage.boneExpose) return 4;
    if (damage >= ClownTuning.damage.muscleExpose) return 3;
    if (damage >= ClownTuning.damage.fatExpose) return 2;
    return 1;
  }

  function getLayerLabel(regionId, damage) {
    return LAYER_NAMES[layerFromDamage(regionId, damage) - 1];
  }

  function facePieceLayer(piece) {
    const structuralDamage = Math.max(piece.damage, piece.burn * 1.08);
    if (piece.destroyed || structuralDamage >= ClownTuning.face.cavityOpen) return 5;
    if (structuralDamage >= ClownTuning.face.boneExpose) return 4;
    if (structuralDamage >= ClownTuning.face.muscleExpose) return 3;
    if (structuralDamage >= ClownTuning.face.fatExpose) return 2;
    return 1;
  }

  class Particle {
    constructor(x, y, options = {}) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
      this.fx = 0;
      this.fy = 0;
      this.radius = options.radius ?? 8;
      this.baseRadius = this.radius;
      this.mass = options.mass ?? 1;
      this.baseMass = this.mass;
      this.region = options.region ?? null;
      this.name = options.name ?? "";
      this.kind = options.kind ?? "flesh";
      this.floorFriction = options.floorFriction ?? ClownTuning.physics.limbFloorFriction;
      this.baseFloorFriction = this.floorFriction;
      this.grounded = false;
    }

    get vx() {
      return this.x - this.prevX;
    }

    get vy() {
      return this.y - this.prevY;
    }

    applyImpulse(x, y) {
      this.prevX -= x / Math.max(0.2, this.mass);
      this.prevY -= y / Math.max(0.2, this.mass);
    }

    applyForce(x, y) {
      this.fx += x;
      this.fy += y;
    }

    integrate(dt, room, options = {}) {
      const oldX = this.x;
      const oldY = this.y;
      const damping = ClownTuning.physics.particleDamping;
      this.x += (this.x - this.prevX) * damping + (this.fx / this.mass) * dt * dt;
      this.y += (this.y - this.prevY) * damping + ((this.fy / this.mass) + ClownTuning.physics.gravity * (options.gravityScale ?? 1)) * dt * dt;
      this.prevX = oldX;
      this.prevY = oldY;
      this.fx = 0;
      this.fy = 0;
      this.constrainToRoom(room, options);
    }

    constrainToRoom(room, options = {}) {
      this.grounded = false;
      const bounce = ClownTuning.physics.floorBounce * (options.bounceScale ?? 1);
      const friction = this.floorFriction * (options.frictionScale ?? 1);
      if (this.y + this.radius > room.floor) {
        const vx = this.x - this.prevX;
        const vy = this.y - this.prevY;
        this.y = room.floor - this.radius;
        this.prevY = this.y + Math.abs(vy) * bounce;
        this.prevX = this.x - vx * friction;
        this.grounded = true;
      }
      if (this.x - this.radius < room.left) {
        const vx = this.x - this.prevX;
        this.x = room.left + this.radius;
        this.prevX = this.x + Math.abs(vx) * ClownTuning.physics.wallBounce * (options.bounceScale ?? 1);
        if (options.wallStickiness) this.prevX = lerp(this.prevX, this.x, options.wallStickiness * 0.75);
      }
      if (this.x + this.radius > room.right) {
        const vx = this.x - this.prevX;
        this.x = room.right - this.radius;
        this.prevX = this.x - Math.abs(vx) * ClownTuning.physics.wallBounce * (options.bounceScale ?? 1);
        if (options.wallStickiness) this.prevX = lerp(this.prevX, this.x, options.wallStickiness * 0.75);
      }
      if (this.y - this.radius < room.top) {
        const vy = this.y - this.prevY;
        this.y = room.top + this.radius;
        this.prevY = this.y + Math.abs(vy) * ClownTuning.physics.wallBounce * (options.bounceScale ?? 1);
        if (options.wallStickiness) this.prevY = lerp(this.prevY, this.y, options.wallStickiness * 0.75);
      }
    }
  }

  class HeadBody {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
      this.fx = 0;
      this.fy = 0;
      this.angle = 0;
      this.angularVelocity = 0;
      this.radiusX = ClownTuning.physics.headRadiusX;
      this.radiusY = ClownTuning.physics.headRadiusY;
      this.mass = ClownTuning.physics.headMass;
      this.baseRadiusX = this.radiusX;
      this.baseRadiusY = this.radiusY;
      this.baseMass = this.mass;
      this.squashX = 1;
      this.squashY = 1;
      this.grounded = false;
    }

    get vx() {
      return this.x - this.prevX;
    }

    get vy() {
      return this.y - this.prevY;
    }

    applyImpulse(x, y, point = null) {
      this.prevX -= x / this.mass;
      this.prevY -= y / this.mass;
      if (point) {
        const rx = point.x - this.x;
        const ry = point.y - this.y;
        const torque = (rx * y - ry * x) / Math.max(1, this.mass * this.radiusX);
        this.angularVelocity += torque * 0.032;
      }
    }

    applyForce(x, y) {
      this.fx += x;
      this.fy += y;
    }

    integrate(dt, room, options = {}) {
      const oldX = this.x;
      const oldY = this.y;
      this.x += (this.x - this.prevX) * ClownTuning.physics.headDamping + (this.fx / this.mass) * dt * dt;
      this.y += (this.y - this.prevY) * ClownTuning.physics.headDamping + ((this.fy / this.mass) + ClownTuning.physics.gravity * (options.gravityScale ?? 1)) * dt * dt;
      this.prevX = oldX;
      this.prevY = oldY;
      this.fx = 0;
      this.fy = 0;
      this.angle += this.angularVelocity * dt * 60;
      this.angularVelocity *= ClownTuning.physics.angularDamping;
      this.squashX = lerp(this.squashX, 1, 0.16);
      this.squashY = lerp(this.squashY, 1, 0.16);
      this.constrainToRoom(room, options);
    }

    constrainToRoom(room, options = {}) {
      this.grounded = false;
      const radius = Math.max(this.radiusX * this.squashX, this.radiusY * this.squashY);
      const bounce = ClownTuning.physics.floorBounce * (options.bounceScale ?? 1);
      const friction = ClownTuning.physics.floorFriction * (options.frictionScale ?? 1);
      if (this.y + radius > room.floor) {
        const vx = this.x - this.prevX;
        const vy = this.y - this.prevY;
        this.y = room.floor - radius;
        this.prevY = this.y + Math.abs(vy) * bounce;
        this.prevX = this.x - vx * friction;
        this.angularVelocity += vx * 0.004;
        this.grounded = true;
        this.squashX = Math.max(this.squashX, 1.08);
        this.squashY = Math.min(this.squashY, 0.91);
      }
      if (this.x - radius < room.left) {
        const vx = this.x - this.prevX;
        this.x = room.left + radius;
        this.prevX = this.x + Math.abs(vx) * ClownTuning.physics.wallBounce * (options.bounceScale ?? 1);
        if (options.wallStickiness) this.prevX = lerp(this.prevX, this.x, options.wallStickiness * 0.75);
        this.angularVelocity -= Math.abs(vx) * 0.006;
      }
      if (this.x + radius > room.right) {
        const vx = this.x - this.prevX;
        this.x = room.right - radius;
        this.prevX = this.x - Math.abs(vx) * ClownTuning.physics.wallBounce * (options.bounceScale ?? 1);
        if (options.wallStickiness) this.prevX = lerp(this.prevX, this.x, options.wallStickiness * 0.75);
        this.angularVelocity += Math.abs(vx) * 0.006;
      }
      if (this.y - radius < room.top) {
        const vy = this.y - this.prevY;
        this.y = room.top + radius;
        this.prevY = this.y + Math.abs(vy) * ClownTuning.physics.wallBounce * (options.bounceScale ?? 1);
        if (options.wallStickiness) this.prevY = lerp(this.prevY, this.y, options.wallStickiness * 0.75);
      }
    }

    anchor(local) {
      const scaled = { x: local.x * this.squashX, y: local.y * this.squashY };
      return localToWorld(scaled, this, this.angle);
    }
  }

  class BloodSystem {
    constructor() {
      this.droplets = [];
      this.stains = [];
      this.chunks = [];
      this.lastSmear = new Map();
    }

    reset() {
      this.droplets.length = 0;
      this.stains.length = 0;
      this.chunks.length = 0;
      this.lastSmear.clear();
    }

    spawn(type, x, y, direction, force, amount = 1, colorOverride = null) {
      const scaledAmount = Math.round(amount * ClownTuning.blood.amount);
      const count = clamp(scaledAmount, 0, 120);
      const base = normalize(direction?.x ?? randomSign(), direction?.y ?? -0.35);
      const rainbow = colorOverride ?? state.selectedCharacter?.getGoreColor?.(force) ?? null;
      for (let index = 0; index < count; index += 1) {
        let angle;
        let speed;
        if (type === "directional") {
          angle = Math.atan2(base.y, base.x) + rand(-0.45, 0.45);
          speed = rand(90, 460) + force * rand(3, 7);
        } else if (type === "drip") {
          angle = HALF_PI + rand(-0.28, 0.28);
          speed = rand(20, 120);
        } else {
          angle = rand(0, TAU);
          speed = rand(70, 320) + force * rand(1, 4);
        }
        this.droplets.push({
          x: x + rand(-5, 5),
          y: y + rand(-5, 5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(2.2, 6.8),
          age: 0,
          life: rand(0.65, ClownTuning.blood.particleLife),
          color: rainbow ?? (Math.random() < 0.34 ? COLORS.bloodBright : COLORS.blood),
        });
      }
      if (this.droplets.length > ClownTuning.blood.maxDroplets) {
        this.droplets.splice(0, this.droplets.length - ClownTuning.blood.maxDroplets);
      }
    }

    spawnChunk(x, y, direction, count = 8, colorOverride = null) {
      const dir = normalize(direction?.x ?? randomSign(), direction?.y ?? -0.4);
      for (let index = 0; index < count; index += 1) {
        const rainbow = colorOverride ?? state.selectedCharacter?.getGoreColor?.(index) ?? null;
        const angle = Math.atan2(dir.y, dir.x) + rand(-1.4, 1.4);
        const speed = rand(120, 520);
        this.chunks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(5, 16),
          rotation: rand(0, TAU),
          spin: rand(-6, 6),
          life: rand(ClownTuning.blood.chunkFade * 0.7, ClownTuning.blood.chunkFade * 1.25),
          color: rainbow ?? [COLORS.muscle, COLORS.fat, COLORS.gut, COLORS.bone][Math.floor(rand(0, 4))],
        });
      }
      if (this.chunks.length > ClownTuning.blood.maxChunks) {
        this.chunks.splice(0, this.chunks.length - ClownTuning.blood.maxChunks);
      }
    }

    addStain(x, y, size, color = COLORS.blood, kind = "splat", angle = null) {
      const resolvedColor = color === COLORS.blood ? (state.selectedCharacter?.getGoreColor?.(size) ?? color) : color;
      this.stains.push({
        x,
        y,
        rx: size * rand(0.7, 1.55),
        ry: size * rand(0.32, 0.72),
        angle: angle ?? rand(-0.4, 0.4),
        color: resolvedColor,
        kind,
        alpha: kind === "soot" ? 0.34 : rand(0.34, 0.68),
        life: ClownTuning.blood.stainFade,
      });
      if (this.stains.length > ClownTuning.blood.maxStains) {
        this.stains.splice(0, this.stains.length - ClownTuning.blood.maxStains);
      }
    }

    addSmear(key, x, y, size = 14, color = COLORS.blood) {
      const last = this.lastSmear.get(key);
      if (last && Math.hypot(last.x - x, last.y - y) < ClownTuning.blood.smearSpacing) return;
      this.lastSmear.set(key, { x, y });
      this.addStain(x, y, size, color, "smear");
    }

    addBoundaryStain(x, y, size, color, surface = "floor") {
      const angleBySurface = {
        floor: rand(-0.18, 0.18),
        ceiling: rand(-0.18, 0.18),
        leftWall: HALF_PI + rand(-0.22, 0.22),
        rightWall: HALF_PI + rand(-0.22, 0.22),
      };
      const kind = surface.includes("Wall") ? "wall" : "splat";
      this.addStain(x, y, size, color, kind, angleBySurface[surface] ?? rand(-0.4, 0.4));
    }

    update(dt, room, clownActor = null) {
      const stainTargets = Array.isArray(clownActor) ? clownActor : clownActor ? [clownActor] : [];
      for (let index = this.droplets.length - 1; index >= 0; index -= 1) {
        const droplet = this.droplets[index];
        droplet.age += dt;
        droplet.vy += ClownTuning.blood.gravity * dt;
        droplet.x += droplet.vx * dt;
        droplet.y += droplet.vy * dt;
        droplet.life -= dt;
        const stainedCharacter = droplet.age > 0.08 && stainTargets.some((actor) => actor.addBloodStainFromWorld(droplet, droplet.size * rand(1.1, 2.2)));
        if (stainedCharacter) {
          this.droplets.splice(index, 1);
        } else if (droplet.y + droplet.size >= room.floor) {
          this.addBoundaryStain(droplet.x, room.floor - 2, droplet.size * rand(1.4, 3.6), droplet.color, "floor");
          this.droplets.splice(index, 1);
        } else if (droplet.y - droplet.size <= room.top) {
          this.addBoundaryStain(droplet.x, room.top + 3, droplet.size * rand(1.2, 2.8), droplet.color, "ceiling");
          this.droplets.splice(index, 1);
        } else if (droplet.x - droplet.size <= room.left) {
          this.addBoundaryStain(room.left + 3, droplet.y, droplet.size * rand(1.2, 3.1), droplet.color, "leftWall");
          this.droplets.splice(index, 1);
        } else if (droplet.x + droplet.size >= room.right) {
          this.addBoundaryStain(room.right - 3, droplet.y, droplet.size * rand(1.2, 3.1), droplet.color, "rightWall");
          this.droplets.splice(index, 1);
        } else if (droplet.life <= 0) {
          this.addStain(droplet.x, droplet.y, droplet.size * rand(1, 1.8), droplet.color, "splat");
          this.droplets.splice(index, 1);
        }
      }

      for (let index = this.chunks.length - 1; index >= 0; index -= 1) {
        const chunk = this.chunks[index];
        chunk.vy += ClownTuning.blood.gravity * dt * 0.82;
        chunk.x += chunk.vx * dt;
        chunk.y += chunk.vy * dt;
        chunk.rotation += chunk.spin * dt;
        chunk.life -= dt;
        if (chunk.y + chunk.size >= room.floor) {
          chunk.y = room.floor - chunk.size;
          chunk.vy *= -0.18;
          chunk.vx *= 0.56;
          this.addStain(chunk.x, room.floor - 2, chunk.size * 1.9, chunk.color);
        }
        if (chunk.y - chunk.size < room.top) {
          chunk.y = room.top + chunk.size;
          chunk.vy = Math.abs(chunk.vy) * 0.28;
          this.addBoundaryStain(chunk.x, room.top + 3, chunk.size * 1.2, chunk.color, "ceiling");
        }
        if (chunk.x - chunk.size < room.left) {
          chunk.x = room.left + chunk.size;
          chunk.vx = Math.abs(chunk.vx) * 0.24;
          this.addBoundaryStain(room.left + 3, chunk.y, chunk.size * 1.35, chunk.color, "leftWall");
        }
        if (chunk.x + chunk.size > room.right) {
          chunk.x = room.right - chunk.size;
          chunk.vx = -Math.abs(chunk.vx) * 0.24;
          this.addBoundaryStain(room.right - 3, chunk.y, chunk.size * 1.35, chunk.color, "rightWall");
        }
        if (chunk.life <= 0) {
          this.chunks.splice(index, 1);
        }
      }

      for (let index = this.stains.length - 1; index >= 0; index -= 1) {
        const stain = this.stains[index];
        stain.life -= dt;
        if (stain.life <= 0) this.stains.splice(index, 1);
      }
    }

    drawBack(context) {
      for (const stain of this.stains) {
        context.save();
        context.translate(stain.x, stain.y);
        context.rotate(stain.angle);
        context.globalAlpha = stain.alpha * clamp(stain.life / ClownTuning.blood.stainFade, 0, 1);
        context.fillStyle = stain.color;
        context.beginPath();
        context.ellipse(0, 0, stain.rx, stain.ry, 0, 0, TAU);
        context.fill();
        if (stain.kind === "smear") {
          context.globalAlpha *= 0.55;
          context.fillRect(-stain.rx, -stain.ry * 0.3, stain.rx * 2.2, stain.ry * 0.58);
        }
        context.restore();
      }
    }

    drawFront(context) {
      for (const droplet of this.droplets) {
        context.fillStyle = droplet.color;
        context.beginPath();
        context.arc(droplet.x, droplet.y, droplet.size, 0, TAU);
        context.fill();
      }

      for (const chunk of this.chunks) {
        context.save();
        context.translate(chunk.x, chunk.y);
        context.rotate(chunk.rotation);
        context.globalAlpha = clamp(chunk.life / ClownTuning.blood.chunkFade, 0, 1);
        context.fillStyle = chunk.color;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 2;
        context.beginPath();
        context.roundRect(-chunk.size * 0.7, -chunk.size * 0.45, chunk.size * 1.4, chunk.size * 0.9, 4);
        context.fill();
        context.stroke();
        context.restore();
      }
    }
  }

  class ClownActor {
    constructor(room) {
      this.instanceId = state.nextActorInstanceId++;
      this.room = room;
      this.reset(room);
    }

    reset(room = this.room) {
      this.room = room;
      const centerX = (room.left + room.right) * 0.5;
      const centerY = Math.min(room.floor - 330, room.top + 240);
      this.restX = centerX;
      this.restY = centerY;
      this.head = new HeadBody(centerX, centerY);
      this.anchors = {
        leftShoulder: { x: -78, y: -10 },
        rightShoulder: { x: 78, y: -10 },
        leftHip: { x: -38, y: 82 },
        rightHip: { x: 38, y: 82 },
        gutDoor: { x: 0, y: 34 },
        jaw: { x: 0, y: 62 },
      };
      this.baseAnchors = Object.fromEntries(Object.entries(this.anchors).map(([key, value]) => [key, { ...value }]));
      this.regions = {};
      for (const regionId of Object.keys(REGION_META)) {
        this.regions[regionId] = {
          damage: 0,
          bruise: 0,
          burn: 0,
          dirt: 0,
          wounds: [],
          severed: false,
          broken: false,
          cutProgress: 0,
          crushProgress: 0,
          regenProgress: 0,
          lastDamageAt: -999,
          destroyed: false,
        };
      }

      this.expression = "idle";
      this.autoExpression = "idle";
      this.expressionTimer = 0;
      this.dead = false;
      this.limp = 0;
      this.time = 0;
      this.characterId = this.characterId || "clown";
      this.displayName = this.displayName || "Clown";
      this.mods = this.mods ? { ...createDefaultMods(), ...this.mods } : createDefaultMods();
      this.spawnPoint = { x: centerX, y: centerY };
      this.pinPoint = null;
      this.panicDirection = randomSign();
      this.behaviorTimer = 0;
      this.wanderDirection = randomSign();
      this.sugarTimer = 0;
      this.sugarBurstTimer = 0;
      this.sugarCooldownTimer = rand(1.6, 5.2);
      this.sugarVertical = randomSign();
      this.rabbitAttackCooldown = 0;
      this.rabbitLeapCooldown = 0;
      this.rabbitTarget = null;
      this.socialTimer = rand(0.15, 0.5);
      this.temporaryPanicTimer = 0;
      this.groupPanicCooldown = 0;
      this.spawnReactionTimer = 0;
      this.spawnReactionTarget = null;
      this.trappedFearTimer = 0;
      this.autoCloneTimer = 0;
      this.scaleModeTimer = rand(2.2, 5.6);
      this.scalePulseTimer = 0;
      this.scaleCrushCooldown = 0;
      this.electricTimer = 0;
      this.explosiveBodyCooldown = 0;
      this.explosiveBodyHits = [];
      this.lastCollisionExplosionAt = -999;
      this.popRecoverTimer = 0;

      this.particles = [];
      this.segments = [];
      this.fragments = [];
      this.facePieces = this.createFacePieces();
      this.selfStains = [];
      this.hangingOrgans = [];
      this.headOrganDamage = 0;
      this.headOrganLastDamageAt = -999;
      this.anchorMemory = {};
      this.guts = {
        exposed: false,
        torn: false,
        particles: [],
        constraints: [],
      };

      this.createRig(centerX, centerY);
      this.createGuts(centerX, centerY);
      this.applyModSettings({ preserveVelocity: false });
      this.initializeAnchorMemory();
      this.settleInitialPose();
    }

    createFacePieces() {
      return FACE_PIECE_LIBRARY.map((piece, index) => ({
        ...piece,
        damage: 0,
        burn: 0,
        dirt: 0,
        layer: 1,
        destroyed: false,
        detached: false,
        regenProgress: 0,
        lastDamageAt: -999,
        organReleased: false,
        wobbleSeed: index * 1.73 + rand(0.2, 1.4),
      }));
    }

    createParticle(name, x, y, options = {}) {
      const particle = new Particle(x, y, { ...options, name });
      this.particles.push(particle);
      return particle;
    }

    createRig(x, y) {
      this.leftElbow = this.createParticle("leftElbow", x - 142, y + 40, { radius: 10, mass: 0.58, region: "leftArm" });
      this.leftHand = this.createParticle("leftHand", x - 170, y + 104, { radius: 17, mass: 0.52, region: "leftHand", kind: "hand" });
      this.rightElbow = this.createParticle("rightElbow", x + 142, y + 40, { radius: 10, mass: 0.58, region: "rightArm" });
      this.rightHand = this.createParticle("rightHand", x + 170, y + 104, { radius: 17, mass: 0.52, region: "rightHand", kind: "hand" });
      this.leftKnee = this.createParticle("leftKnee", x - 38, y + 174, { radius: 11, mass: 0.72, region: "leftLeg" });
      this.leftFoot = this.createParticle("leftFoot", x - 68, y + 268, { radius: 24, mass: 0.86, region: "leftFoot", kind: "foot", floorFriction: ClownTuning.physics.shoeFloorFriction });
      this.rightKnee = this.createParticle("rightKnee", x + 38, y + 174, { radius: 11, mass: 0.72, region: "rightLeg" });
      this.rightFoot = this.createParticle("rightFoot", x + 68, y + 268, { radius: 24, mass: 0.86, region: "rightFoot", kind: "foot", floorFriction: ClownTuning.physics.shoeFloorFriction });

      this.addSegment("leftUpperArm", "leftShoulder", this.leftElbow, 84, 17, "leftArm");
      this.addSegment("leftForearm", this.leftElbow, this.leftHand, 76, 15, "leftArm");
      this.addSegment("rightUpperArm", "rightShoulder", this.rightElbow, 84, 17, "rightArm");
      this.addSegment("rightForearm", this.rightElbow, this.rightHand, 76, 15, "rightArm");
      this.addSegment("leftThigh", "leftHip", this.leftKnee, 94, 15, "leftLeg");
      this.addSegment("leftCalf", this.leftKnee, this.leftFoot, 98, 14, "leftLeg");
      this.addSegment("rightThigh", "rightHip", this.rightKnee, 94, 15, "rightLeg");
      this.addSegment("rightCalf", this.rightKnee, this.rightFoot, 98, 14, "rightLeg");
    }

    addSegment(name, a, b, length, radius, region) {
      this.segments.push({
        name,
        a,
        b,
        length,
        radius,
        region,
        baseLength: length,
        baseRadius: radius,
        severed: false,
        broken: false,
        destroyed: false,
        maxStretch: 1.86,
        hanging: false,
        hangT: 0.5,
      });
    }

    createGuts(x, y) {
      this.guts.particles.length = 0;
      this.guts.constraints.length = 0;
      for (let index = 0; index < ClownTuning.organs.intestineSegments; index += 1) {
        const particle = new Particle(
          x + Math.sin(index * 0.9) * 11,
          y + 26 + index * 2,
          { radius: ClownTuning.organs.gutRadius, mass: 0.42, region: "guts", kind: "gut", name: `gut${index}` },
        );
        this.guts.particles.push(particle);
        if (index > 0) {
          this.guts.constraints.push({
            a: this.guts.particles[index - 1],
            b: particle,
            length: ClownTuning.organs.intestineLength,
          });
        }
      }
    }

    headAnchor(name) {
      return this.head.anchor(this.anchors[name]);
    }

    headFeatureScale() {
      return clamp(
        Math.min(this.head.radiusX / this.head.baseRadiusX, this.head.radiusY / this.head.baseRadiusY),
        0.16,
        6,
      );
    }

    headFeatureAnchor(local) {
      const scale = this.headFeatureScale();
      return this.head.anchor({ x: local.x * scale, y: local.y * scale });
    }

    worldToHeadFeatureLocal(point) {
      const local = worldToLocal(point, this.head, this.head.angle);
      const scale = this.headFeatureScale();
      return { x: local.x / scale, y: local.y / scale };
    }

    getNodePosition(ref) {
      if (typeof ref === "string") return this.headAnchor(ref);
      return ref;
    }

    initializeAnchorMemory() {
      for (const anchorName of ["leftShoulder", "rightShoulder", "leftHip", "rightHip"]) {
        const anchor = this.headAnchor(anchorName);
        this.anchorMemory[anchorName] = { x: anchor.x, y: anchor.y };
      }
    }

    settleInitialPose() {
      for (let iteration = 0; iteration < 8; iteration += 1) {
        this.solveSegments({ allowDamage: false });
      }
      this.zeroRigVelocity();
      this.initializeAnchorMemory();
    }

    zeroRigVelocity() {
      this.head.prevX = this.head.x;
      this.head.prevY = this.head.y;
      this.head.angularVelocity = 0;
      for (const particle of this.particles) {
        particle.prevX = particle.x;
        particle.prevY = particle.y;
      }
      for (const particle of this.guts.particles) {
        particle.prevX = particle.x;
        particle.prevY = particle.y;
      }
    }

    getPhysicsOptions() {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      const wobbleBounce = 1 + Math.max(0, (mods.wobbliness ?? 100) - 100) / 420;
      const world = state.sandboxWorld ?? DEFAULT_WORLD_MOD_SETTINGS;
      const sugarBounce = this.isSugarActive() ? 4.2 : 1;
      const balloonBounce = mods.balloonMode ? 1.75 : 1;
      const shoeBounce = mods.shoeType === "Spring Shoes" ? 1.65 : mods.shoeType === "Bouncy Shoes" ? 2.25 : mods.shoeType === "Heavy Boots" ? 0.72 : 1;
      const stickyFriction = mods.stickyMode ? 2.6 : 1;
      const slipperyFriction = mods.slipperyMode ? 0.08 : 1;
      const balloonFriction = mods.balloonMode ? 0.66 : 1;
      return {
        gravityScale: (mods.gravityScale ?? 1) * (world.boxGravity ?? 1) * (mods.balloonMode ? 0.62 : 1),
        bounceScale: clamp(((mods.bounciness ?? 100) / 100) * ((world.boxBounce ?? 100) / 100) * wobbleBounce * sugarBounce * balloonBounce * shoeBounce, 0, 7.5),
        frictionScale: clamp((mods.friction ?? 100) / 100 * stickyFriction * slipperyFriction * balloonFriction, 0.02, 4),
        wallStickiness: clamp((world.wallStickiness ?? 0) / 100 + (mods.stickyMode ? 0.45 : 0), 0, 1),
      };
    }

    getLocalTimeScale() {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      if (mods.freezeFace) return 0;
      const feralBoost = mods.rabbitClown ? 1.65 : 1;
      const sugarBoost = this.isSugarActive() ? 1.45 : 1;
      const tinyBoost = mods.tinyActive ? 1.35 : 1;
      return clamp((mods.speed ?? 1) * (mods.slowMotion ?? 1) * feralBoost * sugarBoost * tinyBoost, 0.02, 5);
    }

    isSugarActive() {
      return !!this.mods?.sugarMode && this.sugarBurstTimer > 0;
    }

    applyModSettings(options = {}) {
      // Sandbox mods affect actual collider sizes, masses, anchors, and constraints instead of only scaling art.
      const mods = this.mods ?? createDefaultMods();
      const preserveVelocity = options.preserveVelocity !== false;
      const giantScale = mods.giantActive ? 4.25 : 1;
      const tinyScale = mods.tinyActive ? 0.22 : 1;
      const balloonInflate = mods.balloonMode ? Math.max(0, mods.inflate ?? 0) : 0;
      const inflateScale = 1 + clamp(balloonInflate, 0, 300) / 150;
      const size = clamp((mods.size ?? 1) * giantScale * tinyScale, 0.18, 6);
      const headSize = clamp((mods.headSize ?? 1) * inflateScale, 0.35, 5);
      const armLength = clamp(mods.armLength ?? 1, 0.25, 3);
      const legLength = clamp(mods.legLength ?? 1, 0.25, 3);
      const weight = clamp((mods.weight ?? 1) * (mods.giantActive ? 2.7 : 1) * (mods.tinyActive ? 0.28 : 1) * (mods.balloonMode ? 0.38 : 1), 0.05, 20);
      const headScale = size * headSize;
      const limbScale = size;

      this.head.radiusX = this.head.baseRadiusX * headScale;
      this.head.radiusY = this.head.baseRadiusY * headScale;
      this.head.mass = Math.max(0.35, this.head.baseMass * weight * size * size * headSize);

      for (const [anchorName, base] of Object.entries(this.baseAnchors)) {
        this.anchors[anchorName].x = base.x * headScale;
        this.anchors[anchorName].y = base.y * headScale;
      }

      for (const particle of this.particles) {
        const extremityScale = particle.kind === "hand" || particle.kind === "foot" ? Math.sqrt(limbScale) : limbScale;
        particle.radius = Math.max(4, particle.baseRadius * extremityScale);
        particle.mass = Math.max(0.06, particle.baseMass * weight * size);
        particle.floorFriction = particle.baseFloorFriction;
        if (particle.kind === "foot") {
          const shoeMass = {
            "Heavy Boots": 1.85,
            "Tiny Shoes": 0.7,
            "Spring Shoes": 0.82,
            "Rocket Shoes": 0.72,
          }[mods.shoeType] ?? 1;
          const shoeFriction = {
            "Ice Skates": 0.08,
            "Roller Skates": 0.14,
            "Sticky Shoes": 2.8,
            "Heavy Boots": 1.45,
            "Tiny Shoes": 0.82,
          }[mods.shoeType] ?? 1;
          particle.mass *= shoeMass;
          particle.floorFriction *= shoeFriction;
        }
        if (particle.kind === "hand") {
          particle.mass *= {
            "Boxing Gloves": 1.45,
            "Metal Hands": 1.8,
            "Giant Hands": 1.25,
            "Tiny Hands": 0.72,
            "Balloon Hands": 0.62,
          }[mods.gloveType] ?? 1;
        }
      }

      for (const particle of this.guts.particles) {
        particle.radius = Math.max(3, particle.baseRadius * Math.sqrt(size));
        particle.mass = Math.max(0.08, particle.baseMass * weight * size);
      }

      for (const segment of this.segments) {
        const lengthScale = segment.name.includes("Arm") || segment.name.includes("Forearm") ? armLength : legLength;
        segment.length = segment.baseLength * size * lengthScale;
        segment.radius = Math.max(5, segment.baseRadius * limbScale);
      }

      if (mods.pin && !this.pinPoint) {
        this.pinPoint = { x: this.head.x, y: this.head.y };
      } else if (!mods.pin) {
        this.pinPoint = null;
      }
      if (mods.noGore) {
        this.guts.exposed = false;
        this.guts.torn = false;
        this.hangingOrgans.length = 0;
        this.fragments.length = 0;
        this.headOrganDamage = 0;
        this.regions.guts.damage = 0;
        for (const piece of this.facePieces) {
          piece.organReleased = false;
          if (piece.layer >= 5) {
            piece.damage = Math.min(piece.damage, ClownTuning.face.fatExpose * 0.65);
            piece.destroyed = false;
          }
        }
      }
      if ((mods.freezeFace || mods.pin) && preserveVelocity) {
        this.zeroRigVelocity();
      }
    }

    moveTo(x, y) {
      const dx = x - this.head.x;
      const dy = y - this.head.y;
      this.head.x += dx;
      this.head.y += dy;
      this.head.prevX += dx;
      this.head.prevY += dy;
      this.restX += dx;
      this.restY += dy;
      this.spawnPoint = { x, y };
      for (const particle of this.particles) {
        particle.x += dx;
        particle.y += dy;
        particle.prevX += dx;
        particle.prevY += dy;
      }
      for (const particle of this.guts.particles) {
        particle.x += dx;
        particle.y += dy;
        particle.prevX += dx;
        particle.prevY += dy;
      }
      for (const fragment of this.fragments) {
        fragment.x += dx;
        fragment.y += dy;
        fragment.prevX += dx;
        fragment.prevY += dy;
      }
      for (const organ of this.hangingOrgans) {
        organ.x += dx;
        organ.y += dy;
        organ.prevX += dx;
        organ.prevY += dy;
      }
      if (this.pinPoint) this.pinPoint = { x, y };
      this.initializeAnchorMemory();
    }

    setSandboxMod(key, value) {
      if (!this.mods) this.mods = createDefaultMods();
      this.mods[key] = value;
      if (key === "giantMode" && value) this.mods.tinyMode = false;
      if (key === "tinyMode" && value) this.mods.giantMode = false;
      if (key === "noGore" && value) {
        this.mods.rainbowGore = false;
        this.guts.exposed = false;
      }
      if (key === "rainbowGore" && value) this.mods.noGore = false;
      if (key === "sugarMode" && value) this.sugarVertical = randomSign();
      if (key === "giantMode" || key === "tinyMode") {
        this.mods.giantActive = false;
        this.mods.tinyActive = false;
        this.scaleModeTimer = rand(1.6, 4.8);
      }
      if (key === "balloonMode") {
        this.mods.inflate = value ? Math.max(this.mods.inflate ?? 0, 80) : 0;
        this.popRecoverTimer = 0;
      }
      if (key === "pin" && value) this.pinPoint = { x: this.head.x, y: this.head.y };
      if (key === "pin" && !value) this.pinPoint = null;
      this.applyModSettings();
    }

    removeBones() {
      this.mods.bonesRemoved = true;
      for (const region of Object.values(this.regions)) region.broken = true;
      for (const segment of this.segments) segment.broken = true;
    }

    restoreBones() {
      this.mods.bonesRemoved = false;
      for (const region of Object.values(this.regions)) region.broken = false;
      for (const segment of this.segments) segment.broken = false;
    }

    detachAllLimbs() {
      const point = { x: this.head.x, y: this.head.y };
      for (const regionId of ["leftArm", "rightArm", "leftLeg", "rightLeg"]) {
        const direction = normalize((regionId.includes("right") ? 1 : -1), regionId.includes("Leg") ? 0.7 : -0.1);
        this.severRegion(regionId, point, direction);
      }
    }

    reattachAllLimbs() {
      for (const regionId of ["leftArm", "rightArm", "leftHand", "rightHand", "leftLeg", "rightLeg", "leftFoot", "rightFoot"]) {
        this.restoreRegion(regionId);
      }
      this.settleInitialPose();
    }

    resetWithMods(mods = null) {
      this.mods = mods ? { ...createDefaultMods(), ...mods } : createDefaultMods();
      this.reset(this.room);
    }

    getExpressionForDisplay() {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      if (mods.rabbitClown) return "rabid";
      if (mods.panicMode) return "panic";
      if (mods.dazedMode) return "dazed";
      if (mods.forceExpression && mods.forceExpression !== "Normal") {
        return {
          Happy: "idle",
          Nervous: "nervous",
          Panic: "panic",
          Pain: "pain",
          Angry: "angry",
          Dazed: "dazed",
          Shocked: "scream",
          Deadpan: "blank",
          "Knocked Out": "dead",
        }[mods.forceExpression] ?? this.autoExpression;
      }
      return this.autoExpression;
    }

    getEyeLookOffset(eyeX, eyeY) {
      // Eye tracking is actor-local: future characters can reuse the same pointer-to-local-space pattern.
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      if (mods.freezeFace || !mods.eyeFollowMouse || !state.pointer.inside) return { x: 0, y: 0 };
      const localPointer = worldToLocal({ x: state.pointer.x, y: state.pointer.y }, this.head, this.head.angle);
      const dir = normalize(localPointer.x - eyeX, localPointer.y - eyeY);
      const distanceScale = clamp(Math.hypot(localPointer.x - eyeX, localPointer.y - eyeY) / 180, 0, 1);
      return {
        x: dir.x * 7 * distanceScale,
        y: dir.y * 5 * distanceScale,
      };
    }

    getDisplayedLayer(actualLayer) {
      return this.mods?.noGore ? 1 : actualLayer;
    }

    update(dt, room) {
      this.room = room;
      this.applyModSettings();
      const localScale = this.getLocalTimeScale();
      if (localScale <= 0) {
        this.zeroRigVelocity();
        this.updateSelfStains(dt);
        if (this.mods.regenerate) this.updateHealing(dt * 12);
        return;
      }
      dt *= localScale;
      this.time += dt;
      this.explosiveBodyCooldown = Math.max(0, this.explosiveBodyCooldown - dt);
      this.popRecoverTimer = Math.max(0, this.popRecoverTimer - dt);
      if (this.expressionTimer > 0) {
        this.expressionTimer -= dt;
        if (this.expressionTimer <= 0) {
          this.autoExpression = this.dead ? "dead" : "idle";
        }
      }

      this.applyAliveMotor(dt);
      this.applyBehaviorModes(dt);
      this.updateSandboxChaos(dt);
      const physicsOptions = this.getPhysicsOptions();
      this.head.integrate(dt, room, physicsOptions);
      for (const particle of this.particles) {
        particle.integrate(dt, room, physicsOptions);
      }
      if (this.guts.exposed) {
        this.updateGuts(dt, room, physicsOptions);
      }

      for (let iteration = 0; iteration < ClownTuning.physics.constraintIterations; iteration += 1) {
        this.solveSegments();
        if (this.guts.exposed) this.solveGuts();
      }

      this.updateFragments(dt, room);
      this.updateBleeding(dt);
      this.updateHealing(dt);
      this.updateHangingOrgans(dt, room, physicsOptions);
      this.updateSelfStains(dt);
      this.decaySurfaceMarks(dt);
      if (this.mods.pin && this.pinPoint) {
        this.head.x = lerp(this.head.x, this.pinPoint.x, 0.28);
        this.head.y = lerp(this.head.y, this.pinPoint.y, 0.28);
        this.head.prevX = lerp(this.head.prevX, this.head.x, 0.34);
        this.head.prevY = lerp(this.head.prevY, this.head.y, 0.34);
      }
    }

    applyAliveMotor(dt) {
      const totalDamage = Object.values(this.regions).reduce((sum, region) => sum + region.damage, 0);
      const healthFade = clamp(1 - totalDamage * ClownTuning.physics.aliveMotorDamageFade, 0.28, 1);
      const spawnRamp = clamp((this.time - ClownTuning.physics.spawnMotorDelay) / ClownTuning.physics.spawnMotorRamp, 0, 1);
      const strengthScale = clamp((this.mods?.strength ?? 100) / 100, 0, 3);
      const skeletonScale = this.mods?.bonesRemoved ? 0.08 : 1;
      const motor = this.dead ? 0 : ClownTuning.physics.aliveMotorStrength * strengthScale * skeletonScale * healthFade * lerp(1, 0.54, this.limp) * spawnRamp;
      this.limp = clamp(this.limp - dt * 0.12, 0, 1);
      if (motor <= 0) return;

      const plan = this.getStandSupportPlan();
      if (!plan.supports.length) {
        return;
      }

      const supportWeight = plan.supports.reduce((sum, support) => sum + support.weight, 0) || 1;
      const supportX = plan.supports.reduce((sum, support) => sum + support.node.x * support.weight, 0) / supportWeight;
      const damagedLift = plan.mode === "arms" ? 56 : plan.mode === "oneLeg" ? 34 : plan.mode === "brokenLegs" ? 26 : 0;
      const desiredY = this.restY + damagedLift;
      const xImpulse = clamp((supportX - this.head.x) * 0.0075 * motor, -0.72, 0.72);
      const yImpulse = clamp((desiredY - this.head.y) * 0.012 * motor, -1.8, 1.35);
      this.head.applyImpulse(xImpulse, yImpulse);
      this.head.angularVelocity += clamp((plan.targetAngle - this.head.angle) * 0.022 * motor, -0.035, 0.035);
      this.applyStandSupportMotor(plan, motor);
      const headSpeed = Math.hypot(this.head.vx, this.head.vy);
      if (headSpeed < 5) {
        for (const support of plan.supports) {
          if (support.node.grounded) {
            support.node.prevX = lerp(support.node.prevX, support.node.x, 0.022 * motor * support.weight);
          }
        }
      }
      if (this.mods?.dazedMode) {
        this.head.angularVelocity += Math.sin(this.time * 4.8) * 0.004 * motor;
      }
    }

    applyBehaviorModes(dt) {
      if (this.dead || this.mods?.freezeFace) return;
      this.temporaryPanicTimer = Math.max(0, this.temporaryPanicTimer - dt);
      this.applyIdlePersonality(dt);
      this.applyClownSocialBehavior(dt);
      if (this.temporaryPanicTimer > 0 || this.mods?.panicMode) this.applyPanicMode(dt);
      if (this.mods?.dazedMode) this.applyDazedMode(dt);
      if (this.isSugarActive()) this.applySugarMode(dt);
      if (this.mods?.rabbitClown) this.applyRabbitClownMode(dt);
    }

    applyIdlePersonality(dt) {
      if (this.temporaryPanicTimer > 0 || this.mods?.panicMode || this.mods?.dazedMode || this.mods?.rabbitClown || this.isSugarActive() || this.mods?.copycatMode) return;
      const drama = clamp((this.mods?.dramaLevel ?? 100) / 100, 0, 3);
      const behavior = this.mods?.idleBehavior ?? "Stand Still";
      if (behavior === "Nervous Shake" || this.mods?.personality === "Coward") {
        this.autoExpression = "nervous";
        this.head.angularVelocity += Math.sin(this.time * 14) * 0.0025 * drama;
        this.leftHand.applyImpulse(Math.sin(this.time * 10) * 0.14 * drama, -0.08 * drama);
        this.rightHand.applyImpulse(Math.cos(this.time * 11) * 0.14 * drama, -0.08 * drama);
      } else if (behavior === "Look Around" || this.mods?.personality === "Confused") {
        this.autoExpression = Math.sin(this.time * 2.8) > 0 ? "blank" : "nervous";
        this.head.angularVelocity += Math.sin(this.time * 3.1) * 0.006 * drama;
      } else if (behavior === "Dance" || this.mods?.personality === "Show-Off") {
        this.autoExpression = "idle";
        this.head.applyImpulse(Math.sin(this.time * 5.4) * 0.18 * drama, Math.sin(this.time * 10.2) * -0.1 * drama);
      } else if (behavior === "Fall Asleep" || this.mods?.personality === "Sleepy") {
        this.autoExpression = "blank";
        this.head.angularVelocity += Math.sin(this.time * 1.8) * 0.001;
        this.head.squashY = lerp(this.head.squashY, 0.92, 0.02);
      } else if (behavior === "Tap Foot") {
        this.autoExpression = "blank";
        const foot = Math.sin(this.time * 10) > 0 ? this.leftFoot : this.rightFoot;
        if (foot?.grounded) foot.applyImpulse(0, -0.55 * drama);
      } else if (behavior === "Wave at Audience") {
        this.autoExpression = "idle";
        this.rightHand.applyImpulse(Math.sin(this.time * 7) * 0.7 * drama, -0.8 * drama);
      } else if (behavior === "Beg Player to Stop" || this.mods?.personality === "Dramatic") {
        this.autoExpression = "nervous";
        this.head.angle = lerp(this.head.angle, 0.16 * Math.sin(this.time * 4), 0.04);
        this.leftKnee.applyImpulse(0.1, 0.55 * drama);
        this.rightKnee.applyImpulse(-0.1, 0.55 * drama);
        this.leftHand.applyImpulse(0.62 * drama, -0.72 * drama);
        this.rightHand.applyImpulse(-0.62 * drama, -0.72 * drama);
      } else if (behavior === "Laugh at Player" || this.mods?.personality === "Maniac") {
        this.autoExpression = "idle";
        this.head.angularVelocity += Math.sin(this.time * 16) * 0.004 * drama;
        this.head.squashX = lerp(this.head.squashX, 1.12 + Math.sin(this.time * 18) * 0.05, 0.04);
      } else if (behavior === "Pretend Nothing Is Wrong" || this.mods?.personality === "Tough Guy") {
        this.autoExpression = "blank";
        this.head.angle = lerp(this.head.angle, 0, 0.08);
      } else if (this.mods?.personality === "Hyper") {
        this.autoExpression = "idle";
        this.head.applyImpulse(Math.sin(this.time * 13) * 0.22, -Math.abs(Math.sin(this.time * 8)) * 0.18);
      } else if (this.mods?.personality === "Angry") {
        this.autoExpression = "angry";
        this.head.angularVelocity += Math.sin(this.time * 9) * 0.005 * drama;
        if (Math.sin(this.time * 6) > 0.92) this.rightFoot.applyImpulse(-0.8 * drama, -1.2 * drama);
      } else if (this.mods?.personality === "Crybaby") {
        this.autoExpression = "pain";
        this.leftHand.applyImpulse(0.12 * drama, -0.26 * drama);
        this.rightHand.applyImpulse(-0.12 * drama, -0.26 * drama);
      } else if (this.mods?.personality === "Broken Robot") {
        this.autoExpression = Math.sin(this.time * 9) > 0 ? "blank" : "dazed";
        this.head.angularVelocity += randomSign() * 0.0025;
        if (Math.random() < dt * 4) this.head.applyImpulse(randomSign() * 0.7, randomSign() * 0.4);
      }
    }

    triggerTemporaryPanic(duration = 2.4) {
      this.temporaryPanicTimer = Math.max(this.temporaryPanicTimer ?? 0, duration);
      this.autoExpression = "panic";
      this.expressionTimer = Math.max(this.expressionTimer, Math.min(duration, 1.2));
    }

    triggerGroupPanic() {
      if (this.groupPanicCooldown > 0) return;
      this.groupPanicCooldown = 1.1;
      for (const actor of getCharacters()) {
        actor.triggerTemporaryPanic?.(actor === this ? 1.6 : rand(2.0, 3.7));
        actor.head.applyImpulse(rand(-4, 4), -rand(3, 10), this.head);
      }
    }

    reactToNewClown(newActor) {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      if (!newActor || newActor === this || !mods.clownAwareness || mods.copycatMode) return;
      const reaction = REACTION_OPTIONS.includes(mods.reactionToClowns) ? mods.reactionToClowns : "Ignore";
      const dir = normalize(newActor.head.x - this.head.x, newActor.head.y - this.head.y);
      this.spawnReactionTarget = newActor;
      this.spawnReactionTimer = 1.4;
      if (reaction === "Ignore") return;
      if (reaction === "Stare") {
        this.autoExpression = "blank";
        this.expressionTimer = 1.0;
        this.head.angularVelocity += clamp(dir.x * 0.045, -0.08, 0.08);
      } else if (reaction === "Panic" || reaction === "Run Away") {
        this.triggerTemporaryPanic(reaction === "Panic" ? 2.6 : 1.7);
        this.head.applyImpulse(-dir.x * rand(8, 15), -rand(7, 16), newActor.head);
      } else if (reaction === "Laugh" || reaction === "Cheer") {
        this.autoExpression = "idle";
        this.expressionTimer = 1.2;
        this.head.applyImpulse(Math.sin(this.time * 12) * 3.4, -rand(2, 6), newActor.head);
        this.leftHand.applyImpulse(-dir.x * 2.6, -3.2);
        this.rightHand.applyImpulse(-dir.x * 2.6, -3.2);
      } else if (reaction === "Attack") {
        this.autoExpression = "angry";
        this.expressionTimer = 1.0;
        this.head.applyImpulse(dir.x * rand(9, 16), -rand(5, 11), newActor.head);
        if (distance(this.head, newActor.head) < 260) this.performRabbitAttack(newActor, dir);
      } else if (reaction === "Gasp" || reaction === "Freeze Up") {
        this.autoExpression = reaction === "Gasp" ? "scream" : "blank";
        this.expressionTimer = 1.25;
        this.zeroRigVelocity();
        this.head.squashX = 0.86;
        this.head.squashY = 1.16;
      }
    }

    applyClownSocialBehavior(dt) {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      if (state.mode !== "sandbox" || !mods.clownAwareness) return;
      this.socialTimer = Math.max(0, this.socialTimer - dt);
      this.groupPanicCooldown = Math.max(0, this.groupPanicCooldown - dt);
      this.spawnReactionTimer = Math.max(0, this.spawnReactionTimer - dt);
      const others = getCharacters().filter((actor) => actor !== this && !actor.dead);
      if (!others.length) return;
      let nearest = null;
      let nearestDistance = Infinity;
      for (const actor of others) {
        const dist = distance(this.head, actor.head);
        if (dist < nearestDistance) {
          nearest = actor;
          nearestDistance = dist;
        }
      }
      if (!nearest) return;

      const dirToOther = normalize(nearest.head.x - this.head.x, nearest.head.y - this.head.y);
      const fear = mods.fearEnabled ? clamp((mods.fearOfClowns ?? 0) / 100, 0, 1) : 0;
      const friendship = mods.friendshipEnabled ? clamp((mods.friendshipLevel ?? 0) / 100, -1, 1) : 0;

      if (mods.copycatMode) {
        this.autoExpression = nearest.getExpressionForDisplay();
        this.head.applyImpulse(nearest.head.vx * 0.06, nearest.head.vy * 0.035);
        if (nearest.dead || nearest.regions.headShell.destroyed) this.popBody(this.head, { x: randomSign(), y: -0.3 });
      }

      if (fear > 0.02 && nearestDistance < 330) {
        this.autoExpression = "panic";
        this.head.applyImpulse(-dirToOther.x * (0.9 + fear * 4.2), -1.1 - fear * 2.8, nearest.head);
        this.trappedFearTimer = nearestDistance < 120 ? this.trappedFearTimer + dt * (0.4 + fear) : Math.max(0, this.trappedFearTimer - dt);
        if (fear > 0.84 && this.trappedFearTimer > 3.2) {
          this.trappedFearTimer = 0;
          hazards.spawnExplosion(this.head.x, this.head.y);
        }
      }

      if (mods.followClowns || friendship > 0.5) {
        this.autoExpression = friendship > 0.7 ? "idle" : this.autoExpression;
        this.head.applyImpulse(dirToOther.x * 0.7, dirToOther.y * 0.18 - 0.12, nearest.head);
      }

      if (mods.protectMode) {
        const protectedActor = this.getProtectedActor(nearest);
        if (protectedActor && protectedActor !== this) {
          const toProtected = normalize(protectedActor.head.x - this.head.x, protectedActor.head.y - this.head.y);
          const guardDistance = distance(this.head, protectedActor.head);
          if (guardDistance > 130) this.head.applyImpulse(toProtected.x * 1.0, toProtected.y * 0.24 - 0.16, protectedActor.head);
          for (const other of others) {
            if (other === protectedActor || distance(other.head, protectedActor.head) > 210) continue;
            const away = normalize(other.head.x - protectedActor.head.x, other.head.y - protectedActor.head.y);
            other.head.applyImpulse(away.x * 1.4, -0.8, this.head);
          }
        }
      }

      if (mods.danceTogether) {
        state.discoPulse = Math.max(state.discoPulse, 0.6);
        this.autoExpression = "idle";
        this.head.applyImpulse(Math.sin(this.time * 8 + this.head.x * 0.01) * 0.9, -Math.abs(Math.sin(this.time * 10)) * 0.85);
      }

      if (friendship < -0.5 || (mods.rivalryMode && nearestDistance < 235)) {
        if (nearestDistance < 240 && this.socialTimer <= 0) {
          this.socialTimer = rand(0.28, 0.72);
          this.performRabbitAttack(nearest, dirToOther);
        }
        if (!mods.rivalryMode || nearestDistance < 235) this.head.applyImpulse(dirToOther.x * 1.6, -0.9, nearest.head);
      }
    }

    getProtectedActor(fallback = null) {
      const targetLabel = this.mods?.protectTargetId ?? "Nearest Clown";
      if (targetLabel && targetLabel !== "Nearest Clown") {
        const match = getCharacters().find((actor) => actor !== this && getActorEditorLabel(actor) === targetLabel);
        if (match) return match;
      }
      return fallback ?? nearestCharacter(this.head, 9999);
    }

    updateSandboxChaos(dt) {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      this.updateTimedScaleModes(dt);
      this.updateSugarCycle(dt);
      const autoCloneRate = clamp(mods.autoClone ?? 0, 0, 10);
      if (autoCloneRate > 0 && state.mode === "sandbox" && getCharacters().length < 28) {
        if (!Number.isFinite(this.autoCloneTimer) || this.autoCloneTimer <= 0) {
          this.autoCloneTimer = clamp(8 / autoCloneRate, 1.8, 12) + rand(0.4, 1.6);
        }
        this.autoCloneTimer -= dt;
        if (this.autoCloneTimer <= 0) {
          this.autoCloneTimer = clamp(8 / autoCloneRate, 1.8, 12) + rand(0.4, 1.6);
          const copyMods = {
            ...this.mods,
            autoClone: 0,
            giantActive: false,
            tinyActive: false,
          };
          const copy = spawnCharacter(this.characterId, { x: this.head.x + rand(-72, 72), y: this.head.y - rand(30, 90) }, { mods: copyMods });
          copy.head.applyImpulse(rand(-8, 8), rand(-12, -4));
        }
      } else if (autoCloneRate <= 0) {
        this.autoCloneTimer = 0;
      }
      if (mods.electricMode) {
        this.electricTimer -= dt;
        this.autoExpression = Math.random() < 0.5 ? "dazed" : "scream";
        for (const particle of this.particles) particle.applyImpulse(rand(-0.8, 0.8), rand(-0.8, 0.8));
        if (this.electricTimer <= 0) {
          this.electricTimer = 0.24;
          for (const other of getCharacters()) {
            if (other === this || distance(other.head, this.head) > 170) continue;
            if (other.mods?.fireproof) continue;
            const dir = normalize(other.head.x - this.head.x, other.head.y - this.head.y);
            other.applyDamage("electric", other.head, { force: 18, radius: 85, direction: dir });
            other.head.applyImpulse(dir.x * 5, -5, this.head);
          }
        }
      }
      if (mods.balloonMode) {
        const targetInflate = this.popRecoverTimer > 0 ? 0 : 185;
        const ease = this.popRecoverTimer > 0 ? 6 : 0.75;
        mods.inflate = lerp(mods.inflate ?? 0, targetInflate, clamp(dt * ease, 0, 1));
      } else if ((mods.inflate ?? 0) > 0) {
        mods.inflate = Math.max(0, mods.inflate - dt * 80);
      }
    }

    updateSugarCycle(dt) {
      if (!this.mods?.sugarMode) {
        this.sugarBurstTimer = 0;
        this.sugarCooldownTimer = rand(1.6, 5.2);
        return;
      }
      if (this.sugarBurstTimer > 0) {
        this.sugarBurstTimer = Math.max(0, this.sugarBurstTimer - dt);
        if (this.sugarBurstTimer <= 0) {
          this.sugarCooldownTimer = rand(2.2, 7.2);
          this.head.squashX = 1.12;
          this.head.squashY = 0.88;
        }
        return;
      }
      this.sugarCooldownTimer -= dt;
      if (this.sugarCooldownTimer <= 0) {
        this.sugarBurstTimer = rand(1.6, 4.4);
        this.sugarVertical = randomSign();
        this.head.applyImpulse(randomSign() * rand(24, 48), -rand(42, 86));
        this.head.angularVelocity += rand(-0.44, 0.44);
      }
    }

    updateTimedScaleModes(dt) {
      const mods = this.mods ?? DEFAULT_MOD_SETTINGS;
      this.scaleCrushCooldown = Math.max(0, this.scaleCrushCooldown - dt);
      if (mods.giantMode && mods.tinyMode) mods.tinyMode = false;
      if (!mods.giantMode && mods.giantActive) mods.giantActive = false;
      if (!mods.tinyMode && mods.tinyActive) mods.tinyActive = false;
      const activeMode = mods.giantMode ? "giant" : mods.tinyMode ? "tiny" : null;
      if (!activeMode) {
        this.scaleModeTimer = rand(2.2, 5.6);
        return;
      }

      const activeKey = activeMode === "giant" ? "giantActive" : "tinyActive";
      const inactiveKey = activeMode === "giant" ? "tinyActive" : "giantActive";
      mods[inactiveKey] = false;
      if (mods[activeKey]) {
        this.scalePulseTimer -= dt;
        if (activeMode === "giant" && this.scaleCrushCooldown <= 0) {
          this.scaleCrushCooldown = 0.32;
          this.crushNearbyClownsAsGiant();
        }
        if (this.scalePulseTimer <= 0) {
          mods[activeKey] = false;
          this.scaleModeTimer = rand(3.5, 7.5);
          this.head.squashX = 1.18;
          this.head.squashY = 0.82;
          this.applyModSettings();
        }
        return;
      }

      this.scaleModeTimer -= dt;
      if (this.scaleModeTimer <= 0) {
        mods[activeKey] = true;
        this.scalePulseTimer = activeMode === "giant" ? rand(2.0, 3.3) : rand(2.4, 4.0);
        this.head.squashX = activeMode === "giant" ? 1.42 : 0.72;
        this.head.squashY = activeMode === "giant" ? 0.82 : 1.25;
        this.applyModSettings();
      }
    }

    crushNearbyClownsAsGiant() {
      const radius = Math.max(this.head.radiusX, this.head.radiusY) + 90;
      for (const other of getCharacters()) {
        if (other === this || other.dead) continue;
        const dist = distance(this.head, other.head);
        if (dist > radius + Math.max(other.head.radiusX, other.head.radiusY) * 0.6) continue;
        const dir = normalize(other.head.x - this.head.x, other.head.y - this.head.y - 10);
        other.applyDamage("crushing", other.head, { force: 56, radius: 160, direction: dir });
        other.head.applyImpulse(dir.x * 24, -18, this.head);
      }
    }

    applyPanicMode(dt) {
      this.autoExpression = "panic";
      this.expressionTimer = Math.max(this.expressionTimer, 0.18);
      const pointer = state.pointer.inside ? { x: state.pointer.x, y: state.pointer.y } : null;
      const away = pointer ? normalize(this.head.x - pointer.x, this.head.y - pointer.y) : { x: this.panicDirection, y: 0 };
      const close = pointer ? distance(this.head, pointer) : 999;
      if (pointer && close < 340) {
        this.panicDirection = away.x >= 0 ? 1 : -1;
      }
      this.behaviorTimer -= dt;
      if (this.behaviorTimer <= 0 || (pointer && close < 120)) {
        this.behaviorTimer = rand(0.24, 0.72);
        if (pointer && close < 155) this.panicDirection *= -1;
      }
      const urgency = clamp((360 - close) / 260, 0.15, 1.3);
      const run = this.panicDirection * (0.65 + urgency * 2.2);
      this.head.applyImpulse(run, close < 180 ? -1.8 - urgency * 1.4 : -0.25);
      this.head.angularVelocity += this.panicDirection * urgency * 0.022;
      for (const foot of [this.leftFoot, this.rightFoot]) {
        if (foot?.grounded) foot.applyImpulse(-this.panicDirection * rand(1.8, 3.8), -rand(1.8, 4.8) * urgency);
      }
      if (close < 130) {
        this.head.applyImpulse(away.x * 6.5, -8.5, pointer);
        for (const particle of this.particles) particle.applyImpulse(away.x * rand(1.2, 3.2), -rand(0.8, 2.4));
      }
    }

    applyDazedMode(dt) {
      this.autoExpression = "dazed";
      this.expressionTimer = Math.max(this.expressionTimer, 0.18);
      this.behaviorTimer -= dt;
      if (this.behaviorTimer <= 0) {
        this.behaviorTimer = rand(0.25, 0.85);
        this.wanderDirection = randomSign() * rand(0.35, 1.4);
      }
      const sway = Math.sin(this.time * 5.2) * 0.75 + this.wanderDirection;
      this.head.applyImpulse(sway * 0.42, Math.sin(this.time * 3.1) * 0.18);
      this.head.angularVelocity += Math.sin(this.time * 4.7) * 0.018;
      const support = Math.random() < 0.5 ? this.leftFoot : this.rightFoot;
      if (support?.grounded) support.applyImpulse(-sway * rand(0.8, 1.8), -rand(0.2, 1.4));
    }

    applySugarMode(dt) {
      this.autoExpression = "scream";
      this.expressionTimer = Math.max(this.expressionTimer, 0.12);
      const radius = Math.max(this.head.radiusX * this.head.squashX, this.head.radiusY * this.head.squashY);
      this.sugarTimer -= dt;
      if (this.sugarTimer <= 0) {
        this.sugarTimer = rand(0.026, 0.062);
        const speed = Math.hypot(this.head.vx, this.head.vy);
        if (speed < 38) {
          this.head.applyImpulse(randomSign() * rand(18, 32), this.sugarVertical * rand(28, 48));
        }
        this.head.applyImpulse(randomSign() * rand(5, 15), this.sugarVertical * rand(8, 20));
        this.head.angularVelocity += rand(-0.36, 0.36);
        for (const particle of this.particles) {
          particle.applyImpulse(rand(-8, 8), rand(-10, 10));
        }
      }
      if (this.head.grounded) {
        this.sugarVertical = -1;
        this.head.applyImpulse(rand(-24, 24), -rand(70, 112));
        this.head.squashX = 1.28;
        this.head.squashY = 0.72;
      }
      if (this.head.y - radius <= this.room.top + 8) {
        this.sugarVertical = 1;
        this.head.applyImpulse(rand(-22, 22), rand(64, 98));
      }
      if (this.head.x - radius <= this.room.left + 8) {
        this.head.applyImpulse(rand(56, 88), this.sugarVertical * rand(18, 38));
      } else if (this.head.x + radius >= this.room.right - 8) {
        this.head.applyImpulse(-rand(56, 88), this.sugarVertical * rand(18, 38));
      }
    }

    applyRabbitClownMode(dt) {
      this.autoExpression = "rabid";
      this.expressionTimer = Math.max(this.expressionTimer, 0.2);
      this.rabbitAttackCooldown = Math.max(0, this.rabbitAttackCooldown - dt);
      this.rabbitLeapCooldown = Math.max(0, this.rabbitLeapCooldown - dt);

      const targets = this.mods?.clownAwareness === false ? [] : getCharacters().filter((actor) => actor !== this && !actor.dead);
      let target = null;
      let targetDistance = Infinity;
      for (const candidate of targets) {
        const dist = distance(this.head, candidate.head);
        if (dist < targetDistance) {
          target = candidate;
          targetDistance = dist;
        }
      }
      this.rabbitTarget = target;

      if (!target) {
        this.applyFeralIdleBounce(dt);
        return;
      }

      const dir = normalize(target.head.x - this.head.x, target.head.y - this.head.y);
      const urgency = clamp((620 - targetDistance) / 420, 0.35, 1.45);
      this.head.applyImpulse(dir.x * (2.8 + urgency * 5.8), dir.y * 1.1 - urgency * 1.7, target.head);
      this.head.angularVelocity += clamp(dir.x * 0.05 + rand(-0.018, 0.018), -0.08, 0.08);

      for (const foot of [this.leftFoot, this.rightFoot]) {
        if (foot?.grounded || Math.random() < dt * 12) {
          foot.applyImpulse(-dir.x * rand(3.2, 7.4), -rand(2.8, 7.2));
        }
      }
      for (const hand of [this.leftHand, this.rightHand]) {
        hand.applyImpulse(dir.x * rand(1.2, 3.8), dir.y * rand(0.8, 2.5) - rand(0.4, 2.2));
      }

      if (targetDistance < 300 && this.rabbitLeapCooldown <= 0) {
        this.rabbitLeapCooldown = rand(0.45, 0.9);
        this.head.applyImpulse(dir.x * rand(12, 22), -rand(15, 26), target.head);
        for (const particle of this.particles) particle.applyImpulse(dir.x * rand(4, 9), -rand(3, 10));
      }

      if (targetDistance < 155 && this.rabbitAttackCooldown <= 0) {
        this.rabbitAttackCooldown = rand(0.16, 0.36);
        this.performRabbitAttack(target, dir);
      }
    }

    applyFeralIdleBounce(dt) {
      this.sugarTimer -= dt;
      if (this.sugarTimer <= 0) {
        this.sugarTimer = rand(0.11, 0.24);
        this.head.applyImpulse(rand(-6, 6), -rand(5, 13));
        this.head.angularVelocity += rand(-0.18, 0.18);
        const hand = Math.random() < 0.5 ? this.leftHand : this.rightHand;
        const foot = Math.random() < 0.5 ? this.leftFoot : this.rightFoot;
        hand.applyImpulse(rand(-6, 6), rand(-5, 2));
        foot.applyImpulse(rand(-5, 5), -rand(3, 8));
      }
    }

    performRabbitAttack(target, dir) {
      const attack = ["bite", "claw", "kick", "tackle", "headbutt", "scramble"][Math.floor(rand(0, 6))];
      const point = {
        x: lerp(this.head.x, target.head.x, 0.68) + rand(-22, 22),
        y: lerp(this.head.y, target.head.y, 0.58) + rand(-28, 34),
      };
      const forceByAttack = {
        bite: 42,
        claw: 34,
        kick: 52,
        tackle: 62,
        headbutt: 58,
        scramble: 38,
      };
      const typeByAttack = {
        bite: "piercing",
        claw: "slicing",
        kick: "blunt",
        tackle: "crushing",
        headbutt: "blunt",
        scramble: "slicing",
      };
      const radiusByAttack = {
        bite: 42,
        claw: 52,
        kick: 72,
        tackle: 96,
        headbutt: 82,
        scramble: 64,
      };
      const force = forceByAttack[attack] ?? 38;
      const damageType = typeByAttack[attack] ?? "blunt";
      target.applyDamage(damageType, point, {
        force,
        radius: radiusByAttack[attack] ?? 58,
        direction: dir,
      });
      target.head.applyImpulse(dir.x * force * 0.42, dir.y * force * 0.22 - (attack === "tackle" ? 8 : 2), point);
      this.head.applyImpulse(-dir.x * rand(4, 9), -rand(4, 11), target.head);
      this.limp = clamp(this.limp + 0.05, 0, 1);

      if (attack === "tackle" || attack === "headbutt") {
        target.head.angularVelocity += dir.x * rand(0.09, 0.18);
      }
      if (!target.mods?.noGore && (attack === "bite" || attack === "claw" || attack === "scramble")) {
        blood.spawn(damageType === "slicing" ? "directional" : "splat", point.x, point.y, dir, force * 0.8, 22, target.getGoreColor?.());
      }
    }

    getStandSupportPlan() {
      const leftLeg = this.getLimbCondition("leftLeg", "leftFoot");
      const rightLeg = this.getLimbCondition("rightLeg", "rightFoot");
      const leftArm = this.getLimbCondition("leftArm", "leftHand");
      const rightArm = this.getLimbCondition("rightArm", "rightHand");
      const legPairs = [
        { limb: leftLeg, node: this.leftFoot, side: -1 },
        { limb: rightLeg, node: this.rightFoot, side: 1 },
      ].filter(({ limb }) => limb.attached);
      const armPairs = [
        { limb: leftArm, node: this.leftHand, side: -1 },
        { limb: rightArm, node: this.rightHand, side: 1 },
      ].filter(({ limb }) => limb.attached);

      if (legPairs.length > 0) {
        const supports = legPairs.map(({ limb, node, side }) => ({
          node,
          side,
          weight: limb.intact ? 1 : 0.42,
          kind: "leg",
        }));
        const goodLegs = legPairs.filter(({ limb }) => limb.intact).length;
        const mode = legPairs.length === 1 ? "oneLeg" : goodLegs === 0 ? "brokenLegs" : goodLegs === 1 ? "oneLeg" : "standing";
        const targetAngle = mode === "standing"
          ? 0
          : clamp(supports.reduce((sum, support) => sum + support.side * support.weight, 0) * 0.28, -0.42, 0.42);
        return { supports, mode, targetAngle };
      }

      if (armPairs.length > 0) {
        return {
          supports: armPairs.map(({ limb, node, side }) => ({
            node,
            side,
            weight: limb.intact ? 0.72 : 0.3,
            kind: "arm",
          })),
          mode: "arms",
          targetAngle: 0,
        };
      }

      return { supports: [], mode: "helpless", targetAngle: this.head.angle };
    }

    applyStandSupportMotor(plan, motor) {
      const pulse = 0.55 + Math.abs(Math.sin(this.time * 6.5)) * 0.45;
      for (const support of plan.supports) {
        const node = support.node;
        if (!node || this.regions[node.region]?.destroyed || this.regions[node.region]?.severed) continue;
        const brace = support.kind === "arm" ? 0.42 : 0.26;
        if (node.grounded) {
          node.applyImpulse(-support.side * brace * motor * support.weight * pulse, -0.22 * motor * support.weight);
          node.prevX = lerp(node.prevX, node.x, 0.018 * motor * support.weight);
        }
      }
    }

    getLimbCondition(mainRegion, endRegion) {
      const main = this.regions[mainRegion];
      const end = this.regions[endRegion];
      return {
        side: mainRegion.startsWith("left") ? "left" : "right",
        attached: !main.severed && !main.destroyed && !end.severed && !end.destroyed,
        intact: !main.severed && !main.destroyed && !end.severed && !end.destroyed && !main.broken && !end.broken,
        broken: main.broken || end.broken,
      };
    }

    getMobilityLabel() {
      if (this.dead) return "limp";
      const plan = this.getStandSupportPlan();
      if (plan.mode === "standing") return "standing";
      if (plan.mode === "oneLeg") return "slouched limp";
      if (plan.mode === "brokenLegs") return "wobbly stand";
      if (plan.mode === "arms") return "arm brace";
      return "regrowing";
    }

    getFaceDestructionLabel() {
      const exposed = this.facePieces.filter((piece) => facePieceLayer(piece) >= 2 && facePieceLayer(piece) < 5).length;
      const holes = this.facePieces.filter((piece) => facePieceLayer(piece) >= 5).length;
      const healing = this.facePieces.filter((piece) => piece.regenProgress > 0 && piece.regenProgress < 1).length;
      const organPercent = Math.round(clamp(this.headOrganDamage / 120, 0, 1) * 100);
      if (holes > 0) return `${holes} holes, organs ${organPercent}%${healing ? `, healing ${healing}` : ""}`;
      if (exposed > 0) return `${exposed} exposed, organs ${organPercent}%`;
      return `sealed, organs ${organPercent}%`;
    }

    pushFoot(node, x, y) {
      if (!node || this.regions[node.region]?.destroyed || this.regions[node.region]?.severed) return;
      node.applyImpulse(x, y);
    }

    solveSegments(options = {}) {
      const allowDamage = options.allowDamage !== false;
      for (const segment of this.segments) {
        if (segment.severed || segment.destroyed) continue;
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const stretch = dist / segment.length;
        const wobbleScale = clamp((this.mods?.wobbliness ?? 100) / 100, 0.12, 5);
        const stretchLimit = segment.maxStretch * (1 + Math.max(0, wobbleScale - 1) * 0.22);
        if (allowDamage && stretch > stretchLimit && this.regions[segment.region].damage > ClownTuning.damage.fatExpose) {
          this.damageRegion(segment.region, "stretching", { x: b.x, y: b.y }, 18 * (stretch - 1), normalize(dx, dy), { segmentName: segment.name, t: 0.5 });
        }
        const damage = this.regions[segment.region].damage;
        let stiffness = lerp(
          ClownTuning.physics.jointStiffness,
          ClownTuning.physics.damagedJointStiffness,
          clamp(damage / ClownTuning.damage.sever, 0, 1),
        );
        if (typeof segment.a === "string") stiffness = Math.max(stiffness, ClownTuning.physics.rootJointStiffness);
        if (segment.broken || this.regions[segment.region].broken) stiffness *= 0.38;
        if (segment.hanging) stiffness *= 0.16;
        const strengthScale = clamp((this.mods?.strength ?? 100) / 100, 0, 3);
        stiffness *= strengthScale / Math.max(0.28, wobbleScale);
        if (this.mods?.bonesRemoved) stiffness *= 0.07;
        const correction = ((dist - segment.length) / dist) * stiffness;
        const cx = dx * correction;
        const cy = dy * correction;
        if (typeof segment.a === "string") {
          b.x -= cx;
          b.y -= cy;
          const headDx = cx * 0.08;
          const headDy = cy * 0.08;
          this.head.x += headDx;
          this.head.y += headDy;
          this.head.prevX += headDx;
          this.head.prevY += headDy;
          this.head.angularVelocity += cx * 0.00018 * (segment.a.includes("right") ? 1 : -1);
        } else {
          const aParticle = segment.a;
          const am = b.mass / (aParticle.mass + b.mass);
          const bm = aParticle.mass / (aParticle.mass + b.mass);
          aParticle.x += cx * am;
          aParticle.y += cy * am;
          b.x -= cx * bm;
          b.y -= cy * bm;
        }
      }
    }

    updateFragments(dt, room) {
      for (let index = this.fragments.length - 1; index >= 0; index -= 1) {
        const fragment = this.fragments[index];
        const oldX = fragment.x;
        const oldY = fragment.y;
        fragment.x += (fragment.x - fragment.prevX) * 0.984;
        fragment.y += (fragment.y - fragment.prevY) * 0.984 + ClownTuning.physics.gravity * dt * dt;
        fragment.prevX = oldX;
        fragment.prevY = oldY;
        fragment.angle += fragment.spin;
        fragment.life -= dt;
        if (fragment.y + fragment.size > room.floor) {
          const vx = fragment.x - fragment.prevX;
          const vy = fragment.y - fragment.prevY;
          fragment.y = room.floor - fragment.size;
          fragment.prevY = fragment.y + Math.abs(vy) * 0.22;
          fragment.prevX = fragment.x - vx * 0.66;
          blood.addSmear(`fragment-${index}`, fragment.x, room.floor - 2, fragment.size * 0.8, fragment.color ?? COLORS.blood);
        }
        if (fragment.y - fragment.size < room.top) {
          const vy = fragment.y - fragment.prevY;
          fragment.y = room.top + fragment.size;
          fragment.prevY = fragment.y + Math.abs(vy) * 0.22;
          blood.addBoundaryStain(fragment.x, room.top + 3, fragment.size * 0.75, fragment.color ?? COLORS.blood, "ceiling");
        }
        if (fragment.x - fragment.size < room.left) {
          const vx = fragment.x - fragment.prevX;
          fragment.x = room.left + fragment.size;
          fragment.prevX = fragment.x + Math.abs(vx) * 0.24;
          blood.addBoundaryStain(room.left + 3, fragment.y, fragment.size * 0.85, fragment.color ?? COLORS.blood, "leftWall");
        }
        if (fragment.x + fragment.size > room.right) {
          const vx = fragment.x - fragment.prevX;
          fragment.x = room.right - fragment.size;
          fragment.prevX = fragment.x - Math.abs(vx) * 0.24;
          blood.addBoundaryStain(room.right - 3, fragment.y, fragment.size * 0.85, fragment.color ?? COLORS.blood, "rightWall");
        }
        if (fragment.life <= 0) this.fragments.splice(index, 1);
      }
    }

    updateHealing(dt) {
      dt *= this.mods?.regenerate ? 12 : 1;
      const healing = ClownTuning.healing;
      for (const [regionId, region] of Object.entries(this.regions)) {
        const quietTime = this.time - region.lastDamageAt;
        if (quietTime < healing.delay) continue;

        region.bruise = Math.max(0, region.bruise - healing.surfacePerSecond * dt);
        region.burn = Math.max(0, region.burn - healing.surfacePerSecond * 0.65 * dt);
        region.dirt = Math.max(0, region.dirt - healing.surfacePerSecond * 0.85 * dt);

        if (region.severed || region.destroyed) {
          if (quietTime < healing.regrowDelay) continue;
          const regrowSeconds = region.destroyed ? healing.destroyedRegrowSeconds : healing.regrowSeconds;
          region.regenProgress = clamp(region.regenProgress + dt / regrowSeconds, 0, 1);
          this.pullRegionTowardAnchor(regionId, region.regenProgress);
          if (region.regenProgress >= 1) {
            this.restoreRegion(regionId);
          }
          continue;
        }

        region.damage = Math.max(0, region.damage - healing.damagePerSecond * dt);
        region.cutProgress = Math.max(0, region.cutProgress - healing.cutProgressPerSecond * dt);
        region.crushProgress = Math.max(0, region.crushProgress - healing.crushProgressPerSecond * dt);
        if (region.broken && quietTime >= healing.boneHealDelay && region.crushProgress < ClownTuning.damage.boneBreak * 0.35 && region.damage < ClownTuning.damage.boneBreak * 0.45) {
          this.restoreBrokenBones(regionId);
        }
        if (region.wounds.length > 0 && Math.random() < dt * 1.25) {
          region.wounds.shift();
        }
      }
      this.updateFacePieceHealing(dt);
    }

    updateFacePieceHealing(dt) {
      const faceTuning = ClownTuning.face;
      for (const piece of this.facePieces) {
        const quietTime = this.time - piece.lastDamageAt;
        if (quietTime < ClownTuning.healing.delay) continue;

        if (piece.destroyed) {
          if (quietTime < faceTuning.regrowDelay) continue;
          piece.regenProgress = clamp(piece.regenProgress + dt / faceTuning.patchRegrowSeconds, 0, 1);
          piece.damage = lerp(piece.damage, faceTuning.boneExpose * 0.64, 0.012);
          piece.burn = Math.max(0, piece.burn - faceTuning.burnHealPerSecond * 0.38 * dt);
          if (piece.regenProgress >= 1) {
            piece.damage = 0;
            piece.burn = 0;
            piece.dirt = 0;
            piece.layer = 1;
            piece.destroyed = false;
            piece.detached = false;
            piece.regenProgress = 0;
            piece.organReleased = false;
          }
          continue;
        }

        piece.damage = Math.max(0, piece.damage - faceTuning.healPerSecond * dt);
        piece.burn = Math.max(0, piece.burn - faceTuning.burnHealPerSecond * dt);
        piece.dirt = Math.max(0, piece.dirt - ClownTuning.healing.surfacePerSecond * 0.55 * dt);
        piece.layer = facePieceLayer(piece);
        if (piece.layer === 1 && piece.damage <= 0.5) piece.organReleased = false;
      }

      const quietHead = this.time - this.headOrganLastDamageAt;
      if (quietHead > ClownTuning.healing.delay) {
        this.headOrganDamage = Math.max(0, this.headOrganDamage - 5 * dt);
      }
    }

    pullRegionTowardAnchor(regionId, progress) {
      const eased = progress * progress * (3 - 2 * progress);
      const targets = {
        leftArm: { anchor: this.headAnchor("leftShoulder"), nodes: [this.leftElbow, this.leftHand], offsets: [{ x: -62, y: 45 }, { x: -88, y: 105 }] },
        rightArm: { anchor: this.headAnchor("rightShoulder"), nodes: [this.rightElbow, this.rightHand], offsets: [{ x: 62, y: 45 }, { x: 88, y: 105 }] },
        leftHand: { anchor: this.leftElbow, nodes: [this.leftHand], offsets: [{ x: -30, y: 62 }] },
        rightHand: { anchor: this.rightElbow, nodes: [this.rightHand], offsets: [{ x: 30, y: 62 }] },
        leftLeg: { anchor: this.headAnchor("leftHip"), nodes: [this.leftKnee, this.leftFoot], offsets: [{ x: -2, y: 92 }, { x: -28, y: 186 }] },
        rightLeg: { anchor: this.headAnchor("rightHip"), nodes: [this.rightKnee, this.rightFoot], offsets: [{ x: 2, y: 92 }, { x: 28, y: 186 }] },
        leftFoot: { anchor: this.leftKnee, nodes: [this.leftFoot], offsets: [{ x: -30, y: 92 }] },
        rightFoot: { anchor: this.rightKnee, nodes: [this.rightFoot], offsets: [{ x: 30, y: 92 }] },
      };
      const target = targets[regionId];
      if (!target) return;
      target.nodes.forEach((node, index) => {
        if (!node) return;
        const offset = target.offsets[index];
        const desired = { x: target.anchor.x + offset.x, y: target.anchor.y + offset.y };
        const oldX = node.x;
        const oldY = node.y;
        const pull = progress > 0.96 ? 1 : 0.022 + eased * 0.14;
        node.x = lerp(node.x, desired.x, pull);
        node.y = lerp(node.y, desired.y, pull);
        const movedX = node.x - oldX;
        const movedY = node.y - oldY;
        node.prevX += movedX;
        node.prevY += movedY;
        const velocityDamp = 0.48 + eased * 0.42;
        node.prevX = lerp(node.prevX, node.x, velocityDamp);
        node.prevY = lerp(node.prevY, node.y, velocityDamp);
        node.grounded = false;
        node.radius = lerp(node.radius, node.baseRadius, 0.04 + eased * 0.1);
      });
    }

    restoreRegion(regionId) {
      const region = this.regions[regionId];
      if (!region) return;
      region.damage = Math.min(region.damage, ClownTuning.damage.outerBreak * 0.45);
      region.cutProgress = 0;
      region.crushProgress = 0;
      region.regenProgress = 0;
      region.severed = false;
      region.destroyed = false;
      region.broken = false;
      region.wounds.length = 0;
      this.restoreRegionSegments(regionId);
      for (const particle of this.particles) {
        if (particle.region === regionId) {
          particle.radius = particle.baseRadius;
          particle.prevX = particle.x;
          particle.prevY = particle.y;
        }
      }
      const attachedExtremities = {
        leftArm: ["leftHand"],
        rightArm: ["rightHand"],
        leftLeg: ["leftFoot"],
        rightLeg: ["rightFoot"],
      };
      for (const childRegionId of attachedExtremities[regionId] ?? []) {
        this.restoreRegion(childRegionId);
      }
      if (regionId === "headShell" || regionId === "mouthJaw") {
        this.hangingOrgans = this.hangingOrgans.filter((organ) => organ.region !== regionId);
        for (const piece of this.facePieces) {
          if (piece.region !== regionId) continue;
          piece.damage = 0;
          piece.burn = 0;
          piece.dirt = 0;
          piece.layer = 1;
          piece.destroyed = false;
          piece.detached = false;
          piece.regenProgress = 0;
          piece.organReleased = false;
        }
        this.headOrganDamage = Math.max(0, this.headOrganDamage - 34);
        this.dead = false;
        this.autoExpression = "dazed";
        this.expressionTimer = 0.8;
      }
    }

    restoreBrokenBones(regionId) {
      const region = this.regions[regionId];
      if (!region) return;
      region.broken = false;
      region.crushProgress = 0;
      region.damage = Math.min(region.damage, ClownTuning.damage.fatExpose * 0.6);
      for (const segment of this.segments) {
        if (segment.region === regionId) segment.broken = false;
      }
    }

    restoreRegionSegments(regionId) {
      const namesByRegion = {
        leftArm: ["leftUpperArm"],
        rightArm: ["rightUpperArm"],
        leftHand: ["leftForearm"],
        rightHand: ["rightForearm"],
        leftLeg: ["leftThigh"],
        rightLeg: ["rightThigh"],
        leftFoot: ["leftCalf"],
        rightFoot: ["rightCalf"],
      };
      for (const name of namesByRegion[regionId] ?? []) {
        const segment = this.segments.find((candidate) => candidate.name === name);
        if (!segment) continue;
        segment.severed = false;
        segment.destroyed = false;
        segment.broken = false;
        segment.hanging = false;
        segment.hangT = 0.5;
        segment.cutProgress = 0;
      }
    }

    updateGuts(dt, room, physicsOptions = {}) {
      for (const particle of this.guts.particles) {
        particle.integrate(dt, room, physicsOptions);
      }
      const first = this.guts.particles[0];
      if (!this.guts.torn) {
        const anchor = this.headAnchor("gutDoor");
        const stretch = distance(first, anchor) / ClownTuning.organs.intestineLength;
        if (stretch > ClownTuning.organs.tearTension) {
          this.guts.torn = true;
          this.damageRegion("guts", "stretching", first, 42, normalize(first.x - anchor.x, first.y - anchor.y));
          blood.spawn("directional", anchor.x, anchor.y, normalize(first.x - anchor.x, first.y - anchor.y), 22, 28);
        }
      }
    }

    solveGuts() {
      if (!this.guts.torn) {
        this.solveGutAnchor();
      }
      for (const constraint of this.guts.constraints) {
        const dx = constraint.b.x - constraint.a.x;
        const dy = constraint.b.y - constraint.a.y;
        const dist = Math.hypot(dx, dy) || 1;
        const correction = ((dist - constraint.length) / dist) * ClownTuning.organs.stiffness;
        const cx = dx * correction * 0.5;
        const cy = dy * correction * 0.5;
        constraint.a.x += cx;
        constraint.a.y += cy;
        constraint.b.x -= cx;
        constraint.b.y -= cy;
      }
    }

    solveGutAnchor() {
      const first = this.guts.particles[0];
      const anchor = this.headAnchor("gutDoor");
      const dx = first.x - anchor.x;
      const dy = first.y - anchor.y;
      const dist = Math.hypot(dx, dy) || 1;
      const correction = ((dist - ClownTuning.organs.intestineLength * 0.8) / dist) * ClownTuning.organs.stiffness;
      first.x -= dx * correction;
      first.y -= dy * correction;
      this.head.x += dx * correction * 0.025;
      this.head.y += dy * correction * 0.025;
    }

    updateBleeding(dt) {
      for (const [regionId, region] of Object.entries(this.regions)) {
        const layer = layerFromDamage(regionId, region.damage);
        if (layer < 2 || region.destroyed) continue;
        const chance = dt * 0.42 * (layer - 1) * ClownTuning.blood.amount;
        if (Math.random() < chance) {
          const point = this.randomRegionPoint(regionId);
          blood.spawn("drip", point.x, point.y, { x: 0, y: 1 }, 4, layer + 1);
        }
      }

      if (this.guts.exposed) {
        for (const particle of this.guts.particles) {
          if (particle.grounded && Math.random() < dt * 7) {
            blood.addSmear(`gut-${particle.name}`, particle.x, this.room.floor - 3, 11, this.getGoreColor() ?? COLORS.blood);
          }
        }
      }
    }

    updateSelfStains(dt) {
      for (let index = this.selfStains.length - 1; index >= 0; index -= 1) {
        const stain = this.selfStains[index];
        stain.life -= dt;
        stain.alpha = Math.min(stain.alpha, clamp(stain.life / ClownTuning.blood.selfStainFade, 0, 1) * 0.72);
        if (stain.life <= 0) this.selfStains.splice(index, 1);
      }
    }

    updateHangingOrgans(dt, room, physicsOptions = {}) {
      for (let index = this.hangingOrgans.length - 1; index >= 0; index -= 1) {
        const organ = this.hangingOrgans[index];
        const oldX = organ.x;
        const oldY = organ.y;
        organ.x += (organ.x - organ.prevX) * 0.982;
        organ.y += (organ.y - organ.prevY) * 0.982 + ClownTuning.physics.gravity * (physicsOptions.gravityScale ?? 1) * dt * dt;
        organ.prevX = oldX;
        organ.prevY = oldY;
        organ.angle += organ.spin * dt;

        if (!organ.detached) {
          const anchor = this.headFeatureAnchor(organ.anchor);
          const dx = organ.x - anchor.x;
          const dy = organ.y - anchor.y;
          const dist = Math.hypot(dx, dy) || 1;
          const correction = Math.max(0, dist - organ.length) / dist;
          organ.x -= dx * correction * 0.45;
          organ.y -= dy * correction * 0.45;
          this.head.x += dx * correction * 0.012;
          this.head.y += dy * correction * 0.012;
          if (dist > organ.length * 2.2) {
            this.damageHangingOrgan(organ, "stretching", dt * 80, normalize(dx, dy));
          }
        }

        const radius = organ.size;
        if (organ.y + radius > room.floor) {
          const vx = organ.x - organ.prevX;
          const vy = organ.y - organ.prevY;
          organ.y = room.floor - radius;
          organ.prevY = organ.y + Math.abs(vy) * 0.2;
          organ.prevX = organ.x - vx * 0.55;
          if (Math.random() < dt * 10) blood.addSmear(`organ-${organ.id}`, organ.x, room.floor - 2, organ.size * 1.15, this.getGoreColor() ?? organ.color);
        }
        if (organ.x - radius < room.left) organ.x = room.left + radius;
        if (organ.x + radius > room.right) organ.x = room.right - radius;
        if (organ.y - radius < room.top) organ.y = room.top + radius;
      }
    }

    decaySurfaceMarks(dt) {
      for (const region of Object.values(this.regions)) {
        region.bruise = Math.max(0, region.bruise - dt * 0.18);
        region.dirt = Math.max(0, region.dirt - dt * 0.08);
      }
    }

    randomRegionPoint(regionId) {
      if (regionId === "headShell" || regionId === "mouthJaw") {
        const angle = rand(0, TAU);
        const radius = Math.sqrt(Math.random());
        return this.head.anchor({
          x: Math.cos(angle) * this.head.radiusX * radius * 0.68,
          y: Math.sin(angle) * this.head.radiusY * radius * 0.68 + (regionId === "mouthJaw" ? 26 : 0),
        });
      }
      if (regionId === "guts" && this.guts.exposed) {
        return this.guts.particles[Math.floor(rand(0, this.guts.particles.length))];
      }
      const segment = this.segments.find((candidate) => candidate.region === regionId && !candidate.severed);
      if (segment) {
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const t = Math.random();
        return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
      }
      const particle = this.particles.find((candidate) => candidate.region === regionId);
      return particle ? { x: particle.x, y: particle.y } : { x: this.head.x, y: this.head.y };
    }

    addBloodStainFromWorld(point, size = 6) {
      if (this.selfStains.length > 80) this.selfStains.shift();
      const local = worldToLocal(point, this.head, this.head.angle);
      const normalized = (local.x * local.x) / (this.head.radiusX * this.head.radiusX) + (local.y * local.y) / (this.head.radiusY * this.head.radiusY);
      if (normalized <= 1.04) {
        this.selfStains.push({
          kind: "head",
          x: local.x,
          y: local.y,
          rx: size * rand(1.1, 2.5),
          ry: size * rand(0.45, 1.2),
          angle: rand(0, TAU),
          alpha: rand(0.36, 0.72),
          color: point.color ?? this.getGoreColor?.(size) ?? COLORS.blood,
          life: ClownTuning.blood.selfStainFade,
        });
        return true;
      }

      for (const segment of this.segments) {
        if (segment.severed || segment.destroyed) continue;
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const info = pointSegmentInfo(point, a, b);
        if (info.distance <= segment.radius + size * 0.75) {
          this.selfStains.push({
            kind: "segment",
            segmentName: segment.name,
            t: info.t,
            side: randomSign(),
            rx: size * rand(0.9, 1.8),
            ry: size * rand(0.35, 0.9),
          angle: rand(0, TAU),
          alpha: rand(0.32, 0.62),
          color: point.color ?? this.getGoreColor?.(size) ?? COLORS.blood,
          life: ClownTuning.blood.selfStainFade,
        });
          return true;
        }
      }
      return false;
    }

    hitTest(point, radius = 24) {
      const hits = [];
      const local = worldToLocal(point, this.head, this.head.angle);
      const featureLocal = this.worldToHeadFeatureLocal(point);
      const normalized = (local.x * local.x) / (this.head.radiusX * this.head.radiusX) + (local.y * local.y) / (this.head.radiusY * this.head.radiusY);
      if (normalized <= 1.26 || Math.abs(normalized - 1) * 44 < radius) {
        const region = featureLocal.y > 28 && Math.abs(featureLocal.x) < 58 ? "mouthJaw" : "headShell";
        hits.push({
          region,
          strength: clamp(1.26 - normalized, 0.25, 1),
          target: "head",
          localX: featureLocal.x,
          localY: featureLocal.y,
        });
      }

      for (const particle of this.particles) {
        if (this.regions[particle.region]?.destroyed) continue;
        const dist = distance(point, particle);
        if (dist <= particle.radius + radius * 0.65) {
          hits.push({
            region: particle.region,
            strength: clamp(1 - dist / (particle.radius + radius), 0.15, 1),
            target: particle,
            particle,
          });
        }
      }

      if (this.guts.exposed) {
        for (const particle of this.guts.particles) {
          const dist = distance(point, particle);
          if (dist <= particle.radius + radius * 0.75) {
            hits.push({
              region: "guts",
              strength: clamp(1 - dist / (particle.radius + radius), 0.12, 1),
              target: particle,
              particle,
            });
          }
        }
      }

      for (const organ of this.hangingOrgans) {
        const dist = distance(point, organ);
        if (dist <= organ.size + radius * 0.75) {
          hits.push({
            region: organ.region,
            strength: clamp(1 - dist / (organ.size + radius), 0.14, 1),
            target: organ,
            hangingOrgan: organ,
          });
        }
      }

      for (const segment of this.segments) {
        if (segment.severed || segment.destroyed || this.regions[segment.region]?.destroyed) continue;
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const info = pointSegmentInfo(point, a, b);
        if (info.distance <= segment.radius + radius * 0.55) {
          hits.push({
            region: segment.region,
            strength: clamp(1 - info.distance / (segment.radius + radius), 0.12, 1),
            target: segment,
            segment,
            segmentName: segment.name,
            t: info.t,
            side: randomSign(),
          });
        }
      }

      hits.sort((a, b) => b.strength - a.strength);
      return hits.slice(0, 4);
    }

    getGrabTarget(point) {
      let best = null;
      let bestDist = 58;
      if (this.guts.exposed) {
        for (const particle of this.guts.particles) {
          const dist = distance(point, particle);
          if (dist < bestDist) {
            best = { type: "particle", node: particle, region: "guts" };
            bestDist = dist;
          }
        }
      }
      for (const organ of this.hangingOrgans) {
        const dist = distance(point, organ);
        if (dist < bestDist + organ.size * 0.5) {
          best = { type: "organ", node: organ, region: organ.region };
          bestDist = dist;
        }
      }
      for (const particle of this.particles) {
        if (this.regions[particle.region]?.destroyed) continue;
        const dist = distance(point, particle);
        if (dist < bestDist) {
          best = { type: "particle", node: particle, region: particle.region };
          bestDist = dist;
        }
      }
      for (const fragment of this.fragments) {
        const dist = distance(point, fragment);
        if (dist < bestDist + fragment.size * 0.4) {
          best = { type: "fragment", node: fragment, region: "debris" };
          bestDist = dist;
        }
      }
      if (blood) {
        for (const chunk of blood.chunks) {
          const dist = distance(point, chunk);
          if (dist < bestDist + chunk.size * 0.45) {
            best = { type: "chunk", node: chunk, region: "chunk" };
            bestDist = dist;
          }
        }
      }
      const local = worldToLocal(point, this.head, this.head.angle);
      const featureLocal = this.worldToHeadFeatureLocal(point);
      const normalized = (local.x * local.x) / (this.head.radiusX * this.head.radiusX) + (local.y * local.y) / (this.head.radiusY * this.head.radiusY);
      if (normalized <= 1.1 && Math.sqrt(normalized) * Math.max(this.head.radiusX, this.head.radiusY) < bestDist + 52) {
        best = { type: "head", node: this.head, region: "headShell", localX: featureLocal.x, localY: featureLocal.y };
      }
      return best;
    }

    applyGrab(grab, target, dt) {
      if (!grab) return;
      const node = grab.node;
      const dx = target.x - node.x;
      const dy = target.y - node.y;
      const pull = clamp(Math.hypot(dx, dy) * 0.048, 0, 8);
      const dir = normalize(dx, dy);
      if (grab.type === "fragment") {
        this.pullLooseFragment(node, target, dt);
      } else if (grab.type === "chunk") {
        this.pullLooseChunk(node, target, dt);
      } else if (grab.type === "organ") {
        this.pullLooseOrgan(node, target, dt);
      } else if (grab.type === "head") {
        this.head.applyImpulse(dir.x * pull * 1.25, dir.y * pull * 1.25, target);
        this.head.angularVelocity += clamp(dx * 0.0009, -0.035, 0.035);
      } else {
        node.applyImpulse(dir.x * pull * 1.8, dir.y * pull * 1.8);
      }

      if (grab.type === "fragment" || grab.type === "chunk" || grab.type === "organ") {
        if (node.y + node.size > this.room.floor - 8 && Math.random() < dt * 22) {
          blood.addSmear(`grab-${grab.type}-${node.type ?? "chunk"}-${Math.round(node.size)}`, node.x, this.room.floor - 2, node.size * 1.2, this.getGoreColor() ?? node.color ?? COLORS.blood);
        }
        if (grab.type === "organ" && Math.hypot(dx, dy) > node.length + 52) {
          this.damageHangingOrgan(node, "stretching", dt * 95, dir);
        }
        return;
      }

      if (Math.hypot(dx, dy) > 110) {
        this.damageRegion(grab.region, "stretching", { x: node.x, y: node.y }, dt * 38, dir, grab.type === "head" ? { localX: grab.localX, localY: grab.localY } : {});
      }
      if ((node.grounded || this.head.grounded) && Math.random() < dt * 28) {
        blood.addSmear(`drag-${grab.region}`, node.x, this.room.floor - 2, 18, this.getGoreColor() ?? COLORS.blood);
        this.damageRegion(grab.region, "dragging", { x: node.x, y: node.y }, dt * 18, dir);
      }
    }

    pullLooseFragment(fragment, target, dt) {
      const dx = target.x - fragment.x;
      const dy = target.y - fragment.y;
      const oldX = fragment.x;
      const oldY = fragment.y;
      const pull = clamp(0.18 + dt * 8, 0.18, 0.42);
      fragment.x += dx * pull;
      fragment.y += dy * pull;
      fragment.prevX += fragment.x - oldX;
      fragment.prevY += fragment.y - oldY;
      fragment.prevX = lerp(fragment.prevX, fragment.x, 0.36);
      fragment.prevY = lerp(fragment.prevY, fragment.y, 0.36);
      fragment.spin *= 0.9;
    }

    pullLooseChunk(chunk, target, dt) {
      const dx = target.x - chunk.x;
      const dy = target.y - chunk.y;
      const pull = clamp(0.16 + dt * 7, 0.16, 0.38);
      chunk.x += dx * pull;
      chunk.y += dy * pull;
      chunk.vx = lerp(chunk.vx, dx * 7, 0.32);
      chunk.vy = lerp(chunk.vy, dy * 7, 0.32);
      chunk.spin *= 0.88;
    }

    pullLooseOrgan(organ, target, dt) {
      const dx = target.x - organ.x;
      const dy = target.y - organ.y;
      const oldX = organ.x;
      const oldY = organ.y;
      const pull = clamp(0.12 + dt * 6, 0.12, 0.34);
      organ.x += dx * pull;
      organ.y += dy * pull;
      organ.prevX += organ.x - oldX;
      organ.prevY += organ.y - oldY;
      organ.prevX = lerp(organ.prevX, organ.x, 0.24);
      organ.prevY = lerp(organ.prevY, organ.y, 0.24);
      organ.spin *= 0.92;
    }

    applyDamage(type, point, options = {}) {
      const force = options.force ?? 26;
      const radius = options.radius ?? 28;
      const direction = normalize(options.direction?.x ?? this.head.x - point.x, options.direction?.y ?? this.head.y - point.y);
      const hits = this.hitTest(point, radius);
      if (!hits.length) {
        const featureLocal = this.worldToHeadFeatureLocal(point);
        hits.push({
          region: "headShell",
          strength: 0.28,
          target: "head",
          localX: featureLocal.x,
          localY: featureLocal.y,
        });
      }
      const unique = new Set();
      for (const hit of hits) {
        if (unique.has(hit.region) && type !== "explosion") continue;
        unique.add(hit.region);
        if (type === "slicing" && hit.segmentName) {
          this.markSegmentCut(hit.segmentName, hit.t ?? 0.5, force * hit.strength);
        }
        if (hit.hangingOrgan) {
          this.damageHangingOrgan(hit.hangingOrgan, type, force * hit.strength, direction);
        }
        this.damageRegion(hit.region, type, point, force * hit.strength, direction, hit);
      }
    }

    damageRegion(regionId, type, point, force, direction = { x: 0, y: -1 }, hit = {}) {
      const region = this.regions[regionId];
      if (!region || region.destroyed) return;
      if ((type === "burning" || type === "electric") && this.mods?.fireproof) {
        this.setPainExpression("angry", 6);
        return;
      }
      const scale = ClownTuning.damage.typeScale[type] ?? 1;
      const resistanceScale = 1 - clamp((this.mods?.damageResistance ?? 0) / 100, 0, 1);
      const healthScale = DEFAULT_MOD_SETTINGS.health / Math.max(1, this.mods?.health ?? DEFAULT_MOD_SETTINGS.health);
      const worldDamageScale = state.mode === "sandbox" ? (state.sandboxWorld.damageMultiplier ?? 100) / 100 : 1;
      const amount = Math.max(0, force * scale * resistanceScale * healthScale * worldDamageScale);
      if (amount <= 0.02) return;
      if (this.mods?.groupPanic) this.triggerGroupPanic();
      const wasGutsExposed = this.guts.exposed;
      const wasSevered = region.severed;
      const wasBroken = region.broken;
      const wasDestroyed = region.destroyed;

      region.lastDamageAt = this.time;
      region.regenProgress = 0;
      const maxDamage = this.mods?.invincible ? ClownTuning.damage.destroy * 0.72 : 320;
      region.damage = clamp(region.damage + amount, 0, maxDamage);
      if (type === "slicing") region.cutProgress = clamp(region.cutProgress + amount * (hit.segmentName ? 1.25 : 0.78), 0, 260);
      if ((type === "stretching" || type === "dragging") && hit.segmentName) {
        this.markSegmentCut(hit.segmentName, hit.t ?? 0.5, amount * 0.34);
      }
      if (type === "crushing" || type === "blunt" || type === "explosion") {
        region.crushProgress = clamp(region.crushProgress + amount * (type === "crushing" ? 1.35 : 0.54), 0, 260);
      }
      if (type === "blunt") region.bruise = clamp(region.bruise + amount * 0.55, 0, 110);
      if (type === "burning") region.burn = clamp(region.burn + amount * 0.9, 0, 140);
      if (type === "dragging") region.dirt = clamp(region.dirt + amount * 0.62, 0, 100);
      if (this.mods?.explosiveBody && this.explosiveBodyCooldown <= 0 && amount > 18) {
        const windowSeconds = 0.48;
        this.explosiveBodyHits = (this.explosiveBodyHits ?? []).filter((hitRecord) => this.time - hitRecord.time <= windowSeconds);
        this.explosiveBodyHits.push({ time: this.time, amount, point: { x: point.x, y: point.y } });
        const burstAmount = this.explosiveBodyHits.reduce((sum, hitRecord) => sum + hitRecord.amount, 0);
        if (this.explosiveBodyHits.length >= 3 || (this.explosiveBodyHits.length >= 2 && burstAmount >= 150)) {
          this.explosiveBodyCooldown = 1.8;
          this.explosiveBodyHits.length = 0;
          hazards.spawnExplosion(point.x, point.y);
          this.mods.regenerate = true;
        }
      }
      if (this.mods?.chainReactionBody && amount > 62) {
        for (const other of getCharacters()) {
          if (other === this || distance(other.head, this.head) > 260) continue;
          const away = normalize(other.head.x - this.head.x, other.head.y - this.head.y);
          other.head.applyImpulse(away.x * amount * 0.22, away.y * amount * 0.12 - 5, this.head);
          if (other.mods?.groupPanic) other.triggerTemporaryPanic?.(rand(1.8, 3.2));
        }
      }
      if (this.mods?.balloonMode && (amount > 110 || (this.mods.inflate ?? 0) > 245)) {
        this.popBody(point, direction);
      }

      if (this.mods?.noGore) {
        region.damage = Math.min(region.damage, ClownTuning.damage.outerBreak * 0.75);
        region.cutProgress = 0;
        region.crushProgress = Math.min(region.crushProgress, ClownTuning.damage.outerBreak * 0.8);
        this.reactPhysically(regionId, type, point, amount, direction, hit);
        this.spawnDamageEffects(regionId, type, point, amount, direction, 1);
        this.setPainExpression(type, amount);
        emitClownDamageEvent({
          actor: this,
          type,
          regionId,
          amount,
          point: { x: point.x, y: point.y },
          direction,
          layer: 1,
          goreAmount: 0,
          causedGutSpill: false,
          causedSever: false,
          causedBreak: false,
          causedDestroy: false,
          launchHeight: this.room.floor - this.head.y,
          ceilingHit: this.head.y - Math.max(this.head.radiusX, this.head.radiusY) <= this.room.top + 8,
        });
        return;
      }

      const regionLayer = layerFromDamage(regionId, region.damage);
      const faceResult = (regionId === "headShell" || regionId === "mouthJaw")
        ? this.damageFacePieces(regionId, type, point, amount, direction, hit)
        : { maxLayer: regionLayer, goreAmount: 0, openedCavity: false };
      const layer = Math.max(regionLayer, faceResult.maxLayer);
      const wound = this.createWound(regionId, type, point, amount, layer, hit, direction);
      if (wound) {
        region.wounds.push(wound);
        if (region.wounds.length > 18) region.wounds.shift();
      }

      this.reactPhysically(regionId, type, point, amount, direction, hit);
      const goreAmount = this.spawnDamageEffects(regionId, type, point, amount, direction, layer) + faceResult.goreAmount;
      this.setPainExpression(type, amount);

      if (
        (regionId === "headShell" || regionId === "mouthJaw") &&
        (region.damage >= ClownTuning.organs.spillDamage || faceResult.openedCavity || this.headOrganDamage >= ClownTuning.face.organSpillDamage)
      ) {
        this.spillGuts(point, direction);
      }
      if (
        this.canBreak(regionId) &&
        !region.broken &&
        (region.damage >= ClownTuning.damage.boneBreak || region.crushProgress >= ClownTuning.damage.boneBreak || (type === "crushing" && amount > 36))
      ) {
        this.breakRegionBones(regionId, point, direction, hit);
      }
      if (
        this.canSever(regionId) &&
        !(hit.segmentName && (type === "slicing" || type === "stretching" || type === "dragging")) &&
        (
          (type === "slicing" && region.cutProgress >= ClownTuning.damage.cutSever) ||
          (type === "stretching" && region.damage >= ClownTuning.damage.sever) ||
          (type === "explosion" && region.damage >= ClownTuning.damage.sever)
        )
      ) {
        this.severRegion(regionId, point, direction);
      }
      if (
        !this.mods?.invincible &&
        (
          (regionId === "mouthJaw" && (region.cutProgress >= ClownTuning.damage.cutSever || region.crushProgress >= ClownTuning.damage.sever)) ||
          (regionId === "headShell" && type === "slicing" && region.cutProgress >= ClownTuning.damage.sever)
        )
      ) {
        this.decapitateHeadPart(regionId, point, direction);
      }
      if (
        !this.mods?.invincible &&
        !region.destroyed &&
        this.canDestroy(regionId) &&
        (region.damage >= ClownTuning.damage.destroy || (type === "explosion" && amount > 88) || (type === "crushing" && region.crushProgress >= ClownTuning.damage.gib))
      ) {
        this.destroyRegion(regionId, point, direction);
      }
      if (!this.mods?.invincible && (type === "explosion" || type === "crushing") && region.damage >= ClownTuning.damage.gib && regionId === "headShell") {
        this.dead = true;
        this.autoExpression = "dead";
        this.expressionTimer = 2;
        blood.spawnChunk(point.x, point.y, direction, 12);
      }

      emitClownDamageEvent({
        actor: this,
        type,
        regionId,
        amount,
        point: { x: point.x, y: point.y },
        direction,
        layer,
        goreAmount,
        causedGutSpill: !wasGutsExposed && this.guts.exposed,
        causedSever: !wasSevered && region.severed,
        causedBreak: !wasBroken && region.broken,
        causedDestroy: !wasDestroyed && region.destroyed,
        launchHeight: this.room.floor - this.head.y,
        ceilingHit: this.head.y - Math.max(this.head.radiusX, this.head.radiusY) <= this.room.top + 8,
      });
    }

    createWound(regionId, type, point, amount, layer, hit, direction) {
      const size = clamp(7 + amount * 0.42 + layer * 3, 7, 54);
      const wound = {
        region: regionId,
        type,
        size,
        layer,
        style: this.mods?.damageStyle ?? "Gore",
        goreColor: this.getGoreColor() ?? null,
        angle: Math.atan2(direction.y, direction.x) + HALF_PI + rand(-0.32, 0.32),
        age: 0,
      };
      if (hit.segmentName) {
        wound.segmentName = hit.segmentName;
        wound.t = hit.t ?? 0.5;
        wound.side = hit.side ?? randomSign();
      } else if (hit.localX !== undefined) {
        wound.localX = clamp(hit.localX, -this.head.baseRadiusX * 0.95, this.head.baseRadiusX * 0.95);
        wound.localY = clamp(hit.localY, -this.head.baseRadiusY * 0.95, this.head.baseRadiusY * 0.95);
      } else {
        wound.x = point.x;
        wound.y = point.y;
      }
      return wound;
    }

    damageFacePieces(regionId, type, point, amount, direction, hit) {
      const local = hit.localX !== undefined
        ? { x: hit.localX, y: hit.localY }
        : this.worldToHeadFeatureLocal(point);
      const candidates = [];
      for (const piece of this.facePieces) {
        const dx = local.x - piece.x;
        const dy = local.y - piece.y;
        const rotated = rotatePoint(dx, dy, -piece.angle);
        const normalized = (rotated.x * rotated.x) / (piece.rx * piece.rx) + (rotated.y * rotated.y) / (piece.ry * piece.ry);
        let influence = normalized <= 1
          ? 1
          : clamp(1 - (Math.sqrt(normalized) - 1) * 1.45, 0, 1);
        if (type === "explosion") {
          influence = Math.max(influence, clamp(1 - Math.hypot(dx, dy) / 150, 0, 0.9));
        }
        if (piece.region !== regionId) influence *= 0.45;
        if (regionId === "mouthJaw" && piece.y < 12) influence *= 0.35;
        if (regionId === "headShell" && piece.y > 52) influence *= 0.55;
        if (influence > 0.06) candidates.push({ piece, influence, distance: Math.hypot(dx, dy) });
      }

      if (!candidates.length) {
        let nearest = null;
        for (const piece of this.facePieces) {
          const dist = Math.hypot(local.x - piece.x, local.y - piece.y);
          if (!nearest || dist < nearest.distance) nearest = { piece, distance: dist };
        }
        if (nearest) candidates.push({ piece: nearest.piece, influence: 0.28, distance: nearest.distance });
      }

      candidates.sort((a, b) => b.influence - a.influence);
      const typeFactor = {
        blunt: 1.08,
        slicing: 1.08,
        piercing: 1.0,
        crushing: 1.28,
        burning: 2.1,
        explosion: 1.36,
        dragging: 0.38,
        stretching: 0.48,
        dismemberment: 1.6,
      }[type] ?? 1;
      const maxPieces = type === "explosion" || type === "burning" ? candidates.length : Math.min(candidates.length, 3);
      let maxLayer = 1;
      let goreAmount = 0;
      let openedCavity = false;

      for (let index = 0; index < maxPieces; index += 1) {
        const { piece, influence } = candidates[index];
        const oldLayer = facePieceLayer(piece);
        const oldDestroyed = piece.destroyed;
        const directDamage = amount * influence * typeFactor;

        piece.lastDamageAt = this.time;
        piece.regenProgress = 0;
        piece.damage = clamp(piece.damage + directDamage, 0, ClownTuning.face.pieceDestroy + 70);
        if (type === "burning") piece.burn = clamp(piece.burn + directDamage * 1.22, 0, 220);
        if (type === "dragging") piece.dirt = clamp(piece.dirt + directDamage * 0.62, 0, 100);
        if (type === "blunt" || type === "crushing") piece.damage = clamp(piece.damage + directDamage * 0.22, 0, ClownTuning.face.pieceDestroy + 70);
        if (type === "piercing") piece.damage = clamp(piece.damage + directDamage * 0.16, 0, ClownTuning.face.pieceDestroy + 70);

        const structuralDamage = Math.max(piece.damage, piece.burn * 1.08);
        if (
          structuralDamage >= ClownTuning.face.cavityOpen ||
          piece.damage >= ClownTuning.face.pieceDestroy ||
          piece.burn >= 135 ||
          (type === "explosion" && directDamage > 72)
        ) {
          piece.destroyed = true;
        }
        if (!piece.detached && type === "slicing" && structuralDamage >= ClownTuning.face.boneExpose && directDamage > 16) {
          piece.detached = true;
          piece.destroyed = true;
          const origin = this.headFeatureAnchor({ x: piece.x, y: piece.y });
          this.spawnBodyFragment("facePlate", origin.x, origin.y, direction, Math.max(piece.rx, piece.ry) * 0.86, COLORS.face);
        }
        piece.layer = facePieceLayer(piece);
        maxLayer = Math.max(maxLayer, piece.layer);

        if (piece.layer > oldLayer || piece.destroyed !== oldDestroyed) {
          this.spawnFacePieceBreak(piece, type, direction, piece.layer, directDamage);
        }

        if (piece.layer >= 3) goreAmount += directDamage * 0.12;
        if (piece.layer >= 5) {
          openedCavity = true;
          this.headOrganDamage = clamp(this.headOrganDamage + directDamage * (piece.organPocket ? 0.42 : 0.18), 0, 120);
          this.headOrganLastDamageAt = this.time;
          goreAmount += directDamage * 0.28;
          if (Math.random() < 0.34) {
            const origin = this.headFeatureAnchor({ x: piece.x + rand(-piece.rx * 0.25, piece.rx * 0.25), y: piece.y + rand(-piece.ry * 0.25, piece.ry * 0.25) });
            blood.spawn("drip", origin.x, origin.y, { x: 0, y: 1 }, 8, 5);
          }
          if (piece.organPocket && !piece.organReleased && (piece.destroyed || directDamage > 18)) {
            piece.organReleased = true;
            this.releaseFaceOrgan(piece, direction, directDamage);
          } else if (piece.organPocket && piece.organReleased && directDamage > 8) {
            this.releaseFaceOrgan(piece, direction, directDamage);
          }
        }
      }

      return { maxLayer, goreAmount, openedCavity };
    }

    spawnFacePieceBreak(piece, type, direction, layer, amount) {
      const origin = this.headFeatureAnchor({
        x: piece.x + rand(-piece.rx * 0.22, piece.rx * 0.22),
        y: piece.y + rand(-piece.ry * 0.22, piece.ry * 0.22),
      });
      const color = layer >= 5 ? COLORS.gut : layer === 4 ? COLORS.bone : layer === 3 ? COLORS.muscle : COLORS.fat;
      const fragmentCount = clamp(Math.floor(amount / 24) + (layer >= 5 ? 3 : 1), 2, 8);
      for (let index = 0; index < fragmentCount; index += 1) {
        this.spawnBodyFragment(layer >= 4 ? "bone" : "tissue", origin.x, origin.y, direction, rand(7, layer >= 5 ? 19 : 14), color);
      }
      if (type === "burning") {
        blood.addStain(origin.x, origin.y, clamp(amount * 0.38, 12, 42), COLORS.soot, "soot");
      } else if (layer >= 5) {
        blood.spawn("splat", origin.x, origin.y, direction, amount, 18);
        blood.spawnChunk(origin.x, origin.y, direction, 3);
      } else if (layer >= 3) {
        blood.spawn("directional", origin.x, origin.y, direction, amount * 0.65, 8);
      }
    }

    releaseFaceOrgan(piece, direction, amount) {
      if (this.mods?.noGore) return;
      const organType = piece.organType ?? "organ";
      const origin = this.headFeatureAnchor({
        x: piece.x + rand(-piece.rx * 0.18, piece.rx * 0.18),
        y: piece.y + rand(-piece.ry * 0.18, piece.ry * 0.18),
      });
      const colorByOrgan = {
        eye: COLORS.teeth,
        brain: COLORS.brain,
        heart: COLORS.heart,
        kidney: COLORS.kidney,
        guts: COLORS.gut,
        organ: COLORS.gut,
      };
      const type = piece.id === "leftEye" || piece.id === "rightEye"
        ? "eye"
        : organType === "guts"
          ? "organ"
          : organType;
      const existing = this.hangingOrgans.find((organ) => organ.pieceId === piece.id && !organ.detached);
      if (existing) {
        this.damageHangingOrgan(existing, "blunt", amount, direction);
        return;
      }
      const anchor = { x: piece.x, y: piece.y };
      this.hangingOrgans.push({
        id: `${piece.id}-${Math.round(this.time * 1000)}-${this.hangingOrgans.length}`,
        pieceId: piece.id,
        region: piece.region,
        type,
        color: colorByOrgan[type] ?? colorByOrgan[organType] ?? COLORS.gut,
        anchor,
        x: origin.x + direction.x * rand(8, 18),
        y: origin.y + direction.y * rand(8, 18),
        prevX: origin.x - direction.x * rand(8, 18),
        prevY: origin.y - direction.y * rand(8, 18),
        size: type === "eye" ? 17 : type === "brain" ? 22 : type === "heart" ? 20 : 18,
        length: type === "eye" ? 34 : type === "organ" ? 58 : 42,
        damage: amount * 0.42,
        detachDamage: type === "eye" ? 78 : type === "brain" ? 110 : 96,
        angle: rand(0, TAU),
        spin: rand(-3, 3),
        detached: false,
      });
      blood.spawn("splat", origin.x, origin.y, direction, amount * 0.55, type === "eye" ? 10 : 18);
    }

    damageHangingOrgan(organ, type, amount, direction) {
      if (!organ || organ.detached) return;
      const scaleByType = {
        blunt: 0.95,
        slicing: 1.45,
        piercing: 1.1,
        crushing: 1.35,
        explosion: 1.8,
        stretching: 1.3,
        dragging: 0.42,
      };
      organ.damage += amount * (scaleByType[type] ?? 1);
      organ.prevX -= direction.x * amount * 0.08;
      organ.prevY -= direction.y * amount * 0.08;
      blood.spawn(type === "slicing" ? "directional" : "splat", organ.x, organ.y, direction, amount * 0.45, clamp(amount * 0.35, 3, 24));
      if (organ.damage >= organ.detachDamage || type === "explosion" || (type === "slicing" && amount > 34)) {
        this.detachHangingOrgan(organ, direction);
      }
    }

    detachHangingOrgan(organ, direction) {
      if (!organ || organ.detached) return;
      organ.detached = true;
      this.spawnBodyFragment(organ.type, organ.x, organ.y, direction, organ.size * 1.25, organ.color);
      blood.spawn("directional", organ.x, organ.y, direction, 42, 28);
      blood.spawnChunk(organ.x, organ.y, direction, 3);
      const index = this.hangingOrgans.indexOf(organ);
      if (index >= 0) this.hangingOrgans.splice(index, 1);
    }

    reactPhysically(regionId, type, point, amount, direction, hit) {
      const impulse = amount * (type === "explosion" ? 1.15 : type === "spring" ? 1.8 : 0.38);
      if (hit?.particle) {
        hit.particle.applyImpulse(direction.x * impulse * 0.75, direction.y * impulse * 0.75);
      } else if (hit?.target && hit.target !== "head" && hit.target.b) {
        hit.target.b.applyImpulse(direction.x * impulse * 0.42, direction.y * impulse * 0.42);
      } else if (regionId === "guts" && this.guts.exposed) {
        const gut = this.guts.particles[Math.floor(rand(0, this.guts.particles.length))];
        gut.applyImpulse(direction.x * impulse, direction.y * impulse);
      } else {
        this.head.applyImpulse(direction.x * impulse, direction.y * impulse, point);
      }

      if (type === "blunt" || type === "crushing") {
        this.head.squashX = clamp(this.head.squashX + amount * 0.0035, 0.72, 1.32);
        this.head.squashY = clamp(this.head.squashY - amount * 0.0028, 0.66, 1.26);
      }
      if (type === "explosion") {
        this.head.angularVelocity += rand(-0.22, 0.22);
        for (const particle of this.particles) {
          const dir = normalize(particle.x - point.x, particle.y - point.y);
          particle.applyImpulse(dir.x * amount * rand(0.18, 0.42), dir.y * amount * rand(0.18, 0.42));
        }
        if (this.guts.exposed) {
          for (const particle of this.guts.particles) {
            const dir = normalize(particle.x - point.x, particle.y - point.y);
            particle.applyImpulse(dir.x * amount * rand(0.25, 0.6), dir.y * amount * rand(0.25, 0.6));
          }
        }
      }
      this.limp = clamp(this.limp + amount * 0.004, 0, 1);
    }

    spawnDamageEffects(regionId, type, point, amount, direction, layer) {
      if (this.mods?.noGore) {
        const puffColor = type === "burning" ? COLORS.soot : "rgba(246, 202, 69, 0.32)";
        blood.addStain(point.x + rand(-5, 5), point.y + rand(-5, 5), amount * 0.34 + 8, puffColor, type === "burning" ? "soot" : "dust");
        return 0;
      }
      const goreScale = clamp((this.mods?.extraGore ?? 100) / 100, 0, 5);
      const goreColor = this.getGoreColor();
      if (type === "burning") {
        blood.addStain(point.x + rand(-6, 6), point.y + rand(-6, 6), amount * 0.6 + 7, COLORS.soot, "soot");
        const singedLeak = layer >= 2 ? amount * 0.22 + layer * 3 : amount * 0.08;
        if (layer >= 2) {
          blood.spawn("drip", point.x, point.y, { x: 0, y: 1 }, amount * 0.22, singedLeak * goreScale, goreColor);
        }
        return singedLeak * goreScale;
      }

      let bloodKind = "splat";
      let count = amount * 0.54 + layer * 2;
      if (type === "slicing") {
        bloodKind = "directional";
        count = amount * 1.18 + layer * 4;
      } else if (type === "piercing") {
        bloodKind = "drip";
        count = amount * 0.52 + layer * 4;
      } else if (type === "crushing") {
        count = amount * 1.22 + layer * 4;
        blood.spawnChunk(point.x, point.y, direction, Math.round(clamp(amount / 15, 2, 9) * goreScale), goreColor);
      } else if (type === "explosion") {
        count = amount * 1.08 + layer * 6;
        blood.spawnChunk(point.x, point.y, direction, Math.round(clamp(amount / 6, 5, 24) * goreScale), goreColor);
      } else if (type === "dragging") {
        blood.addSmear(`smear-${regionId}`, point.x, this.room.floor - 2, amount * 0.95 + 10, goreColor ?? COLORS.blood);
        count = amount * 0.2 + layer;
      } else if (type === "stretching") {
        bloodKind = "directional";
        count = amount * 0.48 + layer * 3;
      } else if (type === "dismemberment") {
        bloodKind = "directional";
        count = amount * 1.26 + layer * 6;
        blood.spawnChunk(point.x, point.y, direction, Math.round(clamp(amount / 7, 5, 22) * goreScale), goreColor);
      }
      blood.spawn(bloodKind, point.x, point.y, direction, amount, count * goreScale, goreColor);
      return count * goreScale;
    }

    getGoreColor() {
      if (this.mods?.noGore) return null;
      if (this.mods?.rainbowGore || this.mods?.bloodType === "Rainbow Blood") return rainbowColor(this.time + rand(0, 4));
      if (this.mods?.bloodType && this.mods.bloodType !== "Normal Cartoon Blood") {
        return paletteColorFromType(this.mods.bloodType, this.time + rand(0, 8), this.mods.bloodColor ?? COLORS.blood);
      }
      return this.mods?.bloodColor && this.mods.bloodColor !== DEFAULT_MOD_SETTINGS.bloodColor ? this.mods.bloodColor : null;
    }

    organColor(baseColor, seed = 0, alpha = 1) {
      if (this.mods?.rainbowGore || this.mods?.bloodType === "Rainbow Blood") return rainbowColor(seed + this.time, alpha);
      if (this.mods?.bloodType && this.mods.bloodType !== "Normal Cartoon Blood") {
        return paletteColorFromType(this.mods.bloodType, seed + this.time, this.mods.gutColor ?? baseColor, alpha);
      }
      if ((baseColor === COLORS.gut || baseColor === COLORS.gutDark || baseColor === COLORS.brain || baseColor === COLORS.heart || baseColor === COLORS.kidney) && this.mods?.gutColor) {
        return this.mods.gutColor;
      }
      if ((baseColor === COLORS.blood || baseColor === COLORS.bloodBright || baseColor === COLORS.muscle || baseColor === COLORS.muscleDark) && this.mods?.bloodColor) {
        return this.mods.bloodColor;
      }
      return baseColor;
    }

    setPainExpression(type, amount) {
      if (this.mods?.freezeFace) return;
      if (this.dead) {
        this.autoExpression = "dead";
        return;
      }
      const reactionStyle = this.mods?.painReactionStyle ?? "Screams";
      const courage = clamp((this.mods?.courage ?? 50) / 100, 0, 1);
      const anger = clamp((this.mods?.anger ?? 0) / 100, 0, 1);
      const drama = clamp((this.mods?.dramaLevel ?? 100) / 100, 0.15, 3);
      let expression = "pain";
      let timer = 0.75 * drama;
      if (type === "explosion" || amount > 78) {
        expression = courage > 0.82 && reactionStyle !== "Overacts" ? "angry" : "scream";
        timer = 1.25 * drama;
      } else if (type === "blunt" || type === "crushing") {
        expression = amount > 38 ? "pain" : "dazed";
        timer = 0.8 * drama;
      } else if (type === "slicing" || type === "piercing") {
        expression = courage < 0.55 ? "panic" : "pain";
        timer = 0.95 * drama;
      } else if (type === "burning") {
        expression = "angry";
        timer = 0.72 * drama;
      } else if (type === "stretching") {
        expression = "nervous";
        timer = 0.56 * drama;
      }
      if (reactionStyle === "Laughs") expression = "idle";
      else if (reactionStyle === "Cries") expression = "pain";
      else if (reactionStyle === "Gets Angry" || anger > 0.68 || this.mods?.personality === "Angry") expression = "angry";
      else if (reactionStyle === "Freezes") {
        expression = "blank";
        this.zeroRigVelocity();
      } else if (reactionStyle === "Overacts") {
        expression = "scream";
        this.head.applyImpulse(rand(-4, 4) * drama, rand(-5, -2) * drama);
      } else if (reactionStyle === "Spins Eyes") {
        expression = "dazed";
      } else if (reactionStyle === "Plays Dead") {
        expression = "dead";
      } else if (reactionStyle === "Silent Stare") {
        expression = "blank";
      } else if (reactionStyle === "Insults Player") {
        expression = "angry";
        this.head.angularVelocity += randomSign() * 0.05 * drama;
      }
      if (this.mods?.personality === "Tough Guy" && amount < 62) expression = "blank";
      if (this.mods?.personality === "Crybaby" && amount > 12) expression = "pain";
      this.autoExpression = expression;
      this.expressionTimer = timer;
      this.performPainReactionMotion(reactionStyle, type, amount, drama);
    }

    performPainReactionMotion(reactionStyle, type, amount, drama) {
      const intensity = clamp(amount / 80, 0.18, 2.2) * drama;
      if (reactionStyle === "Screams") {
        this.head.applyImpulse(randomSign() * 1.6 * intensity, -2.2 * intensity);
        this.leftHand.applyImpulse(-1.2 * intensity, -1.7 * intensity);
        this.rightHand.applyImpulse(1.2 * intensity, -1.7 * intensity);
      } else if (reactionStyle === "Laughs") {
        this.head.squashX = 1.14;
        this.head.squashY = 0.88;
        this.head.angularVelocity += Math.sin(this.time * 24) * 0.04 * intensity;
      } else if (reactionStyle === "Cries") {
        this.leftHand.applyImpulse(0.7 * intensity, -0.7 * intensity);
        this.rightHand.applyImpulse(-0.7 * intensity, -0.7 * intensity);
        blood.addStain(this.head.x + rand(-34, 34), this.head.y + rand(-8, 40), 5 + intensity * 3, "rgba(90, 170, 255, 0.42)", "tear");
      } else if (reactionStyle === "Gets Angry") {
        this.rightFoot.applyImpulse(-randomSign() * 2.4 * intensity, -2.6 * intensity);
        this.head.angularVelocity += randomSign() * 0.09 * intensity;
      } else if (reactionStyle === "Freezes") {
        this.zeroRigVelocity();
        this.head.squashX = 0.92;
        this.head.squashY = 1.1;
      } else if (reactionStyle === "Overacts") {
        this.head.applyImpulse(randomSign() * 8 * intensity, -8 * intensity);
        for (const particle of this.particles) particle.applyImpulse(rand(-2.2, 2.2) * intensity, rand(-4, -0.2) * intensity);
      } else if (reactionStyle === "Spins Eyes") {
        this.head.angularVelocity += randomSign() * 0.18 * intensity;
      } else if (reactionStyle === "Plays Dead") {
        this.limp = 1;
        this.head.applyImpulse(0, 2.4 * intensity);
      } else if (reactionStyle === "Insults Player") {
        const hand = state.pointer.x < this.head.x ? this.leftHand : this.rightHand;
        hand.applyImpulse((state.pointer.x < this.head.x ? -1 : 1) * 2.5 * intensity, -1.1 * intensity);
      } else if (reactionStyle === "Silent Stare") {
        this.head.angle = lerp(this.head.angle, 0, 0.32);
      }
      if (type === "electric") {
        for (const particle of this.particles) particle.applyImpulse(rand(-1.6, 1.6), rand(-1.6, 1.6));
      }
    }

    markSegmentCut(segmentName, t, amount) {
      const segment = this.segments.find((candidate) => candidate.name === segmentName);
      if (!segment || segment.destroyed) return;
      segment.cutProgress = clamp((segment.cutProgress ?? 0) + amount * 1.15, 0, 220);
      segment.cutT = clamp(t, 0.05, 0.95);
      if (segment.cutProgress >= ClownTuning.damage.cutSever * 0.55 && !segment.hanging && !segment.severed) {
        segment.hanging = true;
        segment.hangT = segment.cutT;
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const point = { x: lerp(a.x, b.x, segment.hangT), y: lerp(a.y, b.y, segment.hangT) };
        blood.spawn("directional", point.x, point.y, normalize(b.x - a.x, b.y - a.y), 24, 18);
      }
      if (segment.cutProgress >= ClownTuning.damage.cutSever && !segment.severed) {
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const point = { x: lerp(a.x, b.x, segment.cutT), y: lerp(a.y, b.y, segment.cutT) };
        this.severSegment(segment, point, normalize(b.x - a.x, b.y - a.y));
      }
    }

    canSever(regionId) {
      return [
        "leftArm",
        "rightArm",
        "leftHand",
        "rightHand",
        "leftLeg",
        "rightLeg",
        "leftFoot",
        "rightFoot",
      ].includes(regionId);
    }

    canBreak(regionId) {
      return [
        "headShell",
        "mouthJaw",
        "leftArm",
        "rightArm",
        "leftHand",
        "rightHand",
        "leftLeg",
        "rightLeg",
        "leftFoot",
        "rightFoot",
      ].includes(regionId);
    }

    canDestroy(regionId) {
      return [
        "headShell",
        "mouthJaw",
        "leftArm",
        "rightArm",
        "leftHand",
        "rightHand",
        "leftLeg",
        "rightLeg",
        "leftFoot",
        "rightFoot",
        "guts",
      ].includes(regionId);
    }

    severSegment(segment, point, direction) {
      if (!segment || segment.severed) return;
      segment.severed = true;
      segment.hanging = false;
      segment.cutT = segment.cutT ?? 0.5;
      segment.tornPoint = { x: point.x, y: point.y };
      blood.spawn("directional", point.x, point.y, direction, 54, 52);
      blood.spawnChunk(point.x, point.y, direction, 6);
      this.spawnBodyFragment("tissue", point.x, point.y, direction, 20, COLORS.muscle);
    }

    breakRegionBones(regionId, point, direction, hit = {}) {
      const region = this.regions[regionId];
      if (!region || region.broken) return;
      region.broken = true;
      if (hit.segmentName) {
        const segment = this.segments.find((candidate) => candidate.name === hit.segmentName);
        if (segment) segment.broken = true;
      } else {
        for (const segment of this.segments) {
          if (segment.region === regionId) segment.broken = true;
        }
      }
      region.wounds.push(this.createWound(regionId, "crushing", point, 58, 4, hit, direction));
      blood.spawn("splat", point.x, point.y, direction, 40, 36);
      for (let index = 0; index < 3; index += 1) {
        this.spawnBodyFragment("bone", point.x + rand(-6, 6), point.y + rand(-6, 6), direction, rand(10, 18), COLORS.bone);
      }
    }

    severRegion(regionId, point, direction) {
      const region = this.regions[regionId];
      if (region.severed) return;
      region.severed = true;
      const namesByRegion = {
        leftArm: ["leftUpperArm"],
        rightArm: ["rightUpperArm"],
        leftHand: ["leftForearm"],
        rightHand: ["rightForearm"],
        leftLeg: ["leftThigh"],
        rightLeg: ["rightThigh"],
        leftFoot: ["leftCalf"],
        rightFoot: ["rightCalf"],
      };
      for (const name of namesByRegion[regionId] ?? []) {
        const segment = this.segments.find((candidate) => candidate.name === name);
        if (segment) this.severSegment(segment, point, direction);
      }
      blood.spawn("directional", point.x, point.y, direction, 56, 54);
      blood.spawnChunk(point.x, point.y, direction, 8);
      this.autoExpression = "panic";
      this.expressionTimer = 1.4;
    }

    decapitateHeadPart(regionId, point, direction) {
      const region = this.regions[regionId];
      if (!region || region.severed) return;
      region.severed = true;
      const type = regionId === "mouthJaw" ? "jaw" : "faceCap";
      this.spawnBodyFragment(type, point.x, point.y, direction, regionId === "mouthJaw" ? 48 : 72, regionId === "mouthJaw" ? COLORS.teeth : COLORS.face);
      blood.spawn("directional", point.x, point.y, direction, 72, 64);
      blood.spawnChunk(point.x, point.y, direction, 9);
      if (regionId === "headShell") {
        this.headOrganDamage = Math.max(this.headOrganDamage, 82);
        this.spawnBodyFragment("brain", point.x + rand(-10, 10), point.y + rand(-10, 10), direction, 24, COLORS.brain);
        this.spillGuts(point, direction);
        this.dead = true;
        this.autoExpression = "dead";
      } else {
        this.autoExpression = "scream";
      }
      this.expressionTimer = 1.6;
    }

    destroyRegion(regionId, point, direction) {
      const region = this.regions[regionId];
      if (!region || region.destroyed) return;
      region.destroyed = true;
      region.broken = true;
      region.severed = true;
      for (const segment of this.segments) {
        if (segment.region === regionId) segment.destroyed = true;
      }
      const linkedParticles = this.particles.filter((particle) => particle.region === regionId);
      for (const particle of linkedParticles) {
        particle.radius *= 0.48;
        particle.applyImpulse(direction.x * rand(25, 70), direction.y * rand(25, 70) - rand(15, 45));
      }
      for (let index = 0; index < 8; index += 1) {
        this.spawnBodyFragment(index % 3 === 0 ? "bone" : "tissue", point.x + rand(-14, 14), point.y + rand(-14, 14), direction, rand(10, 25), index % 3 === 0 ? COLORS.bone : COLORS.muscle);
      }
      blood.spawn("splat", point.x, point.y, direction, 86, 72);
      blood.spawnChunk(point.x, point.y, direction, 14);
      if (regionId === "headShell") {
        this.headOrganDamage = Math.max(this.headOrganDamage, 90);
        this.spawnBodyFragment("brain", point.x + rand(-12, 12), point.y + rand(-12, 12), direction, 26, COLORS.brain);
        this.spillGuts(point, direction);
        this.dead = true;
        this.autoExpression = "dead";
      }
    }

    popBody(point = this.head, direction = { x: 0, y: -1 }) {
      if (this.popRecoverTimer > 0) return;
      this.popRecoverTimer = 4.4;
      this.head.squashX = 1.55;
      this.head.squashY = 0.52;
      this.mods.inflate = 0;
      this.mods.regenerate = true;
      this.limp = 1;
      for (const region of Object.values(this.regions)) {
        region.bruise = Math.max(region.bruise, 70);
        region.damage = Math.max(region.damage, ClownTuning.damage.fatExpose * 0.65);
      }
      for (const particle of this.particles) {
        const away = normalize(particle.x - this.head.x + rand(-3, 3), particle.y - this.head.y + rand(-3, 3));
        particle.applyImpulse(away.x * rand(12, 34), away.y * rand(12, 34) - rand(6, 18));
      }
      if (!this.mods.noGore) {
        const goreScale = clamp((this.mods.extraGore ?? 100) / 100, 0, 5);
        blood.spawn("splat", point.x, point.y, direction, 92, 90 * goreScale, this.getGoreColor());
        blood.spawnChunk(point.x, point.y, direction, Math.round(18 * goreScale), this.getGoreColor());
      }
      this.autoExpression = "dead";
      this.expressionTimer = 1.1;
    }

    spawnBodyFragment(type, x, y, direction, size, color) {
      if (this.mods?.noGore && ["brain", "heart", "kidney", "organ", "tissue"].includes(type)) return;
      const angle = Math.atan2(direction.y, direction.x) + rand(-1.2, 1.2);
      const speed = rand(120, 420);
      this.fragments.push({
        type,
        x,
        y,
        prevX: x - Math.cos(angle) * speed * 0.016,
        prevY: y - Math.sin(angle) * speed * 0.016,
        size,
        color: this.organColor(color, size),
        angle: rand(0, TAU),
        spin: rand(-0.22, 0.22),
        life: rand(ClownTuning.blood.fragmentFade * 0.72, ClownTuning.blood.fragmentFade * 1.25),
      });
      if (this.fragments.length > ClownTuning.blood.maxFragments) {
        this.fragments.splice(0, this.fragments.length - ClownTuning.blood.maxFragments);
      }
    }

    spillGuts(point, direction) {
      if (this.mods?.noGore) return;
      if (this.guts.exposed) return;
      this.guts.exposed = true;
      this.regions.guts.damage = Math.max(this.regions.guts.damage, 18);
      const anchor = this.headAnchor("gutDoor");
      for (let index = 0; index < this.guts.particles.length; index += 1) {
        const particle = this.guts.particles[index];
        particle.x = anchor.x + Math.sin(index * 0.85) * 18;
        particle.y = anchor.y + index * ClownTuning.organs.intestineLength * 0.62;
        particle.prevX = particle.x - direction.x * rand(2, 12);
        particle.prevY = particle.y - direction.y * rand(2, 12);
        particle.applyImpulse(direction.x * rand(5, 18), direction.y * rand(5, 18) + rand(3, 12));
      }
      let looseOrgans = [
        { type: "heart", color: COLORS.heart, size: 22 },
        { type: "kidney", color: COLORS.kidney, size: 18 },
        { type: "organ", color: COLORS.gut, size: 17 },
      ];
      const anatomy = this.mods?.internalAnatomy ?? "Normal Cartoon Guts";
      if (anatomy === "Robot Parts" || anatomy === "Clockwork Gears") {
        looseOrgans = [
          { type: "bone", color: "#9fd8ff", size: 20 },
          { type: "organ", color: "#f6ca45", size: 18 },
          { type: "organ", color: "#c8d1da", size: 16 },
        ];
      } else if (anatomy === "Balloon Organs") {
        looseOrgans = [
          { type: "organ", color: "#ff70bd", size: 26 },
          { type: "organ", color: "#8df7ff", size: 22 },
          { type: "organ", color: "#f6ca45", size: 18 },
        ];
      } else if (anatomy === "Candy Guts") {
        looseOrgans = [
          { type: "organ", color: "#ff70bd", size: 20 },
          { type: "organ", color: "#f6ca45", size: 18 },
          { type: "organ", color: "#8df7ff", size: 16 },
        ];
      } else if (anatomy === "Plush Stuffing") {
        looseOrgans = [
          { type: "tissue", color: "#f2dbc2", size: 22 },
          { type: "tissue", color: "#fff8df", size: 17 },
          { type: "tissue", color: "#d8c1aa", size: 14 },
        ];
      } else if (anatomy === "Slime Core") {
        looseOrgans = [
          { type: "organ", color: "#63e46d", size: 26 },
          { type: "organ", color: "#a6ff80", size: 19 },
        ];
      } else if (anatomy === "Confetti Machine") {
        looseOrgans = [
          { type: "organ", color: "#f6ca45", size: 18 },
          { type: "organ", color: "#39c1d3", size: 18 },
          { type: "organ", color: "#ff6aa2", size: 18 },
        ];
      } else if (anatomy === "Empty Hollow Head") {
        looseOrgans = [];
      }
      if (this.headOrganDamage > 46 && !["Robot Parts", "Clockwork Gears", "Empty Hollow Head"].includes(anatomy)) {
        looseOrgans.push({ type: "brain", color: COLORS.brain, size: 20 });
      }
      const extraCopies = Math.floor(Math.max(0, (this.mods?.extraGore ?? 100) - 100) / 100);
      for (let copy = 0; copy < extraCopies; copy += 1) {
        looseOrgans.push(
          { type: "organ", color: COLORS.gut, size: rand(14, 22) },
          { type: "kidney", color: COLORS.kidney, size: rand(14, 20) },
        );
        if (copy % 2 === 0) looseOrgans.push({ type: "heart", color: COLORS.heart, size: rand(17, 24) });
      }
      for (const organ of looseOrgans) {
        this.spawnBodyFragment(
          organ.type,
          point.x + rand(-12, 12),
          point.y + rand(-12, 12),
          direction,
          organ.size,
          organ.color,
        );
      }
      const goreScale = clamp((this.mods?.extraGore ?? 100) / 100, 0, 5);
      blood.spawn("splat", point.x, point.y, direction, 46, 64 * goreScale, this.getGoreColor());
      blood.spawnChunk(point.x, point.y, direction, Math.round(8 * goreScale), this.getGoreColor());
    }

    draw(context, flags = {}) {
      this.drawShadow(context);
      this.drawLimbLayer(context, "back");
      if (this.guts.exposed && !this.mods?.noGore) this.drawGuts(context);
      this.drawHead(context, flags);
      if (!this.mods?.noGore) this.drawHangingOrgans(context);
      this.drawLimbLayer(context, "front");
      if (!this.mods?.noGore) this.drawFragments(context);
      if (flags.debug) this.drawDebug(context);
    }

    getAppearanceColors() {
      return getAppearanceColorsForMods(this.mods ?? DEFAULT_MOD_SETTINGS);
    }

    drawShadow(context) {
      context.save();
      context.globalAlpha = 0.26;
      context.fillStyle = "#070606";
      context.beginPath();
      context.ellipse(this.head.x, this.room.floor + 4, 112, 17, 0, 0, TAU);
      context.fill();
      for (const particle of [this.leftHand, this.rightHand, this.leftFoot, this.rightFoot]) {
        context.beginPath();
        context.ellipse(particle.x, this.room.floor + 3, particle.radius * 1.35, 6, 0, 0, TAU);
        context.fill();
      }
      context.restore();
    }

    drawLimbLayer(context, layer) {
      const backNames = new Set(["leftThigh", "leftCalf", "rightThigh", "rightCalf"]);
      for (const segment of this.segments) {
        const isBack = backNames.has(segment.name);
        if ((layer === "back") !== isBack) continue;
        this.drawSegment(context, segment);
      }
      if (layer === "front") {
        if (!this.regions.leftHand.destroyed) this.drawHand(context, this.leftHand, this.leftElbow, "leftHand");
        if (!this.regions.rightHand.destroyed) this.drawHand(context, this.rightHand, this.rightElbow, "rightHand");
        if (!this.regions.leftFoot.destroyed) this.drawShoe(context, this.leftFoot, this.leftKnee, "leftFoot");
        if (!this.regions.rightFoot.destroyed) this.drawShoe(context, this.rightFoot, this.rightKnee, "rightFoot");
      }
    }

    drawSegment(context, segment) {
      const a = this.getNodePosition(segment.a);
      const b = segment.b;
      if (segment.destroyed || this.regions[segment.region].destroyed) {
        this.drawTornEnd(context, a.x, a.y, segment.radius * 1.08, angleBetween(b, a));
        return;
      }
      if (segment.severed) {
        this.drawSeveredSegmentPieces(context, segment, a, b);
        return;
      }
      const damage = this.regions[segment.region].damage;
      const layer = this.getDisplayedLayer(layerFromDamage(segment.region, damage));
      const currentLength = distance(a, b);
      const stretchRatio = clamp(currentLength / Math.max(1, segment.length), 0.62, 1.58);
      const visualRadius = segment.radius * clamp(1 / Math.sqrt(stretchRatio), 0.72, 1.28);
      const palette = segment.region.includes("Arm")
        ? { a: COLORS.sleeveA, b: COLORS.sleeveB }
        : { a: COLORS.pantA, b: COLORS.pantB };
      const boneColor = getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, segment.baseLength, 1);
      const baseColor = layer === 1 ? palette.a : layer === 2 ? COLORS.fat : layer === 3 ? COLORS.muscle : boneColor;
      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = visualRadius * 2 + 8;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      context.strokeStyle = layer === 3 ? this.organColor(baseColor, segment.baseLength) : baseColor;
      context.lineWidth = visualRadius * 2;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();

      if (layer === 1) {
        this.drawSegmentStripes(context, a, b, visualRadius, palette.b);
      } else if (layer === 3) {
        this.drawMuscleStrands(context, a, b, visualRadius);
      } else if (layer >= 4 || segment.broken || this.regions[segment.region].broken) {
        context.strokeStyle = this.organColor(COLORS.muscleDark, segment.baseLength + 8);
        context.lineWidth = Math.max(5, visualRadius * 0.78);
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
        context.strokeStyle = boneColor;
        context.lineWidth = Math.max(3, visualRadius * 0.36);
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
        if (segment.broken || this.regions[segment.region].broken) {
          this.drawBoneBreak(context, a, b, visualRadius);
        }
      }

      this.drawSelfBloodStains(context, "segment", segment);
      this.drawSegmentWounds(context, segment);
      if (segment.hanging) this.drawHangingSegmentTear(context, segment, a, b, visualRadius);
      context.restore();
    }

    drawSeveredSegmentPieces(context, segment, a, b) {
      const t = clamp(segment.cutT ?? segment.hangT ?? 0.5, 0.06, 0.94);
      const dir = normalize(b.x - a.x, b.y - a.y);
      const proximalEnd = {
        x: a.x + dir.x * segment.length * t,
        y: a.y + dir.y * segment.length * t,
      };
      const distalEnd = {
        x: b.x - dir.x * segment.length * (1 - t),
        y: b.y - dir.y * segment.length * (1 - t),
      };
      const layer = layerFromDamage(segment.region, this.regions[segment.region].damage);
      const palette = segment.region.includes("Arm")
        ? { a: COLORS.sleeveA, b: COLORS.sleeveB }
        : { a: COLORS.pantA, b: COLORS.pantB };
      const color = layer === 1 ? palette.a : layer === 2 ? COLORS.fat : layer === 3 ? COLORS.muscle : COLORS.bone;
      this.drawLooseSegmentStroke(context, a, proximalEnd, segment.radius, color);
      this.drawLooseSegmentStroke(context, distalEnd, b, segment.radius, color);
      this.drawTornEnd(context, proximalEnd.x, proximalEnd.y, segment.radius * 1.1, Math.atan2(dir.y, dir.x));
      this.drawTornEnd(context, distalEnd.x, distalEnd.y, segment.radius * 1.1, Math.atan2(-dir.y, -dir.x));
    }

    drawLooseSegmentStroke(context, a, b, radius, color) {
      if (distance(a, b) < radius * 0.8) return;
      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = radius * 2 + 8;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      context.strokeStyle = color;
      context.lineWidth = radius * 2;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(b.x, b.y);
      context.stroke();
      context.restore();
    }

    drawHangingSegmentTear(context, segment, a, b, radius) {
      const t = clamp(segment.hangT ?? segment.cutT ?? 0.5, 0.06, 0.94);
      const x = lerp(a.x, b.x, t);
      const y = lerp(a.y, b.y, t);
      const angle = angleBetween(a, b);
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = COLORS.muscleDark;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 2.5;
      context.beginPath();
      context.ellipse(0, 0, radius * 1.08, radius * 0.78, 0, 0, TAU);
      context.fill();
      context.stroke();
      context.strokeStyle = getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, radius, 1);
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-radius * 0.9, -radius * 0.2);
      context.lineTo(-radius * 0.2, radius * 0.25);
      context.lineTo(radius * 0.28, -radius * 0.25);
      context.lineTo(radius * 0.9, radius * 0.22);
      context.stroke();
      context.restore();
    }

    drawBoneBreak(context, a, b, radius) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length;
      const ny = dx / length;
      const mx = (a.x + b.x) * 0.5;
      const my = (a.y + b.y) * 0.5;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(mx - nx * radius * 0.75 - dx * 0.08, my - ny * radius * 0.75 - dy * 0.08);
      context.lineTo(mx + nx * radius * 0.15, my + ny * radius * 0.15);
      context.lineTo(mx - nx * radius * 0.05 + dx * 0.08, my - ny * radius * 0.05 + dy * 0.08);
      context.lineTo(mx + nx * radius * 0.72 + dx * 0.02, my + ny * radius * 0.72 + dy * 0.02);
      context.stroke();
      context.strokeStyle = getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, radius, 1);
      context.lineWidth = 2.5;
      context.stroke();
    }

    drawSegmentStripes(context, a, b, radius, color) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length;
      const ny = dx / length;
      context.strokeStyle = color;
      context.lineWidth = 5;
      for (let t = 0.16; t < 0.94; t += 0.18) {
        const x = lerp(a.x, b.x, t);
        const y = lerp(a.y, b.y, t);
        context.beginPath();
        context.moveTo(x - nx * radius * 0.78, y - ny * radius * 0.78);
        context.lineTo(x + nx * radius * 0.78, y + ny * radius * 0.78);
        context.stroke();
      }
    }

    drawMuscleStrands(context, a, b, radius) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const length = Math.hypot(dx, dy) || 1;
      const nx = -dy / length;
      const ny = dx / length;
      context.strokeStyle = this.organColor(COLORS.muscleDark, radius);
      context.lineWidth = 2;
      for (let offset = -0.45; offset <= 0.45; offset += 0.3) {
        context.beginPath();
        context.moveTo(a.x + nx * radius * offset, a.y + ny * radius * offset);
        context.lineTo(b.x + nx * radius * offset, b.y + ny * radius * offset);
        context.stroke();
      }
    }

    drawSelfBloodStains(context, kind, segment = null) {
      for (const stain of this.selfStains) {
        if (stain.kind !== kind) continue;
        context.save();
        context.globalAlpha = stain.alpha;
        context.fillStyle = stain.color ?? COLORS.blood;
        if (kind === "head") {
          context.translate(stain.x, stain.y);
          context.rotate(stain.angle);
          context.beginPath();
          context.ellipse(0, 0, stain.rx, stain.ry, 0, 0, TAU);
          context.fill();
        } else if (segment && stain.segmentName === segment.name) {
          const a = this.getNodePosition(segment.a);
          const b = segment.b;
          const t = stain.t ?? 0.5;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const length = Math.hypot(dx, dy) || 1;
          const nx = -dy / length;
          const ny = dx / length;
          const x = lerp(a.x, b.x, t) + nx * (stain.side ?? 1) * segment.radius * 0.28;
          const y = lerp(a.y, b.y, t) + ny * (stain.side ?? 1) * segment.radius * 0.28;
          context.translate(x, y);
          context.rotate(angleBetween(a, b) + stain.angle);
          context.beginPath();
          context.ellipse(0, 0, stain.rx, stain.ry, 0, 0, TAU);
          context.fill();
        }
        context.restore();
      }
    }

    drawSegmentWounds(context, segment) {
      const region = this.regions[segment.region];
      for (const wound of region.wounds) {
        if (wound.segmentName && wound.segmentName !== segment.name) continue;
        if (!wound.segmentName && wound.x === undefined) continue;
        const a = this.getNodePosition(segment.a);
        const b = segment.b;
        const t = wound.t ?? 0.5;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const length = Math.hypot(dx, dy) || 1;
        const nx = -dy / length;
        const ny = dx / length;
        const x = wound.x ?? lerp(a.x, b.x, t) + nx * (wound.side ?? 1) * segment.radius * 0.35;
        const y = wound.y ?? lerp(a.y, b.y, t) + ny * (wound.side ?? 1) * segment.radius * 0.35;
        drawWoundPatch(context, x, y, wound.size, wound.layer, wound.angle, wound.type, wound.style, wound.goreColor);
      }
    }

    drawTornEnd(context, x, y, radius, angle) {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.fillStyle = this.organColor(COLORS.muscle, radius);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 2;
      context.beginPath();
      for (let i = 0; i < 9; i += 1) {
        const a = (i / 9) * TAU;
        const r = radius * rand(0.55, 1.0);
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r * 0.72;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = COLORS.bone;
      context.beginPath();
      context.roundRect(-radius * 0.26, -radius * 0.18, radius * 0.52, radius * 0.36, 3);
      context.fill();
      context.restore();
    }

    drawFragments(context) {
      for (const fragment of this.fragments) {
        context.save();
        context.translate(fragment.x, fragment.y);
        context.rotate(fragment.angle);
        context.globalAlpha = clamp(fragment.life / ClownTuning.blood.fragmentFade, 0, 1);
        context.fillStyle = fragment.color;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 2.5;
        if (fragment.type === "jaw") {
          context.beginPath();
          context.roundRect(-fragment.size * 0.5, -fragment.size * 0.18, fragment.size, fragment.size * 0.36, 10);
          context.fill();
          context.stroke();
          context.fillStyle = COLORS.teeth;
          for (let i = -2; i <= 2; i += 1) {
            context.beginPath();
            context.roundRect(i * 9 - 3, -4, 6, 13, 2);
            context.fill();
            context.stroke();
          }
        } else if (fragment.type === "faceCap") {
          context.beginPath();
          context.ellipse(0, 0, fragment.size * 0.5, fragment.size * 0.28, 0, 0, TAU);
          context.fill();
          context.stroke();
          context.fillStyle = COLORS.nose;
          context.beginPath();
          context.arc(0, 0, fragment.size * 0.12, 0, TAU);
          context.fill();
        } else if (fragment.type === "facePlate") {
          context.beginPath();
          context.ellipse(0, 0, fragment.size * 0.54, fragment.size * 0.36, 0.12, 0, TAU);
          context.fill();
          context.stroke();
          context.fillStyle = COLORS.muscle;
          context.beginPath();
          context.ellipse(fragment.size * 0.12, fragment.size * 0.04, fragment.size * 0.22, fragment.size * 0.14, -0.2, 0, TAU);
          context.fill();
          context.stroke();
        } else if (fragment.type === "bone") {
          context.beginPath();
          context.roundRect(-fragment.size * 0.48, -fragment.size * 0.16, fragment.size * 0.96, fragment.size * 0.32, 4);
          context.fill();
          context.stroke();
        } else if (fragment.type === "eye") {
          context.fillStyle = COLORS.teeth;
          context.beginPath();
          context.ellipse(0, 0, fragment.size * 0.48, fragment.size * 0.38, 0, 0, TAU);
          context.fill();
          context.stroke();
          context.fillStyle = COLORS.outline;
          context.beginPath();
          context.arc(fragment.size * 0.06, 0, fragment.size * 0.14, 0, TAU);
          context.fill();
        } else if (fragment.type === "brain") {
          const lobeSize = fragment.size * 0.36;
          for (let index = 0; index < 4; index += 1) {
            context.beginPath();
            context.ellipse((index - 1.5) * lobeSize * 0.72, Math.sin(index) * 3, lobeSize, fragment.size * 0.28, index * 0.22, 0, TAU);
            context.fill();
            context.stroke();
          }
          context.strokeStyle = this.organColor(COLORS.brainDark, fragment.size + 5);
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(-fragment.size * 0.42, -2);
          context.bezierCurveTo(-fragment.size * 0.12, -9, fragment.size * 0.1, 9, fragment.size * 0.44, 0);
          context.stroke();
        } else if (fragment.type === "heart") {
          context.beginPath();
          context.moveTo(0, fragment.size * 0.42);
          context.bezierCurveTo(-fragment.size * 0.7, -fragment.size * 0.05, -fragment.size * 0.46, -fragment.size * 0.6, -fragment.size * 0.06, -fragment.size * 0.34);
          context.bezierCurveTo(fragment.size * 0.36, -fragment.size * 0.62, fragment.size * 0.72, -fragment.size * 0.06, 0, fragment.size * 0.42);
          context.fill();
          context.stroke();
        } else if (fragment.type === "kidney") {
          context.beginPath();
          context.ellipse(0, 0, fragment.size * 0.42, fragment.size * 0.68, 0.45, 0, TAU);
          context.fill();
          context.stroke();
          context.strokeStyle = this.organColor(COLORS.bloodBright, fragment.size + 8);
          context.lineWidth = 2;
          context.beginPath();
          context.arc(fragment.size * 0.16, 0, fragment.size * 0.22, -1.2, 1.2);
          context.stroke();
        } else if (fragment.type === "organ") {
          context.beginPath();
          context.ellipse(0, 0, fragment.size * 0.55, fragment.size * 0.34, 0.22, 0, TAU);
          context.fill();
          context.stroke();
          context.strokeStyle = this.organColor(COLORS.gutDark, fragment.size + 11);
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(-fragment.size * 0.42, 0);
          context.bezierCurveTo(-fragment.size * 0.1, -fragment.size * 0.24, fragment.size * 0.12, fragment.size * 0.24, fragment.size * 0.42, 0);
          context.stroke();
        } else {
          context.beginPath();
          context.ellipse(0, 0, fragment.size * 0.52, fragment.size * 0.32, 0, 0, TAU);
          context.fill();
          context.stroke();
        }
        context.restore();
      }
    }

    drawHand(context, hand, joint, regionId) {
      const damage = this.regions[regionId].damage;
      const layer = this.getDisplayedLayer(layerFromDamage(regionId, damage));
      const angle = angleBetween(joint, hand);
      const appearance = this.getAppearanceColors();
      const gloveType = this.mods?.gloveType ?? "White Gloves";
      const gloveScale = gloveType === "Giant Hands" ? 1.45 : gloveType === "Tiny Hands" ? 0.68 : gloveType === "Boxing Gloves" ? 1.28 : 1;
      context.save();
      context.translate(hand.x, hand.y);
      context.rotate(angle);
      context.scale(gloveScale, gloveScale);
      const gloveColor = gloveType === "Metal Hands" ? "#c8d1da" : gloveType === "Balloon Hands" ? "#ffe7ef" : gloveType === "Boxing Gloves" ? "#e54040" : appearance.glove;
      context.fillStyle = layer === 1 ? gloveColor : layer === 2 ? COLORS.fat : layer === 3 ? this.organColor(COLORS.muscle, 71) : getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, 71, 1);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(0, 0, 22, 17, 0, 0, TAU);
      context.fill();
      context.stroke();
      for (let i = -1; i <= 1; i += 1) {
        context.beginPath();
        context.ellipse(14, i * 8, gloveType === "Sticky Hands" ? 11 : 9, 5, 0.25, 0, TAU);
        context.fill();
        context.stroke();
      }
      if (gloveType === "Claw Hands") {
        context.fillStyle = COLORS.bone;
        for (let i = -1; i <= 1; i += 1) {
          context.beginPath();
          context.moveTo(20, i * 8);
          context.lineTo(38, i * 9 - 5);
          context.lineTo(25, i * 8 + 6);
          context.closePath();
          context.fill();
          context.stroke();
        }
      } else if (gloveType === "Sticky Hands") {
        context.fillStyle = "rgba(99, 228, 109, 0.46)";
        context.beginPath();
        context.arc(17, 0, 13, 0, TAU);
        context.fill();
      }
      if (layer >= 3) {
        context.strokeStyle = layer >= 4 ? getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, 72, 1) : COLORS.muscleDark;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(-13, 0);
        context.lineTo(18, 0);
        context.stroke();
      }
      context.restore();
      this.drawFloatingWounds(context, regionId);
    }

    drawShoe(context, foot, knee, regionId) {
      const damage = this.regions[regionId].damage;
      const layer = this.getDisplayedLayer(layerFromDamage(regionId, damage));
      const angle = angleBetween(knee, foot) + Math.sign(foot.x - this.head.x || 1) * 0.35;
      const appearance = this.getAppearanceColors();
      const shoeType = this.mods?.shoeType ?? "Big Red Shoes";
      const shoeScale = shoeType === "Tiny Shoes" ? 0.62 : shoeType === "Heavy Boots" ? 1.26 : shoeType === "Spring Shoes" || shoeType === "Bouncy Shoes" ? 1.16 : 1;
      context.save();
      context.translate(foot.x, foot.y);
      context.rotate(angle);
      context.scale(shoeScale, shoeScale);
      const shoeColor = shoeType === "Heavy Boots" ? "#554d4b" : shoeType === "Ice Skates" ? "#bff4ff" : appearance.shoe;
      context.fillStyle = layer === 1 ? shoeColor : layer === 2 ? COLORS.fat : layer === 3 ? this.organColor(COLORS.muscle, 72) : getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, 73, 1);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(0, 0, 36, 18, 0, 0, TAU);
      context.fill();
      context.stroke();
      context.fillStyle = shoeType === "Sticky Shoes" ? "#63e46d" : COLORS.shoeSole;
      context.beginPath();
      context.roundRect(-32, 9, 64, 7, 5);
      context.fill();
      context.stroke();
      if (shoeType === "Spring Shoes" || shoeType === "Bouncy Shoes") {
        context.strokeStyle = COLORS.bone;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(-18, 18);
        context.lineTo(-8, 30);
        context.lineTo(4, 18);
        context.lineTo(16, 30);
        context.stroke();
      } else if (shoeType === "Roller Skates") {
        context.fillStyle = "#101010";
        for (const wx of [-20, 18]) {
          context.beginPath();
          context.arc(wx, 22, 6, 0, TAU);
          context.fill();
        }
      } else if (shoeType === "Ice Skates") {
        context.strokeStyle = "#eefcff";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(-27, 23);
        context.lineTo(30, 23);
        context.stroke();
      } else if (shoeType === "Rocket Shoes") {
        context.fillStyle = "#f6ca45";
        context.beginPath();
        context.moveTo(-40, 0);
        context.lineTo(-57, -8);
        context.lineTo(-49, 8);
        context.closePath();
        context.fill();
      }
      context.restore();
      this.drawFloatingWounds(context, regionId);
    }

    drawFloatingWounds(context, regionId) {
      for (const wound of this.regions[regionId].wounds) {
        if (wound.segmentName || wound.localX !== undefined) continue;
        const point = wound.x !== undefined ? wound : this.randomRegionPoint(regionId);
        drawWoundPatch(context, point.x, point.y, wound.size, wound.layer, wound.angle, wound.type, wound.style, wound.goreColor);
      }
    }

    drawGuts(context) {
      const particles = this.guts.particles;
      if (particles.length < 2) return;
      context.save();
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = ClownTuning.organs.gutRadius * 2 + 6;
      context.beginPath();
      context.moveTo(particles[0].x, particles[0].y);
      for (let index = 1; index < particles.length; index += 1) {
        context.lineTo(particles[index].x, particles[index].y);
      }
      context.stroke();

      context.strokeStyle = this.organColor(COLORS.gut, 1);
      context.lineWidth = ClownTuning.organs.gutRadius * 2;
      context.beginPath();
      context.moveTo(particles[0].x, particles[0].y);
      for (let index = 1; index < particles.length; index += 1) {
        const particle = particles[index];
        context.lineTo(particle.x, particle.y);
      }
      context.stroke();

      context.strokeStyle = this.organColor(COLORS.gutDark, 2);
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(particles[0].x, particles[0].y);
      for (let index = 1; index < particles.length; index += 1) {
        context.lineTo(particles[index].x, particles[index].y);
      }
      context.stroke();

      const extraLoops = Math.floor(Math.max(0, (this.mods?.extraGore ?? 100) - 100) / 100);
      for (let loop = 0; loop < extraLoops; loop += 1) {
        context.strokeStyle = this.organColor(COLORS.gut, 60 + loop);
        context.lineWidth = Math.max(5, ClownTuning.organs.gutRadius * 1.1);
        context.beginPath();
        context.moveTo(particles[0].x + loop * 7 - 10, particles[0].y + 8);
        for (let index = 2; index < particles.length; index += 2) {
          context.lineTo(
            particles[index].x + Math.sin(index + loop) * (12 + loop * 4),
            particles[index].y + Math.cos(index * 0.7 + loop) * 8,
          );
        }
        context.stroke();
      }

      for (let index = 2; index < particles.length; index += 4) {
        const organColor = this.organColor(index % 12 === 0 ? COLORS.kidney : index % 8 === 0 ? "#f4b355" : "#d85172", index);
        context.fillStyle = organColor;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 2;
        context.beginPath();
        context.ellipse(particles[index].x + 5, particles[index].y - 3, index % 12 === 0 ? 13 : 11, index % 12 === 0 ? 10 : 8, 0.2, 0, TAU);
        context.fill();
        context.stroke();
      }
      context.restore();
    }

    drawHangingOrgans(context) {
      for (const organ of this.hangingOrgans) {
        const anchor = this.headFeatureAnchor(organ.anchor);
        context.save();
        if (!organ.detached) {
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 7;
          context.lineCap = "round";
          context.beginPath();
          context.moveTo(anchor.x, anchor.y);
          context.quadraticCurveTo(
            (anchor.x + organ.x) * 0.5 + Math.sin(this.time * 6 + organ.size) * 10,
            (anchor.y + organ.y) * 0.5 + 14,
            organ.x,
            organ.y,
          );
          context.stroke();
          context.strokeStyle = this.organColor(organ.type === "eye" ? COLORS.bloodBright : COLORS.gut, organ.size);
          context.lineWidth = 4;
          context.stroke();
        }
        context.translate(organ.x, organ.y);
        context.rotate(organ.angle);
        this.drawLooseOrganShape(context, organ.type, organ.size, this.organColor(organ.color, organ.size));
        context.restore();
      }
    }

    drawLooseOrganShape(context, type, size, color) {
      context.fillStyle = color;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      if (type === "eye") {
        context.fillStyle = this.mods?.rainbowGore ? color : COLORS.teeth;
        context.beginPath();
        context.ellipse(0, 0, size * 0.95, size * 0.78, 0, 0, TAU);
        context.fill();
        context.stroke();
        context.fillStyle = COLORS.outline;
        context.beginPath();
        context.arc(size * 0.08, 0, size * 0.28, 0, TAU);
        context.fill();
        context.fillStyle = this.organColor(COLORS.bloodBright, size + 4);
        context.beginPath();
        context.arc(-size * 0.55, size * 0.3, size * 0.16, 0, TAU);
        context.fill();
        return;
      }
      if (type === "heart") {
        context.beginPath();
        context.moveTo(0, size * 0.55);
        context.bezierCurveTo(-size * 0.85, -size * 0.05, -size * 0.54, -size * 0.7, -size * 0.08, -size * 0.36);
        context.bezierCurveTo(size * 0.42, -size * 0.76, size * 0.86, -size * 0.05, 0, size * 0.55);
        context.fill();
        context.stroke();
        return;
      }
      if (type === "brain") {
        for (let index = 0; index < 4; index += 1) {
          context.beginPath();
          context.ellipse((index - 1.5) * size * 0.28, Math.sin(index) * size * 0.12, size * 0.34, size * 0.25, index * 0.2, 0, TAU);
          context.fill();
          context.stroke();
        }
        context.strokeStyle = this.organColor(COLORS.brainDark, size + 5);
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(-size * 0.5, 0);
        context.bezierCurveTo(-size * 0.12, -size * 0.32, size * 0.16, size * 0.28, size * 0.52, 0);
        context.stroke();
        return;
      }
      if (type === "kidney") {
        context.beginPath();
        context.ellipse(0, 0, size * 0.48, size * 0.72, 0.45, 0, TAU);
        context.fill();
        context.stroke();
        return;
      }
      context.beginPath();
      context.ellipse(0, 0, size * 0.72, size * 0.44, 0.15, 0, TAU);
      context.fill();
      context.stroke();
      context.strokeStyle = this.organColor(COLORS.gutDark, size + 6);
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-size * 0.52, 0);
      context.bezierCurveTo(-size * 0.18, -size * 0.24, size * 0.2, size * 0.24, size * 0.52, 0);
      context.stroke();
    }

    drawHead(context, flags) {
      context.save();
      context.translate(this.head.x, this.head.y);
      context.rotate(this.head.angle);
      context.scale(this.head.squashX, this.head.squashY);
      const appearance = this.getAppearanceColors();
      const featureScale = this.headFeatureScale();

      context.save();
      context.scale(featureScale, featureScale);
      this.drawHair(context);
      context.restore();

      context.fillStyle = COLORS.outline;
      context.beginPath();
      context.ellipse(0, 0, this.head.radiusX + 7, this.head.radiusY + 7, 0, 0, TAU);
      context.fill();

      context.fillStyle = appearance.face;
      context.beginPath();
      context.ellipse(0, 0, this.head.radiusX, this.head.radiusY, 0, 0, TAU);
      context.fill();

      context.fillStyle = appearance.faceShadow;
      context.globalAlpha = 0.28;
      context.beginPath();
      context.ellipse(18, 18, this.head.radiusX * 0.76, this.head.radiusY * 0.72, 0, 0, TAU);
      context.fill();
      context.globalAlpha = 1;

      context.save();
      context.scale(featureScale, featureScale);
      drawSkinTexture(context, this.mods ?? DEFAULT_MOD_SETTINGS, this.head.baseRadiusX, this.head.baseRadiusY, this.time);
      drawFacePaintPattern(context, this.mods ?? DEFAULT_MOD_SETTINGS, this.head.baseRadiusX, this.head.baseRadiusY, this.time);
      this.drawFace(context);
      this.drawOuterMarks(context);
      if (!this.mods?.noGore && flags.xray) this.drawInternalAnatomy(context);
      if (flags.xray) this.drawHeadSkull(context, { alpha: 0.88, fill: true });
      this.drawFacePieceDamage(context);
      this.drawHeadWounds(context);
      this.drawHeadDestructionOverlay(context);
      context.restore();
      this.drawSelfBloodStains(context, "head");
      context.restore();
    }

    drawHair(context) {
      drawPreviewHair(context, this.mods ?? DEFAULT_MOD_SETTINGS, this.getAppearanceColors(), this.time);
    }

    drawOuterMarks(context) {
      const head = this.regions.headShell;
      if (head.bruise > 2) {
        context.fillStyle = `rgba(104, 42, 133, ${clamp(head.bruise / 150, 0, 0.46)})`;
        context.beginPath();
        context.ellipse(-36, 4, 24, 16, -0.45, 0, TAU);
        context.fill();
        context.beginPath();
        context.ellipse(42, -22, 18, 14, 0.3, 0, TAU);
        context.fill();
      }
      if (head.dirt > 2) {
        context.fillStyle = `rgba(53, 39, 27, ${clamp(head.dirt / 135, 0, 0.42)})`;
        for (let i = 0; i < 8; i += 1) {
          context.beginPath();
          context.ellipse(rand(-60, 62), rand(-54, 70), rand(5, 14), rand(2, 5), rand(-0.9, 0.9), 0, TAU);
          context.fill();
        }
      }
      if (head.burn > 2) {
        context.fillStyle = `rgba(26, 20, 16, ${clamp(head.burn / 190, 0, 0.58)})`;
        context.beginPath();
        context.ellipse(28, -8, 38, 28, 0.5, 0, TAU);
        context.fill();
      }
    }

    drawBrainMass(context, x, y, scale = 1) {
      context.save();
      context.translate(x, y);
      context.scale(scale, scale);
      context.fillStyle = this.organColor(COLORS.brain, 10);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      const lobes = [
        { x: -22, y: 0, rx: 24, ry: 18, angle: -0.2 },
        { x: 1, y: -7, rx: 29, ry: 21, angle: 0.08 },
        { x: 25, y: 2, rx: 22, ry: 17, angle: 0.24 },
        { x: -3, y: 13, rx: 30, ry: 15, angle: -0.05 },
      ];
      for (const lobe of lobes) {
        context.beginPath();
        context.ellipse(lobe.x, lobe.y, lobe.rx, lobe.ry, lobe.angle, 0, TAU);
        context.fill();
        context.stroke();
      }
      context.strokeStyle = this.organColor(COLORS.brainDark, 11);
      context.lineWidth = 2.2;
      context.lineCap = "round";
      for (let index = 0; index < 7; index += 1) {
        const yOffset = -13 + index * 6;
        context.beginPath();
        context.moveTo(-32, yOffset);
        context.bezierCurveTo(-16, yOffset - 9, -6, yOffset + 9, 9, yOffset);
        context.bezierCurveTo(19, yOffset - 7, 28, yOffset + 5, 35, yOffset - 2);
        context.stroke();
      }
      context.restore();
    }

    drawHeartOrgan(context, x, y, scale = 1) {
      context.save();
      context.translate(x, y);
      context.scale(scale, scale);
      context.fillStyle = this.organColor(COLORS.heart, 20);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(0, 20);
      context.bezierCurveTo(-35, -2, -25, -31, -3, -19);
      context.bezierCurveTo(18, -35, 39, -6, 0, 20);
      context.fill();
      context.stroke();
      context.strokeStyle = this.organColor(COLORS.bloodBright, 21);
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-7, -13);
      context.bezierCurveTo(1, -2, -5, 8, 7, 17);
      context.moveTo(6, -16);
      context.bezierCurveTo(11, -4, 2, 6, 14, 13);
      context.stroke();
      context.restore();
    }

    drawKidneyOrgan(context, x, y, scale = 1, flip = 1) {
      context.save();
      context.translate(x, y);
      context.scale(scale * flip, scale);
      context.fillStyle = this.organColor(COLORS.kidney, 30);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(8, -25);
      context.bezierCurveTo(-18, -26, -30, -3, -22, 18);
      context.bezierCurveTo(-12, 39, 18, 33, 26, 12);
      context.bezierCurveTo(12, 11, 12, -5, 27, -10);
      context.bezierCurveTo(24, -21, 17, -25, 8, -25);
      context.fill();
      context.stroke();
      context.strokeStyle = this.organColor(COLORS.bloodBright, 31);
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(18, -5);
      context.bezierCurveTo(6, 0, 5, 12, 13, 22);
      context.stroke();
      context.restore();
    }

    drawGutCoil(context, x, y, width, height) {
      context.save();
      context.translate(x, y);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 12;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(-width * 0.48, height * 0.05);
      context.bezierCurveTo(-width * 0.2, -height * 0.48, width * 0.12, height * 0.5, width * 0.44, -height * 0.02);
      context.bezierCurveTo(width * 0.18, height * 0.58, -width * 0.3, height * 0.35, -width * 0.08, -height * 0.38);
      context.stroke();
      context.strokeStyle = this.organColor(COLORS.gut, 40);
      context.lineWidth = 8;
      context.stroke();
      context.strokeStyle = this.organColor(COLORS.gutDark, 41);
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    }

    drawInternalAnatomy(context) {
      context.save();
      context.globalAlpha = 0.64;
      this.drawHeadSkull(context, { fill: false });
      const anatomy = this.mods?.internalAnatomy ?? "Normal Cartoon Guts";
      if (anatomy === "Empty Hollow Head") {
        context.fillStyle = "rgba(10, 7, 8, 0.58)";
        context.beginPath();
        context.ellipse(0, 12, 48, 58, 0, 0, TAU);
        context.fill();
        context.restore();
        return;
      }
      if (anatomy === "Robot Parts" || anatomy === "Clockwork Gears") {
        context.strokeStyle = this.organColor("#9fd8ff", 80);
        context.lineWidth = 5;
        for (let index = 0; index < 4; index += 1) {
          context.beginPath();
          context.arc(-34 + index * 23, -20 + Math.sin(index) * 16, 12 + (index % 2) * 5, 0, TAU);
          context.stroke();
        }
        context.fillStyle = this.organColor("#f6ca45", 81);
        context.fillRect(-44, 34, 88, 18);
        context.restore();
        return;
      }
      if (anatomy === "Plush Stuffing") {
        context.fillStyle = this.organColor("#f2dbc2", 82);
        for (let index = 0; index < 18; index += 1) {
          context.beginPath();
          context.arc(rand(-58, 58), rand(-45, 66), rand(5, 13), 0, TAU);
          context.fill();
        }
        context.restore();
        return;
      }
      if (anatomy === "Balloon Organs") {
        for (const organ of [
          { x: -25, y: -18, rx: 20, ry: 28, color: "#ff70bd" },
          { x: 18, y: -2, rx: 24, ry: 31, color: "#f6ca45" },
          { x: -2, y: 38, rx: 42, ry: 19, color: "#8df7ff" },
        ]) {
          context.fillStyle = this.organColor(organ.color, organ.x + 90);
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 3;
          context.beginPath();
          context.ellipse(organ.x, organ.y, organ.rx, organ.ry, 0.12, 0, TAU);
          context.fill();
          context.stroke();
          context.strokeStyle = "rgba(255,255,255,0.65)";
          context.lineWidth = 2;
          context.beginPath();
          context.arc(organ.x - organ.rx * 0.25, organ.y - organ.ry * 0.25, organ.rx * 0.22, 0, TAU);
          context.stroke();
        }
        context.restore();
        return;
      }
      if (anatomy === "Candy Guts") {
        context.lineWidth = 8;
        context.lineCap = "round";
        for (let i = 0; i < 5; i += 1) {
          context.strokeStyle = this.organColor(["#ff70bd", "#f6ca45", "#8df7ff"][i % 3], i + 100);
          context.beginPath();
          context.arc(-34 + i * 17, 4 + Math.sin(i) * 22, 18, 0.2, TAU - 0.4);
          context.stroke();
        }
        context.fillStyle = this.organColor("#fff8df", 111);
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 3;
        for (const x of [-35, 35]) {
          context.beginPath();
          context.roundRect(x - 14, 38, 28, 18, 7);
          context.fill();
          context.stroke();
        }
        context.restore();
        return;
      }
      if (anatomy === "Slime Core") {
        context.fillStyle = this.organColor("#63e46d", 120, 0.7);
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 4;
        context.beginPath();
        context.ellipse(0, 12, 54, 62, Math.sin(this.time) * 0.1, 0, TAU);
        context.fill();
        context.stroke();
        context.fillStyle = "rgba(255,255,255,0.4)";
        context.beginPath();
        context.arc(-18, -16, 10, 0, TAU);
        context.arc(24, 22, 7, 0, TAU);
        context.fill();
        context.restore();
        return;
      }
      if (anatomy === "Confetti Machine") {
        context.fillStyle = "#5f5960";
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 4;
        context.beginPath();
        context.roundRect(-44, -28, 88, 62, 10);
        context.fill();
        context.stroke();
        for (let i = 0; i < 26; i += 1) {
          context.fillStyle = paletteColorFromType("Confetti", i + this.time);
          context.fillRect(Math.sin(i * 2.2) * 56, Math.cos(i * 1.3) * 52, 8, 5);
        }
        context.restore();
        return;
      }
      this.drawBrainMass(context, 0, -47, 0.78);
      this.drawHeartOrgan(context, -17, 8, 0.52);
      this.drawKidneyOrgan(context, -43, 31, 0.46, -1);
      this.drawKidneyOrgan(context, 44, 31, 0.46, 1);

      context.fillStyle = this.organColor("#f1b34e", 50);
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.ellipse(24, 13, 20, 25, 0.35, 0, TAU);
      context.fill();
      context.stroke();
      this.drawGutCoil(context, 0, 52, 82, 46);

      context.strokeStyle = this.organColor(COLORS.bloodBright, 51);
      context.lineWidth = 2;
      for (let i = 0; i < 10; i += 1) {
        context.beginPath();
        context.moveTo(0, -19);
        context.lineTo(Math.cos(i * 0.68) * 50, Math.sin(i * 0.83) * 46 + 9);
        context.stroke();
      }
      context.restore();
    }

    drawHeadSkull(context, options = {}) {
      const fill = options.fill !== false;
      const boneColor = getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, this.time, 1);
      const crackColor = this.mods?.boneType === "Glass Bones" ? "#eaffff" : this.mods?.boneType === "Metal Bones" ? "#87929b" : "#9d8f63";
      context.save();
      context.globalAlpha *= options.alpha ?? 1;
      context.lineJoin = "round";
      context.lineCap = "round";

      if (fill) {
        context.fillStyle = boneColor;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 4;
        context.beginPath();
        context.ellipse(0, -8, 64, 70, 0, 0, TAU);
        context.fill();
        context.stroke();
        context.beginPath();
        context.roundRect(-38, 30, 76, 36, 13);
        context.fill();
        context.stroke();
      } else {
        context.strokeStyle = boneColor;
        context.lineWidth = 5;
        context.beginPath();
        context.ellipse(0, -8, 64, 70, 0, 0, TAU);
        context.stroke();
        context.beginPath();
        context.roundRect(-38, 30, 76, 36, 13);
        context.stroke();
      }
      drawBoneTextureDetails(context, this.mods?.boneType ?? "Normal Bones", fill, this.time);

      context.fillStyle = "#201719";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      for (const socket of [{ x: -29, y: -24, rx: 18, ry: 23 }, { x: 29, y: -24, rx: 18, ry: 23 }]) {
        context.beginPath();
        context.ellipse(socket.x, socket.y, socket.rx, socket.ry, 0, 0, TAU);
        if (fill) context.fill();
        context.stroke();
      }

      context.beginPath();
      context.moveTo(0, -6);
      context.lineTo(-10, 16);
      context.lineTo(10, 16);
      context.closePath();
      if (fill) context.fill();
      context.stroke();

      context.strokeStyle = fill ? crackColor : boneColor;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-44, 10);
      context.quadraticCurveTo(-24, 30, -6, 22);
      context.moveTo(44, 10);
      context.quadraticCurveTo(24, 30, 6, 22);
      context.stroke();

      context.fillStyle = fill ? getBoneColorForMods(this.mods ?? DEFAULT_MOD_SETTINGS, this.time + 2, 1) : boneColor;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 1.5;
      for (let index = -3; index <= 3; index += 1) {
        context.beginPath();
        context.roundRect(index * 9 - 3, 39 + Math.abs(index) * 1.2, 7, 14, 2);
        if (fill) context.fill();
        context.stroke();
      }

      context.strokeStyle = fill ? crackColor : boneColor;
      context.lineWidth = 2.2;
      context.beginPath();
      context.moveTo(-10, -66);
      context.lineTo(0, -48);
      context.lineTo(-8, -30);
      context.moveTo(16, -58);
      context.lineTo(5, -42);
      context.lineTo(18, -27);
      context.moveTo(-36, 43);
      context.lineTo(36, 43);
      context.stroke();
      context.restore();
    }

    traceFacePiecePatch(context, piece, scale = 1) {
      const points = 18;
      context.beginPath();
      for (let index = 0; index < points; index += 1) {
        const angle = (index / points) * TAU;
        const wobble = 1 + Math.sin(index * 2.13 + piece.wobbleSeed) * 0.075 + Math.cos(index * 3.1 + piece.wobbleSeed) * 0.045;
        const x = Math.cos(angle) * piece.rx * scale * wobble;
        const y = Math.sin(angle) * piece.ry * scale * wobble;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    }

    drawSkullThroughFacePiece(context, piece, scale = 1, alpha = 1) {
      context.save();
      this.traceFacePiecePatch(context, piece, scale);
      context.clip();
      context.rotate(-piece.angle);
      context.translate(-piece.x, -piece.y);
      this.drawHeadSkull(context, { alpha, fill: true });
      context.restore();
    }

    drawFacePieceDamage(context) {
      for (const piece of this.facePieces) {
        const actualLayer = facePieceLayer(piece);
        const layer = this.getDisplayedLayer(actualLayer);
        const visible = layer > 1 || actualLayer > 1 || piece.burn > 5 || piece.dirt > 5 || piece.destroyed || piece.regenProgress > 0;
        if (!visible) continue;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.angle);
        const healingScale = piece.destroyed ? lerp(1, 0.38, piece.regenProgress) : 1;
        context.globalAlpha = piece.destroyed ? lerp(1, 0.62, piece.regenProgress) : 1;

        if (layer > 1) {
          context.fillStyle = COLORS.outline;
          this.traceFacePiecePatch(context, piece, healingScale * 1.08);
          context.fill();
        }

        if (layer >= 5) {
          this.drawFaceOrganWindow(context, piece, healingScale);
        } else if (layer === 4) {
          context.fillStyle = this.organColor(COLORS.muscleDark, piece.wobbleSeed);
          this.traceFacePiecePatch(context, piece, 1.02);
          context.fill();
          this.drawSkullThroughFacePiece(context, piece, 0.84, 1);
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 2.5;
          for (let index = -2; index <= 2; index += 1) {
            context.beginPath();
            context.moveTo(index * 7 - piece.rx * 0.38, -piece.ry * 0.18 + Math.abs(index) * 2);
            context.lineTo(index * 8 + piece.rx * 0.3, piece.ry * 0.22 - Math.abs(index) * 1.4);
            context.stroke();
          }
        } else if (layer === 3) {
          context.fillStyle = this.organColor(COLORS.muscle, piece.wobbleSeed);
          this.traceFacePiecePatch(context, piece, 1);
          context.fill();
          context.strokeStyle = this.organColor(COLORS.muscleDark, piece.wobbleSeed + 4);
          context.lineWidth = 3;
          for (let index = -3; index <= 3; index += 1) {
            context.beginPath();
            context.moveTo(-piece.rx * 0.58, index * 5);
            context.quadraticCurveTo(0, index * 2 + Math.sin(index + this.time * 7) * 3, piece.rx * 0.58, index * 4);
            context.stroke();
          }
        } else if (layer === 2) {
          context.fillStyle = COLORS.fat;
          this.traceFacePiecePatch(context, piece, 1);
          context.fill();
          context.fillStyle = "rgba(255, 246, 188, 0.55)";
          for (let index = 0; index < 4; index += 1) {
            context.beginPath();
            context.ellipse(
              Math.cos(index * 1.7 + piece.wobbleSeed) * piece.rx * 0.28,
              Math.sin(index * 1.2 + piece.wobbleSeed) * piece.ry * 0.22,
              piece.rx * 0.18,
              piece.ry * 0.16,
              index * 0.7,
              0,
              TAU,
            );
            context.fill();
          }
        }

        if (piece.burn > 5) {
          context.save();
          context.globalAlpha = clamp(piece.burn / 165, 0.16, 0.64);
          context.fillStyle = COLORS.soot;
          this.traceFacePiecePatch(context, piece, layer > 1 ? 0.9 : 0.72);
          context.fill();
          context.restore();
        }
        if (piece.dirt > 5) {
          context.save();
          context.globalAlpha = clamp(piece.dirt / 120, 0.12, 0.36);
          context.fillStyle = "#3c2b21";
          this.traceFacePiecePatch(context, piece, 0.58);
          context.fill();
          context.restore();
        }
        context.restore();
      }
    }

    drawFaceOrganWindow(context, piece, scale) {
      context.fillStyle = this.organColor(COLORS.muscleDark, piece.wobbleSeed);
      this.traceFacePiecePatch(context, piece, scale);
      context.fill();

      context.save();
      this.traceFacePiecePatch(context, piece, scale * 0.92);
      context.clip();
      context.fillStyle = "#241419";
      context.fillRect(-piece.rx, -piece.ry, piece.rx * 2, piece.ry * 2);

      if (piece.organPocket) {
        const pulse = Math.sin(this.time * 8 + piece.wobbleSeed) * 0.08;
        const organType = piece.organType ?? "guts";
        if (organType === "brain") {
          this.drawBrainMass(context, 0, piece.ry * 0.02, Math.min(piece.rx / 48, piece.ry / 27) * (1 + pulse));
        } else if (organType === "heart") {
          this.drawHeartOrgan(context, 0, piece.ry * 0.04, Math.min(piece.rx / 26, piece.ry / 26) * (0.9 + pulse));
        } else if (organType === "kidney") {
          this.drawKidneyOrgan(context, -piece.rx * 0.16, piece.ry * 0.03, Math.min(piece.rx / 36, piece.ry / 34) * (0.9 + pulse), piece.x < 0 ? -1 : 1);
          this.drawKidneyOrgan(context, piece.rx * 0.2, piece.ry * 0.18, Math.min(piece.rx / 46, piece.ry / 44) * 0.7, piece.x < 0 ? 1 : -1);
        } else {
          this.drawGutCoil(context, 0, piece.ry * 0.08, piece.rx * 1.08, piece.ry * 0.92);
          context.fillStyle = this.organColor("#f1b34e", piece.wobbleSeed);
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 2.2;
          context.beginPath();
          context.ellipse(piece.rx * 0.23, -piece.ry * 0.08, piece.rx * 0.18, piece.ry * 0.28, 0.28, 0, TAU);
          context.fill();
          context.stroke();
        }
        context.strokeStyle = this.organColor(COLORS.bloodBright, piece.wobbleSeed + 1);
        context.lineWidth = 2;
        for (let index = 0; index < 5; index += 1) {
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(Math.cos(index * 1.35 + piece.wobbleSeed) * piece.rx * 0.54, Math.sin(index * 1.2) * piece.ry * 0.46);
          context.stroke();
        }
      } else {
        context.fillStyle = COLORS.bone;
        for (let index = -1; index <= 1; index += 1) {
          context.beginPath();
          context.roundRect(index * 14 - 4, -piece.ry * 0.1 + Math.abs(index) * 3, 9, piece.ry * 0.44, 2);
          context.fill();
        }
      }
      context.restore();

      context.strokeStyle = COLORS.outline;
      context.lineWidth = 4;
      this.traceFacePiecePatch(context, piece, scale);
      context.stroke();
      context.strokeStyle = this.organColor(COLORS.bloodBright, piece.wobbleSeed + 2);
      context.lineWidth = 2.4;
      context.beginPath();
      context.moveTo(-piece.rx * 0.52 * scale, piece.ry * 0.32 * scale);
      context.lineTo(-piece.rx * 0.36 * scale, piece.ry * 0.64 * scale);
      context.moveTo(piece.rx * 0.34 * scale, piece.ry * 0.36 * scale);
      context.lineTo(piece.rx * 0.42 * scale, piece.ry * 0.7 * scale);
      context.stroke();
    }

    drawHeadWounds(context) {
      for (const regionId of ["headShell", "mouthJaw"]) {
        for (const wound of this.regions[regionId].wounds) {
          if (wound.localX === undefined) continue;
          drawWoundPatch(context, wound.localX, wound.localY, wound.size, wound.layer, wound.angle, wound.type, wound.style, wound.goreColor);
        }
      }
    }

    drawHeadDestructionOverlay(context) {
      const jawRegion = this.regions.mouthJaw;
      if (jawRegion.severed || jawRegion.destroyed) {
        context.save();
        context.fillStyle = COLORS.muscleDark;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 5;
        context.beginPath();
        context.ellipse(0, 58, 48, 24, 0.05, 0, TAU);
        context.fill();
        context.stroke();
        context.fillStyle = COLORS.bone;
        for (let i = -2; i <= 2; i += 1) {
          context.beginPath();
          context.roundRect(i * 13 - 4, 47 + Math.abs(i) * 2, 8, 14, 2);
          context.fill();
        }
        context.restore();
      }
    }

    isFaceFeatureGone(pieceId, minimumLayer = 5) {
      const piece = this.facePieces.find((candidate) => candidate.id === pieceId);
      return !!piece && facePieceLayer(piece) >= minimumLayer;
    }

    drawFace(context) {
      const headGone = this.regions.headShell.destroyed || this.regions.headShell.severed;
      const jawGone = this.regions.mouthJaw.destroyed || this.regions.mouthJaw.severed;
      const leftEyeGone = this.isFaceFeatureGone("leftEye");
      const rightEyeGone = this.isFaceFeatureGone("rightEye");
      const noseGone = this.isFaceFeatureGone("nose", 4);
      const mouthGone = this.isFaceFeatureGone("mouth");
      const expression = this.getExpressionForDisplay();
      const rabid = expression === "rabid";
      const panic = expression === "panic" || expression === "scream" || rabid;
      const pain = expression === "pain";
      const dazed = expression === "dazed" || rabid;
      const angry = expression === "angry";
      const blank = expression === "blank";
      const dead = expression === "dead";
      const nervous = expression === "nervous";
      const confused = expression === "confused";
      const t = this.time;
      const pupilShake = rabid ? Math.sin(t * 88) * 6.5 : panic || pain || nervous ? Math.sin(t * 48) * 2.2 : 0;
      const appearance = this.getAppearanceColors();

      const leftLook = dead || dazed ? { x: 0, y: 0 } : this.getEyeLookOffset(-34, -26);
      const rightLook = dead || dazed ? { x: 0, y: 0 } : this.getEyeLookOffset(34, -26);

      if (!headGone && !leftEyeGone) this.drawEye(context, -34, -26, {
        open: dead ? 0.4 : panic ? 1.45 : pain ? 0.82 : blank ? 0.72 : 1,
        pupilX: dead ? 0 : pupilShake - (confused ? 4 : 0) + leftLook.x,
        pupilY: rabid ? Math.sin(t * 31) * 8 : dazed ? Math.sin(t * 8) * 4 : panic ? -3 : leftLook.y,
        dead,
        dazed,
        crazy: rabid,
        style: this.mods?.eyeStyle ?? "Normal Eyes",
        eyeColor: appearance.eye,
      });
      if (!headGone && !rightEyeGone) this.drawEye(context, 34, -26, {
        open: dead ? 0.4 : panic ? 1.45 : pain ? 0.82 : blank ? 0.72 : 1,
        pupilX: dead ? 0 : -pupilShake + (confused ? 5 : 0) + rightLook.x,
        pupilY: rabid ? Math.cos(t * 29) * 8 : dazed ? Math.cos(t * 8) * 4 : panic ? -3 : rightLook.y,
        dead,
        dazed,
        crazy: rabid,
        style: this.mods?.eyeStyle ?? "Normal Eyes",
        eyeColor: appearance.eye,
      });

      context.strokeStyle = COLORS.outline;
      context.lineWidth = 7;
      context.lineCap = "round";
      const browTilt = angry ? 0.85 : pain ? -0.6 : panic ? 0.2 : confused ? -0.35 : 0;
      if (!headGone) {
        if (!leftEyeGone) {
          context.beginPath();
          context.moveTo(-58, -54 + browTilt * 9);
          context.lineTo(-18, -62 - browTilt * 11);
          context.stroke();
        }
        if (!rightEyeGone) {
          context.beginPath();
          context.moveTo(18, -62 + browTilt * 11);
          context.lineTo(58, -54 - browTilt * 9);
          context.stroke();
        }
      }

      if (!headGone && !noseGone) {
        context.fillStyle = appearance.nose;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 5;
        context.beginPath();
        const noseScale = this.mods?.noseType === "Tiny Nose" ? 0.62 : this.mods?.noseType === "Long Nose" ? 1.28 : this.mods?.noseType === "Balloon Nose" ? 1.42 : 1;
        context.ellipse(0, 2 + (pain ? 3 : 0), (panic ? 22 : 19) * noseScale, (this.mods?.noseType === "Long Nose" ? 30 : panic ? 22 : 19), 0, 0, TAU);
        context.fill();
        context.stroke();
        context.fillStyle = "rgba(255,255,255,0.55)";
        context.beginPath();
        context.arc(-7, -5, 5, 0, TAU);
        context.fill();
        if (this.mods?.noseType === "Button Nose") {
          context.fillStyle = COLORS.outline;
          context.beginPath();
          context.arc(-6, 3, 2.5, 0, TAU);
          context.arc(6, 3, 2.5, 0, TAU);
          context.fill();
        } else if (this.mods?.noseType === "Squeaky Nose") {
          context.strokeStyle = "#fff8ea";
          context.lineWidth = 2;
          context.beginPath();
          context.arc(8, -5, 8, 0.2, 1.5);
          context.stroke();
        } else if (this.mods?.noseType === "Broken Nose") {
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(-11, -4);
          context.lineTo(6, 2);
          context.lineTo(-2, 11);
          context.stroke();
        }
      }

      if (headGone || jawGone || mouthGone) {
        return;
      }

      const forcedMouth = this.mods?.mouthStyle ?? "Big Smile";
      if (forcedMouth === "Frown") {
        context.strokeStyle = COLORS.nose;
        context.lineWidth = 7;
        context.beginPath();
        context.arc(0, 78, 42, Math.PI + 0.1, TAU - 0.1);
        context.stroke();
      } else if (forcedMouth === "Tiny Mouth") {
        context.fillStyle = COLORS.mouth;
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 4;
        context.beginPath();
        context.ellipse(0, 52, 18, 9, 0, 0, TAU);
        context.fill();
        context.stroke();
      } else if (forcedMouth === "Open Scream" && !dead) {
        this.drawScreamMouth(context, true);
      } else if (forcedMouth === "Deadpan Line") {
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 6;
        context.beginPath();
        context.moveTo(-38, 52);
        context.lineTo(38, 52);
        context.stroke();
      } else if (["Sharp Teeth", "Missing Teeth", "Zipper Mouth", "Wobbly Lip"].includes(forcedMouth)) {
        drawPreviewMouth(context, this.mods ?? DEFAULT_MOD_SETTINGS);
      } else if (panic || expression === "scream") {
        this.drawScreamMouth(context, expression === "scream" || rabid);
        if (rabid) this.drawMouthFoam(context);
      } else if (pain || dazed) {
        this.drawGrimace(context, pain);
      } else if (dead) {
        this.drawDeadMouth(context);
      } else if (angry) {
        this.drawAngryMouth(context);
      } else {
        this.drawGrin(context, nervous, blank);
      }
    }

    drawEye(context, x, y, options) {
      context.save();
      context.translate(x, y);
      const style = options.style ?? "Normal Eyes";
      const eyeScale = style === "Giant Eyes" ? 1.32 : style === "Tiny Dot Eyes" ? 0.55 : 1;
      const eyeOpen = style === "Sleepy Eyes" ? Math.min(options.open, 0.48) : options.open;
      context.fillStyle = COLORS.teeth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(0, 0, 21 * eyeScale, 23 * eyeOpen * eyeScale, 0, 0, TAU);
      context.fill();
      context.stroke();
      if (options.dead || style === "X Eyes") {
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(-8, -8);
        context.lineTo(8, 8);
        context.moveTo(8, -8);
        context.lineTo(-8, 8);
        context.stroke();
      } else if (style === "Button Eyes") {
        context.fillStyle = options.eyeColor ?? COLORS.outline;
        context.beginPath();
        context.arc(options.pupilX, options.pupilY, 10, 0, TAU);
        context.fill();
        context.stroke();
        context.strokeStyle = COLORS.teeth;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(options.pupilX - 5, options.pupilY);
        context.lineTo(options.pupilX + 5, options.pupilY);
        context.moveTo(options.pupilX, options.pupilY - 5);
        context.lineTo(options.pupilX, options.pupilY + 5);
        context.stroke();
      } else if (options.crazy) {
        context.fillStyle = COLORS.outline;
        for (let index = 0; index < 3; index += 1) {
          context.beginPath();
          context.arc(options.pupilX + Math.cos(this.time * 18 + index * 2.2) * 7, options.pupilY + Math.sin(this.time * 21 + index) * 6, index === 0 ? 6.5 : 3.2, 0, TAU);
          context.fill();
        }
        context.strokeStyle = COLORS.red ?? COLORS.nose;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(-13, -7);
        context.lineTo(-3, 2);
        context.lineTo(-13, 9);
        context.moveTo(13, -8);
        context.lineTo(4, 0);
        context.lineTo(13, 8);
        context.stroke();
      } else if (options.dazed || style === "Spiral Eyes") {
        context.strokeStyle = COLORS.outline;
        context.lineWidth = 3;
        context.beginPath();
        for (let i = 0; i < 24; i += 1) {
          const r = i * 0.55;
          const a = i * 0.62;
          const px = options.pupilX + Math.cos(a) * r;
          const py = options.pupilY + Math.sin(a) * r;
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.stroke();
      } else {
        context.fillStyle = style === "Glowing Eyes" ? "#7ff7ff" : options.eyeColor ?? COLORS.outline;
        context.beginPath();
        context.arc(options.pupilX, options.pupilY, 7.5, 0, TAU);
        context.fill();
        if (style === "Crying Eyes") {
          context.fillStyle = "#75d9ff";
          context.beginPath();
          context.ellipse(options.pupilX - 3, 24, 5, 12, 0.2, 0, TAU);
          context.fill();
        } else if (style === "Angry Eyes") {
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 4;
          context.beginPath();
          context.moveTo(x < 0 ? -15 : -2, -18);
          context.lineTo(x < 0 ? 16 : 15, -7);
          context.stroke();
        }
      }
      context.restore();
    }

    drawMouthFoam(context) {
      context.save();
      context.fillStyle = "#f4fff1";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 2.5;
      const bubbles = [
        { x: -26, y: 77, r: 9 },
        { x: -14, y: 83, r: 6 },
        { x: 1, y: 78, r: 8 },
        { x: 17, y: 82, r: 7 },
        { x: 29, y: 74, r: 5 },
        { x: -4, y: 93, r: 5 },
      ];
      for (const bubble of bubbles) {
        const wobble = Math.sin(this.time * 18 + bubble.x) * 1.6;
        context.beginPath();
        context.arc(bubble.x + wobble, bubble.y + Math.cos(this.time * 15 + bubble.r) * 1.2, bubble.r, 0, TAU);
        context.fill();
        context.stroke();
      }
      context.fillStyle = "rgba(244, 255, 241, 0.78)";
      context.beginPath();
      context.ellipse(4, 86, 37, 8, 0.03, 0, TAU);
      context.fill();
      context.restore();
    }

    drawGrin(context, nervous, blank) {
      context.strokeStyle = COLORS.nose;
      context.lineWidth = 7;
      context.lineCap = "round";
      context.beginPath();
      context.arc(0, 28, blank ? 30 : 50, 0.05, Math.PI - 0.05);
      context.stroke();
      context.fillStyle = COLORS.mouth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(0, 54, nervous ? 36 : 48, nervous ? 13 : 16, 0, 0, Math.PI);
      context.fill();
      context.stroke();
      this.drawTeeth(context, -34, 47, 68, 12, nervous ? 5 : 7);
    }

    drawScreamMouth(context, wide) {
      context.fillStyle = COLORS.mouth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(0, 50, wide ? 34 : 27, wide ? 43 : 34, 0, 0, TAU);
      context.fill();
      context.stroke();
      this.drawTeeth(context, -21, 15, 42, 13, 4);
      context.fillStyle = "#f17b93";
      context.beginPath();
      context.ellipse(4, 78, 14, 20, 0.15, 0, TAU);
      context.fill();
    }

    drawGrimace(context, pain) {
      context.fillStyle = COLORS.mouth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.roundRect(-43, 39, 86, pain ? 29 : 22, 10);
      context.fill();
      context.stroke();
      this.drawTeeth(context, -36, 43, 72, pain ? 20 : 14, 7);
    }

    drawDeadMouth(context) {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 6;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(-42, 50);
      context.bezierCurveTo(-20, 62, 9, 39, 40, 55);
      context.stroke();
      context.fillStyle = "#f17b93";
      context.beginPath();
      context.ellipse(18, 62, 8, 17, -0.5, 0, TAU);
      context.fill();
    }

    drawAngryMouth(context) {
      context.fillStyle = COLORS.mouth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.roundRect(-36, 43, 72, 22, 8);
      context.fill();
      context.stroke();
      this.drawTeeth(context, -31, 46, 62, 14, 6);
    }

    drawTeeth(context, x, y, width, height, count) {
      context.fillStyle = COLORS.teeth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 1.5;
      const toothWidth = width / count;
      for (let i = 0; i < count; i += 1) {
        context.beginPath();
        context.roundRect(x + i * toothWidth, y, toothWidth + 1, height, 2);
        context.fill();
        context.stroke();
      }
    }

    drawDebug(context) {
      context.save();
      context.strokeStyle = "rgba(57, 193, 211, 0.9)";
      context.lineWidth = 1;
      for (const anchorName of Object.keys(this.anchors)) {
        const anchor = this.headAnchor(anchorName);
        context.beginPath();
        context.arc(anchor.x, anchor.y, 5, 0, TAU);
        context.stroke();
        context.fillStyle = "rgba(255,255,255,0.85)";
        context.fillText(anchorName, anchor.x + 7, anchor.y - 5);
      }
      context.strokeStyle = "rgba(255, 202, 69, 0.7)";
      for (const particle of this.particles) {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, TAU);
        context.stroke();
      }
      if (this.guts.exposed) {
        context.strokeStyle = "rgba(242, 125, 155, 0.9)";
        for (const particle of this.guts.particles) {
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, TAU);
          context.stroke();
        }
      }
      context.restore();
    }
  }

  class AudienceSoundHooks {
    // Placeholder sound hook surface. Replace these methods with real audio events later.
    trigger(name, payload = {}) {
      console.debug(`[audience sound] ${name}`, payload);
    }

    smallLaugh(payload) {
      this.trigger("small-laugh", payload);
    }

    bigLaugh(payload) {
      this.trigger("big-laugh", payload);
    }

    cheer(payload) {
      this.trigger("cheer", payload);
    }

    boo(payload) {
      this.trigger("boo", payload);
    }

    gasp(payload) {
      this.trigger("gasp", payload);
    }

    standingOvation(payload) {
      this.trigger("standing-ovation", payload);
    }
  }

  class ComboTracker {
    constructor() {
      this.reset();
    }

    reset() {
      this.count = 0;
      this.multiplier = 1;
      this.lastHitTime = -999;
      this.lastType = null;
      this.sameTypeStreak = 0;
      this.recentTypes = [];
      this.bestCombo = 0;
    }

    // Combos are time-window based: each qualifying damage event inside the window extends the chain.
    record(type, amount, now) {
      if (now - this.lastHitTime <= ClownTuning.audience.comboWindow) {
        this.count += 1;
      } else {
        this.count = 1;
        this.recentTypes.length = 0;
      }
      this.sameTypeStreak = type === this.lastType ? this.sameTypeStreak + 1 : 1;
      this.lastType = type;
      this.lastHitTime = now;
      this.bestCombo = Math.max(this.bestCombo, this.count);
      this.recentTypes.push({ type, time: now, amount });
      this.recentTypes = this.recentTypes.filter((entry) => now - entry.time <= 5.5).slice(-10);

      const varietyCount = this.getVarietyCount(now);
      const chainBonus = Math.max(0, this.count - 1) * 0.32;
      const forceBonus = amount > 70 ? 0.25 : amount > 38 ? 0.12 : 0;
      const varietyBonus = Math.max(0, varietyCount - 1) * 0.12;
      this.multiplier = clamp(1 + chainBonus + forceBonus + varietyBonus, 1, 5);
      return this.getStats(now);
    }

    update(now) {
      if (this.count > 0 && now - this.lastHitTime > ClownTuning.audience.comboWindow) {
        this.count = 0;
        this.multiplier = 1;
        this.sameTypeStreak = 0;
      }
      this.recentTypes = this.recentTypes.filter((entry) => now - entry.time <= 5.5);
    }

    getVarietyCount(now = state.gameTime) {
      return new Set(this.recentTypes.filter((entry) => now - entry.time <= 5.5).map((entry) => entry.type)).size;
    }

    getStats(now = state.gameTime) {
      return {
        count: this.count,
        multiplier: this.multiplier,
        sameTypeStreak: this.sameTypeStreak,
        varietyCount: this.getVarietyCount(now),
        bestCombo: this.bestCombo,
      };
    }
  }

  class ScoreManager {
    constructor() {
      this.reset();
    }

    reset() {
      this.score = 0;
      this.eventScore = 0;
      this.laughScore = 0;
      this.requestScore = 0;
      this.bursts = [];
    }

    // Score is audience-first: damage creates a reaction, then intensity/volume/duration create points.
    addEventScore(event, reaction, comboStats) {
      if (reaction.state === "boo") {
        this.addBurst("NO POINTS", event.point.x, event.point.y - 32, "#c8b9a2");
        return 0;
      }
      const comboMultiplier = comboStats?.multiplier ?? 1;
      const varietyMultiplier = 1 + Math.max(0, (comboStats?.varietyCount ?? 1) - 1) * 0.08;
      const audienceValue = reaction.intensity * reaction.volume;
      const goreValue = event.goreAmount * 1.35 + Math.max(0, event.layer - 1) * 26;
      const specialValue = (event.causedGutSpill ? 180 : 0) + (event.causedSever ? 120 : 0) + (event.causedBreak ? 90 : 0) + (event.causedDestroy ? 180 : 0) + (event.ceilingHit ? 90 : 0);
      const raw = (event.amount * 1.1 + goreValue + specialValue + 35) * audienceValue;
      const gained = Math.max(0, raw * comboMultiplier * varietyMultiplier * reaction.scoreScale);
      this.score += gained;
      this.eventScore += gained;
      if (gained >= 20) {
        this.addBurst(`+${formatScore(gained)}`, event.point.x, event.point.y - 46, reaction.color);
      }
      return gained;
    }

    // Sustained laughter keeps paying for a short time, so long laughs matter even after impact.
    update(dt, audienceManager, comboStats) {
      const reaction = audienceManager.currentReaction;
      const laughing = ["chuckle", "laugh", "cheer", "standingOvation"].includes(reaction.state);
      if (!laughing || reaction.timer <= 0) {
        this.updateBursts(dt);
        return;
      }
      const comboMultiplier = comboStats.multiplier;
      const perSecond = ClownTuning.audience.scorePerLaughSecond * reaction.intensity * reaction.volume * (1 + (comboMultiplier - 1) * 0.45);
      const gained = perSecond * dt;
      this.score += gained;
      this.laughScore += gained;
      this.updateBursts(dt);
    }

    addRequestBonus(request) {
      const gained = request.bonus ?? ClownTuning.audience.requestBonus;
      this.score += gained;
      this.requestScore += gained;
      this.addBurst(`REQUEST +${formatScore(gained)}`, state.width * 0.5, 126, "#f6ca45");
    }

    addOvationBonus(x, y) {
      const gained = 850;
      this.score += gained;
      this.addBurst(`OVATION +${formatScore(gained)}`, x, y, "#39c1d3");
    }

    addFlatScore(amount, text, x = state.width * 0.5, y = 128, color = "#fff4df") {
      this.score += amount;
      if (Math.abs(amount) >= 1) {
        const prefix = amount >= 0 ? "+" : "";
        this.addBurst(`${text} ${prefix}${formatScore(amount)}`, x, y, color);
      }
      return amount;
    }

    addBurst(text, x, y, color = "#fff4df") {
      this.bursts.push({
        text,
        x,
        y,
        vy: rand(-42, -18),
        life: 1.1,
        color,
        size: text.includes("OVATION") || text.includes("REQUEST") ? 28 : 20,
      });
      if (this.bursts.length > 18) this.bursts.shift();
    }

    updateBursts(dt) {
      for (let index = this.bursts.length - 1; index >= 0; index -= 1) {
        const burst = this.bursts[index];
        burst.y += burst.vy * dt;
        burst.vy += 18 * dt;
        burst.life -= dt;
        if (burst.life <= 0) this.bursts.splice(index, 1);
      }
    }

    draw(context) {
      context.save();
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (const burst of this.bursts) {
        context.globalAlpha = clamp(burst.life, 0, 1);
        context.font = `900 ${burst.size}px Trebuchet MS, Arial`;
        context.lineWidth = 5;
        context.strokeStyle = "#110d0e";
        context.fillStyle = burst.color;
        context.strokeText(burst.text, burst.x, burst.y);
        context.fillText(burst.text, burst.x, burst.y);
      }
      context.restore();
    }
  }

  class AudienceRequestManager {
    constructor() {
      this.requests = [
        {
          id: "launch",
          text: "Launch the clown into the air",
          bonus: 1200,
          check: (event, context) => event?.launchHeight > 360 || context.launchHeight > 390,
        },
        {
          id: "combo3",
          text: "Get a 3-hit combo",
          bonus: 900,
          check: (_event, context) => context.combo.count >= 3,
        },
        {
          id: "fire",
          text: "Use fire damage",
          bonus: 850,
          check: (event) => event?.type === "burning",
        },
        {
          id: "blood",
          text: "Cause a big blood splatter",
          bonus: 1100,
          check: (event) => event?.goreAmount >= 34,
        },
        {
          id: "ceiling",
          text: "Hit the clown into the ceiling",
          bonus: 1250,
          check: (event, context) => Boolean(event?.ceilingHit) || context.ceilingContact,
        },
        {
          id: "upsideDown",
          text: "End with the clown upside down",
          bonus: 1000,
          check: (_event, context) => context.upsideDown,
        },
        {
          id: "variety",
          text: "Use at least 3 different damage types",
          bonus: 1050,
          check: (_event, context) => context.seenDamageTypes >= 3,
        },
        {
          id: "gasp",
          text: "Make the audience gasp",
          bonus: 950,
          check: (_event, context) => context.gaspTriggered,
        },
        {
          id: "ovation",
          text: "Trigger a standing ovation",
          bonus: 1500,
          check: (_event, context) => context.standingOvationTriggered,
        },
      ];
      this.reset();
    }

    reset() {
      this.current = this.requests[Math.floor(rand(0, this.requests.length))];
      this.completed = false;
      this.seenDamageTypes = new Set();
      this.gaspTriggered = false;
      this.standingOvationTriggered = false;
    }

    // Requests are intentionally small predicates over the same event/context data used by scoring.
    handleEvent(event, context) {
      if (event?.type) this.seenDamageTypes.add(event.type);
      if (context.reactionState === "shock") this.gaspTriggered = true;
      if (context.reactionState === "standingOvation") this.standingOvationTriggered = true;
      return this.checkCompletion(event, context);
    }

    updateContinuous(context) {
      return this.checkCompletion(null, context);
    }

    checkCompletion(event, context) {
      if (this.completed || !this.current) return null;
      const requestContext = {
        ...context,
        seenDamageTypes: this.seenDamageTypes.size,
        gaspTriggered: this.gaspTriggered,
        standingOvationTriggered: this.standingOvationTriggered,
      };
      if (!this.current.check(event, requestContext)) return null;
      this.completed = true;
      return this.current;
    }
  }

  class AudienceManager {
    constructor({ scoreManager, comboTracker, requestManager, soundHooks }) {
      this.scoreManager = scoreManager;
      this.comboTracker = comboTracker;
      this.requestManager = requestManager;
      this.soundHooks = soundHooks;
      this.members = this.createMembers();
      this.reset();
    }

    createMembers() {
      // To add new audience types later, add per-member traits here and branch in drawMember.
      // The reaction state stays shared, while individual traits can change silhouettes, timing, or props.
      const members = [];
      const cols = 14;
      const rows = 3;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          members.push({
            col,
            row,
            cols,
            rows,
            phase: rand(0, TAU),
            color: ["#3b3032", "#47383d", "#2e343e", "#493640"][Math.floor(rand(0, 4))],
            shirt: ["#e23535", "#39c1d3", "#f6ca45", "#49bf70", "#9b6df2"][Math.floor(rand(0, 5))],
          });
        }
      }
      return members;
    }

    reset() {
      this.currentReaction = {
        state: "idle",
        text: "Audience is watching.",
        intensity: 0,
        duration: 0,
        timer: 0,
        volume: 0,
        color: "#fff4df",
        scoreScale: 1,
      };
      this.pendingReaction = null;
      this.boredomByType = new Map();
      this.screenShake = 0;
      this.borderAlpha = 0;
      this.borderColor = "#f6ca45";
      this.lastOvationAt = -999;
      this.lastOvationBonusAt = -999;
      this.maxLaunchHeight = 0;
      this.updateReactionDom();
    }

    // Reaction level is chosen from entertainment value, with penalties for repeated same-type spam.
    handleDamageEvent(event) {
      if (!event || event.amount < 1) return;
      const actorMods = event.actor?.mods ?? {};
      const combo = this.comboTracker.record(event.type, event.amount, state.gameTime);
      this.addBoredom(event.type, combo.sameTypeStreak);
      const boredomPenalty = this.getBoredomPenalty(event.type, combo.sameTypeStreak);
      const launchBonus = clamp((event.launchHeight - 280) / 160, 0, 1) * 24;
      const specialBonus = (event.causedGutSpill ? 32 : 0) + (event.causedSever ? 24 : 0) + (event.causedBreak ? 16 : 0) + (event.causedDestroy ? 28 : 0) + (event.ceilingHit ? 20 : 0);
      const funnyMultiplier = Math.max(0, actorMods.funnyMultiplier ?? 1);
      const favoriteScale = actorMods.audienceFavorite ? 1.28 : actorMods.audienceHates ? 0.58 : 1;
      const sympathyScale = clamp(1 - ((actorMods.crowdSympathy ?? 0) / 100) * clamp((event.amount + event.goreAmount) / 180, 0, 0.55), 0.35, 1);
      const rawEntertainment = (event.amount * 0.62 + event.goreAmount * 0.34 + Math.max(0, event.layer - 1) * 12 + combo.count * 7 + combo.varietyCount * 4 + launchBonus + specialBonus) * funnyMultiplier * favoriteScale * sympathyScale;
      const entertainment = rawEntertainment * (1 - boredomPenalty);
      const shockThreshold = 72 / Math.max(0.3, (actorMods.shockValue ?? 100) / 100);
      const unexpected = event.amount > shockThreshold || event.causedGutSpill || event.causedSever || event.type === "explosion";

      let reaction = this.chooseReaction(event, entertainment, combo, boredomPenalty, unexpected);
      reaction.scoreScale *= favoriteScale * Math.max(0.05, funnyMultiplier);
      if (actorMods.audienceHates && reaction.state !== "boo" && entertainment < 50) {
        reaction = { ...reaction, state: "boo", text: "AUDIENCE HATES THIS CLOWN", intensity: 0.15, volume: 0.28, scoreScale: 0 };
      }
      if ((actorMods.crowdSympathy ?? 0) > 74 && event.goreAmount > 90 && reaction.state !== "shock") {
        reaction = { ...reaction, state: "shock", text: "AUDIENCE FEELS BAD", intensity: 0.55, duration: 0.62, timer: 0.62, volume: 0.66, scoreScale: 0.18 };
      }
      const requestContext = this.buildContext(reaction.state);
      const completedRequest = this.requestManager.handleEvent(event, {
        ...requestContext,
        reactionState: reaction.state,
        combo,
      });

      if (reaction.state === "shock") {
        this.setReaction(reaction);
        this.soundHooks.gasp({ event, reaction });
        this.pendingReaction = {
          delay: 0.42,
          reaction: this.chooseReaction(event, Math.max(entertainment, 58), combo, 0, false, true),
          event,
          combo,
        };
      } else {
        this.setReaction(reaction);
        this.playSoundForReaction(reaction, event);
      }

      this.scoreManager.addEventScore(event, reaction, combo);
      if (completedRequest) this.completeRequest(completedRequest);
    }

    chooseReaction(event, entertainment, combo, boredomPenalty, unexpected, afterShock = false) {
      if (boredomPenalty > 0.58 && combo.sameTypeStreak >= 5 && entertainment < 46) {
        return {
          state: "boo",
          text: "BOO! MIX IT UP!",
          intensity: 0.12,
          duration: 1.1,
          timer: 1.1,
          volume: 0.18,
          color: "#c8b9a2",
          scoreScale: 0,
        };
      }

      if (unexpected && !afterShock) {
        return {
          state: "shock",
          text: "AUDIENCE GASPS",
          intensity: 0.72,
          duration: 0.48,
          timer: 0.48,
          volume: 0.88,
          color: "#39c1d3",
          scoreScale: 0.45,
        };
      }

      if ((combo.count >= 8 || entertainment >= 112) && state.gameTime - this.lastOvationAt > 3.4) {
        this.lastOvationAt = state.gameTime;
        return {
          state: "standingOvation",
          text: "STANDING OVATION",
          intensity: 1,
          duration: 2.4,
          timer: 2.4,
          volume: 1,
          color: "#39c1d3",
          scoreScale: 1.75,
        };
      }
      if (combo.count >= 5 || entertainment >= 72) {
        return {
          state: "cheer",
          text: combo.count >= 5 ? "AUDIENCE LOVES IT" : "HUGE LAUGH BONUS",
          intensity: 0.86,
          duration: 1.6,
          timer: 1.6,
          volume: 0.92,
          color: "#f6ca45",
          scoreScale: 1.32,
        };
      }
      if (entertainment >= 38) {
        return {
          state: "laugh",
          text: combo.count >= 3 ? `COMBO x${combo.count}` : "BIG LAUGH",
          intensity: 0.62,
          duration: 1.18,
          timer: 1.18,
          volume: 0.7,
          color: "#fff4df",
          scoreScale: 1,
        };
      }
      if (entertainment >= 12) {
        return {
          state: "chuckle",
          text: "CHUCKLE",
          intensity: 0.3,
          duration: 0.72,
          timer: 0.72,
          volume: 0.38,
          color: "#fff4df",
          scoreScale: 0.55,
        };
      }
      return {
        state: "idle",
        text: "Audience is waiting.",
        intensity: 0,
        duration: 0,
        timer: 0,
        volume: 0,
        color: "#fff4df",
        scoreScale: 0,
      };
    }

    setReaction(reaction) {
      if (reaction.state === "idle" && this.currentReaction.timer > 0) return;
      this.currentReaction = { ...reaction };
      const effect = reaction.intensity * reaction.volume;
      this.screenShake = Math.max(this.screenShake, effect * (reaction.state === "standingOvation" ? 18 : 8));
      this.borderAlpha = Math.max(this.borderAlpha, effect * (reaction.state === "standingOvation" ? 0.95 : 0.55));
      this.borderColor = reaction.state === "standingOvation"
        ? ["#f6ca45", "#39c1d3", "#e23535", "#49bf70"][Math.floor(rand(0, 4))]
        : reaction.color;
      if (reaction.state === "standingOvation" && state.gameTime - this.lastOvationBonusAt > 1.2) {
        this.lastOvationBonusAt = state.gameTime;
        this.scoreManager.addOvationBonus(state.width * 0.5, 166);
      }
      this.updateReactionDom();
      if (performanceLoop) performanceLoop.handleAudienceReaction(reaction);
    }

    playSoundForReaction(reaction, event) {
      if (reaction.state === "standingOvation") this.soundHooks.standingOvation({ event, reaction });
      else if (reaction.state === "cheer") this.soundHooks.cheer({ event, reaction });
      else if (reaction.state === "laugh") this.soundHooks.bigLaugh({ event, reaction });
      else if (reaction.state === "chuckle") this.soundHooks.smallLaugh({ event, reaction });
      else if (reaction.state === "boo") this.soundHooks.boo({ event, reaction });
    }

    addBoredom(type, sameTypeStreak) {
      for (const [key, value] of this.boredomByType.entries()) {
        if (key !== type) this.boredomByType.set(key, Math.max(0, value - 0.12));
      }
      const current = this.boredomByType.get(type) ?? 0;
      this.boredomByType.set(type, clamp(current + 0.22 + Math.max(0, sameTypeStreak - 2) * 0.1, 0, 1));
    }

    // Boredom reduces entertainment and can produce boos after repeated same-damage spam.
    getBoredomPenalty(type, sameTypeStreak) {
      const boredom = this.boredomByType.get(type) ?? 0;
      return clamp(boredom * ClownTuning.audience.boredomPenaltyStep + Math.max(0, sameTypeStreak - 3) * 0.14, 0, 0.78);
    }

    update(dt, context) {
      this.comboTracker.update(state.gameTime);
      for (const [type, value] of this.boredomByType.entries()) {
        const next = Math.max(0, value - ClownTuning.audience.boredomDecay * dt);
        if (next <= 0.01) this.boredomByType.delete(type);
        else this.boredomByType.set(type, next);
      }

      if (this.pendingReaction) {
        this.pendingReaction.delay -= dt;
        if (this.pendingReaction.delay <= 0) {
          this.setReaction(this.pendingReaction.reaction);
          this.playSoundForReaction(this.pendingReaction.reaction, this.pendingReaction.event);
          this.scoreManager.addEventScore(this.pendingReaction.event, this.pendingReaction.reaction, this.pendingReaction.combo);
          const completedRequest = this.requestManager.handleEvent(this.pendingReaction.event, {
            ...this.buildContext(this.pendingReaction.reaction.state, context),
            reactionState: this.pendingReaction.reaction.state,
            combo: this.pendingReaction.combo,
          });
          if (completedRequest) this.completeRequest(completedRequest);
          this.pendingReaction = null;
        }
      }

      this.currentReaction.timer = Math.max(0, this.currentReaction.timer - dt);
      if (this.currentReaction.timer <= 0 && this.currentReaction.state !== "idle") {
        this.currentReaction = {
          state: "idle",
          text: "Audience is watching.",
          intensity: 0,
          duration: 0,
          timer: 0,
          volume: 0,
          color: "#fff4df",
          scoreScale: 1,
        };
        this.updateReactionDom();
      }

      const continuousContext = this.buildContext(this.currentReaction.state, context);
      const completedRequest = this.requestManager.updateContinuous(continuousContext);
      if (completedRequest) this.completeRequest(completedRequest);
      this.scoreManager.update(dt, this, this.comboTracker.getStats());
      this.screenShake = Math.max(0, this.screenShake - dt * 18);
      this.borderAlpha = Math.max(0, this.borderAlpha - dt * 1.4);
      this.maxLaunchHeight = Math.max(this.maxLaunchHeight, continuousContext.launchHeight);
    }

    buildContext(reactionState = this.currentReaction.state, context = {}) {
      const head = context.clown?.head ?? clown.head;
      const room = context.room ?? state.room;
      const radius = Math.max(head.radiusX ?? 80, head.radiusY ?? 90);
      const launchHeight = room.floor - head.y;
      return {
        combo: this.comboTracker.getStats(),
        reactionState,
        launchHeight,
        ceilingContact: head.y - radius <= room.top + 8,
        upsideDown: Math.abs(wrapAngle(head.angle)) > 2.35,
      };
    }

    completeRequest(request) {
      this.scoreManager.addRequestBonus(request);
      this.setReaction({
        state: "cheer",
        text: "REQUEST COMPLETE",
        intensity: 0.92,
        duration: 1.45,
        timer: 1.45,
        volume: 0.95,
        color: "#f6ca45",
        scoreScale: 1.4,
      });
      this.soundHooks.cheer({ request });
    }

    updateReactionDom() {
      reactionText.textContent = this.currentReaction.text;
      reactionText.classList.toggle("hot", this.currentReaction.intensity >= 0.7);
    }

    getScreenOffset() {
      if (this.screenShake <= 0.05) return { x: 0, y: 0 };
      return {
        x: rand(-this.screenShake, this.screenShake),
        y: rand(-this.screenShake, this.screenShake),
      };
    }

    drawBackground(context, room) {
      context.save();
      context.fillStyle = "#130f10";
      context.fillRect(room.left, room.top + 18, room.right - room.left, 152);
      context.fillStyle = "rgba(246, 202, 69, 0.08)";
      context.fillRect(room.left, room.top + 18, room.right - room.left, 18);
      for (let row = 0; row < 3; row += 1) {
        context.fillStyle = row % 2 ? "#211819" : "#271d1e";
        context.fillRect(room.left + 10, room.top + 52 + row * 42, room.right - room.left - 20, 32);
      }

      const reaction = this.currentReaction;
      for (const member of this.members) {
        const x = room.left + 34 + (member.col / Math.max(1, member.cols - 1)) * (room.right - room.left - 68);
        const baseY = room.top + 68 + member.row * 42;
        const energy = reaction.intensity * reaction.volume;
        const bounce = ["chuckle", "laugh", "cheer", "standingOvation"].includes(reaction.state)
          ? Math.sin(state.gameTime * (8 + energy * 10) + member.phase) * (2 + energy * 8)
          : 0;
        const stand = reaction.state === "standingOvation" || reaction.state === "cheer";
        this.drawMember(context, x, baseY + bounce - (stand ? 10 : 0), member, reaction);
      }
      context.restore();
    }

    drawMember(context, x, y, member, reaction) {
      const energy = reaction.intensity * reaction.volume;
      context.save();
      context.translate(x, y);
      context.globalAlpha = 0.86;
      context.fillStyle = member.shirt;
      context.strokeStyle = "#0c090a";
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(-10, 9, 20, reaction.state === "standingOvation" ? 28 : 20, 6);
      context.fill();
      context.stroke();

      context.fillStyle = member.color;
      context.beginPath();
      context.arc(0, 0, 10, 0, TAU);
      context.fill();
      context.stroke();

      context.strokeStyle = "#090707";
      context.lineWidth = 2.4;
      if (reaction.state === "shock") {
        context.beginPath();
        context.arc(0, 1, 3.5, 0, TAU);
        context.stroke();
      } else if (reaction.state === "boo") {
        context.beginPath();
        context.moveTo(-5, 4);
        context.quadraticCurveTo(0, 0, 5, 4);
        context.stroke();
      } else {
        context.beginPath();
        context.arc(0, 1, 4 + energy * 3, 0.12, Math.PI - 0.12);
        context.stroke();
      }

      context.strokeStyle = "#0c090a";
      context.lineWidth = 3;
      const armsUp = reaction.state === "cheer" || reaction.state === "standingOvation" || reaction.state === "shock";
      const armY = armsUp ? -8 : 16;
      context.beginPath();
      context.moveTo(-8, 14);
      context.lineTo(-16, armY);
      context.moveTo(8, 14);
      context.lineTo(16, reaction.state === "boo" ? 24 : armY);
      context.stroke();
      context.restore();
    }

    drawScreenEffects(context) {
      if (this.borderAlpha <= 0.01) return;
      context.save();
      context.globalAlpha = clamp(this.borderAlpha, 0, 1);
      context.strokeStyle = this.borderColor;
      context.lineWidth = this.currentReaction.state === "standingOvation" ? 16 : 9;
      context.strokeRect(5, 5, state.width - 10, state.height - 10);
      context.globalAlpha *= 0.16;
      context.fillStyle = this.borderColor;
      context.fillRect(0, 0, state.width, state.height);
      context.restore();
    }
  }

  function emitClownDamageEvent(event) {
    if (performanceLoop) performanceLoop.handleDamageEvent(event);
    if (!audience) return;
    audience.handleDamageEvent(event);
  }

  class PerformanceController {
    constructor() {
      this.act = 1;
      this.quota = 5000;
      this.performanceNumber = 0;
      this.items = [];
      this.phase = "idle";
      this.setupTimer = 0;
      this.runningTimer = 0;
      this.chainQuietTimer = 0;
      this.pendingSignals = [];
      this.drag = null;
      this.connectingFrom = null;
      this.tempConnectionPoint = null;
      this.buttonOutputId = null;
      this.startScore = 0;
      this.lastScoreAwardKey = "";
      this.lastScoreAwardAt = -999;
      this.lastResults = null;
    }

    clear() {
      this.phase = "idle";
      this.items.length = 0;
      this.pendingSignals.length = 0;
      this.drag = null;
      this.connectingFrom = null;
      this.tempConnectionPoint = null;
      this.buttonOutputId = null;
      state.performance = null;
      this.hideResults();
      this.updateUi();
    }

    startRun() {
      this.act = 1;
      this.quota = 5000;
      this.performanceNumber = 0;
      scoreManager.reset();
      this.startNextPerformance();
    }

    startNextPerformance() {
      this.performanceNumber += 1;
      const carryScore = scoreManager.score;
      resetPrototypeRound({ resetScore: false, keepPerformance: true });
      scoreManager.score = carryScore;
      this.phase = "setup";
      this.setupTimer = rand(20, 40);
      this.runningTimer = 0;
      this.chainQuietTimer = 0;
      this.pendingSignals.length = 0;
      this.drag = null;
      this.connectingFrom = null;
      this.tempConnectionPoint = null;
      this.buttonOutputId = null;
      this.startScore = scoreManager.score;
      this.lastResults = null;
      state.performance = this;
      this.items = this.createDealtItems();
      this.hideResults();
      this.updateUi();
      toolReadout.textContent = `Performance ${this.performanceNumber}: items drop into the box unconnected. Wire the red button and build the chain yourself.`;
    }

    createDealtItems() {
      const dealt = shuffleArray(PERFORMANCE_ITEM_LIBRARY).slice(0, Math.floor(rand(3, 6)));
      const room = state.room;
      const pipeX = room.left + 116;
      const floorY = room.floor - 36;
      const spacing = 96;
      const startX = pipeX + 52;
      return dealt.map((definition, index) => ({
        ...definition,
        uid: `perf-${this.performanceNumber}-${index}-${definition.id}`,
        x: pipeX,
        y: room.top + 18,
        targetX: clamp(startX + index * spacing, room.left + 74, room.right - 156),
        targetY: floorY - (index % 2) * 4,
        width: 84,
        height: 58,
        placed: false,
        activated: false,
        activationState: "idle",
        outputs: [],
        customOutputs: false,
        dropDelay: index * 0.18,
        dropTimer: 0,
        dropBounce: 0,
        activeTimer: 0,
        triggerTimer: 0,
        actionTimer: 0,
        cooldown: 0,
        fieldTimer: 0,
        rotation: rand(-0.08, 0.08),
        pulse: rand(0, TAU),
      }));
    }

    update(dt) {
      if (state.mode !== "story" || this.phase === "idle") return;
      for (const item of this.items) {
        item.cooldown = Math.max(0, item.cooldown - dt);
        item.activeTimer = Math.max(0, item.activeTimer - dt);
        item.triggerTimer = Math.max(0, item.triggerTimer - dt);
        item.actionTimer = Math.max(0, item.actionTimer - dt);
        item.fieldTimer = Math.max(0, item.fieldTimer - dt);
        if ((this.phase === "setup" || this.phase === "ready") && this.drag?.item !== item && !item.placed) {
          item.dropTimer += dt;
          const fall = clamp((item.dropTimer - item.dropDelay) * 2.2, 0, 1);
          item.x = lerp(item.x, item.targetX, fall * 0.12);
          item.y = lerp(item.y, item.targetY, fall * 0.16);
          item.dropBounce = Math.sin(fall * Math.PI) * 12;
          if (fall > 0.985 && distance(item, { x: item.targetX, y: item.targetY }) < 10) {
            item.x = item.targetX;
            item.y = item.targetY;
            item.placed = true;
            item.dropBounce = 0;
          }
        }
      }

      if (this.phase === "setup" || this.phase === "ready") {
        this.setupTimer = Math.max(0, this.setupTimer - dt);
        if (this.setupTimer <= 0) this.phase = "ready";
        this.updateUi();
        return;
      }

      if (this.phase !== "running") return;
      this.runningTimer += dt;
      this.chainQuietTimer += dt;
      this.updateSignals(dt);
      this.updateItemFields(dt);
      this.checkPassiveTriggers();
      const pending = this.pendingSignals.length > 0 || this.items.some((item) => item.activeTimer > 0 || item.fieldTimer > 0);
      const allActivated = this.items.length > 0 && this.items.every((item) => item.activated);
      if ((allActivated && this.runningTimer > 4.2 && !pending) || this.runningTimer > 18 || (!pending && this.chainQuietTimer > 5.5 && this.items.some((item) => item.activated))) {
        this.finishPerformance(allActivated ? "circuit-complete" : "timeout");
      }
      this.updateUi();
    }

    freezesCharacters() {
      return state.mode === "story" && (this.phase === "setup" || this.phase === "ready");
    }

    holdCharactersStill() {
      if (!this.freezesCharacters()) return;
      for (const actor of getCharacters()) {
        actor.zeroRigVelocity?.();
      }
    }

    updateSignals(dt) {
      for (let index = this.pendingSignals.length - 1; index >= 0; index -= 1) {
        const signal = this.pendingSignals[index];
        signal.delay -= dt;
        if (signal.delay > 0) continue;
        this.pendingSignals.splice(index, 1);
        this.activateItemById(signal.targetId, signal.sourceId);
      }
    }

    updateItemFields(dt) {
      const actor = clown;
      if (!actor) return;
      for (const item of this.items) {
        if (!item.placed) continue;
        if (item.id === "glueFloor" && item.fieldTimer > 0 && distance(item, actor.head) < 145) {
          actor.head.prevX = lerp(actor.head.prevX, actor.head.x, 0.16);
          actor.head.prevY = lerp(actor.head.prevY, actor.head.y, 0.16);
          actor.limp = clamp(actor.limp + dt * 0.42, 0, 1);
        } else if (item.id === "conveyorBelt" && item.fieldTimer > 0 && distance(item, actor.head) < 170) {
          actor.head.applyImpulse(2.8, -0.12, item);
        } else if (item.id === "sawBlade" && item.fieldTimer > 0 && distance(item, actor.head) < 145 && item.cooldown <= 0) {
          item.cooldown = 0.16;
          actor.applyDamage("slicing", { x: item.x, y: item.y }, { force: 18, radius: 78, direction: normalize(actor.head.x - item.x, actor.head.y - item.y) });
        } else if (item.id === "flamethrower" && item.fieldTimer > 0 && item.cooldown <= 0) {
          item.cooldown = 0.22;
          hazards.spawnFire(item.x + 35, item.y);
          actor.applyDamage("burning", { x: item.x + 45, y: item.y }, { force: 10, radius: 110, direction: normalize(actor.head.x - item.x, actor.head.y - item.y) });
        }
      }
    }

    checkPassiveTriggers() {
      const actor = clown;
      if (!actor) return;
      const speed = Math.hypot(actor.head.vx, actor.head.vy);
      for (const item of this.items) {
        if (!item.placed || item.activated || item.cooldown > 0) continue;
        const dist = distance(item, actor.head);
        if ((item.id === "pressurePlate" || item.id === "springPad" || item.id === "glueFloor" || item.id === "trapdoorPanel" || item.id === "conveyorBelt") && dist < 92) {
          this.activateItem(item, "contact");
        } else if ((item.id === "sawBlade" || item.id === "spikeWall" || item.id === "electricCoil" || item.id === "portalDoor") && dist < 112) {
          this.activateItem(item, "contact");
        } else if (item.id === "motionSensor" && dist < 220 && speed > 70) {
          this.activateItem(item, "motion");
        } else if (item.id === "bloodSensor" && this.hasBloodNear(item, 110)) {
          this.activateItem(item, "blood");
        }
      }
    }

    hasBloodNear(item, radius) {
      for (const droplet of blood.droplets) {
        if (distance(item, droplet) <= radius) return true;
      }
      for (const stain of blood.stains) {
        if (distance(item, stain) <= radius + Math.max(stain.rx ?? 0, stain.ry ?? 0)) return true;
      }
      return false;
    }

    handlePointer(point, eventType) {
      if (state.mode !== "story" || this.phase === "idle" || this.phase === "results") return false;
      if (this.phase === "running") return true;
      if (eventType === "down") {
        if (this.getButtonOutputAt(point)) {
          this.connectingFrom = { type: "button", name: "Red Button" };
          this.tempConnectionPoint = { ...point };
          toolReadout.textContent = "Connecting red button";
          return true;
        }
        const outputItem = this.getOutputItemAt(point);
        if (outputItem) {
          this.connectingFrom = outputItem;
          this.tempConnectionPoint = { ...point };
          toolReadout.textContent = `Connecting ${outputItem.name}`;
          return true;
        }
        const item = this.getItemAt(point);
        if (item) {
          this.drag = { item, offsetX: point.x - item.x, offsetY: point.y - item.y };
          this.bringItemToFront(item);
          toolReadout.textContent = `Moving ${item.name}`;
          return true;
        }
        return true;
      }
      if (eventType === "move") {
        if (this.drag) {
          const item = this.drag.item;
          item.x = clamp(point.x - this.drag.offsetX, state.room.left + item.width * 0.5, state.room.right - item.width * 0.5);
          item.y = clamp(point.y - this.drag.offsetY, state.room.top + item.height * 0.5, state.room.floor - item.height * 0.5);
          item.placed = this.isInPlacementArea(item);
          this.updateUi();
        } else if (this.connectingFrom) {
          this.tempConnectionPoint = { ...point };
        }
        return true;
      }
      if (eventType === "up") {
        if (this.drag) {
          const item = this.drag.item;
          item.placed = this.isInPlacementArea(item);
          toolReadout.textContent = item.placed ? `${item.name} placed` : `${item.name} is still outside the usable box`;
          this.drag = null;
          this.updateUi();
          return true;
        }
        if (this.connectingFrom) {
          const target = this.getInputItemAt(point) ?? this.getItemAt(point);
          if (target && target !== this.connectingFrom) {
            if (this.connectingFrom.type === "button") {
              this.connectButtonToItem(target);
              toolReadout.textContent = `Red button connected to ${target.name}`;
            } else {
              this.connectItems(this.connectingFrom, target);
              toolReadout.textContent = `${this.connectingFrom.name} connected to ${target.name}`;
            }
          } else {
            toolReadout.textContent = "Connection canceled";
          }
          this.connectingFrom = null;
          this.tempConnectionPoint = null;
          return true;
        }
        return true;
      }
      return true;
    }

    getItemAt(point) {
      for (let index = this.items.length - 1; index >= 0; index -= 1) {
        const item = this.items[index];
        if (Math.abs(point.x - item.x) <= item.width * 0.5 && Math.abs(point.y - item.y) <= item.height * 0.5) return item;
      }
      return null;
    }

    getOutputItemAt(point) {
      return this.items.find((item) => distance(point, this.getOutputPoint(item)) < 18) ?? null;
    }

    getButtonOutputAt(point) {
      return distance(point, this.getButtonOutputPoint()) < 20;
    }

    getInputItemAt(point) {
      return this.items.find((item) => distance(point, this.getInputPoint(item)) < 18) ?? null;
    }

    getInputPoint(item) {
      return { x: item.x - item.width * 0.5 - 11, y: item.y };
    }

    getOutputPoint(item) {
      return { x: item.x + item.width * 0.5 + 11, y: item.y };
    }

    getButtonOutputPoint() {
      const button = this.getWallButtonPoint();
      return { x: button.x - 43, y: button.y };
    }

    getConnectionStartPoint(source) {
      if (source?.type === "button") return this.getButtonOutputPoint();
      return this.getOutputPoint(source);
    }

    bringItemToFront(item) {
      const index = this.items.indexOf(item);
      if (index < 0) return;
      this.items.splice(index, 1);
      this.items.push(item);
    }

    isInPlacementArea(item) {
      return item.x > state.room.left + 36
        && item.x < state.room.right - 36
        && item.y > state.room.top + 176
        && item.y < state.room.floor - 34;
    }

    connectItems(from, to) {
      from.outputs = [to.uid];
      from.customOutputs = true;
    }

    connectButtonToItem(item) {
      this.buttonOutputId = item.uid;
    }

    get placedCount() {
      return this.items.filter((item) => item.placed).length;
    }

    get allPlaced() {
      return this.items.length > 0 && this.placedCount === this.items.length;
    }

    tryStartPerformance() {
      if (state.mode !== "story" || this.phase === "running") return;
      if (!this.allPlaced) {
        toolReadout.textContent = "Use every item first. The audience can see leftovers.";
        audience.setReaction({
          state: "boo",
          text: "BOO! USE EVERY ITEM!",
          intensity: 0.16,
          duration: 1.1,
          timer: 1.1,
          volume: 0.28,
          color: "#c8b9a2",
          scoreScale: 0,
        });
        return;
      }
      if (this.setupTimer > 0) {
        toolReadout.textContent = `Setup still has ${Math.ceil(this.setupTimer)} seconds. The wall button is locked.`;
        return;
      }
      const first = this.items.find((item) => item.uid === this.buttonOutputId);
      if (!first) {
        toolReadout.textContent = "Wire the red button to one item before starting.";
        audience.setReaction({
          state: "boo",
          text: "WIRE THE BUTTON!",
          intensity: 0.13,
          duration: 1,
          timer: 1,
          volume: 0.24,
          color: "#c8b9a2",
          scoreScale: 0,
        });
        return;
      }
      this.phase = "running";
      this.runningTimer = 0;
      this.chainQuietTimer = 0;
      this.startScore = scoreManager.score;
      this.activateItem(first, "wall-button");
      toolReadout.textContent = "Performance running - hands off the contraption";
      this.updateUi();
    }

    activateItemById(itemId, sourceId = null) {
      const item = this.items.find((candidate) => candidate.uid === itemId);
      if (item) this.activateItem(item, sourceId);
    }

    activateItem(item, sourceId = null) {
      if (!item || !item.placed || item.activated) return;
      item.activated = true;
      item.activationState = "activated";
      item.activeTimer = 0.86;
      item.triggerTimer = 0.32;
      item.actionTimer = 1.05;
      item.fieldTimer = 0.9;
      item.cooldown = 0.18;
      this.chainQuietTimer = 0;
      this.performItemAction(item, sourceId);
      const outputDelay = item.id === "delayBox" ? 1.25 : item.id === "wire" ? 0.1 : item.id === "chaosDice" ? 0.8 : 0.5;
      for (const outputId of item.outputs) {
        this.pendingSignals.push({ sourceId: item.uid, targetId: outputId, delay: outputDelay });
      }
      this.updateUi();
    }

    performItemAction(item, sourceId = null) {
      const actor = clown;
      if (!actor) return;
      const point = { x: item.x, y: item.y };
      const dir = normalize(actor.head.x - item.x, actor.head.y - item.y);
      const nearPoint = { x: lerp(item.x, actor.head.x, 0.55), y: lerp(item.y, actor.head.y, 0.55) };
      if (item.id === "boxingGlove") {
        actor.applyDamage("blunt", point, { force: 54, radius: 116, direction: dir });
        actor.head.applyImpulse(dir.x * 18, -7, point);
      } else if (item.id === "anvilDrop") {
        hazards.spawnCrusher(clamp(actor.head.x, state.room.left + 80, state.room.right - 80));
      } else if (item.id === "sawBlade") {
        item.fieldTimer = 2.1;
        hazards.saw = { x: item.x, y: item.y, rotation: state.gameTime * 8 };
        actor.applyDamage("slicing", point, { force: 54, radius: 116, direction: dir });
      } else if (item.id === "spikeWall") {
        actor.applyDamage("piercing", nearPoint, { force: 48, radius: 102, direction: dir });
      } else if (item.id === "springPad") {
        hazards.spawnSpring(item.x, item.y);
        actor.head.applyImpulse(dir.x * 4, -24, point);
      } else if (item.id === "cannon") {
        actor.applyDamage("blunt", point, { force: 42, radius: 126, direction: dir });
        actor.head.applyImpulse(dir.x * 34, -10, point);
      } else if (item.id === "wire") {
        scoreManager.addBurst("SIGNAL", item.x, item.y - 38, "#39c1d3");
      } else if (item.id === "delayBox") {
        scoreManager.addBurst("WAIT...", item.x, item.y - 38, "#f6ca45");
      } else if (item.id === "pressurePlate" || item.id === "motionSensor" || item.id === "bloodSensor" || item.id === "screamMicrophone") {
        scoreManager.addBurst("TRIGGER", item.x, item.y - 38, "#39c1d3");
      } else if (item.id === "glueFloor") {
        item.fieldTimer = 2.8;
        actor.applyDamage("dragging", point, { force: 12, radius: 120, direction: { x: 0, y: 1 } });
      } else if (item.id === "netLauncher") {
        actor.limp = clamp(actor.limp + 0.38, 0, 1);
        actor.applyDamage("blunt", point, { force: 24, radius: 132, direction: dir });
        actor.head.prevX = lerp(actor.head.prevX, actor.head.x, 0.42);
      } else if (item.id === "flamethrower") {
        item.fieldTimer = 2.2;
        hazards.spawnFire(item.x + dir.x * 32, item.y + dir.y * 12);
        actor.applyDamage("burning", nearPoint, { force: 36, radius: 126, direction: dir });
      } else if (item.id === "electricCoil") {
        actor.applyDamage("electric", point, { force: 44, radius: 138, direction: dir });
        for (const particle of actor.particles) particle.applyImpulse(rand(-1.4, 1.4), rand(-1.4, 0.2));
      } else if (item.id === "nailLauncher") {
        actor.applyDamage("piercing", nearPoint, { force: 64, radius: 92, direction: dir });
      } else if (item.id === "fireworkRack") {
        hazards.spawnExplosion(nearPoint.x, nearPoint.y);
        actor.head.applyImpulse(dir.x * 12, -18, point);
      } else if (item.id === "trapdoorPanel") {
        actor.head.applyImpulse(dir.x * 2, 18, point);
        actor.applyDamage("dragging", point, { force: 20, radius: 118, direction: { x: 0, y: 1 } });
      } else if (item.id === "conveyorBelt") {
        item.fieldTimer = 3.0;
        actor.head.applyImpulse(18, -2, point);
      } else if (item.id === "portalDoor") {
        const x = clamp(state.room.right - (item.x - state.room.left), state.room.left + 120, state.room.right - 120);
        const y = clamp(item.y - 80, state.room.top + 210, state.room.floor - 150);
        actor.moveTo(x, y);
        actor.head.applyImpulse(randomSign() * 9, -14, point);
      } else if (item.id === "chaosDice") {
        this.performChaosRoll(item, sourceId);
      }
    }

    performChaosRoll(item) {
      const actor = clown;
      const roll = Math.floor(rand(0, 5));
      if (roll === 0) hazards.spawnExplosion(actor.head.x + rand(-60, 60), actor.head.y + rand(-50, 30));
      else if (roll === 1) actor.applyDamage("blunt", item, { force: 72, radius: 140, direction: normalize(actor.head.x - item.x, actor.head.y - item.y) });
      else if (roll === 2) actor.applyDamage("slicing", item, { force: 58, radius: 112, direction: normalize(actor.head.x - item.x, actor.head.y - item.y) });
      else if (roll === 3) actor.head.applyImpulse(rand(-30, 30), -rand(22, 45), item);
      else actor.applyDamage("electric", item, { force: 46, radius: 150, direction: { x: randomSign(), y: -0.2 } });
      scoreManager.addBurst(`DICE ${roll + 1}`, item.x, item.y - 42, "#9b6df2");
    }

    handleDamageEvent(event) {
      if (state.mode !== "story" || this.phase !== "running") return;
      this.chainQuietTimer = 0;
      for (const item of this.items) {
        if (!item.placed || item.activated) continue;
        if (item.id === "screamMicrophone" && event.amount > 10) {
          this.activateItem(item, "scream");
        } else if (item.id === "bloodSensor" && (event.goreAmount > 16 || event.causedGutSpill || event.causedSever)) {
          this.pendingSignals.push({ sourceId: "blood", targetId: item.uid, delay: 0.22 });
        }
      }
    }

    handleAudienceReaction(reaction) {
      if (state.mode !== "story" || this.phase !== "running" || !reaction || reaction.state === "idle") return;
      const key = `${reaction.state}:${reaction.text}`;
      if (key === this.lastScoreAwardKey && state.gameTime - this.lastScoreAwardAt < 0.6) return;
      this.lastScoreAwardKey = key;
      this.lastScoreAwardAt = state.gameTime;
      const base = this.getReactionBaseScore(reaction);
      if (base <= 0) return;
      const comboStats = comboTracker.getStats();
      const gained = base * Math.max(1, comboStats.multiplier);
      scoreManager.addFlatScore(gained, reaction.state === "standingOvation" ? "OVATION" : "LAUGH", state.width * 0.5, 118, reaction.color);
    }

    getReactionBaseScore(reaction) {
      if (reaction.state === "chuckle") return 100;
      if (reaction.state === "laugh") return reaction.text.includes("HUGE") || reaction.text.includes("BIG") ? 750 : 300;
      if (reaction.state === "cheer") return 1000;
      if (reaction.state === "standingOvation") return 2500;
      return 0;
    }

    finishPerformance(reason) {
      if (this.phase === "results") return;
      this.phase = "results";
      const unused = this.items.filter((item) => !item.activated).length;
      const activated = this.items.length - unused;
      const perfect = unused === 0 && this.items.length > 0;
      let perfectBonus = 0;
      let unusedPenalty = 0;
      if (perfect) {
        perfectBonus = 2000;
        scoreManager.addFlatScore(perfectBonus, "PERFECT CIRCUIT", state.width * 0.5, 146, "#f6ca45");
        audience.setReaction({
          state: "cheer",
          text: "PERFECT CIRCUIT",
          intensity: 0.92,
          duration: 1.4,
          timer: 1.4,
          volume: 0.96,
          color: "#f6ca45",
          scoreScale: 1.4,
        });
      } else if (unused > 0) {
        unusedPenalty = unused * -500;
        scoreManager.addFlatScore(unusedPenalty, "UNUSED ITEM", state.width * 0.5, 146, "#c8b9a2");
        audience.setReaction({
          state: "boo",
          text: "BOO! UNUSED ITEMS!",
          intensity: 0.16,
          duration: 1.25,
          timer: 1.25,
          volume: 0.28,
          color: "#c8b9a2",
          scoreScale: 0,
        });
      }
      this.lastResults = {
        reason,
        performanceScore: scoreManager.score - this.startScore,
        totalScore: scoreManager.score,
        activated,
        unused,
        bestCombo: comboTracker.bestCombo,
        audience: audience.currentReaction.text,
        perfect,
        perfectBonus,
        unusedPenalty,
      };
      this.showResults();
      this.updateUi();
    }

    showResults() {
      const results = this.lastResults;
      if (!results || !performanceResults) return;
      resultsTitle.textContent = `Performance ${this.performanceNumber} complete`;
      resultPerformanceScore.textContent = formatScore(results.performanceScore);
      resultTotalScore.textContent = formatScore(results.totalScore);
      resultItemsActivated.textContent = `${results.activated}/${this.items.length}`;
      resultItemsUnused.textContent = String(results.unused);
      resultBiggestCombo.textContent = results.bestCombo > 1 ? `x${results.bestCombo}` : "x1";
      resultAudienceReaction.textContent = results.audience;
      resultPerfectBonus.textContent = results.perfect ? `+${formatScore(results.perfectBonus)}` : "No";
      performanceResults.hidden = false;
    }

    hideResults() {
      if (performanceResults) performanceResults.hidden = true;
    }

    updateUi() {
      if (state.mode !== "story") {
        if (performanceStartButton) performanceStartButton.hidden = true;
        return;
      }
      if (actValue) actValue.textContent = String(this.act);
      if (performanceValue) performanceValue.textContent = String(Math.max(1, this.performanceNumber));
      if (quotaValue) quotaValue.textContent = formatScore(this.quota);
      if (setupTimerValue) setupTimerValue.textContent = this.phase === "running" ? "GO" : this.setupTimer > 0 ? `${Math.ceil(this.setupTimer)}s` : "Ready";
      if (placedItemsValue) placedItemsValue.textContent = `${this.placedCount}/${this.items.length}`;
      if (performanceStartButton) {
        performanceStartButton.hidden = this.phase === "idle" || this.phase === "results";
        performanceStartButton.disabled = this.phase === "running" || this.setupTimer > 0;
        performanceStartButton.textContent = this.phase === "running"
          ? "LIVE"
          : this.setupTimer > 0
            ? `${Math.ceil(this.setupTimer)}`
            : !this.allPlaced
              ? "PLACE"
              : this.buttonOutputId
                ? "START"
                : "WIRE";
      }
    }

    draw(context) {
      if (state.mode !== "story" || this.phase === "idle") return;
      this.drawConnections(context);
      this.drawPipeAndTray(context);
      for (const item of this.items) this.drawItem(context, item);
      if (this.connectingFrom && this.tempConnectionPoint) {
        const from = this.getConnectionStartPoint(this.connectingFrom);
        context.save();
        context.setLineDash([8, 7]);
        context.strokeStyle = "#f6ca45";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(this.tempConnectionPoint.x, this.tempConnectionPoint.y);
        context.stroke();
        context.restore();
      }
    }

    drawPipeAndTray(context) {
      const room = state.room;
      context.save();
      const pipeX = room.left + 58;
      const pipeY = room.top + 28;
      const chuteY = pipeY + 22;
      context.fillStyle = "#9fa8aa";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.roundRect(pipeX, pipeY, 122, 34, 10);
      context.fill();
      context.stroke();
      context.fillStyle = "#5f6769";
      context.fillRect(pipeX + 12, pipeY + 7, 98, 8);
      context.fillStyle = "#767f82";
      context.strokeStyle = COLORS.outline;
      context.beginPath();
      context.roundRect(pipeX + 82, chuteY, 44, 54, 9);
      context.fill();
      context.stroke();
      context.strokeStyle = "rgba(255,245,224,0.22)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(pipeX + 105, chuteY + 55);
      context.lineTo(pipeX + 105, room.floor - 54);
      context.stroke();
      context.globalAlpha = 0.16;
      context.fillStyle = "#fff4df";
      context.beginPath();
      context.ellipse(pipeX + 105, room.floor - 24, 82, 9, 0, 0, TAU);
      context.fill();
      context.restore();
    }

    drawConnections(context) {
      context.save();
      context.lineWidth = 4;
      context.lineCap = "round";
      for (const item of this.items) {
        const from = this.getOutputPoint(item);
        for (const outputId of item.outputs) {
          const target = this.items.find((candidate) => candidate.uid === outputId);
          if (!target) continue;
          const to = this.getInputPoint(target);
          context.strokeStyle = item.activated ? "#49bf70" : item.placed && target.placed ? "#f6ca45" : "rgba(255, 245, 224, 0.2)";
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.bezierCurveTo(from.x + 38, from.y, to.x - 38, to.y, to.x, to.y);
          context.stroke();
        }
      }
      const buttonOutput = this.getButtonOutputPoint();
      if (this.buttonOutputId) {
        const targetItem = this.items.find((candidate) => candidate.uid === this.buttonOutputId);
        if (targetItem) {
          const target = this.getInputPoint(targetItem);
          context.strokeStyle = this.phase === "running" ? "#49bf70" : "rgba(226, 53, 53, 0.72)";
          context.beginPath();
          context.moveTo(buttonOutput.x, buttonOutput.y);
          context.bezierCurveTo(buttonOutput.x - 60, buttonOutput.y, target.x - 40, target.y, target.x, target.y);
          context.stroke();
        }
      } else {
        const pulse = 0.5 + Math.sin(state.gameTime * 6) * 0.5;
        context.strokeStyle = `rgba(246, 202, 69, ${0.35 + pulse * 0.45})`;
        context.setLineDash([5, 8]);
        context.beginPath();
        context.arc(buttonOutput.x, buttonOutput.y, 18 + pulse * 8, 0, TAU);
        context.stroke();
        context.setLineDash([]);
        if (this.phase !== "running") {
          context.fillStyle = "rgba(255,244,224,0.8)";
          context.font = "900 10px Trebuchet MS, Arial";
          context.textAlign = "center";
          context.fillText("WIRE", buttonOutput.x, buttonOutput.y - 20);
        }
      }
      context.fillStyle = this.buttonOutputId ? "#f6ca45" : "#8f8585";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(buttonOutput.x, buttonOutput.y, 9, 0, TAU);
      context.fill();
      context.stroke();
      context.restore();
    }

    getWallButtonPoint() {
      return { x: state.room.right - 78, y: (state.room.top + state.room.floor) * 0.5 };
    }

    drawItem(context, item) {
      const active = item.activated || item.activeTimer > 0;
      const triggerPulse = clamp((item.triggerTimer ?? 0) / 0.32, 0, 1);
      const actionPulse = clamp((item.actionTimer ?? 0) / 1.05, 0, 1);
      const floorBounce = item.dropBounce ?? 0;
      context.save();
      context.translate(item.x, item.y - floorBounce);
      if (!item.placed) {
        const squash = 1 + floorBounce * 0.006;
        context.scale(1 / squash, squash);
      }
      context.rotate(item.rotation + Math.sin(state.gameTime * 5 + item.pulse) * (item.activeTimer > 0 ? 0.08 : 0.015));
      context.shadowColor = active ? "rgba(246, 202, 69, 0.45)" : "rgba(0, 0, 0, 0.36)";
      context.shadowBlur = active ? 14 : 6;
      context.shadowOffsetY = active ? 0 : 4;
      this.drawPerformanceItemAsset(context, item, active, triggerPulse, actionPulse);
      if (triggerPulse > 0) {
        context.shadowBlur = 0;
        context.strokeStyle = `rgba(246, 202, 69, ${0.25 + triggerPulse * 0.55})`;
        context.lineWidth = 3;
        context.setLineDash([6, 5]);
        context.beginPath();
        context.roundRect(-item.width * 0.5 - 5, -item.height * 0.5 - 5, item.width + 10, item.height + 10, 12);
        context.stroke();
        context.setLineDash([]);
      }
      context.restore();

      const input = this.getInputPoint(item);
      const output = this.getOutputPoint(item);
      context.save();
      context.fillStyle = item.placed ? "#39c1d3" : "#5f5960";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(input.x, input.y, 8, 0, TAU);
      context.fill();
      context.stroke();
      context.fillStyle = item.outputs.length ? "#f6ca45" : "#5f5960";
      context.beginPath();
      context.arc(output.x, output.y, 8, 0, TAU);
      context.fill();
      context.stroke();
      if (item.fieldTimer > 0) {
        context.globalAlpha = clamp(item.fieldTimer, 0, 1) * 0.25;
        context.fillStyle = this.categoryColor(item.category);
        context.beginPath();
        context.arc(item.x, item.y, 88 + Math.sin(state.gameTime * 12) * 8, 0, TAU);
        context.fill();
      }
      context.restore();
    }

    drawPerformanceItemAsset(context, item, active, triggerPulse, actionPulse) {
      const w = item.width;
      const h = item.height;
      const color = this.categoryColor(item.category);
      const energy = Math.sin(actionPulse * Math.PI);
      context.lineJoin = "round";
      context.lineCap = "round";
      context.lineWidth = 4;

      const drawBase = (fill = "#302b2d") => {
        context.fillStyle = active ? "#3d3423" : fill;
        context.strokeStyle = COLORS.outline;
        context.beginPath();
        context.roundRect(-w * 0.5, -h * 0.5, w, h, 9);
        context.fill();
        context.stroke();
      };

      const drawBolts = () => {
        context.fillStyle = "#d8d0b6";
        for (const bolt of [{ x: -w * 0.38, y: -h * 0.34 }, { x: w * 0.38, y: -h * 0.34 }, { x: -w * 0.38, y: h * 0.34 }, { x: w * 0.38, y: h * 0.34 }]) {
          context.beginPath();
          context.arc(bolt.x, bolt.y, 3, 0, TAU);
          context.fill();
        }
      };

      drawBase(item.id === "glueFloor" ? "#24352c" : item.id === "portalDoor" ? "#251c33" : "#2d292b");
      drawBolts();

      switch (item.id) {
        case "boxingGlove": {
          const punch = energy * 18;
          context.strokeStyle = "#c8d1da";
          context.lineWidth = 6;
          context.beginPath();
          context.moveTo(-30, 4);
          context.lineTo(5 + punch, 4);
          context.stroke();
          context.fillStyle = "#d8d0b6";
          context.beginPath();
          context.roundRect(-34, -7, 24, 22, 5);
          context.fill();
          context.strokeStyle = COLORS.outline;
          context.stroke();
          context.fillStyle = "#e23535";
          context.beginPath();
          context.ellipse(20 + punch, -5, 20, 16, -0.2, 0, TAU);
          context.fill();
          context.stroke();
          context.beginPath();
          context.ellipse(8 + punch, 11, 11, 9, 0.45, 0, TAU);
          context.fill();
          context.stroke();
          context.strokeStyle = "#fff4df";
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(11 + punch, -14);
          context.quadraticCurveTo(24 + punch, -20, 36 + punch, -8);
          context.stroke();
          break;
        }
        case "anvilDrop": {
          const drop = energy * 18;
          context.strokeStyle = "#d8d0b6";
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(0, -26);
          context.lineTo(0, -8 + drop);
          context.stroke();
          context.fillStyle = "#6e777b";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.moveTo(-28, -4 + drop);
          context.lineTo(18, -4 + drop);
          context.quadraticCurveTo(35, -7 + drop, 38, -18 + drop);
          context.lineTo(43, 2 + drop);
          context.lineTo(25, 2 + drop);
          context.lineTo(18, 15 + drop);
          context.lineTo(-22, 15 + drop);
          context.lineTo(-28, 2 + drop);
          context.lineTo(-42, 2 + drop);
          context.lineTo(-38, -13 + drop);
          context.quadraticCurveTo(-35, -4 + drop, -28, -4 + drop);
          context.closePath();
          context.fill();
          context.stroke();
          context.strokeStyle = "#c8d1da";
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(-20, -1 + drop);
          context.lineTo(18, -1 + drop);
          context.stroke();
          break;
        }
        case "sawBlade": {
          const spin = state.gameTime * (active ? 16 : 3) + item.pulse;
          this.drawToothedDisc(context, -4, 0, 25, 14, spin, "#d8d0b6", "#747b80");
          context.fillStyle = "#e23535";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.arc(-4, 0, 8, 0, TAU);
          context.fill();
          context.stroke();
          context.strokeStyle = "#49bf70";
          context.lineWidth = 4;
          context.beginPath();
          context.moveTo(-34, 25);
          context.lineTo(34, 25);
          context.stroke();
          break;
        }
        case "spikeWall": {
          const extend = 7 + energy * 16;
          context.fillStyle = "#5f6769";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-34, -24, 18, 48, 4);
          context.fill();
          context.stroke();
          context.fillStyle = "#d8d0b6";
          for (let i = 0; i < 4; i += 1) {
            const y = -18 + i * 12;
            context.beginPath();
            context.moveTo(-16, y - 5);
            context.lineTo(31 + extend, y);
            context.lineTo(-16, y + 5);
            context.closePath();
            context.fill();
            context.stroke();
          }
          break;
        }
        case "springPad": {
          const compression = 6 - energy * 13;
          context.fillStyle = "#39c1d3";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-34, 15 + compression, 68, 14, 6);
          context.fill();
          context.stroke();
          context.strokeStyle = "#f6ca45";
          context.lineWidth = 5;
          context.beginPath();
          for (let i = 0; i < 15; i += 1) {
            const x = -22 + i * 3.2;
            const y = 13 + compression - Math.sin(i * 1.7) * 12;
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
          context.fillStyle = "#fff4df";
          context.beginPath();
          context.moveTo(0, -25 - energy * 18);
          context.lineTo(11, -8 - energy * 10);
          context.lineTo(-11, -8 - energy * 10);
          context.closePath();
          context.fill();
          context.stroke();
          break;
        }
        case "cannon": {
          const recoil = energy * -11;
          context.fillStyle = "#5f6769";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.ellipse(-18 + recoil, 18, 12, 12, 0, 0, TAU);
          context.fill();
          context.stroke();
          context.beginPath();
          context.roundRect(-22 + recoil, -14, 50, 24, 10);
          context.fill();
          context.stroke();
          context.beginPath();
          context.ellipse(31 + recoil, -2, 10, 15, HALF_PI, 0, TAU);
          context.fill();
          context.stroke();
          if (energy > 0.08) {
            drawStar(context, 44, -2, 15 + energy * 13, 6, "#ff8a45");
          }
          break;
        }
        case "wire": {
          context.strokeStyle = "#39c1d3";
          context.lineWidth = 5;
          context.beginPath();
          for (let t = 0; t < 20; t += 1) {
            const a = t / 19 * TAU * 2.3;
            const r = 4 + t * 1.1;
            const x = -8 + Math.cos(a) * r;
            const y = Math.sin(a) * r * 0.7;
            if (t === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
          context.fillStyle = "#f6ca45";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(21, -11, 19, 22, 4);
          context.fill();
          context.stroke();
          context.strokeStyle = "#d8d0b6";
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(40, -6);
          context.lineTo(48, -6);
          context.moveTo(40, 6);
          context.lineTo(48, 6);
          context.stroke();
          if (active) this.drawSignalDots(context, -34, 0, 30, "#f6ca45", actionPulse);
          break;
        }
        case "delayBox": {
          context.fillStyle = "#9b6df2";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-25, -24, 50, 48, 8);
          context.fill();
          context.stroke();
          context.fillStyle = "#fff4df";
          context.beginPath();
          context.arc(0, -2, 17, 0, TAU);
          context.fill();
          context.stroke();
          context.strokeStyle = "#151111";
          context.lineWidth = 3;
          const hand = state.gameTime * (active ? 8 : 1.2);
          context.beginPath();
          context.moveTo(0, -2);
          context.lineTo(Math.cos(hand) * 12, -2 + Math.sin(hand) * 12);
          context.stroke();
          context.fillStyle = "#f6ca45";
          context.beginPath();
          context.arc(0, -2, 4, 0, TAU);
          context.fill();
          break;
        }
        case "pressurePlate": {
          const press = energy * 9;
          context.fillStyle = "#747b80";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-37, 9 + press, 74, 17, 5);
          context.fill();
          context.stroke();
          context.fillStyle = "#d8d0b6";
          context.beginPath();
          context.roundRect(-30, -9 + press, 60, 18, 4);
          context.fill();
          context.stroke();
          context.strokeStyle = "#f6ca45";
          context.lineWidth = 3;
          for (let i = -1; i <= 1; i += 1) {
            context.beginPath();
            context.moveTo(i * 16 - 6, -2 + press);
            context.lineTo(i * 16, 4 + press);
            context.lineTo(i * 16 + 6, -2 + press);
            context.stroke();
          }
          break;
        }
        case "motionSensor": {
          context.fillStyle = "#151111";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-20, -17, 38, 27, 7);
          context.fill();
          context.stroke();
          context.fillStyle = "#39c1d3";
          context.beginPath();
          context.arc(0, -4, 10 + energy * 3, 0, TAU);
          context.fill();
          context.stroke();
          context.fillStyle = "#151111";
          context.beginPath();
          context.arc(energy * 5, -4, 4, 0, TAU);
          context.fill();
          context.strokeStyle = `rgba(57, 193, 211, ${0.18 + energy * 0.3})`;
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(16, -5);
          context.lineTo(43, -22);
          context.lineTo(43, 13);
          context.closePath();
          context.stroke();
          break;
        }
        case "glueFloor": {
          context.fillStyle = "#49bf70";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.ellipse(0, 10, 35 + energy * 5, 17 + energy * 3, 0, 0, TAU);
          context.fill();
          context.stroke();
          context.fillStyle = "#c8ffb5";
          for (let i = 0; i < 5; i += 1) {
            context.beginPath();
            context.arc(-22 + i * 11, 4 + Math.sin(state.gameTime * 3 + i) * 3, 3 + (i % 2), 0, TAU);
            context.fill();
          }
          if (active) {
            context.strokeStyle = "#c8ffb5";
            context.lineWidth = 2;
            for (let i = 0; i < 4; i += 1) {
              context.beginPath();
              context.moveTo(-24 + i * 16, 7);
              context.quadraticCurveTo(-14 + i * 16, -22 - energy * 8, -2 + i * 14, 9);
              context.stroke();
            }
          }
          break;
        }
        case "netLauncher": {
          context.fillStyle = "#5f6769";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-38, -10, 48, 24, 8);
          context.fill();
          context.stroke();
          context.fillStyle = "#d8d0b6";
          context.beginPath();
          context.roundRect(8, -16, 20, 32, 5);
          context.fill();
          context.stroke();
          const netX = 26 + energy * 22;
          context.strokeStyle = "#fff4df";
          context.lineWidth = 2;
          context.strokeRect(netX - 11, -18 - energy * 8, 26 + energy * 14, 30 + energy * 16);
          for (let i = 0; i < 3; i += 1) {
            context.beginPath();
            context.moveTo(netX - 11, -8 + i * 9 - energy * 8);
            context.lineTo(netX + 15 + energy * 14, -8 + i * 9 - energy * 8);
            context.moveTo(netX - 2 + i * 8, -18 - energy * 8);
            context.lineTo(netX - 2 + i * 8, 12 + energy * 8);
            context.stroke();
          }
          break;
        }
        case "flamethrower": {
          context.fillStyle = "#e23535";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-34, -19, 26, 38, 9);
          context.fill();
          context.stroke();
          context.fillStyle = "#5f6769";
          context.beginPath();
          context.roundRect(-10, -7, 39, 14, 5);
          context.fill();
          context.stroke();
          if (active) {
            context.fillStyle = "#ff8a45";
            context.beginPath();
            context.moveTo(29, -10);
            context.quadraticCurveTo(58 + energy * 22, 0, 29, 12);
            context.quadraticCurveTo(42 + energy * 10, 0, 29, -10);
            context.fill();
            context.stroke();
            context.fillStyle = "#f6ca45";
            context.beginPath();
            context.moveTo(32, -5);
            context.quadraticCurveTo(48 + energy * 13, 0, 32, 7);
            context.fill();
          }
          break;
        }
        case "electricCoil": {
          context.fillStyle = "#5f6769";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-30, 16, 60, 13, 5);
          context.fill();
          context.stroke();
          context.strokeStyle = "#c8d1da";
          context.lineWidth = 5;
          context.beginPath();
          for (let i = 0; i < 18; i += 1) {
            const x = Math.sin(i * 1.5) * 14;
            const y = 16 - i * 2.2;
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
          context.fillStyle = "#39c1d3";
          context.beginPath();
          context.arc(0, -25, 9, 0, TAU);
          context.fill();
          context.stroke();
          if (active) {
            this.drawLightningBolt(context, 0, -25, -33, -7, "#f6ca45", 3);
            this.drawLightningBolt(context, 0, -25, 37, -11, "#39c1d3", 3);
          }
          break;
        }
        case "nailLauncher": {
          context.fillStyle = "#ff8a45";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-33, -15, 55, 25, 8);
          context.fill();
          context.stroke();
          context.fillStyle = "#5f6769";
          context.beginPath();
          context.roundRect(-18, 8, 13, 24, 4);
          context.fill();
          context.stroke();
          context.strokeStyle = "#d8d0b6";
          context.lineWidth = 3;
          for (let i = 0; i < 4; i += 1) {
            const fly = active ? energy * (18 + i * 7) : 0;
            context.beginPath();
            context.moveTo(18 + fly, -9 + i * 6);
            context.lineTo(36 + fly, -9 + i * 6);
            context.stroke();
          }
          break;
        }
        case "fireworkRack": {
          context.fillStyle = "#5f6769";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-34, 12, 68, 14, 4);
          context.fill();
          context.stroke();
          for (let i = 0; i < 4; i += 1) {
            const launch = active ? energy * (14 + i * 5) : 0;
            context.fillStyle = ["#e23535", "#39c1d3", "#f6ca45", "#9b6df2"][i];
            context.beginPath();
            context.roundRect(-27 + i * 18, -18 - launch, 11, 32, 4);
            context.fill();
            context.stroke();
            context.fillStyle = "#fff4df";
            context.beginPath();
            context.moveTo(-21.5 + i * 18, -28 - launch);
            context.lineTo(-29 + i * 18, -16 - launch);
            context.lineTo(-14 + i * 18, -16 - launch);
            context.closePath();
            context.fill();
            context.stroke();
          }
          if (active) drawStar(context, 30, -26 - energy * 18, 9, 4, "#f6ca45");
          break;
        }
        case "bloodSensor": {
          context.fillStyle = "#151111";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-30, -22, 60, 44, 9);
          context.fill();
          context.stroke();
          context.strokeStyle = "#e23535";
          context.lineWidth = 4;
          context.beginPath();
          context.arc(0, 0, 18 + energy * 5, 0, TAU);
          context.stroke();
          context.fillStyle = "#e23535";
          context.beginPath();
          context.moveTo(0, -18);
          context.bezierCurveTo(17, 2, 9, 18, 0, 18);
          context.bezierCurveTo(-12, 18, -18, 2, 0, -18);
          context.fill();
          context.stroke();
          context.fillStyle = "#fff4df";
          context.beginPath();
          context.arc(-5, -3, 4, 0, TAU);
          context.fill();
          break;
        }
        case "screamMicrophone": {
          context.fillStyle = "#c8d1da";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-16, -26, 32, 42, 15);
          context.fill();
          context.stroke();
          context.strokeStyle = "#151111";
          context.lineWidth = 2;
          for (let y = -16; y <= 8; y += 8) {
            context.beginPath();
            context.moveTo(-10, y);
            context.lineTo(10, y);
            context.stroke();
          }
          context.strokeStyle = "#f6ca45";
          context.lineWidth = 3;
          context.beginPath();
          context.moveTo(0, 16);
          context.lineTo(0, 29);
          context.moveTo(-18, 29);
          context.lineTo(18, 29);
          context.stroke();
          if (active) {
            for (let i = 0; i < 3; i += 1) {
              context.globalAlpha = 0.65 - i * 0.14;
              context.beginPath();
              context.arc(0, -5, 26 + i * 10 + energy * 8, -0.55, 0.55);
              context.stroke();
            }
            context.globalAlpha = 1;
          }
          break;
        }
        case "trapdoorPanel": {
          const angle = -energy * 0.9;
          context.fillStyle = "#747b80";
          context.strokeStyle = COLORS.outline;
          context.save();
          context.translate(-30, 12);
          context.rotate(angle);
          context.beginPath();
          context.roundRect(0, -16, 62, 32, 4);
          context.fill();
          context.stroke();
          context.strokeStyle = "#f6ca45";
          context.lineWidth = 3;
          for (let i = 0; i < 4; i += 1) {
            context.beginPath();
            context.moveTo(8 + i * 14, -15);
            context.lineTo(-4 + i * 14, 15);
            context.stroke();
          }
          context.restore();
          context.fillStyle = "#151111";
          context.beginPath();
          context.arc(-30, 12, 6, 0, TAU);
          context.fill();
          break;
        }
        case "conveyorBelt": {
          const offset = (state.gameTime * (active ? 38 : 8)) % 18;
          context.fillStyle = "#151111";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-38, -13, 76, 26, 12);
          context.fill();
          context.stroke();
          context.strokeStyle = "#39c1d3";
          context.lineWidth = 4;
          for (let x = -38 + offset; x < 42; x += 18) {
            context.beginPath();
            context.moveTo(x, -13);
            context.lineTo(x - 12, 13);
            context.stroke();
          }
          context.fillStyle = "#747b80";
          for (const x of [-31, 31]) {
            context.beginPath();
            context.arc(x, 0, 9, 0, TAU);
            context.fill();
            context.stroke();
          }
          break;
        }
        case "portalDoor": {
          const spin = state.gameTime * (active ? 5 : 1.5);
          context.fillStyle = "#151111";
          context.strokeStyle = "#9b6df2";
          context.lineWidth = 5;
          context.beginPath();
          context.ellipse(0, 0, 27, 34, 0, 0, TAU);
          context.fill();
          context.stroke();
          for (let i = 0; i < 4; i += 1) {
            context.strokeStyle = `hsla(${(spin * 70 + i * 70) % 360}, 90%, 68%, 0.8)`;
            context.lineWidth = 3;
            context.beginPath();
            context.ellipse(0, 0, 7 + i * 5 + energy * 3, 12 + i * 5, spin + i * 0.7, 0, TAU);
            context.stroke();
          }
          context.fillStyle = "#5f6769";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-34, 27, 68, 9, 4);
          context.fill();
          context.stroke();
          break;
        }
        case "chaosDice": {
          const wobble = active ? Math.sin(state.gameTime * 22) * 0.15 : 0;
          context.save();
          context.rotate(wobble);
          context.fillStyle = "#fff4df";
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.roundRect(-25, -25, 50, 50, 8);
          context.fill();
          context.stroke();
          context.fillStyle = ["#e23535", "#39c1d3", "#9b6df2", "#49bf70", "#ff8a45"][Math.floor((state.gameTime * 8 + item.pulse) % 5)];
          const pips = [[-11, -11], [11, -11], [0, 0], [-11, 11], [11, 11]];
          for (const pip of pips) {
            context.beginPath();
            context.arc(pip[0], pip[1], 4 + energy * 1.5, 0, TAU);
            context.fill();
          }
          context.restore();
          if (active) drawStar(context, 31, -27, 8 + energy * 6, 3, color);
          break;
        }
        default: {
          context.fillStyle = color;
          context.strokeStyle = COLORS.outline;
          context.beginPath();
          context.arc(0, 0, 21 + energy * 5, 0, TAU);
          context.fill();
          context.stroke();
          break;
        }
      }
    }

    drawToothedDisc(context, x, y, radius, teeth, rotation, fill, hub) {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.fillStyle = fill;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      for (let i = 0; i < teeth * 2; i += 1) {
        const r = i % 2 === 0 ? radius + 8 : radius;
        const a = i / (teeth * 2) * TAU;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
      }
      context.closePath();
      context.fill();
      context.stroke();
      context.fillStyle = hub;
      context.beginPath();
      context.arc(0, 0, radius * 0.5, 0, TAU);
      context.fill();
      context.stroke();
      context.restore();
    }

    drawSignalDots(context, x, y, length, color, pulse) {
      context.fillStyle = color;
      for (let i = 0; i < 4; i += 1) {
        const phase = (pulse + i * 0.18) % 1;
        context.globalAlpha = 0.35 + phase * 0.65;
        context.beginPath();
        context.arc(x + length * phase, y + Math.sin(phase * TAU) * 4, 3, 0, TAU);
        context.fill();
      }
      context.globalAlpha = 1;
    }

    drawLightningBolt(context, x1, y1, x2, y2, color, width) {
      context.strokeStyle = color;
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(x1, y1);
      const midX = (x1 + x2) * 0.5;
      const midY = (y1 + y2) * 0.5;
      context.lineTo(midX - 8, midY + 5);
      context.lineTo(midX + 6, midY - 7);
      context.lineTo(x2, y2);
      context.stroke();
    }

    categoryColor(category) {
      return {
        "Impact Items": "#f6ca45",
        "Blade / Piercing Items": "#d8d0b6",
        "Launch / Movement Items": "#39c1d3",
        "Circuit / Trigger Items": "#9b6df2",
        "Hold / Trap Items": "#49bf70",
        "Element Items": "#e23535",
        "Projectile / Weapon Items": "#ff8a45",
        "Body Interaction Items": "#f27d9b",
        "Setup / Stage Items": "#9fa8aa",
        "Chaos / Special Items": "#fff4df",
      }[category] ?? "#f6ca45";
    }
  }

  function shuffleArray(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(rand(0, index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  class HazardSystem {
    constructor() {
      this.spikes = [];
      this.blocks = [];
      this.fires = [];
      this.bursts = [];
      this.springs = [];
      this.saw = null;
    }

    reset() {
      this.spikes.length = 0;
      this.blocks.length = 0;
      this.fires.length = 0;
      this.bursts.length = 0;
      this.springs.length = 0;
      this.saw = null;
    }

    spawnSpike(x, y) {
      this.spikes.push({ x, y, life: 3.4, cooldown: 0 });
    }

    spawnCrusher(x) {
      this.blocks.push({
        x,
        y: state.room.top - 90,
        w: 132,
        h: 66,
        vy: 0,
        life: 5,
        hitCooldown: 0,
      });
    }

    spawnExplosion(x, y) {
      this.bursts.push({ x, y, radius: 0, maxRadius: 170, life: 0.72 });
      for (const actor of getCharacters()) {
        const dist = distance(actor.head, { x, y });
        if (dist > 260) continue;
        actor.applyDamage("explosion", { x, y }, {
          force: lerp(96, 32, clamp(dist / 260, 0, 1)),
          radius: 180,
          direction: normalize(actor.head.x - x, actor.head.y - y - 20),
        });
      }
      blood.spawn("splat", x, y, { x: 0, y: -1 }, 55, 34);
    }

    spawnSpring(x, y) {
      this.springs.push({ x, y, life: 0.72 });
      const target = nearestCharacter({ x, y }, 220) ?? clown;
      const dir = normalize(target.head.x - x + rand(-40, 40), target.head.y - y - 230);
      target.applyDamage("blunt", { x, y }, {
        force: 32,
        radius: 110,
        direction: dir,
      });
      target.head.applyImpulse(dir.x * 170, dir.y * 170, { x, y });
      for (const particle of target.particles) {
        if (distance(particle, { x, y }) < 180) {
          particle.applyImpulse(dir.x * 52, dir.y * 74);
        }
      }
    }

    spawnFire(x, y) {
      this.fires.push({ x, y, life: 0.82, tick: 0 });
    }

    update(dt, room) {
      this.updateSpikes(dt);
      this.updateBlocks(dt, room);
      this.updateFires(dt);
      for (let index = this.bursts.length - 1; index >= 0; index -= 1) {
        const burst = this.bursts[index];
        burst.life -= dt;
        burst.radius = lerp(burst.radius, burst.maxRadius, 0.25);
        if (burst.life <= 0) this.bursts.splice(index, 1);
      }
      for (let index = this.springs.length - 1; index >= 0; index -= 1) {
        const spring = this.springs[index];
        spring.life -= dt;
        if (spring.life <= 0) this.springs.splice(index, 1);
      }
    }

    updateSpikes(dt) {
      for (let index = this.spikes.length - 1; index >= 0; index -= 1) {
        const spike = this.spikes[index];
        spike.life -= dt;
        spike.cooldown -= dt;
        if (spike.cooldown <= 0) {
          const actor = findCharacterAt(spike, 18);
          const hits = actor ? actor.hitTest(spike, 18) : [];
          if (hits.length) {
            const dir = normalize(actor.head.x - spike.x, actor.head.y - spike.y);
            actor.damageRegion(hits[0].region, "piercing", spike, 18, dir, hits[0]);
            spike.cooldown = 0.14;
          }
        }
        if (spike.life <= 0) this.spikes.splice(index, 1);
      }
    }

    updateBlocks(dt, room) {
      for (let index = this.blocks.length - 1; index >= 0; index -= 1) {
        const block = this.blocks[index];
        block.vy += 1850 * dt;
        block.y += block.vy * dt;
        block.life -= dt;
        block.hitCooldown -= dt;
        if (block.y + block.h > room.floor) {
          block.y = room.floor - block.h;
          block.vy *= -0.1;
        }
        if (block.hitCooldown <= 0) {
          const center = { x: block.x, y: block.y + block.h * 0.5 };
          for (const actor of getCharacters()) {
            const headDistX = Math.abs(actor.head.x - block.x);
            const headDistY = Math.abs(actor.head.y - center.y);
            if (headDistX < block.w * 0.5 + actor.head.radiusX && headDistY < block.h * 0.5 + actor.head.radiusY) {
              actor.applyDamage("crushing", { x: actor.head.x, y: block.y + block.h }, {
                force: clamp(block.vy * 0.05, 24, 92),
                radius: 100,
                direction: { x: 0, y: 1 },
              });
              actor.head.y = Math.max(actor.head.y, block.y + block.h + actor.head.radiusY * 0.42);
              block.vy *= -0.22;
              block.hitCooldown = 0.18;
            }
            for (const particle of actor.particles) {
              if (
                particle.x > block.x - block.w * 0.5 &&
                particle.x < block.x + block.w * 0.5 &&
                particle.y > block.y &&
                particle.y < block.y + block.h
              ) {
                actor.damageRegion(particle.region, "crushing", particle, clamp(block.vy * 0.04, 16, 64), { x: 0, y: 1 }, { particle });
                particle.y = block.y + block.h + particle.radius;
                particle.applyImpulse(0, 24);
                block.hitCooldown = 0.12;
              }
            }
          }
        }
        if (block.life <= 0) this.blocks.splice(index, 1);
      }
    }

    updateFires(dt) {
      for (let index = this.fires.length - 1; index >= 0; index -= 1) {
        const fire = this.fires[index];
        fire.life -= dt;
        fire.tick -= dt;
        if (fire.tick <= 0) {
          for (const actor of getCharacters()) {
            const hits = actor.hitTest(fire, 54);
            for (const hit of hits) {
              actor.damageRegion(hit.region, "burning", fire, 8, normalize(actor.head.x - fire.x, actor.head.y - fire.y), hit);
            }
          }
          fire.tick = 0.12;
        }
        if (fire.life <= 0) this.fires.splice(index, 1);
      }
    }

    draw(context) {
      for (const spring of this.springs) drawSpring(context, spring);
      for (const spike of this.spikes) drawSpike(context, spike);
      for (const block of this.blocks) drawCrusher(context, block);
      for (const fire of this.fires) drawFire(context, fire);
      for (const burst of this.bursts) drawExplosion(context, burst);
      if (this.saw) drawSaw(context, this.saw);
    }
  }

  function drawWoundPatch(context, x, y, size, layer, angle, type, style = "Gore", goreColor = null) {
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    if (style !== "Gore") {
      drawStylizedDamagePatch(context, size, angle, type, style);
      context.restore();
      return;
    }
    const woundColor = goreColor ?? COLORS.bloodBright;
    const exposedColor = layer >= 4
      ? getBoneColorForMods(DEFAULT_MOD_SETTINGS, size, 1)
      : layer === 3
        ? COLORS.muscleDark
        : layer === 2
          ? COLORS.fat
          : woundColor;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = COLORS.outline;
    context.lineWidth = Math.max(4, size * 0.16);

    if (type === "burning") {
      context.fillStyle = COLORS.soot;
      context.globalAlpha = 0.7;
      context.beginPath();
      context.ellipse(0, 0, size * 0.46, size * 0.24, 0, 0, TAU);
      context.fill();
      context.globalAlpha = 1;
    } else if (type === "blunt" || type === "crushing") {
      context.strokeStyle = "rgba(84, 45, 120, 0.75)";
      context.lineWidth = Math.max(3, size * 0.11);
      context.beginPath();
      context.arc(0, 0, size * 0.34, 0.2, Math.PI * 1.78);
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(-size * 0.52, -size * 0.05);
      context.lineTo(size * 0.52, size * 0.08);
      context.stroke();
    }

    context.strokeStyle = exposedColor;
    context.lineWidth = Math.max(2, size * 0.08);
    const strandCount = layer >= 3 ? 4 : 2;
    for (let i = 0; i < strandCount; i += 1) {
      const offset = (i - (strandCount - 1) * 0.5) * size * 0.11;
      context.beginPath();
      context.moveTo(-size * 0.42, offset);
      context.quadraticCurveTo(0, offset + Math.sin(i + size) * size * 0.08, size * 0.42, offset * 0.55);
      context.stroke();
    }

    if (layer >= 4) {
      context.strokeStyle = getBoneColorForMods(DEFAULT_MOD_SETTINGS, size + 3, 1);
      context.lineWidth = Math.max(2, size * 0.07);
      context.beginPath();
      context.moveTo(-size * 0.18, -size * 0.16);
      context.lineTo(size * 0.04, size * 0.02);
      context.lineTo(size * 0.22, -size * 0.14);
      context.stroke();
    }
    if (type === "slicing") {
      context.strokeStyle = woundColor;
      context.lineWidth = Math.max(3, size * 0.1);
      context.beginPath();
      context.moveTo(-size * 0.64, 0);
      context.lineTo(size * 0.64, 0);
      context.stroke();
    }
    context.restore();
  }

  function drawStylizedDamagePatch(context, size, angle, type, style) {
    context.lineCap = "round";
    context.lineJoin = "round";
    if (style === "Cartoon Bruises") {
      context.fillStyle = "rgba(110, 69, 173, 0.68)";
      context.beginPath();
      context.ellipse(0, 0, size * 0.65, size * 0.42, 0, 0, TAU);
      context.fill();
      context.fillStyle = "rgba(246, 202, 69, 0.28)";
      context.beginPath();
      context.ellipse(size * 0.12, -size * 0.06, size * 0.38, size * 0.22, 0.4, 0, TAU);
      context.fill();
    } else if (style === "Cracks") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-size * 0.58, -size * 0.12);
      context.lineTo(-size * 0.18, size * 0.06);
      context.lineTo(0, -size * 0.28);
      context.lineTo(size * 0.24, size * 0.08);
      context.lineTo(size * 0.62, -size * 0.18);
      context.stroke();
    } else if (style === "Burn Marks") {
      context.fillStyle = COLORS.soot;
      context.beginPath();
      context.ellipse(0, 0, size * 0.75, size * 0.48, 0, 0, TAU);
      context.fill();
      context.strokeStyle = "#f06b42";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(0, 0, size * 0.32, 0.2, Math.PI * 1.3);
      context.stroke();
    } else if (style === "Dents") {
      context.fillStyle = "rgba(20, 17, 17, 0.34)";
      context.beginPath();
      context.ellipse(0, 0, size * 0.68, size * 0.36, 0, 0, TAU);
      context.fill();
      context.strokeStyle = "rgba(255,255,255,0.28)";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(-size * 0.18, -size * 0.08, size * 0.22, Math.PI, TAU);
      context.stroke();
    } else if (style === "Confetti Bursts" || style === "Paint Splats") {
      const paint = style === "Paint Splats" ? ["#ff70bd", "#39c1d3", "#f6ca45", "#49bf70"] : ["#f6ca45", "#39c1d3", "#9b6df2", "#49bf70", "#ff6aa2"];
      for (let i = 0; i < 12; i += 1) {
        context.fillStyle = paint[i % paint.length];
        context.beginPath();
        context.ellipse(Math.cos(i * 1.9) * size * 0.4, Math.sin(i * 1.4) * size * 0.28, size * 0.1, size * 0.06, i, 0, TAU);
        context.fill();
      }
    } else if (style === "Sparks") {
      context.strokeStyle = "#fff175";
      context.lineWidth = 3;
      for (let i = 0; i < 8; i += 1) {
        const a = i * TAU / 8;
        context.beginPath();
        context.moveTo(Math.cos(a) * size * 0.12, Math.sin(a) * size * 0.12);
        context.lineTo(Math.cos(a) * size * 0.62, Math.sin(a) * size * 0.4);
        context.stroke();
      }
    } else if (style === "Smoke Puffs") {
      context.fillStyle = "rgba(111, 107, 102, 0.56)";
      for (let i = 0; i < 5; i += 1) {
        context.beginPath();
        context.arc(Math.cos(i * 1.4) * size * 0.22, Math.sin(i * 1.1) * size * 0.18, size * 0.22, 0, TAU);
        context.fill();
      }
    }
  }

  function drawSpike(context, spike) {
    context.save();
    context.globalAlpha = clamp(spike.life, 0, 1);
    context.translate(spike.x, spike.y);
    context.fillStyle = "#d8d0b6";
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0, -38);
    context.lineTo(22, 28);
    context.lineTo(-22, 28);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }

  function drawCrusher(context, block) {
    context.save();
    context.translate(block.x, block.y);
    context.fillStyle = "#59504d";
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 5;
    context.beginPath();
    context.roundRect(-block.w * 0.5, 0, block.w, block.h, 7);
    context.fill();
    context.stroke();
    context.strokeStyle = "#f1c84a";
    context.lineWidth = 5;
    for (let x = -block.w * 0.45; x < block.w * 0.45; x += 32) {
      context.beginPath();
      context.moveTo(x, 8);
      context.lineTo(x + 24, block.h - 8);
      context.stroke();
    }
    context.restore();
  }

  function drawFire(context, fire) {
    context.save();
    context.translate(fire.x, fire.y);
    context.globalAlpha = clamp(fire.life * 1.4, 0, 1);
    for (let i = 0; i < 7; i += 1) {
      const offset = (i - 3) * 9;
      context.fillStyle = i % 2 ? "#f6ca45" : "#e23535";
      context.beginPath();
      context.ellipse(offset, Math.sin(performance.now() * 0.008 + i) * 6, 12, 32 + i * 2, 0, 0, TAU);
      context.fill();
    }
    context.restore();
  }

  function drawExplosion(context, burst) {
    context.save();
    context.globalAlpha = clamp(burst.life, 0, 1);
    context.strokeStyle = "#f6ca45";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(burst.x, burst.y, burst.radius, 0, TAU);
    context.stroke();
    context.strokeStyle = "#e23535";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(burst.x, burst.y, burst.radius * 0.6, 0, TAU);
    context.stroke();
    context.restore();
  }

  function drawSpring(context, spring) {
    context.save();
    context.translate(spring.x, spring.y);
    context.globalAlpha = clamp(spring.life * 1.6, 0, 1);
    context.strokeStyle = COLORS.sleeveA;
    context.lineWidth = 6;
    context.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const x = Math.sin(i * Math.PI) * 26;
      const y = -i * 8;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.fillStyle = COLORS.shoeSole;
    context.fillRect(-42, 4, 84, 12);
    context.restore();
  }

  function drawSaw(context, saw) {
    context.save();
    context.translate(saw.x, saw.y);
    context.rotate(saw.rotation);
    context.fillStyle = "#d8d0b6";
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 4;
    context.beginPath();
    for (let i = 0; i < 18; i += 1) {
      const radius = i % 2 ? 26 : 36;
      const angle = (i / 18) * TAU;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = COLORS.outline;
    context.beginPath();
    context.arc(0, 0, 8, 0, TAU);
    context.fill();
    context.restore();
  }

  function drawRoom(context, room) {
    context.save();
    const gradient = context.createLinearGradient(0, 0, 0, state.height);
    gradient.addColorStop(0, "#211a1b");
    gradient.addColorStop(0.6, "#171314");
    gradient.addColorStop(1, "#120f10");
    context.fillStyle = gradient;
    context.fillRect(0, 0, state.width, state.height);
    if (audience) audience.drawBackground(context, room);

    context.strokeStyle = "rgba(255, 244, 224, 0.08)";
    context.lineWidth = 1;
    const grid = 48;
    for (let x = room.left; x <= room.right; x += grid) {
      context.beginPath();
      context.moveTo(x, room.top);
      context.lineTo(x, room.floor);
      context.stroke();
    }
    for (let y = room.top; y <= room.floor; y += grid) {
      context.beginPath();
      context.moveTo(room.left, y);
      context.lineTo(room.right, y);
      context.stroke();
    }

    context.fillStyle = "#2a2223";
    context.fillRect(0, room.floor, state.width, state.height - room.floor);
    context.fillStyle = "#403432";
    context.fillRect(room.left, room.floor - 9, room.right - room.left, 12);
    context.strokeStyle = "#0e0b0c";
    context.lineWidth = 7;
    context.strokeRect(room.left, room.top, room.right - room.left, room.floor - room.top);
    context.fillStyle = "rgba(246, 202, 69, 0.1)";
    context.fillRect(room.left, room.top, room.right - room.left, 22);
    if (state.discoPulse > 0 || getCharacters().some((actor) => actor.mods?.danceTogether)) {
      const pulse = 0.35 + Math.abs(Math.sin(state.gameTime * 6)) * 0.35;
      context.fillStyle = `rgba(9, 6, 18, ${0.38 + pulse * 0.25})`;
      context.fillRect(room.left, room.top, room.right - room.left, room.floor - room.top);
      const ballX = (room.left + room.right) * 0.5;
      const ballY = room.top + 46;
      context.fillStyle = "#d7f8ff";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(ballX, ballY, 18, 0, TAU);
      context.fill();
      context.stroke();
      for (let ray = 0; ray < 10; ray += 1) {
        const hue = (state.gameTime * 180 + ray * 36) % 360;
        context.strokeStyle = `hsla(${hue}, 94%, 64%, 0.42)`;
        context.beginPath();
        context.moveTo(ballX, ballY);
        context.lineTo(ballX + Math.cos(ray * 0.63 + state.gameTime * 2.2) * 520, ballY + Math.sin(ray * 0.63 + state.gameTime * 2.2) * 360);
        context.stroke();
      }
    }
    context.restore();
  }

  function pointerToCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left),
      y: (event.clientY - rect.top),
    };
  }

  function startModDrawerDrag(event) {
    if (state.mode !== "sandbox" || event.button !== 0) return;
    if (event.target.closest("button, input, select, textarea, label")) return;
    const rect = modDrawer.getBoundingClientRect();
    state.modDrawerDrag = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    modDrawer.classList.add("dragging", "dragged");
    modDrawer.style.left = `${rect.left}px`;
    modDrawer.style.top = `${rect.top}px`;
    modDrawer.style.width = `${rect.width}px`;
    modDrawer.style.height = `${rect.height}px`;
    modDrawerHandle.setPointerCapture(event.pointerId);
  }

  function moveModDrawerDrag(event) {
    const drag = state.modDrawerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const width = modDrawer.offsetWidth;
    const height = modDrawer.offsetHeight;
    const left = clamp(event.clientX - drag.offsetX, 8, window.innerWidth - width - 8);
    const top = clamp(event.clientY - drag.offsetY, 8, window.innerHeight - Math.min(height, window.innerHeight - 16) - 8);
    modDrawer.style.left = `${left}px`;
    modDrawer.style.top = `${top}px`;
  }

  function endModDrawerDrag(event) {
    const drag = state.modDrawerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;
    state.modDrawerDrag = null;
    modDrawer.classList.remove("dragging");
    try {
      modDrawerHandle.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture can already be released by the browser if the pointer leaves the window.
    }
  }

  function setActiveTool(tool) {
    state.activeTool = tool;
    state.pointer.grab = null;
    for (const button of toolGrid.querySelectorAll(".tool-button")) {
      button.classList.toggle("active", button.dataset.tool === tool);
    }
    toolReadout.textContent = TOOL_COPY[tool] ?? "Tool ready";
  }

  function useToolAt(point, eventType = "down") {
    const now = performance.now();
    const dx = point.x - state.pointer.lastX;
    const dy = point.y - state.pointer.lastY;
    const movement = normalize(dx || rand(-1, 1), dy || -1);
    if (state.mode === "story" && performanceLoop?.handlePointer(point, eventType)) return;
    if (state.mode === "sandbox" && state.placingCharacterId && eventType === "down") {
      spawnCharacter(state.placingCharacterId, point);
      toolReadout.textContent = `${getCharacterEntry(state.placingCharacterId).name} placed`;
      state.placingCharacterId = null;
      closeCharacterPaletteDrawer();
      return;
    }

    const target = findCharacterAt(point, state.activeTool === "saw" ? 52 : 78) ?? state.selectedCharacter ?? clown;
    if (target && state.mode === "sandbox") setSelectedCharacter(target);

    if (state.activeTool === "hammer" && eventType === "down") {
      const dir = normalize(target.head.x - point.x, target.head.y - point.y - 12);
      target.applyDamage("blunt", point, { force: 58, radius: 74, direction: dir });
      toolReadout.textContent = "Hammer impact";
    } else if (state.activeTool === "saw" && (eventType === "down" || eventType === "move")) {
      if (now - state.pointer.lastDamageAt > 44) {
        target.applyDamage("slicing", point, { force: 22, radius: 46, direction: movement });
        state.pointer.lastDamageAt = now;
      }
      hazards.saw = { x: point.x, y: point.y, rotation: now * 0.026 };
      toolReadout.textContent = "Saw cutting";
    } else if (state.activeTool === "spike" && eventType === "down") {
      hazards.spawnSpike(point.x, point.y);
      toolReadout.textContent = "Spike placed";
    } else if (state.activeTool === "explosive" && eventType === "down") {
      hazards.spawnExplosion(point.x, point.y);
      toolReadout.textContent = "Blast triggered";
    } else if (state.activeTool === "spring" && eventType === "down") {
      hazards.spawnSpring(point.x, point.y);
      toolReadout.textContent = "Spring launched";
    } else if (state.activeTool === "crusher" && eventType === "down") {
      hazards.spawnCrusher(point.x);
      toolReadout.textContent = "Crusher dropped";
    } else if (state.activeTool === "fire" && (eventType === "down" || eventType === "move")) {
      if (now - state.pointer.lastDamageAt > 82) {
        hazards.spawnFire(point.x, point.y);
        state.pointer.lastDamageAt = now;
      }
      toolReadout.textContent = "Fire burning";
    } else if (state.activeTool === "rope" && eventType === "down") {
      const grabActor = findCharacterAt(point, 68) ?? state.selectedCharacter ?? clown;
      const nextGrab = grabActor.getGrabTarget(point);
      if (nextGrab) nextGrab.actor = grabActor;
      if (state.pointer.grab && nextGrab && sameGrabTarget(state.pointer.grab, nextGrab)) {
        state.pointer.grab = null;
        toolReadout.textContent = "Glove released";
      } else {
        state.pointer.grab = nextGrab;
        toolReadout.textContent = state.pointer.grab ? "Glove grabbed" : "Glove missed";
      }
    }
  }

  function sameGrabTarget(a, b) {
    return !!a && !!b && a.type === b.type && a.node === b.node && (a.actor ?? null) === (b.actor ?? null);
  }

  function showCharacterContextMenu(actor, event) {
    if (!characterContextMenu || !actor) return;
    state.characterContextMenu.actor = actor;
    state.characterContextMenu.open = true;
    const width = 92;
    const height = 48;
    const left = clamp(event.clientX + 8, 8, window.innerWidth - width - 8);
    const top = clamp(event.clientY + 8, 8, window.innerHeight - height - 8);
    characterContextMenu.style.left = `${left}px`;
    characterContextMenu.style.top = `${top}px`;
    characterContextMenu.hidden = false;
  }

  function hideCharacterContextMenu() {
    state.characterContextMenu.actor = null;
    state.characterContextMenu.open = false;
    if (characterContextMenu) characterContextMenu.hidden = true;
  }

  function openContextCharacterEditor() {
    const actor = state.characterContextMenu.actor;
    if (!actor) return;
    hideCharacterContextMenu();
    setItemDrawerOpen(false);
    setModDrawerOpen(false);
    setCharacterDrawerOpen(true);
    setSelectedCharacter(actor);
    openCharacterEditor({ type: "actor", actor });
  }

  function setItemDrawerOpen(open) {
    state.itemDrawerOpen = open;
    itemDrawer.classList.toggle("open", open);
    itemDrawerToggle.setAttribute("aria-expanded", String(open));
  }

  function setModDrawerOpen(open) {
    state.modDrawerOpen = open;
    modDrawer.classList.toggle("open", open);
    modMenuToggle.setAttribute("aria-expanded", String(open));
  }

  function setCharacterDrawerOpen(open) {
    state.characterPaletteOpen = open;
    characterPalette.hidden = false;
    characterPalette.classList.toggle("open", open);
    characterPickerButton.setAttribute("aria-expanded", String(open));
    if (!open) {
      window.setTimeout(() => {
        if (!state.characterPaletteOpen) characterPalette.hidden = true;
      }, 190);
    }
  }

  function openModMenu() {
    if (state.mode !== "sandbox") return;
    setItemDrawerOpen(false);
    setCharacterDrawerOpen(false);
    setModDrawerOpen(true);
    if (modPanel) modPanel.hidden = false;
    renderModControls();
    toolReadout.textContent = "Sandbox mods open";
  }

  function openCharacterPaletteDrawer() {
    if (state.mode !== "sandbox") return;
    setItemDrawerOpen(false);
    setModDrawerOpen(false);
    setCharacterDrawerOpen(true);
    renderCharacterList();
    toolReadout.textContent = "Sandbox characters open";
  }

  function closeCharacterPaletteDrawer() {
    setCharacterDrawerOpen(false);
  }

  function renderItemGrid(filter = "") {
    const query = filter.trim().toLowerCase();
    const items = ITEM_REGISTRY.filter((item) => !query || item.name.toLowerCase().includes(query) || item.id.includes(query));
    toolGrid.innerHTML = items.map((item) => `
      <button class="tool-button${state.activeTool === item.id ? " active" : ""}" type="button" data-tool="${item.id}" title="${item.description}">
        <span class="item-icon">${item.icon}</span>
        <span><strong>${item.name}</strong><small>${item.description}</small></span>
      </button>
    `).join("");
  }

  function renderItemSearchResults() {
    const query = itemSearch.value.trim().toLowerCase();
    if (!query) {
      itemSearchResults.innerHTML = "";
      renderItemGrid("");
      return;
    }
    const matches = ITEM_REGISTRY
      .map((item) => ({
        item,
        score: item.name.toLowerCase().startsWith(query) ? 0 : item.name.toLowerCase().includes(query) ? 1 : item.id.includes(query) ? 2 : 9,
      }))
      .filter((entry) => entry.score < 9)
      .sort((a, b) => a.score - b.score || a.item.name.localeCompare(b.item.name))
      .map((entry) => entry.item);
    itemSearchResults.innerHTML = matches.slice(0, 5).map((item) => `
      <button class="search-result-button" type="button" data-tool="${item.id}">
        <span class="item-icon">${item.icon}</span>
        <span><strong>${item.name}</strong><small>${item.description}</small></span>
      </button>
    `).join("");
    renderItemGrid(query);
  }

  function renderCharacterList() {
    if (!characterList) return;
    const baseCards = CHARACTER_REGISTRY.map((character) => renderCharacterCard(character, {
      mods: createDefaultMods(),
      actions: [
        { action: "place", label: "Place" },
        { action: "createFromBase", label: "Edit Copy" },
      ],
    })).join("");
    const customCards = state.customCharacters.map((character) => renderCharacterCard(character, {
      mods: character.defaultMods,
      custom: true,
      actions: [
        { action: "place", label: "Place" },
        { action: "edit", label: "Edit" },
        { action: "duplicate", label: "Duplicate" },
        { action: "delete", label: "Delete", danger: true },
      ],
    })).join("");
    characterList.innerHTML = `
      <div class="editor-section">
        <div class="editor-section-title">Base Characters</div>
        ${baseCards}
      </div>
      <div class="editor-section">
        <div class="editor-section-title">Saved Characters</div>
        ${customCards || `<p class="panel-hint">No saved custom clowns yet.</p>`}
      </div>
    `;
    for (const preview of characterList.querySelectorAll("[data-character-preview]")) {
      const entry = getCharacterEntry(preview.dataset.characterPreview);
      drawCharacterPreviewCanvas(preview, entry.defaultMods ?? createDefaultMods());
    }
  }

  function renderCharacterCard(character, config = {}) {
    const actions = (config.actions ?? [{ action: "place", label: "Place" }]).map((item) => `
      <button class="${item.danger ? "danger" : ""}" type="button" data-character-action="${item.action}" data-character="${character.id}">${item.label}</button>
    `).join("");
    return `
      <article class="character-card">
        <canvas class="character-card-preview" width="172" height="148" data-character-preview="${character.id}" aria-hidden="true"></canvas>
        <div class="character-card-main">
          <strong>${escapeHtml(character.name)}</strong>
          <small>${escapeHtml(character.description ?? "Playable character")}</small>
          <div class="character-card-actions">${actions}</div>
        </div>
      </article>
    `;
  }

  function openCharacterEditor(source = null) {
    if (!characterEditor || !characterNameInput) return;
    const baseSourceEntry = source?.type === "base" ? getCharacterEntry(source.id) : null;
    const actorSource = source?.type === "actor" ? source.actor : null;
    const selected = source?.type === "base"
      ? null
      : actorSource
        ? actorSource
        : source?.type === "custom"
        ? getCustomCharacter(source.id)
        : state.selectedCharacter;
    const defaultName = selected?.name ?? selected?.displayName ?? (baseSourceEntry ? `${baseSourceEntry.name} Custom` : "Custom Clown");
    const sourceMods = selected?.defaultMods ?? selected?.mods ?? baseSourceEntry?.defaultMods ?? createDefaultMods();
    const customRecord = actorSource ? getCustomCharacter(actorSource.characterId) : null;
    state.characterEditor = {
      open: true,
      editingId: source?.type === "custom" ? source.id : customRecord?.id ?? null,
      lastSavedId: source?.type === "custom" ? source.id : customRecord?.id ?? state.characterEditor.lastSavedId,
      baseCharacterId: baseSourceEntry?.id ?? selected?.baseCharacterId ?? selected?.characterId ?? "clown",
      draftMods: sanitizeCharacterEditorDraft({ ...createDefaultMods(), ...sourceMods }),
      liveActor: actorSource ?? null,
    };
    characterNameInput.value = sanitizeCharacterName(defaultName);
    characterEditor.hidden = false;
    renderCharacterEditorControls();
    updateCharacterEditorPreview();
    toolReadout.textContent = actorSource ? `Editing ${actorSource.displayName}` : source?.type === "custom" ? "Editing saved character" : "Creating custom character";
  }

  function closeCharacterEditorPanel() {
    state.characterEditor.open = false;
    state.characterEditor.liveActor = null;
    if (characterEditor) characterEditor.hidden = true;
  }

  function renderCharacterEditorControls() {
    if (!characterEditorControls) return;
    const draft = state.characterEditor.draftMods ?? createDefaultMods();
    const visibleDefinitions = getVisibleCharacterEditorDefinitions(draft);
    characterEditorControls.innerHTML = EDITOR_GROUPS
      .map((group) => {
        const controls = visibleDefinitions
          .filter((definition) => getEditorGroupId(definition.key) === group.id)
          .map((definition) => renderEditorControl(getCharacterEditorDefinitionForRender(definition, draft), draft[definition.key] ?? DEFAULT_MOD_SETTINGS[definition.key]))
          .join("");
        if (!controls) return "";
        return `
          <section class="editor-section" data-editor-section="${group.id}">
            <h3 class="editor-section-title">${group.label}</h3>
            ${controls}
          </section>
        `;
      })
      .join("");
  }

  function renderEditorControl(definition, value) {
    if (definition.type === "range") {
      return `
        <div class="mod-control" data-editor-control="${definition.key}">
          <label><span>${definition.label}</span><output data-value>${formatModValue(definition, value)}</output></label>
          <input type="range" min="${definition.min}" max="${definition.max}" step="${definition.step}" value="${value}" data-editor-mod="${definition.key}">
          <small>${definition.description}</small>
        </div>
      `;
    }
    if (definition.type === "toggle") {
      return `
        <div class="mod-control" data-editor-control="${definition.key}">
          <label><span>${definition.label}</span><input type="checkbox" ${value ? "checked" : ""} data-editor-mod="${definition.key}"></label>
          <small>${definition.description}</small>
        </div>
      `;
    }
    if (definition.type === "color") {
      return `
        <div class="mod-control" data-editor-control="${definition.key}">
          <label><span>${definition.label}</span><output data-value>${formatModValue(definition, value)}</output></label>
          <input type="color" value="${value}" data-editor-mod="${definition.key}">
          <small>${definition.description}</small>
        </div>
      `;
    }
    if (definition.type === "select") {
      return `
        <div class="mod-control" data-editor-control="${definition.key}">
          <label><span>${definition.label}</span><output data-value>${escapeHtml(value)}</output></label>
          <select data-editor-mod="${definition.key}">
            ${definition.options.map((option) => `<option value="${escapeHtml(option)}"${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
          <small>${definition.description}</small>
        </div>
      `;
    }
    return `
      <div class="mod-control" data-editor-control="${definition.key}">
        <button type="button" data-editor-action="${definition.key}">${definition.label}</button>
        <small>${definition.description}</small>
      </div>
    `;
  }

  function handleCharacterEditorInput(input) {
    const key = input.dataset.editorMod;
    const definition = CHARACTER_EDITOR_DEFINITIONS.find((candidate) => candidate.key === key);
    if (!definition) return;
    const value = definition.type === "toggle" ? input.checked : definition.type === "range" ? Number(input.value) : input.value;
    state.characterEditor.draftMods = { ...createDefaultMods(), ...(state.characterEditor.draftMods ?? {}) };
    state.characterEditor.draftMods[key] = value;
    state.characterEditor.draftMods = sanitizeCharacterEditorDraft(state.characterEditor.draftMods, key);
    applyCharacterEditorDraftToLiveActor(key);
    const output = input.closest(".mod-control")?.querySelector("[data-value]");
    if (output) output.textContent = formatModValue(definition, state.characterEditor.draftMods[key]);
    renderCharacterEditorControls();
    updateCharacterEditorPreview();
  }

  const LIVE_EDITOR_ACTION_KEYS = new Set([
    "removeBones",
    "restoreBones",
    "reset",
    "duplicate",
    "delete",
    "detachLimbs",
    "reattachLimbs",
    "explode",
    "miniClownSpawn",
  ]);
  const SOCIAL_EDITOR_KEYS = new Set([
    "reactionToClowns",
    "friendshipEnabled",
    "friendshipLevel",
    "fearEnabled",
    "fearOfClowns",
    "followClowns",
    "protectMode",
    "protectTargetId",
    "danceTogether",
    "rivalryMode",
    "copycatMode",
    "groupPanic",
    "clownMagnetism",
    "clownCollisionMode",
    "chainLinkClowns",
  ]);
  const FREEZE_HIDDEN_KEYS = new Set(["panicMode", "dazedMode", "sugarMode", "rabbitClown", "giantMode", "tinyMode", "autoClone", "balloonMode", "miniClownSpawn"]);
  const FRIENDLY_REACTIONS = new Set(["Laugh", "Cheer"]);
  const FEAR_SAFE_REACTIONS = ["Ignore", "Stare", "Panic", "Run Away", "Gasp", "Freeze Up"];

  const EDITOR_GROUPS = [
    { id: "appearance-core", label: "Clown Look" },
    { id: "premade-textures", label: "Premade Clown Textures" },
    { id: "anatomy-textures", label: "Anatomy And Gore Textures" },
    { id: "personality", label: "Personality And Idle Acting" },
    { id: "spawn-reactions", label: "New-Clown Spawn Reaction" },
    { id: "social", label: "Continuous Clown Behavior" },
    { id: "special", label: "Special Modes And Triggers" },
    { id: "physics", label: "Physics And Durability" },
    { id: "gore", label: "Runtime Gore Rules" },
    { id: "audience", label: "Audience Scoring Bias" },
    { id: "actions", label: "Live Actor Actions" },
  ];

  function getEditorGroupId(key) {
    if (key === "clownSkin") return "premade-textures";
    if (["facePaintStyle", "noseType", "eyeStyle", "mouthStyle", "hairStyle", "shoeType", "gloveType", "facePaintColor", "noseColor", "hairColor", "gloveColor", "shoeColor", "eyeColor"].includes(key)) return "appearance-core";
    if (["bloodColor", "gutColor", "bloodType", "internalAnatomy", "boneType", "damageStyle"].includes(key)) return "anatomy-textures";
    if (["personality", "painReactionStyle", "idleBehavior", "courage", "anger", "dramaLevel", "forceExpression", "eyeFollowMouse"].includes(key)) return "personality";
    if (["clownAwareness", "reactionToClowns"].includes(key)) return "spawn-reactions";
    if (["friendshipEnabled", "friendshipLevel", "fearEnabled", "fearOfClowns", "followClowns", "protectMode", "protectTargetId", "danceTogether", "rivalryMode", "copycatMode", "groupPanic", "clownMagnetism", "clownCollisionMode", "chainLinkClowns"].includes(key)) return "social";
    if (["panicMode", "dazedMode", "rabbitClown", "sugarMode", "giantMode", "tinyMode", "balloonMode", "stickyMode", "slipperyMode", "electricMode", "fireproof", "explosiveBody", "chainReactionBody", "autoClone", "miniClownSpawn"].includes(key)) return "special";
    if (["headSize", "armLength", "legLength", "health", "damageResistance", "strength", "weight", "bounciness", "friction", "wobbliness", "slowMotion", "speed", "gravityScale", "pin"].includes(key)) return "physics";
    if (["extraGore", "noGore", "rainbowGore", "regenerate", "invincible"].includes(key)) return "gore";
    if (["audienceFavorite", "audienceHates", "funnyMultiplier", "shockValue", "crowdSympathy"].includes(key)) return "audience";
    if (LIVE_EDITOR_ACTION_KEYS.has(key)) return "actions";
    return "premade-textures";
  }

  function getVisibleCharacterEditorDefinitions(draft) {
    return CHARACTER_EDITOR_DEFINITIONS.filter((definition) => shouldShowCharacterEditorControl(definition, draft));
  }

  function shouldShowCharacterEditorControl(definition, draft) {
    const key = definition.key;
    const liveActor = state.characterEditor.liveActor;
    if (REMOVED_MOD_KEYS.has(key)) return false;
    if (LIVE_EDITOR_ACTION_KEYS.has(key) && !liveActor) return false;
    if (draft.freezeFace && FREEZE_HIDDEN_KEYS.has(key)) return false;
    if (draft.noGore && (key === "rainbowGore" || key === "extraGore")) return false;
    if (key === "removeBones") return liveActor && !draft.bonesRemoved;
    if (key === "restoreBones") return liveActor && draft.bonesRemoved;
    if (key === "fearOfClowns") return !!draft.fearEnabled;
    if (key === "friendshipLevel") return !!draft.friendshipEnabled;
    if (key === "protectTargetId") return !!draft.protectMode && !!liveActor;
    if (key === "audienceFavorite") return !draft.audienceHates;
    if (key === "audienceHates") return !draft.audienceFavorite;
    if (key === "courage" && draft.personality === "Coward") return false;
    if (key === "tinyMode") return !draft.giantMode;
    if (key === "giantMode") return !draft.tinyMode;
    if (key === "clownAwareness") return true;
    if (!draft.clownAwareness && SOCIAL_EDITOR_KEYS.has(key)) return false;
    if (draft.rabbitClown && ["reactionToClowns", "friendshipEnabled", "friendshipLevel", "fearEnabled", "fearOfClowns", "followClowns", "protectMode", "protectTargetId", "danceTogether", "rivalryMode", "copycatMode"].includes(key)) return false;
    if (draft.copycatMode && ["reactionToClowns", "personality", "painReactionStyle", "idleBehavior", "courage", "anger", "dramaLevel", "fearEnabled", "fearOfClowns", "friendshipEnabled", "friendshipLevel", "rivalryMode", "followClowns", "protectMode", "protectTargetId", "danceTogether"].includes(key)) return false;
    if (draft.rivalryMode && ["friendshipEnabled", "friendshipLevel", "protectMode", "protectTargetId", "danceTogether", "followClowns"].includes(key)) return false;
    if (draft.fearEnabled && ["friendshipEnabled", "friendshipLevel", "protectMode", "protectTargetId", "danceTogether", "followClowns"].includes(key)) return false;
    if (draft.friendshipEnabled && ["fearEnabled", "fearOfClowns"].includes(key)) return false;
    return true;
  }

  function getActorEditorLabel(actor) {
    return `${actor.displayName ?? "Clown"} #${actor.instanceId ?? "?"}`;
  }

  function getProtectTargetOptions() {
    const liveActor = state.characterEditor.liveActor;
    if (!liveActor) return ["Nearest Clown"];
    const options = getCharacters()
      .filter((actor) => actor !== liveActor)
      .map(getActorEditorLabel);
    return ["Nearest Clown", ...options];
  }

  function getCharacterEditorDefinitionForRender(definition, draft) {
    if (definition.key === "protectTargetId") return { ...definition, options: getProtectTargetOptions() };
    if (definition.key !== "reactionToClowns") return definition;
    let options = REACTION_OPTIONS;
    if (draft.fearEnabled) {
      options = FEAR_SAFE_REACTIONS;
    } else if (draft.rivalryMode) {
      options = ["Ignore", "Stare", "Attack", "Gasp"];
    }
    return { ...definition, options };
  }

  function sanitizeCharacterEditorDraft(mods, changedKey = null) {
    const draft = { ...createDefaultMods(), ...(mods ?? {}) };
    for (const key of REMOVED_MOD_KEYS) delete draft[key];
    if (draft.noGore) draft.rainbowGore = false;
    if (changedKey === "audienceFavorite" && draft.audienceFavorite) draft.audienceHates = false;
    if (changedKey === "audienceHates" && draft.audienceHates) draft.audienceFavorite = false;
    if (draft.audienceFavorite && draft.audienceHates) draft.audienceHates = false;
    if (draft.freezeFace) {
      Object.assign(draft, {
        panicMode: false,
        dazedMode: false,
        sugarMode: false,
        rabbitClown: false,
        giantMode: false,
        tinyMode: false,
        balloonMode: false,
        autoClone: 0,
      });
    }
    if (changedKey === "panicMode" && draft.panicMode) {
      draft.dazedMode = false;
      draft.sugarMode = false;
      draft.rabbitClown = false;
    } else if (changedKey === "dazedMode" && draft.dazedMode) {
      draft.panicMode = false;
      draft.sugarMode = false;
      draft.rabbitClown = false;
    } else if (changedKey === "sugarMode" && draft.sugarMode) {
      draft.panicMode = false;
      draft.dazedMode = false;
      draft.rabbitClown = false;
    } else if (changedKey === "rabbitClown" && draft.rabbitClown) {
      draft.panicMode = false;
      draft.dazedMode = false;
      draft.sugarMode = false;
    }
    if (draft.rabbitClown) {
      draft.rivalryMode = false;
      draft.copycatMode = false;
      draft.friendshipEnabled = false;
      draft.fearEnabled = false;
      draft.followClowns = false;
      draft.protectMode = false;
      draft.danceTogether = false;
      draft.reactionToClowns = "Attack";
    }
    if (changedKey === "giantMode" && draft.giantMode) draft.tinyMode = false;
    if (changedKey === "tinyMode" && draft.tinyMode) draft.giantMode = false;
    if (!draft.clownAwareness) {
      draft.reactionToClowns = "Ignore";
      draft.fearEnabled = false;
      draft.friendshipEnabled = false;
      draft.followClowns = false;
      draft.protectMode = false;
      draft.danceTogether = false;
      draft.rivalryMode = false;
      draft.copycatMode = false;
      draft.groupPanic = false;
      draft.chainLinkClowns = false;
      draft.clownMagnetism = "Off";
      draft.clownCollisionMode = "Normal Collision";
    }
    if (changedKey === "fearEnabled" && draft.fearEnabled) {
      draft.friendshipEnabled = false;
    }
    if (changedKey === "friendshipEnabled" && draft.friendshipEnabled) {
      draft.fearEnabled = false;
    }
    if (draft.fearEnabled) {
      draft.friendshipEnabled = false;
      draft.followClowns = false;
      draft.protectMode = false;
      draft.danceTogether = false;
      if (!FEAR_SAFE_REACTIONS.includes(draft.reactionToClowns)) draft.reactionToClowns = "Run Away";
    }
    if (draft.friendshipEnabled) {
      draft.fearEnabled = false;
    }
    if (draft.rivalryMode) {
      draft.friendshipEnabled = false;
      draft.followClowns = false;
      draft.protectMode = false;
      draft.danceTogether = false;
      if (FRIENDLY_REACTIONS.has(draft.reactionToClowns)) draft.reactionToClowns = "Attack";
    }
    if (draft.copycatMode) {
      draft.rivalryMode = false;
      draft.fearEnabled = false;
      draft.friendshipEnabled = false;
      draft.followClowns = false;
      draft.protectMode = false;
      draft.danceTogether = false;
      draft.reactionToClowns = "Ignore";
    }
    if (draft.personality === "Coward") draft.courage = 0;
    if (!REACTION_OPTIONS.includes(draft.reactionToClowns)) draft.reactionToClowns = "Ignore";
    if (draft.clownMagnetism !== "Positive" && draft.clownMagnetism !== "Negative") draft.clownMagnetism = "Off";
    if (!getProtectTargetOptions().includes(draft.protectTargetId)) draft.protectTargetId = "Nearest Clown";
    return draft;
  }

  function applyCharacterEditorDraftToLiveActor(changedKey = null) {
    const actor = state.characterEditor.liveActor;
    if (!actor) return;
    actor.mods = { ...createDefaultMods(), ...actor.mods, ...state.characterEditor.draftMods };
    actor.mods = sanitizeCharacterEditorDraft(actor.mods, changedKey);
    state.characterEditor.draftMods = { ...actor.mods };
    applyEditorSideEffects(actor, changedKey);
    actor.applyModSettings();
    updateSelectedCharacterReadout();
    updateReports();
  }

  function applyEditorSideEffects(actor, changedKey) {
    if (!actor) return;
    if (changedKey === "noGore" && actor.mods.noGore) {
      blood.reset();
      actor.guts.exposed = false;
    }
    if (["rainbowGore", "bloodType", "bloodColor", "gutColor"].includes(changedKey)) {
      recolorExistingGore(actor);
    }
    if (changedKey === "freezeFace" && actor.mods.freezeFace) {
      actor.zeroRigVelocity();
    }
    if (changedKey === "sugarMode" && actor.mods.sugarMode) {
      actor.sugarVertical = randomSign();
      actor.sugarBurstTimer = 0;
      actor.sugarCooldownTimer = rand(0.8, 3.8);
    }
    if (changedKey === "autoClone" && actor.mods.autoClone > 0) {
      actor.autoCloneTimer = rand(2.4, 5.2);
    }
    if (changedKey === "giantMode") {
      actor.mods.giantActive = false;
      actor.scaleModeTimer = rand(1.6, 4.8);
    }
    if (changedKey === "tinyMode") {
      actor.mods.tinyActive = false;
      actor.scaleModeTimer = rand(1.6, 4.8);
    }
    if (changedKey === "balloonMode" && actor.mods.balloonMode) {
      actor.mods.inflate = Math.max(actor.mods.inflate ?? 0, 80);
    }
  }

  function handleCharacterEditorAction(action) {
    const actor = state.characterEditor.liveActor;
    if (!actor) return;
    if (action === "removeBones") {
      actor.removeBones();
    } else if (action === "restoreBones") {
      actor.restoreBones();
    } else if (action === "reset") {
      actor.resetWithMods(actor.mods);
      blood.reset();
      hazards.reset();
    } else if (action === "duplicate") {
      const copy = spawnCharacter(actor.characterId, { x: actor.head.x + 92, y: actor.head.y }, { mods: { ...actor.mods } });
      copy.head.applyImpulse(8, -5);
    } else if (action === "delete") {
      removeCharacter(actor);
      closeCharacterEditorPanel();
      hideCharacterContextMenu();
      return;
    } else if (action === "detachLimbs") {
      actor.detachAllLimbs();
    } else if (action === "reattachLimbs") {
      actor.reattachAllLimbs();
    } else if (action === "explode") {
      hazards.spawnExplosion(actor.head.x, actor.head.y);
    } else if (action === "miniClownSpawn") {
      const copyMods = { ...actor.mods, size: 0.32, headSize: 0.8, autoClone: 0, giantMode: false, tinyMode: false, giantActive: false, tinyActive: false };
      const copy = spawnCharacter(actor.characterId, { x: actor.head.x + rand(-50, 50), y: actor.head.y - rand(60, 120) }, { mods: copyMods });
      copy.head.applyImpulse(rand(-8, 8), rand(-14, -5));
    }
    state.characterEditor.draftMods = sanitizeCharacterEditorDraft({ ...actor.mods });
    renderCharacterEditorControls();
    updateCharacterEditorPreview();
    updateReports();
  }

  function saveCharacterFromEditor() {
    const now = Date.now();
    const editingId = state.characterEditor.editingId;
    const previous = editingId ? getCustomCharacter(editingId) : null;
    state.characterEditor.draftMods = sanitizeCharacterEditorDraft(state.characterEditor.draftMods);
    const record = normalizeCustomCharacter({
      id: editingId ?? makeCustomCharacterId(),
      name: sanitizeCharacterName(characterNameInput?.value, previous?.name ?? "Custom Clown"),
      baseCharacterId: state.characterEditor.baseCharacterId ?? previous?.baseCharacterId ?? "clown",
      appearance: extractAppearanceSettings(state.characterEditor.draftMods),
      defaultMods: extractSavedMods(state.characterEditor.draftMods),
      createdAt: previous?.createdAt ?? now,
      updatedAt: now,
    });
    if (!record) return null;
    if (previous) {
      const index = state.customCharacters.indexOf(previous);
      state.customCharacters.splice(index, 1, record);
    } else {
      state.customCharacters.push(record);
    }
    state.characterEditor.editingId = record.id;
    state.characterEditor.lastSavedId = record.id;
    if (state.characterEditor.liveActor) {
      state.characterEditor.liveActor.characterId = record.id;
      state.characterEditor.liveActor.displayName = record.name;
      state.characterEditor.liveActor.mods = { ...createDefaultMods(), ...record.defaultMods };
      state.characterEditor.liveActor.applyModSettings();
      setSelectedCharacter(state.characterEditor.liveActor);
    }
    persistCustomCharacters();
    renderCharacterList();
    updateCharacterEditorPreview();
    toolReadout.textContent = `${record.name} saved`;
    return record;
  }

  function duplicateCustomCharacter(characterId) {
    const source = getCustomCharacter(characterId);
    if (!source) return;
    const copy = normalizeCustomCharacter({
      ...source,
      id: makeCustomCharacterId(),
      name: `${source.name} Copy`.slice(0, 32),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    state.customCharacters.push(copy);
    persistCustomCharacters();
    renderCharacterList();
    toolReadout.textContent = `${copy.name} duplicated`;
  }

  function deleteCustomCharacter(characterId) {
    const record = getCustomCharacter(characterId);
    if (!record) return;
    state.customCharacters = state.customCharacters.filter((entry) => entry.id !== characterId);
    if (state.characterEditor.editingId === characterId) closeCharacterEditorPanel();
    if (state.placingCharacterId === characterId) state.placingCharacterId = null;
    persistCustomCharacters();
    renderCharacterList();
    toolReadout.textContent = `${record.name} deleted`;
  }

  function updateCharacterEditorPreview() {
    if (!characterPreviewCanvas) return;
    const draft = { ...createDefaultMods(), ...(state.characterEditor.draftMods ?? {}) };
    drawCharacterPreviewCanvas(characterPreviewCanvas, draft);
  }

  function drawCharacterPreviewCanvas(canvasElement, mods) {
    const context = canvasElement.getContext("2d");
    if (!context) return;
    const width = canvasElement.width;
    const height = canvasElement.height;
    context.clearRect(0, 0, width, height);
    context.save();
    context.fillStyle = "rgba(17, 13, 14, 0.9)";
    context.fillRect(0, 0, width, height);
    context.translate(width * 0.5, height * 0.48);
    const scale = Math.min(width / 280, height / 230);
    context.scale(scale, scale);
    drawProceduralClownPreview(context, { ...createDefaultMods(), ...mods }, state.gameTime);
    context.restore();
  }

  function drawProceduralClownPreview(context, mods, time = 0) {
    const appearance = getAppearanceColorsForMods(mods);
    context.save();
    context.lineJoin = "round";
    context.lineCap = "round";
    context.globalAlpha = 0.86;
    drawPreviewLimb(context, -76, 22, -126, 72, 13, COLORS.sleeveA, COLORS.sleeveB);
    drawPreviewLimb(context, 76, 22, 126, 72, 13, COLORS.sleeveA, COLORS.sleeveB);
    drawPreviewLimb(context, -36, 86, -62, 152, 12, COLORS.pantA, COLORS.pantB);
    drawPreviewLimb(context, 36, 86, 62, 152, 12, COLORS.pantA, COLORS.pantB);
    drawPreviewShoe(context, -62, 152, mods, appearance, -0.12);
    drawPreviewShoe(context, 62, 152, mods, appearance, 0.12);
    drawPreviewHand(context, -126, 72, mods, appearance, -0.2);
    drawPreviewHand(context, 126, 72, mods, appearance, 0.2);
    context.globalAlpha = 1;
    drawPreviewHair(context, mods, appearance, time);

    context.fillStyle = COLORS.outline;
    context.beginPath();
    context.ellipse(0, 0, 93, 101, 0, 0, TAU);
    context.fill();
    context.fillStyle = appearance.face;
    context.beginPath();
    context.ellipse(0, 0, 86, 94, 0, 0, TAU);
    context.fill();
    context.fillStyle = appearance.faceShadow;
    context.globalAlpha = 0.26;
    context.beginPath();
    context.ellipse(18, 20, 58, 62, 0, 0, TAU);
    context.fill();
    context.globalAlpha = 1;
    drawSkinTexture(context, mods, 86, 94, time);
    drawFacePaintPattern(context, mods, 86, 94, time);
    drawPreviewEyes(context, mods, appearance);
    drawPreviewNose(context, mods, appearance);
    drawPreviewMouth(context, mods);
    if (mods.internalAnatomy !== "Normal Cartoon Guts" || mods.boneType !== "Normal Bones" || mods.bloodType !== "Normal Cartoon Blood") {
      context.save();
      context.globalAlpha = 0.42;
      context.translate(0, 10);
      drawPreviewInternalBadge(context, mods);
      context.restore();
    }
    context.restore();
  }

  function drawPreviewLimb(context, x1, y1, x2, y2, radius, colorA, colorB) {
    context.strokeStyle = COLORS.outline;
    context.lineWidth = radius * 2 + 6;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.strokeStyle = colorA;
    context.lineWidth = radius * 2;
    context.stroke();
    context.strokeStyle = colorB;
    context.lineWidth = 4;
    for (let t = 0.2; t < 0.92; t += 0.24) {
      context.beginPath();
      context.moveTo(lerp(x1, x2, t) - 8, lerp(y1, y2, t) - 2);
      context.lineTo(lerp(x1, x2, t) + 8, lerp(y1, y2, t) + 2);
      context.stroke();
    }
  }

  function drawPreviewHand(context, x, y, mods, appearance, angle) {
    const type = mods.gloveType;
    const scale = type === "Giant Hands" ? 1.35 : type === "Tiny Hands" ? 0.62 : type === "Boxing Gloves" ? 1.34 : 1;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(scale, scale);
    context.fillStyle = type === "Metal Hands" ? "#c8d1da" : type === "Balloon Hands" ? "#ffe7ef" : type === "Boxing Gloves" ? "#e54040" : appearance.glove;
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 4;
    if (type === "Claw Hands") {
      context.beginPath();
      context.ellipse(0, 0, 20, 15, 0, 0, TAU);
      context.fill();
      context.stroke();
      context.fillStyle = COLORS.bone;
      for (let i = -1; i <= 1; i += 1) {
        context.beginPath();
        context.moveTo(17, i * 7);
        context.lineTo(36, i * 9 - 5);
        context.lineTo(22, i * 7 + 6);
        context.closePath();
        context.fill();
        context.stroke();
      }
    } else {
      context.beginPath();
      context.ellipse(0, 0, type === "Boxing Gloves" ? 28 : 22, type === "Boxing Gloves" ? 21 : 17, 0, 0, TAU);
      context.fill();
      context.stroke();
      for (let i = -1; i <= 1; i += 1) {
        context.beginPath();
        context.ellipse(14, i * 8, type === "Sticky Hands" ? 11 : 9, 5, 0.25, 0, TAU);
        context.fill();
        context.stroke();
      }
      if (type === "Sticky Hands") {
        context.fillStyle = "rgba(99, 228, 109, 0.5)";
        context.beginPath();
        context.arc(16, 0, 12, 0, TAU);
        context.fill();
      }
    }
    context.restore();
  }

  function drawPreviewShoe(context, x, y, mods, appearance, angle) {
    const type = mods.shoeType;
    const scale = type === "Tiny Shoes" ? 0.62 : type === "Heavy Boots" ? 1.28 : 1;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.scale(scale, scale);
    context.fillStyle = type === "Heavy Boots" ? "#554d4b" : type === "Ice Skates" ? "#bff4ff" : appearance.shoe;
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, 0, type === "Rocket Shoes" ? 42 : 36, 18, 0, 0, TAU);
    context.fill();
    context.stroke();
    context.fillStyle = type === "Sticky Shoes" ? "#63e46d" : COLORS.shoeSole;
    context.beginPath();
    context.roundRect(-32, 9, 64, 7, 5);
    context.fill();
    context.stroke();
    if (type === "Spring Shoes" || type === "Bouncy Shoes") {
      context.strokeStyle = COLORS.bone;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-18, 18);
      context.lineTo(-8, 30);
      context.lineTo(4, 18);
      context.lineTo(16, 30);
      context.stroke();
    } else if (type === "Roller Skates") {
      context.fillStyle = "#101010";
      for (const wx of [-20, 18]) {
        context.beginPath();
        context.arc(wx, 22, 6, 0, TAU);
        context.fill();
      }
    } else if (type === "Ice Skates") {
      context.strokeStyle = "#eefcff";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-27, 23);
      context.lineTo(30, 23);
      context.stroke();
    } else if (type === "Rocket Shoes") {
      context.fillStyle = "#f6ca45";
      context.beginPath();
      context.moveTo(-40, 0);
      context.lineTo(-57, -8);
      context.lineTo(-49, 8);
      context.closePath();
      context.fill();
    }
    context.restore();
  }

  function drawPreviewHair(context, mods, appearance, time = 0) {
    const style = mods.hairStyle ?? "Side Tufts";
    if (style === "Bald") return;
    context.save();
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 5;
    const drawBlob = (x, y, r, color) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, r, 0, TAU);
      context.fill();
      context.stroke();
    };
    const colorAt = (index) => style === "Rainbow Wig" ? rainbowColor(index + time) : appearance.hair;
    if (style === "Big Afro" || style === "Rainbow Wig") {
      const blobs = [
        [-64, -82, 27], [-38, -103, 28], [0, -112, 31], [38, -103, 28], [64, -82, 27],
        [-86, -46, 24], [86, -46, 24],
      ];
      blobs.forEach((blob, index) => drawBlob(blob[0], blob[1], blob[2], colorAt(index)));
    } else if (style === "Mohawk") {
      context.fillStyle = appearance.hair;
      for (let i = -3; i <= 3; i += 1) {
        context.beginPath();
        context.moveTo(i * 17, -85);
        context.lineTo(i * 17 + 9, -127 - Math.abs(i) * 4);
        context.lineTo(i * 17 + 18, -84);
        context.closePath();
        context.fill();
        context.stroke();
      }
    } else if (style === "Burnt Hair") {
      context.fillStyle = "#2a2523";
      for (let i = -4; i <= 4; i += 1) {
        context.beginPath();
        context.moveTo(i * 17, -78);
        context.lineTo(i * 14 + Math.sin(i) * 8, -110 - Math.abs(i) * 2);
        context.lineTo(i * 17 + 12, -78);
        context.closePath();
        context.fill();
        context.stroke();
      }
    } else if (style === "Static Hair") {
      context.strokeStyle = appearance.hair;
      context.lineWidth = 6;
      for (let i = -5; i <= 5; i += 1) {
        context.beginPath();
        context.moveTo(i * 14, -86);
        context.lineTo(i * 18 - 8, -111);
        context.lineTo(i * 16 + 8, -105);
        context.lineTo(i * 20, -130);
        context.stroke();
      }
    } else if (style === "Spiky Hair") {
      context.fillStyle = appearance.hair;
      for (let i = -4; i <= 4; i += 1) {
        const angle = -Math.PI / 2 + i * 0.22;
        const baseX = Math.cos(angle) * 76;
        const baseY = Math.sin(angle) * 85;
        context.beginPath();
        context.moveTo(baseX - 8, baseY + 8);
        context.lineTo(Math.cos(angle) * 118, Math.sin(angle) * 124);
        context.lineTo(baseX + 10, baseY + 8);
        context.closePath();
        context.fill();
        context.stroke();
      }
    } else if (style === "Long Strings") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 8;
      for (const side of [-1, 1]) {
        for (let i = 0; i < 6; i += 1) {
          const x = side * (80 + i * 4);
          context.beginPath();
          context.moveTo(x, -46 + i * 3);
          context.bezierCurveTo(x + side * 14, -8, x - side * 10, 36, x + side * 6, 78);
          context.stroke();
        }
      }
      context.strokeStyle = appearance.hair;
      context.lineWidth = 4;
      for (const side of [-1, 1]) {
        for (let i = 0; i < 6; i += 1) {
          const x = side * (80 + i * 4);
          context.beginPath();
          context.moveTo(x, -46 + i * 3);
          context.bezierCurveTo(x + side * 14, -8, x - side * 10, 36, x + side * 6, 78);
          context.stroke();
        }
      }
    } else {
      drawBlob(-86, -38, 25, appearance.hair);
      drawBlob(86, -38, 25, COLORS.hairC);
      drawBlob(-45, -91, 18, COLORS.hairB);
      drawBlob(45, -91, 18, appearance.hair);
    }
    context.restore();
  }

  function texturePoint(index, rx, ry, seed = 0) {
    return {
      x: Math.sin(index * 12.9898 + seed * 7.23) * rx * 0.78,
      y: Math.cos(index * 78.233 + seed * 3.91) * ry * 0.78,
    };
  }

  function drawTextureBolt(context, x, y, radius = 4) {
    context.beginPath();
    context.arc(x, y, radius, 0, TAU);
    context.fill();
    context.stroke();
  }

  function drawClownSkinTextureDetails(context, skin, rx, ry, time) {
    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    if (skin === "Classic Clown") {
      context.fillStyle = "rgba(226, 53, 53, 0.14)";
      for (const spot of [{ x: -48, y: 26 }, { x: 48, y: 26 }, { x: 0, y: -62 }]) {
        context.beginPath();
        context.ellipse(spot.x, spot.y, 14, 7, 0.2, 0, TAU);
        context.fill();
      }
      context.fillStyle = "rgba(32, 23, 25, 0.16)";
      for (let i = 0; i < 18; i += 1) {
        const p = texturePoint(i, rx, ry, 1.2);
        context.beginPath();
        context.arc(p.x, p.y, 1.8, 0, TAU);
        context.fill();
      }
    } else if (skin === "Sad Clown") {
      context.fillStyle = "rgba(85, 168, 255, 0.18)";
      context.fillRect(-rx, -ry * 0.08, rx * 2, ry * 1.1);
      context.strokeStyle = "rgba(68, 147, 232, 0.58)";
      context.lineWidth = 5;
      for (const x of [-34, 34, -58, 58]) {
        context.beginPath();
        context.moveTo(x, -20);
        context.bezierCurveTo(x - 8, 16, x + 8, 38, x - 3, 75);
        context.stroke();
      }
    } else if (skin === "Angry Clown") {
      context.fillStyle = "rgba(226, 53, 53, 0.18)";
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
      context.strokeStyle = "rgba(120, 15, 25, 0.7)";
      context.lineWidth = 4;
      for (let i = 0; i < 9; i += 1) {
        const p = texturePoint(i, rx, ry, 3);
        context.beginPath();
        context.moveTo(p.x - 12, p.y);
        context.lineTo(p.x + 8, p.y - 8);
        context.lineTo(p.x + 16, p.y + 5);
        context.stroke();
      }
    } else if (skin === "Zombie Clown") {
      context.fillStyle = "rgba(75, 128, 70, 0.24)";
      for (let i = 0; i < 16; i += 1) {
        const p = texturePoint(i, rx, ry, 4.5);
        context.beginPath();
        context.ellipse(p.x, p.y, 14 + (i % 3) * 4, 7 + (i % 2) * 3, i, 0, TAU);
        context.fill();
      }
      context.strokeStyle = "rgba(37, 65, 38, 0.72)";
      context.lineWidth = 3;
      for (const x of [-52, -12, 38]) {
        context.beginPath();
        context.moveTo(x, -58);
        context.lineTo(x + 18, -34);
        context.stroke();
        for (let s = 0; s < 4; s += 1) {
          context.beginPath();
          context.moveTo(x + s * 5, -56 + s * 7);
          context.lineTo(x + s * 5 + 8, -62 + s * 7);
          context.stroke();
        }
      }
    } else if (skin === "Robot Clown") {
      context.fillStyle = "rgba(155, 180, 190, 0.2)";
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
      context.strokeStyle = "rgba(57, 89, 105, 0.76)";
      context.lineWidth = 3;
      for (let x = -64; x <= 64; x += 32) {
        context.beginPath();
        context.moveTo(x, -82);
        context.lineTo(x + 10, 82);
        context.stroke();
      }
      context.fillStyle = "#c8d1da";
      context.strokeStyle = COLORS.outline;
      for (const p of [{ x: -58, y: -58 }, { x: 58, y: -58 }, { x: -52, y: 55 }, { x: 52, y: 55 }]) drawTextureBolt(context, p.x, p.y, 4);
      context.strokeStyle = "#39c1d3";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-58, 12);
      context.lineTo(-20, 12);
      context.lineTo(-20, 38);
      context.lineTo(34, 38);
      context.stroke();
    } else if (skin === "Alien Clown") {
      const gradient = context.createRadialGradient(0, -20, 4, 0, 0, ry);
      gradient.addColorStop(0, "rgba(125, 255, 211, 0.42)");
      gradient.addColorStop(1, "rgba(121, 122, 255, 0.18)");
      context.fillStyle = gradient;
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
      context.fillStyle = "rgba(69, 255, 178, 0.34)";
      for (let i = 0; i < 20; i += 1) {
        const p = texturePoint(i, rx, ry, 7);
        context.beginPath();
        context.ellipse(p.x, p.y, 5 + (i % 4), 3 + (i % 2), i * 0.4, 0, TAU);
        context.fill();
      }
    } else if (skin === "Burnt Clown") {
      context.fillStyle = "rgba(18, 15, 12, 0.38)";
      for (let i = 0; i < 18; i += 1) {
        const p = texturePoint(i, rx, ry, 8);
        context.beginPath();
        context.ellipse(p.x, p.y, 18, 8, i * 0.4, 0, TAU);
        context.fill();
      }
      context.strokeStyle = "rgba(246, 202, 69, 0.35)";
      context.lineWidth = 2;
      for (let i = 0; i < 7; i += 1) {
        const p = texturePoint(i, rx, ry, 8.7);
        context.beginPath();
        context.moveTo(p.x - 10, p.y);
        context.lineTo(p.x, p.y - 14);
        context.lineTo(p.x + 13, p.y + 4);
        context.stroke();
      }
    } else if (skin === "Golden Clown") {
      const gradient = context.createLinearGradient(-rx, -ry, rx, ry);
      gradient.addColorStop(0, "rgba(255, 255, 210, 0.72)");
      gradient.addColorStop(0.44, "rgba(255, 192, 48, 0.3)");
      gradient.addColorStop(1, "rgba(121, 77, 7, 0.24)");
      context.fillStyle = gradient;
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
      context.strokeStyle = "rgba(255, 245, 180, 0.68)";
      context.lineWidth = 4;
      for (let x = -90; x < 90; x += 30) {
        context.beginPath();
        context.moveTo(x, -ry);
        context.lineTo(x + 58, ry);
        context.stroke();
      }
      drawStar(context, 45, -50, 11, 5, "rgba(255, 255, 210, 0.7)");
    } else if (skin === "Mime Clown") {
      context.fillStyle = "rgba(18, 13, 14, 0.12)";
      context.fillRect(0, -ry, rx, ry * 2);
      context.strokeStyle = "rgba(18, 13, 14, 0.72)";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(0, -86);
      context.lineTo(0, 86);
      context.moveTo(-42, -62);
      context.lineTo(-22, -28);
      context.moveTo(42, -62);
      context.lineTo(22, -28);
      context.stroke();
    } else if (skin === "TV Static Clown") {
      for (let y = -ry; y < ry; y += 5) {
        context.fillStyle = `rgba(255,255,255,${0.04 + (Math.sin(y * 8.1 + time * 8) + 1) * 0.08})`;
        context.fillRect(-rx, y, rx * 2, 2);
      }
      for (const bar of [{ x: -70, c: "#39c1d3" }, { x: -35, c: "#f6ca45" }, { x: 0, c: "#ff70bd" }, { x: 35, c: "#49bf70" }]) {
        context.fillStyle = bar.c;
        context.globalAlpha = 0.22;
        context.fillRect(bar.x, -ry, 24, ry * 2);
      }
      context.globalAlpha = 1;
    } else if (skin === "Toy Clown") {
      context.strokeStyle = "rgba(135, 62, 62, 0.58)";
      context.lineWidth = 2;
      context.setLineDash([8, 6]);
      context.beginPath();
      context.ellipse(0, 0, rx * 0.78, ry * 0.72, 0, 0, TAU);
      context.moveTo(-rx * 0.62, 0);
      context.lineTo(rx * 0.62, 0);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = "#f6ca45";
      context.strokeStyle = COLORS.outline;
      for (const p of [{ x: -58, y: -18 }, { x: 58, y: -18 }, { x: 0, y: 58 }]) drawTextureBolt(context, p.x, p.y, 5);
    } else if (skin === "Balloon Clown") {
      context.fillStyle = "rgba(255,255,255,0.48)";
      context.beginPath();
      context.ellipse(-32, -38, 19, 40, -0.34, 0, TAU);
      context.fill();
      context.strokeStyle = "rgba(255, 112, 189, 0.32)";
      context.lineWidth = 3;
      for (let x = -64; x <= 64; x += 32) {
        context.beginPath();
        context.moveTo(x, -ry);
        context.quadraticCurveTo(x + 14, 0, x, ry);
        context.stroke();
      }
    } else if (skin === "Skeleton Clown") {
      context.strokeStyle = "rgba(32, 23, 25, 0.58)";
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(0, -4, 53, 59, 0, 0, TAU);
      context.moveTo(-35, 34);
      context.lineTo(35, 34);
      context.moveTo(-24, -44);
      context.lineTo(-36, -18);
      context.moveTo(24, -44);
      context.lineTo(36, -18);
      context.stroke();
      context.fillStyle = "rgba(32, 23, 25, 0.18)";
      for (const p of [{ x: -28, y: -18 }, { x: 28, y: -18 }, { x: 0, y: 12 }]) {
        context.beginPath();
        context.ellipse(p.x, p.y, 10, 13, 0, 0, TAU);
        context.fill();
      }
    } else if (skin === "Candy Clown") {
      context.strokeStyle = "rgba(255, 112, 189, 0.38)";
      context.lineWidth = 11;
      for (let x = -140; x < 140; x += 34) {
        context.beginPath();
        context.moveTo(x, -100);
        context.lineTo(x + 80, 100);
        context.stroke();
      }
      context.fillStyle = "rgba(246, 202, 69, 0.38)";
      for (let i = 0; i < 14; i += 1) {
        const p = texturePoint(i, rx, ry, 12);
        context.beginPath();
        context.arc(p.x, p.y, 5, 0, TAU);
        context.fill();
      }
    }
    context.restore();
  }

  function drawSkinTexture(context, mods, rx = 86, ry = 94, time = 0) {
    const skin = mods.clownSkin ?? "Classic Clown";
    context.save();
    context.beginPath();
    context.ellipse(0, 0, rx, ry, 0, 0, TAU);
    context.clip();
    drawClownSkinTextureDetails(context, skin, rx, ry, time);
      if (skin === "Zombie Clown") {
      context.fillStyle = "rgba(75, 128, 70, 0.28)";
      for (let i = 0; i < 12; i += 1) {
        context.beginPath();
        context.ellipse(Math.sin(i * 2.1) * 62, Math.cos(i * 1.7) * 70, 12, 7, i, 0, TAU);
        context.fill();
      }
    } else if (skin === "Robot Clown") {
      context.strokeStyle = "rgba(57, 89, 105, 0.58)";
      context.lineWidth = 3;
      for (let x = -64; x <= 64; x += 32) {
        context.beginPath();
        context.moveTo(x, -82);
        context.lineTo(x + 10, 82);
        context.stroke();
      }
      context.fillStyle = "rgba(159, 216, 255, 0.45)";
      context.fillRect(-38, -62, 32, 20);
      context.fillRect(18, 42, 38, 18);
    } else if (skin === "Alien Clown") {
      const gradient = context.createRadialGradient(0, -20, 10, 0, 0, 94);
      gradient.addColorStop(0, "rgba(125, 255, 211, 0.35)");
      gradient.addColorStop(1, "rgba(121, 122, 255, 0.12)");
      context.fillStyle = gradient;
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
    } else if (skin === "Burnt Clown") {
      context.fillStyle = "rgba(18, 15, 12, 0.34)";
      for (let i = 0; i < 14; i += 1) {
        context.beginPath();
        context.ellipse(Math.sin(i * 1.3) * 64, Math.cos(i * 2.1) * 73, 18, 8, i * 0.4, 0, TAU);
        context.fill();
      }
    } else if (skin === "Golden Clown") {
      const gradient = context.createLinearGradient(-rx, -ry, rx, ry);
      gradient.addColorStop(0, "rgba(255, 255, 210, 0.55)");
      gradient.addColorStop(0.44, "rgba(255, 192, 48, 0.18)");
      gradient.addColorStop(1, "rgba(121, 77, 7, 0.16)");
      context.fillStyle = gradient;
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
    } else if (skin === "Mime Clown") {
      context.strokeStyle = "rgba(18, 13, 14, 0.5)";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(0, -86);
      context.lineTo(0, 86);
      context.stroke();
    } else if (skin === "TV Static Clown") {
      for (let y = -ry; y < ry; y += 7) {
        context.fillStyle = `rgba(255,255,255,${0.05 + (Math.sin(y * 8.1 + time) + 1) * 0.08})`;
        context.fillRect(-rx, y, rx * 2, 3);
      }
    } else if (skin === "Toy Clown") {
      context.strokeStyle = "rgba(135, 62, 62, 0.42)";
      context.lineWidth = 2;
      context.setLineDash([8, 6]);
      context.beginPath();
      context.ellipse(0, 0, rx * 0.78, ry * 0.72, 0, 0, TAU);
      context.stroke();
      context.setLineDash([]);
    } else if (skin === "Balloon Clown") {
      context.fillStyle = "rgba(255,255,255,0.44)";
      context.beginPath();
      context.ellipse(-32, -38, 19, 40, -0.34, 0, TAU);
      context.fill();
    } else if (skin === "Skeleton Clown") {
      context.strokeStyle = "rgba(32, 23, 25, 0.45)";
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(0, -4, 53, 59, 0, 0, TAU);
      context.moveTo(-35, 34);
      context.lineTo(35, 34);
      context.stroke();
    } else if (skin === "Candy Clown") {
      context.strokeStyle = "rgba(255, 112, 189, 0.32)";
      context.lineWidth = 9;
      for (let x = -140; x < 140; x += 34) {
        context.beginPath();
        context.moveTo(x, -100);
        context.lineTo(x + 80, 100);
        context.stroke();
      }
    } else if (skin === "Sad Clown") {
      context.fillStyle = "rgba(90, 170, 255, 0.12)";
      context.fillRect(-rx, 0, rx * 2, ry);
    } else if (skin === "Angry Clown") {
      context.fillStyle = "rgba(226, 53, 53, 0.14)";
      context.fillRect(-rx, -ry, rx * 2, ry * 2);
    }
    context.restore();
  }

  function drawFacePaintPattern(context, mods, rx = 86, ry = 94, time = 0) {
    const style = mods.facePaintStyle ?? "Classic Smile";
    const paint = mods.facePaintColor && mods.facePaintColor !== DEFAULT_MOD_SETTINGS.facePaintColor ? mods.facePaintColor : COLORS.nose;
    context.save();
    context.strokeStyle = paint;
    context.fillStyle = paint;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 5;
    if (style === "Big Frown") {
      context.beginPath();
      context.arc(0, 80, 48, Math.PI + 0.16, TAU - 0.16);
      context.stroke();
    } else if (style === "Star Eyes") {
      drawStar(context, -34, -27, 17, 7, paint);
      drawStar(context, 34, -27, 17, 7, paint);
    } else if (style === "Heart Cheeks") {
      drawHeart(context, -54, 25, 0.55, paint);
      drawHeart(context, 54, 25, 0.55, paint);
    } else if (style === "Jagged Smile" || style === "Scary Smile") {
      context.beginPath();
      context.moveTo(-55, 42);
      for (let i = 0; i <= 8; i += 1) context.lineTo(-55 + i * 14, 42 + (i % 2 ? 16 : 0));
      context.stroke();
      if (style === "Scary Smile") {
        context.fillStyle = "rgba(20, 13, 14, 0.3)";
        context.beginPath();
        context.ellipse(0, 52, 57, 23, 0, 0, TAU);
        context.fill();
      }
    } else if (style === "Melting Makeup") {
      for (const x of [-46, -18, 22, 52]) {
        context.beginPath();
        context.moveTo(x, -8);
        context.bezierCurveTo(x + 8, 22, x - 7, 46, x + 3, 76);
        context.stroke();
      }
    } else if (style === "Cracked Makeup") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      for (const x of [-42, 10, 48]) {
        context.beginPath();
        context.moveTo(x, -70);
        context.lineTo(x + 12, -37);
        context.lineTo(x - 4, -5);
        context.lineTo(x + 17, 24);
        context.stroke();
      }
    } else if (style === "Spiral Cheeks") {
      drawSpiral(context, -52, 27, 17, paint);
      drawSpiral(context, 52, 27, 17, paint);
    } else if (style === "Blank Mime Face") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(-43, -65);
      context.lineTo(-18, 8);
      context.moveTo(43, -65);
      context.lineTo(18, 8);
      context.stroke();
    } else {
      context.beginPath();
      context.arc(0, 28, 51, 0.08, Math.PI - 0.08);
      context.stroke();
      context.beginPath();
      context.arc(-43, 14, 9, 0, TAU);
      context.arc(43, 14, 9, 0, TAU);
      context.fill();
    }
    context.restore();
  }

  function drawPreviewEyes(context, mods, appearance) {
    const style = mods.eyeStyle ?? "Normal Eyes";
    for (const x of [-34, 34]) {
      const scale = style === "Giant Eyes" ? 1.34 : style === "Tiny Dot Eyes" ? 0.56 : 1;
      context.save();
      context.translate(x, -26);
      context.fillStyle = COLORS.teeth;
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(0, 0, 20 * scale, (style === "Sleepy Eyes" ? 11 : 22) * scale, 0, 0, TAU);
      context.fill();
      context.stroke();
      if (style === "X Eyes") {
        context.beginPath();
        context.moveTo(-9, -9);
        context.lineTo(9, 9);
        context.moveTo(9, -9);
        context.lineTo(-9, 9);
        context.stroke();
      } else if (style === "Spiral Eyes") {
        drawSpiral(context, 0, 0, 12, COLORS.outline);
      } else if (style === "Button Eyes") {
        context.fillStyle = appearance.eye;
        context.beginPath();
        context.arc(0, 0, 10, 0, TAU);
        context.fill();
        context.stroke();
      } else {
        context.fillStyle = style === "Glowing Eyes" ? "#7ff7ff" : appearance.eye;
        context.beginPath();
        context.arc(0, style === "Sleepy Eyes" ? 3 : 1, style === "Tiny Dot Eyes" ? 5 : 7, 0, TAU);
        context.fill();
        if (style === "Crying Eyes") {
          context.fillStyle = "#75d9ff";
          context.beginPath();
          context.ellipse(-3, 23, 5, 12, 0.2, 0, TAU);
          context.fill();
        } else if (style === "Angry Eyes") {
          context.strokeStyle = COLORS.outline;
          context.lineWidth = 5;
          context.beginPath();
          context.moveTo(x < 0 ? -22 : -2, -24);
          context.lineTo(x < 0 ? 18 : 22, -9);
          context.stroke();
        }
      }
      context.restore();
    }
  }

  function drawPreviewNose(context, mods, appearance) {
    const type = mods.noseType ?? "Red Ball Nose";
    const scale = type === "Tiny Nose" ? 0.6 : type === "Long Nose" ? 1.26 : type === "Balloon Nose" ? 1.4 : 1;
    context.fillStyle = type === "Metal Nose" ? "#c7d0d8" : type === "Glowing Nose" ? "#ff7cff" : appearance.nose;
    context.strokeStyle = type === "Broken Nose" ? COLORS.muscleDark : COLORS.outline;
    context.lineWidth = 5;
    context.beginPath();
    context.ellipse(0, 3, 19 * scale, type === "Long Nose" ? 31 : 19 * scale, 0, 0, TAU);
    context.fill();
    context.stroke();
    if (type === "Button Nose") {
      context.fillStyle = COLORS.outline;
      context.beginPath();
      context.arc(-6, 2, 2.5, 0, TAU);
      context.arc(6, 2, 2.5, 0, TAU);
      context.fill();
    } else if (type === "Squeaky Nose") {
      context.strokeStyle = "#fff8ea";
      context.lineWidth = 2;
      context.beginPath();
      context.arc(8, -5, 8, 0.2, 1.5);
      context.stroke();
    } else if (type === "Broken Nose") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-11, -4);
      context.lineTo(6, 2);
      context.lineTo(-2, 11);
      context.stroke();
    }
  }

  function drawPreviewMouth(context, mods) {
    const style = mods.mouthStyle ?? "Big Smile";
    context.strokeStyle = COLORS.nose;
    context.fillStyle = COLORS.mouth;
    context.lineCap = "round";
    if (style === "Frown") {
      context.lineWidth = 7;
      context.beginPath();
      context.arc(0, 82, 42, Math.PI + 0.12, TAU - 0.12);
      context.stroke();
    } else if (style === "Open Scream") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.ellipse(0, 50, 32, 39, 0, 0, TAU);
      context.fill();
      context.stroke();
    } else if (style === "Tiny Mouth") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 4;
      context.beginPath();
      context.ellipse(0, 53, 17, 9, 0, 0, TAU);
      context.fill();
      context.stroke();
    } else if (style === "Sharp Teeth") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.roundRect(-46, 40, 92, 28, 9);
      context.fill();
      context.stroke();
      context.fillStyle = COLORS.teeth;
      for (let i = 0; i < 8; i += 1) {
        context.beginPath();
        context.moveTo(-40 + i * 11, 42);
        context.lineTo(-34 + i * 11, 64);
        context.lineTo(-28 + i * 11, 42);
        context.closePath();
        context.fill();
        context.stroke();
      }
    } else if (style === "Missing Teeth") {
      drawPreviewToothyMouth(context, [1, 4]);
    } else if (style === "Zipper Mouth") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(-45, 52);
      context.lineTo(45, 52);
      context.stroke();
      context.lineWidth = 2.5;
      for (let x = -38; x <= 38; x += 10) {
        context.beginPath();
        context.moveTo(x, 45);
        context.lineTo(x + 6, 59);
        context.stroke();
      }
    } else if (style === "Wobbly Lip") {
      context.strokeStyle = COLORS.nose;
      context.lineWidth = 7;
      context.beginPath();
      context.moveTo(-48, 50);
      context.bezierCurveTo(-24, 35, -13, 69, 3, 51);
      context.bezierCurveTo(22, 31, 33, 71, 52, 49);
      context.stroke();
    } else if (style === "Deadpan Line") {
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 6;
      context.beginPath();
      context.moveTo(-38, 52);
      context.lineTo(38, 52);
      context.stroke();
    } else {
      drawPreviewToothyMouth(context, []);
    }
  }

  function drawPreviewToothyMouth(context, missing = []) {
    context.strokeStyle = COLORS.nose;
    context.lineWidth = 7;
    context.beginPath();
    context.arc(0, 28, 50, 0.08, Math.PI - 0.08);
    context.stroke();
    context.fillStyle = COLORS.mouth;
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 4;
    context.beginPath();
    context.ellipse(0, 54, 48, 16, 0, 0, Math.PI);
    context.fill();
    context.stroke();
    context.fillStyle = COLORS.teeth;
    for (let i = 0; i < 7; i += 1) {
      if (missing.includes(i)) continue;
      context.beginPath();
      context.roundRect(-34 + i * 10, 47, 11, 12, 2);
      context.fill();
      context.stroke();
    }
  }

  function drawPreviewInternalBadge(context, mods) {
    const bone = mods.boneType;
    const anatomy = mods.internalAnatomy;
    if (anatomy === "Robot Parts" || anatomy === "Clockwork Gears") {
      context.strokeStyle = "#9fd8ff";
      context.lineWidth = 4;
      for (let i = 0; i < 3; i += 1) {
        context.beginPath();
        context.arc(-24 + i * 24, -10 + (i % 2) * 14, 12, 0, TAU);
        context.stroke();
      }
    } else if (anatomy === "Balloon Organs") {
      context.fillStyle = "rgba(255, 112, 189, 0.68)";
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 3;
      for (const x of [-24, 10, 34]) {
        context.beginPath();
        context.ellipse(x, -5 + Math.abs(x) * 0.15, 15, 21, 0, 0, TAU);
        context.fill();
        context.stroke();
      }
    } else if (bone !== "Normal Bones") {
      context.strokeStyle = getBoneColorForMods(mods, 0, 0.86);
      context.lineWidth = bone === "No Bones" ? 5 : 4;
      if (bone === "No Bones") context.setLineDash([10, 7]);
      context.beginPath();
      context.ellipse(0, -8, 52, 56, 0, 0, TAU);
      context.stroke();
      context.setLineDash([]);
      if (bone === "Metal Bones") {
        context.fillStyle = "#87929b";
        context.strokeStyle = COLORS.outline;
        for (const p of [{ x: -24, y: -38 }, { x: 24, y: -38 }, { x: 0, y: 28 }]) drawTextureBolt(context, p.x, p.y, 3);
      } else if (bone === "Glass Bones") {
        context.strokeStyle = "#eaffff";
        context.lineWidth = 2;
        for (const shard of [[-28, -42, 4, -12, -20, 20], [12, -48, 35, -14, 10, 32]]) {
          context.beginPath();
          context.moveTo(shard[0], shard[1]);
          context.lineTo(shard[2], shard[3]);
          context.lineTo(shard[4], shard[5]);
          context.stroke();
        }
      } else if (bone === "Rubber Bones") {
        context.strokeStyle = "#bf6645";
        context.lineWidth = 3;
        for (let y = -36; y <= 36; y += 17) {
          context.beginPath();
          context.moveTo(-38, y);
          context.quadraticCurveTo(0, y + 12, 38, y);
          context.stroke();
        }
      } else if (bone === "Spring Bones") {
        context.strokeStyle = "#794d07";
        context.lineWidth = 3;
        for (let i = 0; i < 17; i += 1) {
          const x = Math.sin(i * 1.4) * 14;
          const y = -40 + i * 5;
          if (i === 0) context.beginPath(), context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      } else if (bone === "Cartoon X-Ray Bones") {
        context.strokeStyle = "#8ff7ff";
        context.lineWidth = 2;
        for (let r = 18; r < 55; r += 16) {
          context.beginPath();
          context.ellipse(0, -8, r * 0.8, r, 0, 0, TAU);
          context.stroke();
        }
      }
    } else {
      context.fillStyle = "rgba(242, 125, 155, 0.6)";
      context.beginPath();
      context.ellipse(-12, 0, 18, 24, 0.3, 0, TAU);
      context.fill();
      context.fillStyle = "rgba(216, 32, 56, 0.6)";
      context.beginPath();
      context.ellipse(18, 5, 13, 18, -0.25, 0, TAU);
      context.fill();
    }
  }

  function drawStar(context, x, y, outer, inner, color) {
    context.save();
    context.translate(x, y);
    context.fillStyle = color;
    context.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const r = i % 2 ? inner : outer;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.closePath();
    context.fill();
    context.restore();
  }

  function drawHeart(context, x, y, scale, color) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 18);
    context.bezierCurveTo(-28, 0, -20, -24, -2, -12);
    context.bezierCurveTo(15, -27, 31, -2, 0, 18);
    context.fill();
    context.restore();
  }

  function drawSpiral(context, x, y, radius, color) {
    context.save();
    context.translate(x, y);
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.beginPath();
    for (let i = 0; i < 30; i += 1) {
      const r = (i / 30) * radius;
      const a = i * 0.62;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.stroke();
    context.restore();
  }

  function updateSelectedCharacterReadout() {
    if (!selectedCharacterReadout) return;
    const actor = state.selectedCharacter;
    selectedCharacterReadout.textContent = actor
      ? `${actor.displayName} selected - click another character to edit it`
      : "No character selected";
  }

  function formatModValue(definition, value) {
    if (definition.type === "toggle") return value ? "On" : "Off";
    if (definition.type === "color") return value;
    if (definition.type === "range") {
      const number = Number(value);
      const suffix = definition.valueLabel ?? "";
      return `${Number.isInteger(number) ? number : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}${suffix}`;
    }
    return String(value);
  }

  function renderModControls() {
    if (!modPanel || !modControls) return;
    modPanel.hidden = state.mode !== "sandbox";
    if (state.mode !== "sandbox") {
      modControls.innerHTML = "";
      updateSelectedCharacterReadout();
      return;
    }
    modControls.innerHTML = RUNTIME_MOD_DEFINITIONS
      .map((definition) => renderModControl(definition, state.selectedCharacter))
      .join("");
    updateSelectedCharacterReadout();
  }

  function renderModControl(definition, actor) {
    const value = definition.scope === "world"
      ? state.sandboxWorld[definition.key] ?? DEFAULT_WORLD_MOD_SETTINGS[definition.key]
      : actor.mods[definition.key] ?? DEFAULT_MOD_SETTINGS[definition.key];
    if (definition.type === "range") {
      return `
        <div class="mod-control" data-mod="${definition.key}">
          <label><span>${definition.label}</span><output data-value>${formatModValue(definition, value)}</output></label>
          <input type="range" min="${definition.min}" max="${definition.max}" step="${definition.step}" value="${value}" data-mod="${definition.key}">
          <small>${definition.description}</small>
        </div>
      `;
    }
    if (definition.type === "toggle") {
      return `
        <div class="mod-control" data-mod="${definition.key}">
          <label><span>${definition.label}</span><input type="checkbox" ${value ? "checked" : ""} data-mod="${definition.key}"></label>
          <small>${definition.description}</small>
        </div>
      `;
    }
    if (definition.type === "color") {
      return `
        <div class="mod-control" data-mod="${definition.key}">
          <label><span>${definition.label}</span><output data-value>${formatModValue(definition, value)}</output></label>
          <input type="color" value="${value}" data-mod="${definition.key}">
          <small>${definition.description}</small>
        </div>
      `;
    }
    if (definition.type === "select") {
      return `
        <div class="mod-control" data-mod="${definition.key}">
          <label><span>${definition.label}</span><output data-value>${value}</output></label>
          <select data-mod="${definition.key}">
            ${definition.options.map((option) => `<option value="${option}"${option === value ? " selected" : ""}>${option}</option>`).join("")}
          </select>
          <small>${definition.description}</small>
        </div>
      `;
    }
    return `
      <div class="mod-control" data-mod="${definition.key}">
        <button type="button" data-mod-action="${definition.key}">${definition.label}</button>
        <small>${definition.description}</small>
      </div>
    `;
  }

  function handleModInput(input) {
    const key = input.dataset.mod;
    const definition = RUNTIME_MOD_DEFINITIONS.find((candidate) => candidate.key === key);
    if (!definition) return;
    const value = definition.type === "toggle" ? input.checked : definition.type === "range" ? Number(input.value) : input.value;
    if (definition.scope === "world") {
      state.sandboxWorld[key] = value;
      const output = input.closest(".mod-control")?.querySelector("[data-value]");
      if (output) output.textContent = formatModValue(definition, value);
      return;
    }
  }

  function recolorExistingGore(actor) {
    for (const [index, droplet] of blood.droplets.entries()) droplet.color = actor.getGoreColor(index) ?? actor.mods.bloodColor ?? COLORS.blood;
    for (const [index, stain] of blood.stains.entries()) stain.color = actor.getGoreColor(index + 40) ?? actor.mods.bloodColor ?? COLORS.blood;
    for (const [index, chunk] of blood.chunks.entries()) chunk.color = actor.getGoreColor(index + 80) ?? actor.mods.gutColor ?? COLORS.gut;
    for (const [index, stain] of actor.selfStains.entries()) stain.color = actor.getGoreColor(index + 100) ?? actor.mods.bloodColor ?? COLORS.blood;
    for (const region of Object.values(actor.regions)) {
      for (const [index, wound] of region.wounds.entries()) wound.goreColor = actor.getGoreColor(index + 110) ?? wound.goreColor;
    }
    for (const [index, fragment] of actor.fragments.entries()) fragment.color = actor.organColor(fragment.color, index + 120);
    for (const [index, organ] of actor.hangingOrgans.entries()) organ.color = actor.organColor(organ.color, index + 160);
  }

  function randomizeAppearance(actor) {
    randomizeAppearanceMods(actor.mods);
    actor.applyModSettings();
  }

  function getAppearancePreset(actor) {
    const keys = [
      "clownSkin", "facePaintStyle", "noseType", "eyeStyle", "mouthStyle", "hairStyle", "shoeType", "gloveType",
      "facePaintColor", "noseColor", "hairColor", "gloveColor", "shoeColor", "bloodColor", "gutColor", "eyeColor",
    ];
    return Object.fromEntries(keys.map((key) => [key, actor.mods[key]]));
  }

  function saveAppearancePreset(actor) {
    try {
      localStorage.setItem("clownInABoxAppearancePreset", JSON.stringify(getAppearancePreset(actor)));
      toolReadout.textContent = "Appearance preset saved";
    } catch {
      toolReadout.textContent = "Appearance preset could not be saved";
    }
  }

  function loadAppearancePreset(actor) {
    try {
      const saved = JSON.parse(localStorage.getItem("clownInABoxAppearancePreset") || "null");
      if (saved && typeof saved === "object") {
        Object.assign(actor.mods, saved);
        actor.mods.loadAppearancePreset = "Saved Preset";
        actor.applyModSettings();
        toolReadout.textContent = "Appearance preset loaded";
      }
    } catch {
      toolReadout.textContent = "Appearance preset could not be loaded";
    }
  }

  function handleModAction(action) {
    const definition = RUNTIME_MOD_DEFINITIONS.find((candidate) => candidate.key === action);
    if (definition?.scope === "world") {
      if (action === "resetSandbox") {
        state.sandboxWorld = { ...DEFAULT_WORLD_MOD_SETTINGS };
        resetPrototypeRound();
        openModMenu();
      }
      renderModControls();
      updateReports();
      return;
    }
  }

  function showScreen(screen) {
    state.screen = screen;
    mainMenu.hidden = screen !== "menu";
    characterSelect.hidden = screen !== "character";
    const inGame = screen === "game";
    const storyGame = inGame && state.mode === "story";
    for (const element of storyHudElements) element.hidden = !storyGame;
    itemDrawerToggle.hidden = !(inGame && state.mode === "sandbox");
    modMenuToggle.hidden = !(inGame && state.mode === "sandbox");
    if (!inGame) {
      setItemDrawerOpen(false);
      setModDrawerOpen(false);
      closeCharacterPaletteDrawer();
    }
    characterPickerButton.hidden = !(inGame && state.mode === "sandbox");
    if (sandboxCharacterPanel) sandboxCharacterPanel.hidden = !(inGame && state.mode === "sandbox");
    if (modPanel) modPanel.hidden = !(inGame && state.mode === "sandbox");
    if (!storyGame && performanceStartButton) performanceStartButton.hidden = true;
  }

  function startClownStage() {
    state.mode = "story";
    showScreen("game");
    resizeCanvas();
    resetPrototypeRound({ keepPerformance: true });
    characterPickerButton.hidden = true;
    if (modPanel) modPanel.hidden = true;
    if (sandboxCharacterPanel) sandboxCharacterPanel.hidden = true;
    modMenuToggle.hidden = true;
    setItemDrawerOpen(false);
    setModDrawerOpen(false);
    closeCharacterPaletteDrawer();
    setActiveTool("none");
    performanceLoop.startRun();
    updateReports();
  }

  function startSandboxStage() {
    state.mode = "sandbox";
    performanceLoop.clear();
    showScreen("game");
    resizeCanvas();
    resetPrototypeRound();
    characterPickerButton.hidden = false;
    modMenuToggle.hidden = false;
    itemDrawerToggle.hidden = false;
    if (modPanel) modPanel.hidden = false;
    setActiveTool("hammer");
    openModMenu();
    renderCharacterList();
    renderModControls();
    toolReadout.textContent = "Sandbox ready - Characters, Items, and Mods are separate tabs";
    updateReports();
  }

  function bindEvents() {
    playButton.addEventListener("click", startClownStage);

    sandboxButton.addEventListener("click", startSandboxStage);

    selectClownButton.addEventListener("click", startClownStage);
    performanceStartButton.addEventListener("click", () => performanceLoop.tryStartPerformance());
    continuePerformanceButton.addEventListener("click", () => performanceLoop.startNextPerformance());

    backToMenuButton.addEventListener("click", () => {
      showScreen("menu");
    });

    itemDrawerToggle.addEventListener("click", () => {
      const nextOpen = !state.itemDrawerOpen;
      if (nextOpen) {
        setModDrawerOpen(false);
        setCharacterDrawerOpen(false);
      }
      setItemDrawerOpen(nextOpen);
    });
    closeModDrawer.addEventListener("pointerdown", (event) => event.stopPropagation());
    closeModDrawer.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setModDrawerOpen(false);
    });
    modMenuToggle.addEventListener("click", () => {
      if (state.modDrawerOpen) setModDrawerOpen(false);
      else openModMenu();
    });
    modDrawerHandle.addEventListener("pointerdown", startModDrawerDrag);
    modDrawerHandle.addEventListener("pointermove", moveModDrawerDrag);
    modDrawerHandle.addEventListener("pointerup", endModDrawerDrag);
    modDrawerHandle.addEventListener("pointercancel", endModDrawerDrag);
    closeItemDrawer.addEventListener("click", () => setItemDrawerOpen(false));
    editCharacterContextButton.addEventListener("click", openContextCharacterEditor);
    window.addEventListener("pointerdown", (event) => {
      if (!state.characterContextMenu.open) return;
      if (characterContextMenu?.contains(event.target)) return;
      hideCharacterContextMenu();
    });
    itemSearch.addEventListener("input", renderItemSearchResults);
    itemSearchResults.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tool]");
      if (!button) return;
      setActiveTool(state.activeTool === button.dataset.tool ? "none" : button.dataset.tool);
      itemSearch.value = "";
      renderItemSearchResults();
    });

    characterPickerButton.addEventListener("click", () => {
      if (!state.characterPaletteOpen) openCharacterPaletteDrawer();
      else closeCharacterPaletteDrawer();
    });
    closeCharacterPalette.addEventListener("click", closeCharacterPaletteDrawer);
    characterList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-character-action]");
      if (!button) return;
      const characterId = button.dataset.character;
      const action = button.dataset.characterAction;
      if (action === "place") {
        state.placingCharacterId = characterId;
        toolReadout.textContent = `${getCharacterEntry(state.placingCharacterId).name} ready - click the stage to place`;
        closeCharacterPaletteDrawer();
      } else if (action === "createFromBase") {
        openCharacterEditor({ type: "base", id: characterId });
      } else if (action === "edit") {
        openCharacterEditor({ type: "custom", id: characterId });
      } else if (action === "duplicate") {
        duplicateCustomCharacter(characterId);
      } else if (action === "delete") {
        deleteCustomCharacter(characterId);
      }
    });
    createCharacterButton.addEventListener("click", () => openCharacterEditor());
    closeCharacterEditor.addEventListener("click", closeCharacterEditorPanel);
    characterNameInput.addEventListener("input", updateCharacterEditorPreview);
    characterEditorControls.addEventListener("input", (event) => {
      const input = event.target.closest("[data-editor-mod]");
      if (input) handleCharacterEditorInput(input);
    });
    characterEditorControls.addEventListener("change", (event) => {
      const input = event.target.closest("[data-editor-mod]");
      if (input) handleCharacterEditorInput(input);
    });
    characterEditorControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-editor-action]");
      if (button) handleCharacterEditorAction(button.dataset.editorAction);
    });
    randomizeCharacterButton.addEventListener("click", () => {
      state.characterEditor.draftMods = sanitizeCharacterEditorDraft(randomizeAppearanceMods({ ...createDefaultMods(), ...(state.characterEditor.draftMods ?? {}) }));
      applyCharacterEditorDraftToLiveActor("randomizeAppearance");
      renderCharacterEditorControls();
      updateCharacterEditorPreview();
    });
    saveCharacterButton.addEventListener("click", saveCharacterFromEditor);
    placeEditedCharacterButton.addEventListener("click", () => {
      const saved = state.characterEditor.editingId ? getCustomCharacter(state.characterEditor.editingId) : saveCharacterFromEditor();
      if (!saved) return;
      state.placingCharacterId = saved.id;
      toolReadout.textContent = `${saved.name} ready - click the stage to place`;
      closeCharacterPaletteDrawer();
    });

    modControls.addEventListener("input", (event) => {
      const input = event.target.closest("[data-mod]");
      if (input) handleModInput(input);
    });
    modControls.addEventListener("change", (event) => {
      const input = event.target.closest("[data-mod]");
      if (input) handleModInput(input);
    });
    modControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-mod-action]");
      if (button) handleModAction(button.dataset.modAction);
    });

    toolGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tool]");
      if (!button) return;
      setActiveTool(state.activeTool === button.dataset.tool ? "none" : button.dataset.tool);
    });

    resetButton.addEventListener("click", () => {
      if (state.mode === "story") {
        performanceLoop.startRun();
        toolReadout.textContent = "New run started";
      } else {
        resetPrototypeRound();
        toolReadout.textContent = `${TOOL_COPY[state.activeTool]} - reset`;
      }
      updateReports();
    });

    xrayButton.addEventListener("click", () => {
      state.xray = !state.xray;
      xrayButton.setAttribute("aria-pressed", String(state.xray));
    });

    slowButton.addEventListener("click", () => {
      state.slow = !state.slow;
      slowButton.setAttribute("aria-pressed", String(state.slow));
    });

    debugButton.addEventListener("click", () => {
      state.debug = !state.debug;
      debugButton.setAttribute("aria-pressed", String(state.debug));
    });

    autoTestButton.addEventListener("click", runAutoAbuseTest);
    destroyTestButton.addEventListener("click", runDestructionTest);
    faceTestButton.addEventListener("click", runFaceDestructionTest);

    canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      hideCharacterContextMenu();
      const point = pointerToCanvas(event);
      state.pointer.down = true;
      state.pointer.inside = true;
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
      state.pointer.lastDamageAt = 0;
      state.pointer.lastPointerInputAt = performance.now();
      state.pointer.lastCanvasActionAt = performance.now();
      canvas.setPointerCapture(event.pointerId);
      useToolAt(point, "down");
    });

    canvas.addEventListener("contextmenu", (event) => {
      if (state.mode !== "sandbox") return;
      event.preventDefault();
      const point = pointerToCanvas(event);
      const actor = findCharacterAt(point, 84);
      if (!actor) {
        hideCharacterContextMenu();
        return;
      }
      setSelectedCharacter(actor);
      showCharacterContextMenu(actor, event);
    });

    canvas.addEventListener("pointermove", (event) => {
      const point = pointerToCanvas(event);
      state.pointer.inside = true;
      state.pointer.lastX = state.pointer.x;
      state.pointer.lastY = state.pointer.y;
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      if (state.pointer.down) {
        useToolAt(point, "move");
      }
    });

    canvas.addEventListener("pointerup", (event) => {
      const point = pointerToCanvas(event);
      if (state.mode === "story") performanceLoop.handlePointer(point, "up");
      state.pointer.down = false;
      if (state.activeTool !== "rope") state.pointer.grab = null;
      hazards.saw = null;
      canvas.releasePointerCapture(event.pointerId);
      if (state.mode !== "story") toolReadout.textContent = TOOL_COPY[state.activeTool] ?? "Tool ready";
    });

    canvas.addEventListener("pointercancel", () => {
      state.pointer.down = false;
      state.pointer.inside = false;
      state.pointer.grab = null;
      hazards.saw = null;
    });

    canvas.addEventListener("pointerenter", (event) => {
      const point = pointerToCanvas(event);
      state.pointer.inside = true;
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
    });

    canvas.addEventListener("pointerleave", () => {
      if (!state.pointer.down) state.pointer.inside = false;
    });

    canvas.addEventListener("mousedown", (event) => {
      if (performance.now() - state.pointer.lastPointerInputAt < 90) return;
      const point = pointerToCanvas(event);
      state.pointer.down = true;
      state.pointer.inside = true;
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
      state.pointer.lastDamageAt = 0;
      state.pointer.lastCanvasActionAt = performance.now();
      useToolAt(point, "down");
    });

    canvas.addEventListener("mousemove", (event) => {
      if (!state.pointer.down || performance.now() - state.pointer.lastPointerInputAt < 90) return;
      const point = pointerToCanvas(event);
      state.pointer.lastX = state.pointer.x;
      state.pointer.lastY = state.pointer.y;
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      useToolAt(point, "move");
    });

    window.addEventListener("mouseup", (event) => {
      if (performance.now() - state.pointer.lastPointerInputAt < 90) return;
      if (state.mode === "story") performanceLoop.handlePointer(pointerToCanvas(event), "up");
      state.pointer.down = false;
      if (state.activeTool !== "rope") state.pointer.grab = null;
      hazards.saw = null;
      if (state.mode !== "story") toolReadout.textContent = TOOL_COPY[state.activeTool] ?? "Tool ready";
    });

    canvas.addEventListener("click", (event) => {
      if (performance.now() - state.pointer.lastCanvasActionAt < 160) return;
      const point = pointerToCanvas(event);
      state.pointer.x = point.x;
      state.pointer.y = point.y;
      state.pointer.lastX = point.x;
      state.pointer.lastY = point.y;
      state.pointer.lastCanvasActionAt = performance.now();
      useToolAt(point, "down");
    });

    window.addEventListener("keydown", (event) => {
      if (state.screen !== "game") {
        if (event.key === "Enter" && state.screen === "menu") startClownStage();
        else if (event.key === "Enter" && state.screen === "character") startClownStage();
        else if (event.key === "Escape" && state.screen === "character") showScreen("menu");
        return;
      }
      const tools = ["hammer", "saw", "spike", "explosive", "spring", "crusher", "fire", "rope"];
      const index = Number(event.key) - 1;
      if (index >= 0 && index < tools.length) setActiveTool(tools[index]);
      if (event.key.toLowerCase() === "x") xrayButton.click();
      if (event.key.toLowerCase() === "r") resetButton.click();
    });

    window.addEventListener("resize", resizeCanvas);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    state.dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.25));
    state.width = Math.max(480, rect.width);
    state.height = Math.max(420, rect.height);
    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    state.room = {
      left: 38,
      right: state.width - 38,
      top: 34,
      floor: state.height - 70,
    };
    if (clown) {
      clown.room = state.room;
    }
    for (const actor of getCharacters()) {
      actor.room = state.room;
    }
  }

  function updateReports() {
    const reportActor = state.selectedCharacter ?? clown;
    if (!reportActor) return;
    const rows = Object.entries(reportActor.regions).map(([regionId, region]) => {
      const layer = layerFromDamage(regionId, region.damage);
      const status = getRegionStatusText(regionId, region);
      return `
        <div class="damage-row">
          <span>${REGION_META[regionId].label}</span>
          <span class="layer-pill layer-${region.destroyed || region.severed ? 5 : layer}">${status}</span>
          <div class="damage-meter"><span style="width:${clamp(region.damage / ClownTuning.damage.gib, 0, 1) * 100}%"></span></div>
        </div>
      `;
    });
    damageReport.innerHTML = rows.join("");
    systemReport.innerHTML = `
      <div class="system-row"><span>Character</span><strong>${reportActor.displayName}</strong></div>
      <div class="system-row"><span>Expression</span><strong>${reportActor.getExpressionForDisplay()}</strong></div>
      <div class="system-row"><span>Audience</span><strong>${audience.currentReaction.state}</strong></div>
      <div class="system-row"><span>Blood particles</span><strong>${blood.droplets.length}</strong></div>
      <div class="system-row"><span>Stains</span><strong>${blood.stains.length}</strong></div>
      <div class="system-row"><span>Face body</span><strong>${reportActor.getFaceDestructionLabel()}</strong></div>
      <div class="system-row"><span>Guts</span><strong>${reportActor.guts.exposed ? (reportActor.guts.torn ? "torn" : "spilled") : "internal"}</strong></div>
      <div class="system-row"><span>Limp</span><strong>${Math.round(reportActor.limp * 100)}%</strong></div>
      <div class="system-row"><span>Mobility</span><strong>${reportActor.getMobilityLabel()}</strong></div>
      <div class="system-row"><span>Motion</span><strong>${Math.hypot(reportActor.head.vx, reportActor.head.vy).toFixed(1)}</strong></div>
    `;
    updateScoreHud();
  }

  function getRegionStatusText(regionId, region) {
    if ((region.destroyed || region.severed) && region.regenProgress > 0) {
      return `Regrow ${Math.round(region.regenProgress * 100)}%`;
    }
    if (region.destroyed) return "Gone";
    if (region.severed) return "Cut Off";
    if (region.broken) return "Broken";
    return getLayerLabel(regionId, region.damage);
  }

  function updateScoreHud() {
    const comboStats = comboTracker.getStats();
    scoreValue.textContent = formatScore(scoreManager.score);
    comboValue.textContent = comboStats.count > 1 ? `x${comboStats.count}  ${comboStats.multiplier.toFixed(1)}x` : "x1";
    requestText.textContent = requestManager.completed ? `${requestManager.current.text} - complete` : requestManager.current.text;
    if (performanceLoop) performanceLoop.updateUi();
  }

  function runAutoAbuseTest() {
    resetPrototypeRound();
    toolReadout.textContent = "Auto test running";
    const steps = [
      () => clown.applyDamage("blunt", { x: clown.head.x - 54, y: clown.head.y - 18 }, {
        force: 56,
        radius: 86,
        direction: { x: 1, y: 0.15 },
      }),
      () => clown.applyDamage("slicing", { x: clown.head.x + 26, y: clown.head.y + 6 }, {
        force: 58,
        radius: 76,
        direction: { x: -1, y: 0.08 },
      }),
      () => hazards.spawnSpike(clown.head.x + 44, clown.head.y + 42),
      () => hazards.spawnFire(clown.head.x - 24, clown.head.y + 12),
      () => hazards.spawnSpring(clown.head.x - 18, state.room.floor - 20),
      () => hazards.spawnCrusher(clown.head.x),
      () => hazards.spawnExplosion(clown.head.x + 72, clown.head.y - 24),
    ];
    for (let index = 0; index < steps.length; index += 1) {
      window.setTimeout(steps[index], index * 230);
    }
    window.setTimeout(() => {
      toolReadout.textContent = "Auto test complete";
      updateReports();
    }, steps.length * 250);
  }

  function resetPrototypeRound(options = {}) {
    const resetScore = options.resetScore !== false;
    state.pointer.grab = null;
    state.placingCharacterId = null;
    resetCharactersForMode();
    blood.reset();
    hazards.reset();
    if (resetScore) scoreManager.reset();
    comboTracker.reset();
    requestManager.reset();
    audience.reset();
    if (!options.keepPerformance && performanceLoop) performanceLoop.clear();
    renderModControls();
  }

  function runDestructionTest() {
    resetPrototypeRound();
    toolReadout.textContent = "Destroy test running";
    const leftShoulder = clown.headAnchor("leftShoulder");
    const jaw = clown.headAnchor("jaw");
    const headCut = clown.head.anchor({ x: 8, y: -44 });
    const steps = [
      () => clown.damageRegion("leftArm", "slicing", leftShoulder, 150, { x: -1, y: 0.1 }, { segmentName: "leftUpperArm", t: 0.12 }),
      () => clown.damageRegion("rightLeg", "crushing", { x: clown.rightKnee.x, y: clown.rightKnee.y }, 130, { x: 0.15, y: 1 }, { segmentName: "rightThigh", t: 0.52 }),
      () => clown.damageRegion("mouthJaw", "slicing", jaw, 165, { x: 1, y: 0.08 }, { localX: 0, localY: 60 }),
      () => clown.damageRegion("leftHand", "explosion", { x: clown.leftHand.x, y: clown.leftHand.y }, 190, { x: -0.8, y: -0.35 }, { particle: clown.leftHand }),
      () => clown.damageRegion("headShell", "slicing", headCut, 195, { x: 0.6, y: -0.2 }, { localX: 8, localY: -44 }),
    ];
    for (let index = 0; index < steps.length; index += 1) {
      window.setTimeout(steps[index], index * 260);
    }
    window.setTimeout(() => {
      toolReadout.textContent = "Destroy test complete";
      updateReports();
    }, steps.length * 300);
  }

  function runFaceDestructionTest() {
    resetPrototypeRound();
    toolReadout.textContent = "Face test running";
    const steps = [
      () => clown.damageRegion("headShell", "burning", clown.head.anchor({ x: -44, y: 18 }), 42, { x: -0.4, y: 0.9 }, { localX: -44, localY: 18 }),
      () => clown.damageRegion("headShell", "blunt", clown.head.anchor({ x: 46, y: 16 }), 72, { x: -1, y: 0.1 }, { localX: 46, localY: 16 }),
      () => clown.damageRegion("headShell", "blunt", clown.head.anchor({ x: 46, y: 16 }), 78, { x: -1, y: 0.2 }, { localX: 46, localY: 16 }),
      () => clown.damageRegion("headShell", "piercing", clown.head.anchor({ x: 0, y: 2 }), 96, { x: 0.1, y: -1 }, { localX: 0, localY: 2 }),
      () => clown.damageRegion("mouthJaw", "crushing", clown.head.anchor({ x: 0, y: 44 }), 112, { x: 0, y: 1 }, { localX: 0, localY: 44 }),
      () => clown.damageRegion("headShell", "slicing", clown.head.anchor({ x: -34, y: -28 }), 130, { x: 1, y: -0.1 }, { localX: -34, localY: -28 }),
    ];
    for (let index = 0; index < steps.length; index += 1) {
      window.setTimeout(steps[index], index * 260);
    }
    window.setTimeout(() => {
      toolReadout.textContent = "Face test complete";
      updateReports();
    }, steps.length * 300);
  }

  function tick(time) {
    if (!state.lastTime) state.lastTime = time;
    const rawDt = clamp((time - state.lastTime) / 1000, 0, 0.033);
    state.lastTime = time;
    const worldSlow = state.mode === "sandbox" ? state.sandboxWorld.globalSlowMotion ?? 1 : 1;
    const dt = rawDt * (state.slow ? 0.35 : 1) * worldSlow;
    state.gameTime += dt;
    const substeps = 2;
    for (let step = 0; step < substeps; step += 1) {
      const performanceFrozen = performanceLoop?.freezesCharacters?.() ?? false;
      if (state.pointer.grab && !performanceFrozen) {
        if (state.pointer.down) {
          const grabActor = state.pointer.grab.actor ?? state.selectedCharacter ?? clown;
          grabActor.applyGrab(state.pointer.grab, { x: state.pointer.x, y: state.pointer.y }, dt / substeps);
        }
      }
      if (performanceFrozen) {
        performanceLoop.holdCharactersStill();
      } else {
        for (const actor of getCharacters()) {
          actor.update(dt / substeps, state.room);
        }
      }
      if (!performanceFrozen) updateSandboxCharacterInteractions(dt / substeps);
      hazards.update(dt / substeps, state.room);
      blood.update(dt / substeps, state.room, getCharacters());
    }
    if (performanceLoop) performanceLoop.update(dt);
    audience.update(dt, { clown: state.selectedCharacter ?? clown, blood, room: state.room });

    draw();
    state.uiTimer += rawDt;
    if (state.uiTimer > 0.25) {
      updateReports();
      state.uiTimer = 0;
    }
    requestAnimationFrame(tick);
  }

  function draw() {
    ctx.clearRect(0, 0, state.width, state.height);
    const offset = audience.getScreenOffset();
    ctx.save();
    ctx.translate(offset.x, offset.y);
    drawRoom(ctx, state.room);
    blood.drawBack(ctx);
    hazards.draw(ctx);
    if (performanceLoop) performanceLoop.draw(ctx);
    drawClownChains(ctx);
    for (const actor of getCharacters()) {
      actor.draw(ctx, { xray: state.xray, debug: state.debug, selected: actor === state.selectedCharacter });
    }
    drawSelectedCharacterRing(ctx);
    if (state.pointer.grab && state.pointer.down) {
      drawRope(ctx, state.pointer.grab, { x: state.pointer.x, y: state.pointer.y });
    }
    blood.drawFront(ctx);
    scoreManager.draw(ctx);
    ctx.restore();
    audience.drawScreenEffects(ctx);
    drawCursorPreview(ctx);
    drawGloveCursor(ctx);
  }

  function drawClownChains(context) {
    if (state.mode !== "sandbox") return;
    const actors = getCharacters();
    context.save();
    for (let i = 0; i < actors.length; i += 1) {
      for (let j = i + 1; j < actors.length; j += 1) {
        const a = actors[i];
        const b = actors[j];
        if ((a.mods?.clownAwareness === false || b.mods?.clownAwareness === false) || (!a.mods?.chainLinkClowns && !b.mods?.chainLinkClowns)) continue;
        const dist = distance(a.head, b.head);
        if (dist > 520) continue;
        const dx = b.head.x - a.head.x;
        const dy = b.head.y - a.head.y;
        const angle = Math.atan2(dy, dx);
        const links = clamp(Math.floor(dist / 22), 5, 28);
        context.strokeStyle = "rgba(17, 13, 14, 0.72)";
        context.lineWidth = 7;
        context.beginPath();
        context.moveTo(a.head.x, a.head.y);
        context.lineTo(b.head.x, b.head.y);
        context.stroke();
        for (let link = 1; link < links; link += 1) {
          const t = link / links;
          const x = lerp(a.head.x, b.head.x, t);
          const y = lerp(a.head.y, b.head.y, t) + Math.sin(state.gameTime * 8 + link) * 3;
          context.save();
          context.translate(x, y);
          context.rotate(angle + (link % 2 ? HALF_PI : 0));
          context.strokeStyle = link % 2 ? "#d8c680" : "#9e8c55";
          context.lineWidth = 3;
          context.beginPath();
          context.ellipse(0, 0, 9, 5, 0, 0, TAU);
          context.stroke();
          context.restore();
        }
      }
    }
    context.restore();
  }

  function drawSelectedCharacterRing(context) {
    const actor = state.selectedCharacter;
    if (state.mode !== "sandbox" || !actor) return;
    context.save();
    context.strokeStyle = "rgba(246, 202, 69, 0.72)";
    context.lineWidth = 3;
    context.setLineDash([9, 8]);
    context.beginPath();
    context.ellipse(actor.head.x, actor.head.y, actor.head.radiusX + 16, actor.head.radiusY + 16, actor.head.angle, 0, TAU);
    context.stroke();
    context.restore();
  }

  function drawRope(context, grab, target) {
    context.save();
    const node = grab.node;
    context.strokeStyle = "#d7bc76";
    context.lineWidth = 5;
    context.setLineDash([10, 7]);
    context.beginPath();
    context.moveTo(node.x, node.y);
    context.lineTo(target.x, target.y);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#f6ca45";
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(node.x, node.y, 8, 0, TAU);
    context.fill();
    context.stroke();
    context.restore();
  }

  function drawCursorPreview(context) {
    if (!state.pointer.inside && !state.pointer.down) return;
    if (!state.pointer.down && !["fire", "saw"].includes(state.activeTool)) return;
    context.save();
    context.globalAlpha = 0.42;
    context.strokeStyle = state.activeTool === "explosive" ? "#e23535" : "#f6ca45";
    context.lineWidth = 2;
    const radiusByTool = {
      hammer: 74,
      saw: 46,
      spike: 20,
      explosive: 180,
      spring: 110,
      crusher: 68,
      fire: 54,
      rope: 34,
    };
    const radius = radiusByTool[state.activeTool] ?? 40;
    context.beginPath();
    context.arc(state.pointer.x, state.pointer.y, radius, 0, TAU);
    context.stroke();
    context.restore();
  }

  function drawGloveCursor(context) {
    if (!state.pointer.inside && !state.pointer.down) return;
    const x = state.pointer.x;
    const y = state.pointer.y;
    const grabbing = state.pointer.down && state.pointer.grab;
    const selected = !state.pointer.down && state.pointer.grab;
    if (!playerGloveAssets) playerGloveAssets = createPlayerGloveAssets();
    const asset = grabbing ? playerGloveAssets.grab : playerGloveAssets.open;
    context.save();
    context.translate(x, y);
    context.rotate(grabbing ? -0.18 : state.pointer.down ? 0.06 : -0.08);
    context.scale(grabbing ? 0.92 : 1, grabbing ? 1.04 : 1);
    context.drawImage(asset, -44, -38, 104, 104);
    if (state.selectedCharacter?.mods?.rainbowGore && !state.selectedCharacter?.mods?.noGore) {
      context.globalAlpha = 0.82;
      context.fillStyle = rainbowColor(240);
      context.beginPath();
      context.ellipse(10, 4, 16, 8, -0.35, 0, TAU);
      context.fill();
      context.fillStyle = rainbowColor(260);
      context.beginPath();
      context.arc(27, 17, 5, 0, TAU);
      context.fill();
      context.globalAlpha = 1;
    }
    if (selected || grabbing) {
      context.strokeStyle = "#f6ca45";
      context.lineWidth = 2.5;
      context.beginPath();
      context.arc(10, 13, 32, -0.1, Math.PI * 1.1);
      context.stroke();
    }
    context.restore();
  }

  function createPlayerGloveAssets() {
    return {
      open: createPlayerGloveAsset(false),
      grab: createPlayerGloveAsset(true),
    };
  }

  function createPlayerGloveAsset(grabbing) {
    const asset = document.createElement("canvas");
    asset.width = 128;
    asset.height = 128;
    const context = asset.getContext("2d");
    context.translate(54, 50);
    context.rotate(-0.08);

    context.shadowColor = "rgba(0, 0, 0, 0.32)";
    context.shadowBlur = 8;
    context.shadowOffsetY = 5;
    context.fillStyle = COLORS.sleeveA;
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 6;
    context.beginPath();
    context.roundRect(-38, 28, 36, 32, 9);
    context.fill();
    context.stroke();
    context.shadowColor = "transparent";

    context.fillStyle = COLORS.sleeveB;
    for (let stripe = 0; stripe < 3; stripe += 1) {
      context.beginPath();
      context.roundRect(-35 + stripe * 10, 31, 5, 26, 3);
      context.fill();
    }
    context.fillStyle = "#fff0bc";
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 4;
    context.beginPath();
    context.roundRect(-38, 22, 42, 15, 7);
    context.fill();
    context.stroke();

    context.lineJoin = "round";
    context.lineCap = "round";
    context.fillStyle = COLORS.glove;
    context.strokeStyle = COLORS.outline;
    context.lineWidth = 6;

    const fingerData = grabbing
      ? [
        { x: 22, y: -18, rx: 20, ry: 8, angle: 0.56 },
        { x: 27, y: -3, rx: 19, ry: 8, angle: 0.2 },
        { x: 25, y: 12, rx: 18, ry: 8, angle: -0.18 },
      ]
      : [
        { x: 34, y: -21, rx: 25, ry: 8, angle: -0.12 },
        { x: 39, y: -5, rx: 27, ry: 8, angle: 0.02 },
        { x: 36, y: 12, rx: 24, ry: 8, angle: 0.18 },
      ];
    for (const finger of fingerData) {
      context.beginPath();
      context.ellipse(finger.x, finger.y, finger.rx, finger.ry, finger.angle, 0, TAU);
      context.fill();
      context.stroke();
      context.strokeStyle = "rgba(18, 13, 14, 0.23)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(finger.x - finger.rx * 0.25, finger.y + 2);
      context.quadraticCurveTo(finger.x + finger.rx * 0.12, finger.y + 5, finger.x + finger.rx * 0.45, finger.y + 1);
      context.stroke();
      context.strokeStyle = COLORS.outline;
      context.lineWidth = 6;
    }

    context.beginPath();
    context.ellipse(1, 7, 28, 22, -0.22, 0, TAU);
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(-15, -12, grabbing ? 13 : 17, 24, grabbing ? -0.82 : -0.62, 0, TAU);
    context.fill();
    context.stroke();

    context.strokeStyle = "rgba(18, 13, 14, 0.32)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-12, 5);
    context.quadraticCurveTo(0, 0, 19, 7);
    context.moveTo(-2, 22);
    context.quadraticCurveTo(12, 27, 27, 18);
    context.stroke();

    context.fillStyle = "rgba(255, 255, 255, 0.7)";
    context.beginPath();
    context.ellipse(1, -5, 10, 5, -0.28, 0, TAU);
    context.fill();
    context.beginPath();
    context.ellipse(26, grabbing ? -8 : -12, 8, 2.5, 0.08, 0, TAU);
    context.fill();
    return asset;
  }

  function init() {
    resizeCanvas();
    state.customCharacters = loadCustomCharacters();
    blood = new BloodSystem();
    hazards = new HazardSystem();
    scoreManager = new ScoreManager();
    comboTracker = new ComboTracker();
    requestManager = new AudienceRequestManager();
    soundHooks = new AudienceSoundHooks();
    audience = new AudienceManager({ scoreManager, comboTracker, requestManager, soundHooks });
    performanceLoop = new PerformanceController();
    resetCharactersForMode();
    renderItemGrid();
    renderCharacterList();
    bindEvents();
    showScreen("menu");
    setActiveTool("hammer");
    updateReports();
    requestAnimationFrame(tick);
  }

  init();
})();
