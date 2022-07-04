import nearestColor from 'nearest-color'
import type { PaletteColor } from './palette'
import { paletteValuesMappedByName } from './palette'

type RGB = {
  r: Number,
  g: Number,
  b: Number
}

type NearestColor = {
  name: String,
  value: String,
  rgb: RGB,
  distance: Number,
}

type NearestColorResult = NearestColor & PaletteColor

const nearestColorFromPalette = nearestColor.from(paletteValuesMappedByName)

/**
 * Finds the nearest color in the palette for the given color.
 * @param colorString a HEX or RBG color string
 * @returns an object containing the nearest color object in the palette and the search result metadata
 */
const findNearestColor = (colorString: String): NearestColorResult => {
  const result = nearestColorFromPalette(colorString)
  const colorData = paletteValuesMappedByName[result.name]

  return {...colorData, ...result}
}

export default findNearestColor
export {
  NearestColorResult,
}