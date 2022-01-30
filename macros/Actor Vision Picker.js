let dialogEditor = new Dialog({
  title: `VisionPicker`,
  buttons: {
    none: {
      label: `Normal`,
      callback: () => {
        token.document.update({"dimSight": 0, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },
    darkvision30: {
      label: `DV 30`,
      callback: () => {
        token.document.update({"dimSight": 30, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },
    darkvision60: {
      label: `DV 60`,
      callback: () => {
        token.document.update({"dimSight": 60, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },	
    darkvision80: {
      label: `DV 80`,
      callback: () => {
        token.document.update({"dimSight": 80, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },
    darkvision120: {
      label: `DV 120`,
      callback: () => {
        token.document.update({"dimSight": 120, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },
	darkvision150: {
      label: `DV 150`,
      callback: () => {
        token.document.update({"dimSight": 150, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },
	darkvision180: {
      label: `DV 180`,
      callback: () => {
        token.document.update({"dimSight": 180, "brightSight": 0, "vision":true,});
        dialogEditor.render(true);
      }
    },
	blind: {
      label: `Blinded`,
      callback: () => {
        token.document.update({"dimSight": 0, "brightSight": 0, "vision":false,});
        dialogEditor.render(true);
      }
    },	
	devilsight: {
      label: `Devils Sight`,
      callback: () => {
        token.document.update({"dimSight": 0, "brightSight": 120, "vision":true,});
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
