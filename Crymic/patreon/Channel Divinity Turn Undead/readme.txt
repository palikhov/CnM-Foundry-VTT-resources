This will work as RAW. Once your cleric can turn undead with channel divinity it will auto explode them on saving throw failure.
Added Support for Turn Resistance and Turn Defiance.
This macro is for Midi-qol only, Only undead creatures within 30 feet will roll for saving throw. The macro does require 2 callback macros.

Module Requirements
Midi-QoL
Advanced Macros
Item Macro (optional)

Macro Requirements
ActorUpdate

Updates
4/25/21: Dropped "ActorUpdate" in favor of Midi-Qol Damage. Also added a target catch.
5/27/21: Fixed broken actorData token issue.
6/14/21: Updated 8.x, Dropped Midi-qol Damage due to conflict with DND helpers Undead Fortitude. Went back with ActorUpdate.
6/15/21: Added in Immunity check, Added label for result.
8/3/21: Removed the need for Cub_Condition, It is automatically built in now.
8/14/21: Updated ActorUpdate callback macro.
10/16/21: Remove Async, Small changes
11/6/21: Changed target creature types, included suport for npcs, fixed Frightened condition on hit.