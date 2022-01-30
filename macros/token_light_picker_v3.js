
const TORCH_ICON = 'icons/sundries/lights/torch-brown-lit.webp'
const torchAnimation = {
    "intensity": 1,
    "speed": 1,
    "type": "torch"
}

const mundaneLight = {
    "alpha": 0.1,
    "angle": 360,
    "animation": torchAnimation,
    "color": "#d98e26",
    "luminosity": 0.5
}

const magicLight = {
    "alpha": 0.1,
    "angle": 360,
    "animation": {"type": "none"},
    "color": "#a6bbdd",
    "luminosity": 0.5
}

async function tokenUpdate(lightData) {
  if (canvas.tokens.controlled.length === 0){
    return ui.notifications.error("No token is selected!")
  }
  const tokens = canvas.tokens.controlled.map(token => {
      return {
          _id: token.id,
          light: {...lightData}
      }
  })
  await canvas.scene.updateEmbeddedDocuments('Token', tokens)
  const turnedOn = lightData?.animation?.type === 'torch'
  const turnedOff = !turnedOn && token.data.effects.includes(TORCH_ICON)
  for (const token of canvas.tokens.controlled) {
    if (turnedOn || turnedOff)
      await token.toggleEffect(TORCH_ICON, { active: true, overlay: false })
    if (turnedOff)
      await token.toggleEffect(TORCH_ICON, { active: false, overlay: false })
  }
}

const dialogOptions = {
    id: "lightPickerSelector",
    width: 320
}

const content = `
<style>
  #lightPickerSelector .dialog-button { margin: auto; min-width: 200px; }
  #lightPickerSelector .light { min-width: 200px; }
  #lightPickerSelector .lightHeightened { min-width: 75px; }
</style>
Pick the light source the selected token is holding.
`

let dialogEditor = new Dialog({
  title: `Token Light Picker`,
  content: content,
  buttons: {
    none: {
      icon: "<i class='fas fa-eye'></i>",
      label: `None`,
      callback: () => {
        tokenUpdate({"bright": 0, "dim": 0, "angle": 360,});
        dialogEditor.render(true)
      }
    },
    torch: {
      icon: "<i class='fas fa-fire'></i>",
      label: `Torch`,
      callback: () => {
        tokenUpdate({...mundaneLight, "bright": 20, "dim": 40})
        dialogEditor.render(true)
      }
    },
    light: {
      icon: "<i class='fas fa-magic'></i>",
      label: `Light cantrip (Level 1 to 3)`,
      callback: () => {
        tokenUpdate({...magicLight, "bright": 20, "dim": 40})
        dialogEditor.render(true)
      }
    },
    lightHeightened: {
      icon: "<i class='fas fa-magic'></i>",
      label: `(Level 4+)`,
      callback: () => {
        tokenUpdate({...magicLight, "bright": 60, "dim": 120})
        dialogEditor.render(true)
      }
    },
    candle: {
      icon: "<i class='fas fa-burn'></i>",
      label: `Candle`,
      callback: () => {
        tokenUpdate({...mundaneLight, "bright": 0, "dim": 10})
        dialogEditor.render(true)
      }
    },
    bullseye: {
      icon: "<i class='fas fa-bullseye'></i>",
      label: `Bullseye Lantern`,
      callback: () => {
        tokenUpdate({...mundaneLight, "bright": 60, "dim": 120, "angle": 45})
        dialogEditor.render(true)
      }
    },
    hooded: {
      icon: "<i class='fas fa-traffic-light'></i>",
      label: `Hooded Lantern`,
      callback: () => {
        tokenUpdate({...mundaneLight, "bright": 30, "dim": 60})
        dialogEditor.render(true)
      }
    },
    darkness: {
      icon: "<i class='fas fa-eye-slash'></i>",
      label: `Darkness spell`,
      callback: () => {
        tokenUpdate({...magicLight, "bright": 15, "dim": 0, "luminosity": -0.5})
        dialogEditor.render(true)
      }
    },
    close: {
      icon: "<i class='fas fa-times'></i>",
      label: `Close`
    },
  },
  default: "close",
  close: () => {}
}, dialogOptions)

dialogEditor.render(true)
