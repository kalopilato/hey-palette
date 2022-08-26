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

/**
 * Converts the `distance` value from the nearestColor result to a percentage match
 * @param distance the distance value returned by findNearestColor
 * @returns the percentage match as a number between 0 and 100
 */
const resultDistanceToMatchPercentage = (distance: number): number => {
  // This const was determined by using the `nearest-color` library to compare #000 to #fff and taking its `distance` value
  const maxResultDistance = 441.6729559300637
  return 100 - (distance / maxResultDistance) * 100
}

export default findNearestColor
export { resultDistanceToMatchPercentage }
export type { NearestColorResult }
