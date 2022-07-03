import nearestColor from 'nearest-color'
import { paletteValuesMappedByName } from './palette'

const nearestColorFromPalette = nearestColor.from(paletteValuesMappedByName)

export default (colorString) => {
  const result = nearestColorFromPalette(colorString)
  const colorData = paletteValuesMappedByName[result.name]

  return {...colorData, ...result}
}