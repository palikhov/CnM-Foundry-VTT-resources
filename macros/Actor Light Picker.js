let dialogEditor = new Dialog({
  title: `LightPicker`,
  buttons: {
    none: {
      label: `None`,
      callback: () => {
        token.document.update({light:{ dim: 0, bright: 0, color: "00000", alpha: 1, animation:{ type: "none"}}});
        dialogEditor.render(true);
      }
    },
    torch: {
      label: `Torch`,
      callback: () => {
        token.document.update({light:{ dim: 40, bright : 20, color : "#ff830f", alpha: 0.5, angle: 360, animation:{ type: "torch", speed: 5, intensity: 5}}});
        dialogEditor.render(true);
      }
   },
    lamp: {
      label: `Lamp`,
      callback: () => {
        token.document.update({light:{ dim: 45, bright : 15, color : "#ffa200", alpha: 0.5, angle: 360, animation:{ type: "torch", speed: 3, intensity: 3}}});
        dialogEditor.render(true);
      }
   },
    bullseye: {
      label: `BullseyeLantern`,
      callback: () => {
        token.document.update({light:{ dim: 120, bright : 60, color : "#ffa200", alpha: 0.5, angle: 45, animation:{ type: "torch", speed: 3, intensity: 3}}});
        dialogEditor.render(true);
      }
   },
    hoodedOpen: {
      label: `HoodedLantern(O)`,
      callback: () => {
        token.document.update({light:{ dim: 60, bright : 30, color : "#ffa200", alpha: 0.5, angle: 360, animation:{ type: "torch", speed: 3, intensity: 3}}});
        dialogEditor.render(true);
      }
   },
    hoodedClosed: {
      label: `HoodedLantern(C)`,
      callback: () => {
        token.document.update({light:{ dim: 5, bright : 0, color : "#ffa200", alpha: 0.5, angle: 360, animation:{ type: "torch", speed: 3, intensity: 3}}});
        dialogEditor.render(true);
      }
    },
    lightcantrip: {
      label: `LightCantrip`,
      callback: () => {
        token.document.update({light:{ dim: 40, bright : 20, color : "#fffab8", alpha: 0.5, angle: 360, animation:{ type: "torch", speed: 2, intensity: 1}}});
        dialogEditor.render(true);
      }
    },	
    moontouched: {
      label: `MoonTouched`,
      callback: () => {
        token.document.update({light:{ dim: 30, bright : 15, color : "#38c0f3", alpha: 0.5, angle: 360, animation:{ type: "torch", speed: 1, intensity: 1}}});
        dialogEditor.render(true);
      }
    },
    sunlight: {
      label: `SunLight`,
      callback: () => {
        token.document.update({light:{ dim: 60, bright : 30, color : "#fff45c", alpha: 0.6, angle: 360, animation:{ type: "torch", speed: 1, intensity: 5}}});
        dialogEditor.render(true);
      }
    },
    close: {
      icon: "<i class='fas fa-tick'></i>",
      label: `Exit`
    },
  },
  default: "close",
  close: () => {}
});
dialogEditor.render(true)
