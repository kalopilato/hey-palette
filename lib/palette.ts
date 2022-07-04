import colorTokens from '../data/color-tokens'

type PaletteColor = {
  value: string
  type: string
  description: string
}

const palette = colorTokens.global

const paletteValuesMappedByName = Object.entries(palette).reduce(
  (acc, entry) => {
    const [name, data] = entry
    return { ...acc, [name]: data.value }
  },
  {}
)

const paletteObjectsMappedByName = Object.entries(palette).reduce(
  (acc, entry) => {
    const [name, data] = entry
    return { ...acc, [name]: data }
  },
  {}
)

const paletteObjectsGroupedByName = Object.entries(
  paletteObjectsMappedByName
).reduce((acc, entry) => {
  const [name, value] = entry
  const groupName = name.split('-')[0]

  const existingGroupEntries = acc[groupName] || {}
  acc[groupName] = { ...existingGroupEntries, [name]: value }

  return acc
}, {})
export const APP_PALETTE = paletteObjectsGroupedByName
export default palette
export {
  PaletteColor,
  paletteValuesMappedByName,
  paletteObjectsMappedByName,
  paletteObjectsGroupedByName,
}
