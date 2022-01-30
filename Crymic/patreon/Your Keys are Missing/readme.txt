So I recently encountered a ton of this error when importing in a new character from ddb. No matter what items I added from srd it would cause this error
If you're like me and import all your characters. This issue will affect you. There's a confirmed race issue on document creation.. Here's the solution to fix it.

Solution..
Goto to actor directory on the sidebar. Right click on an actor and choose Export. This will give you a prompt box to save the actor as a json file.
After saving the file to your hard drive, right click again on the actor. This time we're gonna choose Import.

You will need to do this with each actor. You should notice the errors are gone. The reimport repairs and merges any missing data from the create document process. I don't think this is a bug in ddb, but is a bug in foundry itself.

EDIT
After the recent release of Twilight Sanctuary. I was able to work with Tposney (author of DAE and Midi-QoL). On How to fix this issue. He found a line of code in DAE.js which needed to be awaited..

daeMacro("off", actor, this.data, {});
daeMacro("on", parent, this.data, {});

change to

await daeMacro("off", actor, this.data, {});
await daeMacro("on", parent, this.data, {});