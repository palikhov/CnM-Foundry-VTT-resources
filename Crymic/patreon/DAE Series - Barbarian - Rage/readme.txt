In this video series, I will be discussing how to setup Rage with Dynamic Active Effects.

Below is a screenshot of how I set mine up.

Rules as written for Rage..

You have advantage on Strength checks and Strength saving throws.
When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian, as shown in the Rage Damage column of the Barbarian table. 
You have resistance to bludgeoning, piercing, and slashing damage.
With having both DAE and Midi-qol installed, we can emulate this perfectly.

flags.midi-qol.advantage.ability.check.str
flags.midi-qol.advantage.ability.save.str
set both these to 1

For the scaling weapon damage, we'll use this weapon damage formula

(ceil(floor(@classes.barbarian.levels/(9-(floor(@classes.barbarian.levels/9)))+2)))

To add damage resistance, make sure to add Bludgeoning, Piercing and Slashing.

If you have a totem Barb, rip.. you'll have to add them all but Psychic.

Below is how I setup the item details.

Next video, I will cover Danger Sense and Reckless Attack.