I am bringing a new macro for you guys, Tasha's Hideous Laughter. This uses DAE and Midi-QoL.

A creature of your choice that you can see within range perceives everything as hilariously funny and falls into fits of laughter if this spell affects it. The target must succeed on a Wisdom saving throw or fall prone, becoming incapacitated and unable to stand up for the duration. A creature with an Intelligence score of 4 or less isn't affected.
At the end of each of its turns, and each time it takes damage, the target can make another Wisdom saving throw. The target has advantage on the saving throw if it's triggered by damage. On a success, the spell ends.
This macro works rules as written above, it will make the target roll a saving throw at the end of their turn. If they take damage, they will also roll a saving throw. 

I hope you enjoy it!

Module Requirements
Dynamic Active Effects
Midi-QoL (Fast Forward Saving Throws)
Times Up
Advanced Macros
About Time
Updates

6/11/21: Updated for 8.x
6/14/21: Adjusted various calls, Added Cub_Condition just in case. (GM execute)
6/15/21: Added a better catch for targets with an Intelligence equal or less than 4. Removed entries.
6/16/21: Moved around some variables. Auto removes Incapacitated when spell is finished.
11/3/21: Major overhaul, Removed Cub for in favor of socket lib. Now adds an active effect to give advantage on saving throws, when damage is dealt. Added some flavor when fails their save.
Broken

Int 4 or less check is broken in newest version of DAE. This is due to the way it resolves, will work with Tposney to come up some solution.