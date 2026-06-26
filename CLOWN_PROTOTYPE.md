# Clown Character Prototype

This prototype is isolated from the existing Worms app:

- `clown-prototype.html` is the playable test bench.
- `clown-prototype.css` contains the prototype-only layout and UI styling.
- `clown-prototype.js` contains the character actor, physics rig, damage model, organs, blood, hazards, audience reactions, scoring, combos, and requests.
- `clown-local-server.cjs` is a tiny local preview server for testing the static prototype at `http://127.0.0.1:8765/clown-prototype.html`.

## Menu Flow

The prototype now starts on a main menu titled `clown in a box`. Play starts the first regular Performance loop. The old regular-game character select is no longer part of the Play flow.

The main menu also has `Sandbox`. Sandbox enters the same stage layout, but enables character spawning, item selection, and the sandbox mod menu. The item selector is removed from the regular game and only appears in Sandbox. In Sandbox, `Items`, `Mods`, and `Characters` are separate right-edge tabs with their own drawers. The `Mods` drawer can be dragged around the screen from its title bar.

The old manual expression controls were removed. The clown's face is now driven by `setPainExpression`, trauma state, daze/death flags, and recovery timers instead of direct player expression buttons.

## Registries And Sandbox

Items and characters now come from registries near the top of `clown-prototype.js`:

- `ITEM_REGISTRY` drives the item drawer, icons, names, descriptions, and search results.
- `CHARACTER_REGISTRY` drives the character picker. The clown is the only current entry, but future characters can provide their own `create` function and supported sandbox mod keys.
- `MOD_DEFINITIONS` is the source list for all possible controls.
- `RUNTIME_MOD_DEFINITIONS` filters that list down to world/global sandbox controls shown in the Mods drawer.
- `CHARACTER_EDITOR_DEFINITIONS` filters character appearance, anatomy, personality, physics, gore, audience modifiers, social behavior, special modes, and live actor actions into the Character Editor.

Sandbox-only systems use `state.mode === "sandbox"` so they do not become part of the normal game flow yet. The character list is inside the separate `Characters` drawer. Choosing a character arms placement; the next stage click spawns that character at the clicked point.

The selected character is tracked separately from the legacy `clown` reference. Most gameplay code now works through `getCharacters()`, `findCharacterAt()`, and `setSelectedCharacter()` so multiple characters can share hazards, blood staining, social behavior, chains, collision modes, and future tools.

## Regular Performance Loop

The Play mode now runs a basic Performance loop instead of the old free-test tool mode. A Performance deals 3-5 random contraption items from the starter item library, drops them from a small metal pipe onto the stage floor, and gives the player a random 20-40 second setup timer. The clown is held still during setup so the player can build the contraption without the character wandering into it early. Yellow output dots can be pulled to blue input dots to wire item outputs; the red wall button has its own yellow output dot and must be wired manually to the first item the player wants to trigger.

The red wall button unlocks when the setup timer reaches zero. If the player presses it before all items are placed or before the button is wired to an item, the audience boos and the performance does not start. Once the performance starts, item dragging and rewiring stop. The button activates the item connected to it, activated items fire their action, and their outputs send delayed signals to the next connected item. Contact-triggered items such as pressure plates, saw blades, glue, conveyors, and sensors can also activate from clown movement, blood, or pain events during the chain.

The starter pool includes the named prototype items from the design brief: Boxing Glove, Anvil Drop, Saw Blade, Spike Wall, Spring Pad, Cannon, Wire, Delay Box, Pressure Plate, Motion Sensor, Glue Floor, Net Launcher, Flamethrower, Electric Coil, Nail Launcher, Firework Rack, Blood Sensor, Scream Microphone, Trapdoor Panel, Conveyor Belt, Portal Door, and Chaos Dice. Each item has a shared data shape: name, category, rarity, icon, description, trigger type, action type, activation state, placed state, and connected outputs. The visible items are procedural canvas props rather than text placeholders; each one has a distinct silhouette plus trigger/action animation.

Performance scoring still uses the existing audience system, with extra regular-mode awards layered on top for the simple v1 scoring formula. Chuckles, laughs, big laughs, cheers, and standing ovations add fixed score bursts with combo multipliers. If every dealt item activates, the player earns a `Perfect Circuit` bonus. Unused items subtract 500 points each and make the audience boo.

At the end of a Performance, the results panel shows performance score, total score, activated items, unused items, biggest combo, the final audience reaction, and whether the perfect circuit bonus was earned. `Next Performance` deals a new random setup while keeping the run score. Act, quota, and performance count are currently placeholders for the later 12-act run/shop structure.

## Character Editor

Sandbox has a real character editor inside the `Characters` drawer. `Create Character` opens an editor with a live procedural canvas preview. It defaults to the currently selected clown, including any runtime mods already applied to that clown; otherwise it starts from the base clown.

Saved custom characters live in browser `localStorage` under `clownInABoxCustomCharactersV1`:

```js
{
  id,
  name,
  baseCharacterId,
  appearance,
  defaultMods,
  createdAt,
  updatedAt
}
```

The Characters drawer lists base characters and saved custom characters. Custom cards show their name, a live canvas preview, and actions: `Place`, `Edit`, `Duplicate`, and `Delete`. Placing a saved character instantiates the base clown actor, then applies that saved character's appearance and default mod settings. In Sandbox, right-click a live character on the canvas and choose `Edit` to open the Character Editor for that exact actor; editor changes apply to the live actor immediately, and saving creates or updates a reusable preset.

Appearance assets are procedural, not PNGs. Hair styles, face paint, nose, eye, mouth, glove, shoe, premade clown skin, internal anatomy, bone type, blood type, and damage style are drawn in code so they combine with scaling, physics, x-ray, wounds, gore, and layer damage.

To add future character customization or per-character behavior, add the option to `MOD_DEFINITIONS`, keep it out of the `world` scope, and render/apply its effect in the actor, preview, damage, or behavior path. To add a global sandbox control, mark it with `scope: "world"` so it appears in the Mods drawer instead.

## Sandbox Mods

The Mods drawer is now world/global only:

- Box Gravity
- Box Bounce
- Wall Stickiness
- Damage Multiplier
- Global Slow Motion
- Reset Sandbox

All character-specific controls now live in the Character Editor. That includes head/arm/leg scale, health, damage resistance, strength, weight, bounciness, friction, wobbliness, slow motion, speed, gravity scale, regenerate, invincible, gore toggles, behavior modes, social behavior, collision modes, chains, audience modifiers, duplicate/delete/reset, detach/reattach limbs, explode, and all appearance/anatomy/personality options. Removed user-facing options are `Size`, `Drag Mode`, `Layer Visibility`, and `Floating Mode`.

The editor has conditional rules so incompatible controls do not appear together. Turning `Clown Awareness` off hides social controls. Fear and friendship are mutually exclusive. Audience Favorite and Audience Hates This Clown hide each other. Rabbit Clown overrides normal social behavior. Rivalry is defensive only. Copycat hides personality, pain, idle, fear, friendship, and other independent behavior options because that clown is borrowing its behavior from nearby clowns. Coward personality hides Courage because that trait defines the clown as low-courage by design. Freeze disables the movement chaos modes while it is on. No Gore hides Rainbow Gore and Extra Gore. Bone actions switch between `Remove Bones` and `Restore Bones` depending on the current skeleton state.

The Character Editor is grouped by purpose: clown look, premade clown textures, anatomy and gore textures, personality and idle acting, one-time new-clown spawn reactions, continuous clown behavior, special modes, physics and durability, runtime gore rules, audience scoring bias, and live actor actions. `Reaction to Other Clowns` is now a one-time new-spawn reaction. Continuous behaviors such as following, protecting a chosen live clown, dancing together, fighting over space, and copycat movement are separate controls.

Character scale and head scale update the head collider and mass. Arm and leg length update the matching ragdoll constraints. Strength, wobbliness, removed bones, and broken bones all feed into segment stiffness. High wobbliness makes the clown stretchier, gooier, and bouncier. Bounciness affects environmental bounce, while friction only changes sliding/grip. Gravity, speed, and slow motion are per-character physics options applied during update, so one sandbox character can be heavy and slow while another is light and chaotic.

`Eye Follow Mouse` is on by default. The clown calculates pupil offsets from the current pointer in local head space, and the method lives on the actor so future characters can implement the same behavior through their own draw code.

`Freeze` now freezes the whole selected character in its current position. `Panic Mode` makes the clown wear its panic face and run away from the player's mouse, jumping or switching direction when the cursor gets too close. `Sugar Mode` intentionally recreates the old chaotic bounce bug as a mod: the clown gets extreme environmental bounce and ricochets from floor to ceiling at high speed. `Dazed Mode` gives the clown a dizzy expression and makes it wander randomly like it does not know where it is going.

`Rabbit Clown` is a rabid sandbox behavior mode. The clown foams at the mouth, gets frantic eyes, moves much faster, and looks for other characters in the box. If it finds one, it chases, leaps, tackles, bites, claws, kicks, headbutts, and scrambles over the target using the same damage/event systems as the tools. With no target, it still jitters and bounces like it is barely contained.

`Group Panic` is now hurt-triggered: when the clown carrying that setting takes any damage, every clown panics temporarily instead of permanently turning on Panic Mode. `Sugar Mode` is also timed: it randomly erupts into a short ricochet burst, calms down, then waits a random amount of time before doing it again.

`Balloon` replaces the old Inflate/Deflate/Pop controls. It inflates the clown into a light, bouncy body, pops on hard hits, then slowly reinflates. `Giant Mode` and `Tiny Mode` are timed transformation modes: they periodically switch the clown huge or tiny, then return it to normal. Giant mode crushes nearby clowns while enlarged. `Auto Clone` has a cooldown and spawned clones default auto-clone off, so it no longer fills the room instantly.

`Chain Link Clowns` now draws visible chain links and enforces a maximum chain distance. `Clown Magnetism` is a three-option mode: Off, Positive, or Negative. `Clown Collision Mode` applies on contact with other clowns; explosive collision triggers an explosion on contact with a short cooldown, bouncy collision rebounds with squash, sticky collision dampens and glues the bump, heavy collision causes blunt impact damage, and soft squishy collision compresses the clown like a soft prop.

Blood Type, Internal Anatomy, Bone Type, Damage Style, and premade Clown Skin are visual texture themes. They change what the clown and its effects look like, while physical bone removal, health, mass, bounce, friction, and damage resistance remain controlled by their dedicated gameplay settings.

`Rainbow Gore` recolors blood, self-stains, exposed muscle, guts, loose organs, brain, heart, body fragments, floor/wall stains, and the glove's blood smear into bright rainbow colors. `No Gore` clears blood and suppresses guts/organs so impacts become bruises and cartoon marks. `Extra Gore` scales blood output and adds extra loose organs/gut strands as the slider rises. `Regenerate` is intentionally much faster than the clown's baseline passive healing.

## Layer System

Every tracked body region has independent damage and wound records:

- Layer 1: outer clown surface, makeup, gloves, shoes, hair, bruises, dirt, cuts, burns.
- Layer 2: soft yellow fat / clown padding exposed after the outer surface breaks.
- Layer 3: red muscle and tendon tissue exposed by deeper cuts, crushing, pulling, or explosions.
- Layer 4: ivory cartoon bones, skull shell, jaw, arm bones, leg bones, hands, and feet.
- Layer 5: organ spill / heavy destruction for the head cavity and gut system.

The renderer draws the same region in different visual passes. The wound depth is derived from cumulative region damage, while individual wound records keep their own position, type, size, and angle. The old layer-colored oval wound decal has been removed because it looked like a stray organ; wounds now render as cuts, cracks, bruises, burns, fibers, and small bone strokes while the real anatomy is handled by face plates, organ windows, fragments, and gut systems. This lets a bruised face, a cut mouth, a severed arm, and exposed guts coexist without needing separate sprites.

## Physics Rig

The clown is centered around one heavy elliptical head body. Arms and legs attach directly to head anchors:

- `leftShoulder` / `rightShoulder`
- `leftHip` / `rightHip`
- `gutDoor`

Limbs use Verlet particles and distance constraints:

- upper arm, forearm, hand
- thigh, calf, foot

The head stores the main center of mass, velocity, angle, angular velocity, squash, and recoil. A weak alive motor keeps the clown standing and wobbling until trauma makes it limp. If a limb exceeds damage or stretch thresholds, its head anchor constraint is disabled and the detached limb remains physically interactable.

The rig settles its initial pose on reset and ramps the self-righting motor in after a short delay. That prevents startup constraint corrections from turning into artificial bounce velocity. Arms and legs are not manually carried by the head every frame; they stay physical and follow through constraints, while the standing motor tries to recover an upright pose after damage.

## Organs And Guts

The head doubles as a surreal body cavity. In X-Ray mode, the continuous skull, jaw, brain, heart, kidneys, stomach sack, blood vessels, tubes, and longer gut loops are visible inside the face. When head damage reaches the organ threshold, the intestine chain spills from the `gutDoor` anchor. The chain can sag, drag, bounce, stretch, tear, and leave smears when it contacts the floor.

The visible head/body also has named destructible face plates: forehead, left eye, right eye, nose, left cheek, right cheek, mouth, and chin. Each plate tracks its own burn, dirt, damage, exposed layer, destruction state, and regrow progress. Hammering one cheek can open a local hole without destroying the whole head; fire can burn a plate down through makeup, padding, muscle, skull, and then into the organ cavity. Deep bone-layer holes clip through to the same underlying skull, so damaged plates reveal one coherent skull instead of isolated bone chips.

When a face plate reaches the cavity layer, the renderer shows dark internal head-body space with a local organ pocket: forehead reveals brain, eyes can pop out on a tether, the nose area reveals a heart, cheeks reveal kidney shapes, and the mouth region reveals guts. These holes add to `headOrganDamage`, can release hanging organ pieces, can trigger gut spill, and can heal closed over time. The organ windows no longer draw the old dark red skull/crack overlay, so the organ art remains visible.

## Blood System

Blood is particle-based and decal-based. Output is intentionally higher now, but droplets, stains, chunks, and fragments still have caps and fade timers for performance:

- droplets fly, fall, and pool on the floor
- splashes and smears linger as stage decals, then fade out for performance
- droplets stain the floor, side walls, ceiling, and stage frame when they hit the environment
- slicing emits directional spray
- blunt trauma emits splats and nosebleeds
- crushing emits heavy splatter and flattening
- explosions emit radial sprays and chunks
- dragging emits floor streaks
- flying droplets can stain the clown's own head and limb surfaces, then fade out

Blood liquid itself is not a grab target. Flying droplets resolve into fading stains when they hit the room, while flesh chunks and body fragments remain physical debris for a while before fading out.

## Test Tools

The right panel switches the active test tool:

- Hammer: blunt impact, bruising, dents, nosebleeds, recoil.
- Saw: continuous slicing while dragging over the clown.
- Spike: places a temporary piercing hazard.
- Explosive: radial blast, launch force, chunks, deep wounds.
- Spring: launches the rig upward from the clicked point.
- Crusher: drops a heavy block that collides with the ragdoll.
- Fire: burning, soot, and light leaking blood once deeper layers are exposed.
- Glove: grabs body parts, exposed guts, flesh chunks, and loose fragments. It does not grab blood liquid or stains. Click the same grabbed target again to deselect it.
- Auto Test: resets the clown and runs a short canned sequence through blunt, slicing, piercing, fire, spring, crusher, and explosion reactions.
- Destroy Test: directly exercises saw-off, jaw/face-cap removal, bone break, and destroyed-part states.
- Face Test: directly burns, hammers, punctures, crushes, and slices the head/body plates so face holes and internal organs are easy to inspect.

## Body Destruction

Body regions can now move beyond exposed anatomy into explicit destruction states:

- `Broken`: bones are cracked or crushed. Crusher, blunt trauma, and explosions build `crushProgress`; once the threshold is crossed, the limb becomes floppier and broken-bone marks are drawn.
- `Hanging`: focused saw/pull damage first makes the specific hit segment hang by a weak connection.
- `Cut Off`: continued saw/pull damage finishes the same segment cut. Cutting the hand/forearm only drops that part and anything below it; cutting an upper arm or thigh drops the lower chain.
- `Gone`: very high damage or explosions destroy the region, hide the destroyed segment/part, spawn body fragments, and leave blood/chunks behind.

For the clown's no-torso body design, "decapitation" is represented as cartoon head-part removal: the jaw can be cut away, and the upper face/skull cap can be sliced off, exposing internal tissue and spilling guts. This keeps the request readable while respecting the character's head-as-body structure.

Face/body plates are smaller destruction targets inside the larger head and jaw regions:

- `Outer`: clean clown makeup, skin, nose paint, eyes, grin, and surface marks.
- `Fat`: yellow squishy padding under the makeup.
- `Muscle`: red elastic flesh and tendon fibers.
- `Bone`: local skull/jaw plate with cracks.
- `Guts`: an open head-body cavity with organ sacks, tubes, vessels, blood drips, and possible gut spill.

Destroyed face plates do not immediately erase the whole head. They open local holes first, so the player can take the main face apart piece by piece before the broader head region fully breaks.

The normal player tools use the same destruction path:

- Saw: best for cutting off arms, legs, hands, feet, jaw, and face cap.
- Crusher: best for breaking bones and eventually destroying parts.
- Explosive: can break, sever, or destroy parts depending on force.
- Glove/drag: can tear damaged limbs or guts under tension.

## Healing And Regrowth

After a quiet delay, surface damage fades, broken bones can knit back together, and severed or destroyed limbs slowly pull toward their anatomical anchor before reconnecting. Cut-off limbs remain separate while regrowing; detached hands, feet, and limb ends are not treated as support points until they reconnect. When a whole arm or leg finishes regrowing, its attached hand or foot is restored too, so extremities come back with the limb instead of staying gone. The regrowth pull also damps the limb's hidden physics velocity so a healing hand cannot slingshot across the room when it snaps back. Loose chunks and body fragments now fade out after a while to avoid long-session lag.

The clown starts standing upright and always tries to stand back up when it has usable supports. Two working legs stand normally. One usable leg makes it slouch and limp. Broken legs still try to brace weakly. If both legs are gone, intact arms try to prop the head/body up. If no limbs are available, it waits for regrowth before it can stand again. The old head-carry limb behavior has been disabled, so arms and legs are no longer manually dragged along with the head every frame.

Face plates heal separately from limbs. Exposed plates fade back through their layers, while open holes slowly shrink and seal. The system report's `Face body` row shows how many plates are exposed or opened and how damaged the head organs are.

Mini clowns use a hidden actor scale rather than the removed player-facing Size control. Their head features, eyes, nose, mouth, hair, face wounds, skull, and organ windows are drawn in scaled head-local coordinates so the tiny clone reads like a complete small clown instead of a normal-size face pasted onto a small body.

## Audience And Scoring

Damage events are emitted from `ClownActor.damageRegion`, then consumed by four standalone systems:

- `AudienceManager`: chooses audience state, draws audience silhouettes, drives reaction text, sound hooks, screen shake, and border flashes.
- `ScoreManager`: awards score from audience intensity, volume, duration, combo multiplier, variety, gore visibility, and request bonuses.
- `ComboTracker`: tracks quick hit chains, combo multiplier, same-damage streaks, and recent damage variety.
- `AudienceRequestManager`: selects and checks one random request per reset/test round.

Audience states are:

- idle
- chuckle
- laugh
- cheer
- boo
- shock
- standing ovation

Score is not raw damage. A damage event first becomes an entertainment value from impact amount, gore amount, exposed anatomy depth, launch height, combo count, and special moments such as gut spill, severing, or ceiling hits. Boredom reduces that value when the same damage type is repeated too many times. The chosen audience reaction then determines event score and ongoing laugh score while the reaction timer runs.

Combos reset after `ClownTuning.audience.comboWindow` seconds without a new damage event. Repeating one damage type increases `sameTypeStreak`; after enough repetition, the audience applies a boredom penalty and can boo instead of laughing.

Audience requests currently include launch, 3-hit combo, fire damage, big blood splatter, ceiling hit, upside-down clown, 3 different damage types, audience gasp, and standing ovation. Completing a request gives a bonus and forces a cheer reaction.

Placeholder sound hooks live in `AudienceSoundHooks`:

- `smallLaugh`
- `bigLaugh`
- `cheer`
- `boo`
- `gasp`
- `standingOvation`

They currently call `console.debug`; replace those methods with real audio routing later.

## Tuning

At runtime, the full tuning object is exposed as `window.ClownTuning`.

Useful values:

- `ClownTuning.blood.amount`: global blood multiplier.
- `ClownTuning.blood.stainFade`, `chunkFade`, and `fragmentFade`: how long blood decals and loose gore remain before fading out.
- `ClownTuning.blood.maxDroplets`, `maxStains`, `maxChunks`, and `maxFragments`: performance caps for gore effects.
- `ClownTuning.organs.spillDamage`: head damage needed before guts spill.
- `ClownTuning.organs.intestineSegments` and `intestineLength`: how long the spillable intestine chain is.
- `ClownTuning.organs.tearTension`: pull distance multiplier before intestines tear.
- `ClownTuning.face.outerBreak`, `fatExpose`, `muscleExpose`, `boneExpose`, and `cavityOpen`: per-face-plate thresholds for peeling the head/body apart.
- `ClownTuning.face.organSpillDamage`: local head-organ damage needed before face holes can force gut spill.
- `ClownTuning.face.healPerSecond`, `burnHealPerSecond`, `regrowDelay`, and `patchRegrowSeconds`: how fast damaged face plates fade, close, and reseal.
- `ClownTuning.healing.delay`, `boneHealDelay`, `regrowDelay`, `regrowSeconds`, and `destroyedRegrowSeconds`: limb/body healing and regrowth timing.
- `ClownTuning.physics.jointStiffness`: limb constraint stiffness.
- `ClownTuning.physics.rootJointStiffness`: shoulder/hip attachment stiffness.
- `ClownTuning.physics.limbFloorFriction` and `shoeFloorFriction`: limb and shoe ground grip.
- `ClownTuning.physics.spawnMotorDelay` and `spawnMotorRamp`: how gently the standing motor wakes up after reset.
- `ClownTuning.physics.aliveMotorStrength`: standing wobble / self-righting strength.
- `ClownTuning.damage.outerBreak`, `fatExpose`, `muscleExpose`, `boneExpose`, `sever`, `gib`: damage thresholds.
- `ClownTuning.damage.cutSever`: saw/cut progress needed before a segment is cut off.
- `ClownTuning.damage.boneBreak`: crush/damage needed before bones break.
- `ClownTuning.damage.destroy`: damage needed before a body region becomes gone/destroyed.
- `ClownTuning.damage.typeScale`: per-damage-type multipliers.
- `ClownTuning.audience.comboWindow`: seconds allowed between hits before combo reset.
- `ClownTuning.audience.boredomDecay`: how quickly repeated-damage boredom fades.
- `ClownTuning.audience.boredomPenaltyStep`: how strongly repetition reduces entertainment.
- `ClownTuning.audience.scorePerLaughSecond`: score gained from sustained laughter.
- `ClownTuning.audience.requestBonus`: default request completion bonus.

This is intentionally a prototype rig, not the final game loop. The public surface is the `ClownActor` class, which can later be moved into a game scene and driven by the same `update`, `draw`, and `applyDamage` calls used by the test room.
