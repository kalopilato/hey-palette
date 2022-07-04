import colorTokens from '../data/color-tokens.json'

type PaletteColor = {
  value: string
  type: string
  description: string
}

type PaletteMap = {
  [key: string]: PaletteColor
}

type GroupedPaletteMap = {
  [key: string]: PaletteMap
}

type StringMap = {
  [key: string]: string
}

const palette = colorTokens.global

const paletteValuesMappedByName: StringMap = Object.entries(palette).reduce(
  (acc, entry) => {
    const [name, data] = entry
    return { ...acc, [name]: data.value }
  },
  {}
)

const paletteObjectsMappedByName: PaletteMap = Object.entries(palette).reduce(
  (acc, entry) => {
    const [name, data] = entry
    return { ...acc, [name]: data }
  },
  {}
)

const paletteObjectsGroupedByName = Object.entries(
  paletteObjectsMappedByName
).reduce((acc: GroupedPaletteMap, entry: [string, PaletteColor]) => {
  const [name, value] = entry
  const groupName = name.split('-')[0]

  const existingGroupEntries = acc[groupName] || {}
  acc[groupName] = { ...existingGroupEntries, [name]: value }

  return acc
}, {})

export default palette

export type { PaletteColor }

export {
  paletteValuesMappedByName,
  paletteObjectsMappedByName,
  paletteObjectsGroupedByName,
}
