You'll need to setup this macro exactly how I have to make it work. Change icons to fit your taste.

Conquering Presence Setup

1 Create item in item directory.
2 Create DAE Effect
2 Duration : Macro repeat, End of Each turn.
3 Effect: Item Macro
4 Enter macro into Item Macro.
Aura of Conquest Setup

1 Create a feature for Aura of Conquest.
2 Go back into Conquering Presence and create another Effect called Aura of Conquest.
3 Duration : Macro repeat, Start of Each turn.
4 Effects: Macro.execute "AuraOfConquest" @token
I have also included the item itself, you'll still need to attach the Aura of Conquest macro.

Updates

3/17/21: Bug fixes and updated for latest version of Midi-QoL.
6/21/21: Updated to 8.x, Uses Midi-QoL for cards.