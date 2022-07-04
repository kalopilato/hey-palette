import nearestColor from 'nearest-color'
import type { PaletteColor } from './palette'
import {
  paletteValuesMappedByName,
  paletteObjectsMappedByName,
} from './palette'

type RGB = {
  r: number
  g: number
  b: number
}

type NearestColor = {
  name: string
  value: string
  rgb: RGB
  distance: number
}

type NearestColorResult = NearestColor & PaletteColor

const nearestColorFromPalette = nearestColor.from(paletteValuesMappedByName)

/**
 * Finds the nearest color in the palette for the given color.
 * @param colorString a HEX or RBG color string
 * @returns an object containing the nearest color object in the palette and the search result metadata
 */
const findNearestColor = (colorString: string): NearestColorResult => {
  const result = nearestColorFromPalette(colorString)
  const colorData = paletteObjectsMappedByName[result.name]

  return { ...colorData, ...result }
}

export default findNearestColor
export type { NearestColorResult }
