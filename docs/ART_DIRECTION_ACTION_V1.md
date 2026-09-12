# RuneForged — Art Direction: Action First v1

Status: **approved production direction / pilot assets remain non-canonical until card-level approval**

## Core principle

RuneForged card art should feel like a captured moment from an ongoing story, not a character posing for a portrait.

The default composition is **action first**: attack, defense, spellcasting, pursuit, summoning, destruction, ritual, command, discovery, escape, transformation or environmental interaction.

Static hero poses are exceptions and must have a narrative reason.

## Production rules

1. **No generic idle pose by default.** Characters should be doing something meaningful.
2. **Show the card fantasy.** Whenever possible, the image should visually communicate what the card does in gameplay.
3. **Use cinematic staging.** Favor dynamic camera angles, foreground/background separation, motion, particles, debris, weather, magic and environmental interaction.
4. **Protect the crop.** The main action, face and defining silhouette must survive card-frame cropping. Do not place critical information only on the extreme edges.
5. **Readable silhouette.** The main subject should remain identifiable at small card size.
6. **One visual sentence.** The player should understand the core event quickly even when the art is reduced.
7. **World continuity matters.** Architecture, weapons, costumes, materials, symbols and magic language must remain consistent inside each region.
8. **Recurring characters must remain recognizable.** Reuse face, body proportions, armor language, signature items, symbols and palette cues across appearances.
9. **No gameplay text inside art.** Text, mana values and card UI belong to the frame/UI layer, not the illustration.
10. **Avoid generic fantasy-AI composition.** Do not default to centered subject + neutral stance + blurred background.

## Card-type language

### Units
Show movement, combat, patrol, protection, pursuit, formation, interaction with allies/enemies or a decisive character beat.

### Champions
Use the strongest narrative composition in the set. Champions should feel iconic without becoming static portraits. Show command, transformation, signature attack, duel, rescue, sacrifice or battlefield leadership.

### Spells
Show the exact moment the spell changes the scene. The effect should dominate the visual read.

### Rituals
Use deliberate staging, circles, runes, offerings, gathered mana, coordinated casters or a visible threshold moment before a large effect resolves.

### Traps
Use suspense, asymmetry, occlusion, sudden movement and the instant the trap is triggered.

### Structures
Show the structure operating: firing, forging, shielding, channeling, summoning, opening, collapsing or changing the battlefield. Avoid architectural postcard shots.

## Regional action language

### Emberhold
Heat, impact, forge machinery, sparks, ash, bronze/iron, siege scale, heavy momentum and destructive power.

### Tidecall
Fluid motion, pressure, currents, tidal force, submerged ruins, refracted light, control and redirection.

### Ironwood
Weight, resilience, roots, stone, wood, defensive formations, terrain control and monumental engineering.

### Voidborn
Spatial distortion, impossible geometry, negative space, predation, corruption, reality tears and elegant cosmic horror.

### Florestia
Pack movement, growth, fauna, roots, canopy motion, ambush, adaptation and natural magic interacting with the environment.

### Tempestade
Wind, lightning, speed, aerial movement, aggressive diagonals, cloth/hair motion and split-second energy.

## Composition checklist

Before approving an illustration, ask:

- Is the subject visibly acting rather than posing?
- Can the player understand the event at thumbnail size?
- Does the image communicate the card fantasy?
- Is the focal point safe for the final crop?
- Does the region remain identifiable without reading the card name?
- Is the camera angle intentional and dramatic?
- Does the environment participate in the action?
- Are anatomy, weapon handling and perspective believable enough for final production?
- If this is a recurring character, is continuity preserved?
- Does the piece avoid looking like a generic fantasy key art prompt?

## Pilot assets

The first Action First pilot contains three non-canonical showcase crops:

- `public/standalone-game/art/cards/flagship/emberhold/emberhold_action_pilot.webp`
- `public/standalone-game/art/cards/flagship/tidecall/tidecall_action_pilot.webp`
- `public/standalone-game/art/cards/flagship/voidborn/voidborn_action_pilot.webp`

These are style-validation assets. They must not replace a live card illustration until the corresponding card/character identity is approved.

## Production export target

For approved final art, preserve a high-resolution master outside runtime optimization. The website/game build should receive optimized derivatives suitable for the card frame and responsive web use.

Recommended web delivery:

- WebP/AVIF derivative;
- crop-safe composition;
- no embedded UI or typography;
- deterministic filename tied to card/character identity;
- asset manifest status (`pilot`, `approved`, `canonical`, `retired`).

## Alternate-frame rule

Alternate rarity frames may use full-art, extended-art, sketch, gilded, corrupted/void or regional showcase variants, but they must never imply a gameplay advantage. Visual rarity is collectible presentation, not power.
