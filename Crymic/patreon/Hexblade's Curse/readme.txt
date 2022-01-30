All you Cursed locks can rejoice! I don't have any hexblades in my campaign, but test this out anyway.

Starting at 1st level, you gain the ability to place a baleful curse on someone. As a bonus action, choose one creature you can see within 30 feet of you. The target is cursed for 1 minute. The curse ends early if the target dies, you die, or you are incapacitated. Until the curse ends, you gain the following benefits:
You gain a bonus to damage rolls against the cursed target. The bonus equals your proficiency bonus.
Any attack roll you make against the cursed target is a critical hit on a roll of 19 or 20 on the d20.
If the cursed target dies, you regain hit points equal to your warlock level + your Charisma modifier (minimum of 1 hit point).
You can’t use this feature again until you finish a short or long rest.
This macro requires Midi-Qol and DAE.

This macro places an effect on the target as described above. Now since Midi-QoL does not offer a flag for a grant threshold critical. I had to hack the workflow, so this will roll an additional damage die on the 19 critical. It's not gonna be green like a normal critical, but it'll still do the 2x damage. If you game offers some sort of odd crit style, you can modify the result.

Now the second part is another macro, which is handled by DAE.  I had to make its own macro to work properly, you may need to give it permission level of "Observer" for all. I think 8.x changed some stuff for macro permissions. When casted and the target dies, it'll heal the caster. Works like a charm. :)

Modules Required:
Dynamic Active Effects
Midi-Qol
Advanced Macro

Updates:
6/10/21: Updated for 8.x
6/11/21: Updated Dice Roll and Updated Active Effects. Changed Method of dice damage on critical and non-critical.
6/13/21: Updated Paths, Added Catch for no target, Added Catch for Afflicted target. Tposney fixed bug in DAE & Midi-qol preventing this macro working 100%.
6/16/21: reupload
8/3/21: Removed the need for ActiveEffect callback macros. Now uses Midi-qol socketlib.
8/14/21: Forgot to removed ActiveEffect check macro check, It's now removed.
9/18/21: Added json file, corrected Healing mod.