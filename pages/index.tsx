import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import type { NearestColorResult } from '../lib/nearestColor'
import nearestColor, {
  resultDistanceToMatchPercentage,
} from '../lib/nearestColor'
import { paletteObjectsGroupedByName } from '../lib/palette'
import { sentenceCase } from '../lib/stringUtils'
import { copyTextToClipboard } from '../lib/clipboard'
import React from 'react'
import Head from 'next/head'

const Home: NextPage = () => {
  const router = useRouter()

  const [searchedColor, setSearchedColor] = React.useState<string>('')
  const [result, setResult] = React.useState<NearestColorResult | null>(null)
  const [validationError, setValidationError] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    reset()
  }, [searchedColor])

  const reset = () => {
    setValidationError(null)
    setResult(null)
  }

  const handleSwatchClick = async (colorValue: string) => {
    await copyTextToClipboard(colorValue)
    alert(`Copied ${colorValue} to clipboard`)
  }

  const handleColorNameClick = async (colorName: string) => {
    // It's a little weird to reformat the string before writing to clipboard but this is
    // how we define the palette in CSS Custom Properties so why not 🤷‍♂️
    const colorVariableString = `var(--${colorName})`

    await copyTextToClipboard(colorVariableString)
    alert(`Copied ${colorVariableString} to clipboard`)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchedColor === '') {
      reset()
      router.push('/')
      setValidationError('Maybe enter something first?')
      return
    }

    try {
      const nearestColorResult = nearestColor(searchedColor)
      setResult(nearestColorResult)
      router.push(`#${nearestColorResult.name}`)
    } catch (e) {
      setValidationError('I only know about HEX or RGB colors sorry!')
    }
  }

  const resultMatchPercentage = result
    ? resultDistanceToMatchPercentage(result.distance)
    : 0
  const resultMatchPercentageText =
    resultMatchPercentage === 100
      ? 'exact match'
      : `${resultMatchPercentage.toFixed(2)}% match`

  return (
    <div className="min-h-screen">
      <Head>
        <title>Hey Palette</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <header className="sticky top-0 flex flex-col items-center justify-center w-full py-4 mt-4 bg-white border-b">
          <form className="block w-10/12" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="colorInput"
                className="block text-xl font-bold text-gray-800 md:text-2xl"
              >
                Hey Palette, what color is this?
              </label>
              <input
                id="colorInput"
                type="search"
                className="w-48 px-4 py-2 mt-2 text-center text-gray-700 border-2 border-gray-200 rounded focus:outline-none focus:border-gray-300"
                autoComplete="off"
                autoFocus
                placeholder="Enter a color"
                onChange={(e) => {
                  setSearchedColor(e.target.value)
                }}
              />
              <button
                type="submit"
                className="px-4 py-2 ml-4 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded hover:border-gray-400 hover:bg-gray-100 hover:text-gray-900"
              >
                Find
              </button>
            </div>
            <div className="h-4 pt-2 mb-2 italic">
              {validationError ? (
                <span className="text-red-500">{validationError}</span>
              ) : null}
              {result ? (
                <span className="font-semibold text-gray-500">{`Nearest color: "${result.name}" (${resultMatchPercentageText})`}</span>
              ) : null}
            </div>
          </form>
        </header>

        <div className="flex w-10/12 my-8">
          <div className="flex flex-wrap justify-center w-full gap-x-16 gap-y-8">
            {Object.entries(paletteObjectsGroupedByName).map(
              ([groupName, group]) => (
                <div key={groupName} className="w-48">
                  <h3 className="mb-2 text-lg font-semibold">
                    {sentenceCase(groupName)}
                  </h3>
                  <ol>
                    {Object.entries(group).map(([colorName, colorData]) => (
                      <li
                        id={colorName}
                        key={colorName}
                        className={`p-1 bg-white border rounded transition ease-in-out duration-125 scroll-mt-56 ${
                          colorName === result?.name
                            ? 'scale-150 shadow-[0_25px_50px_-12px_rgb(0,0,0)]'
                            : 'border-transparent'
                        }`}
                      >
                        {colorName === result?.name && (
                          <div className="mb-1 italic text-gray-500">
                            {resultMatchPercentageText}
                          </div>
                        )}
                        <div
                          className="flex items-center"
                          title={`${colorData.description} (${colorData.value})`}
                        >
                          <div
                            className="w-12 h-8 mr-8 border border-black rounded cursor-pointer"
                            style={{ backgroundColor: colorData.value }}
                            onClick={() => handleSwatchClick(colorData.value)}
                          />
                          <span
                            className="cursor-pointer"
                            onClick={() => handleColorNameClick(colorName)}
                          >
                            {colorName}
                          </span>
                        </div>
                        {colorName === result?.name && (
                          <div className="flex items-center pt-1 mt-1 border-0 border-t">
                            <div
                              className="w-12 h-8 mr-8 border border-black rounded cursor-pointer"
                              style={{ backgroundColor: searchedColor }}
                              onClick={() => handleSwatchClick(searchedColor)}
                            />
                            <span className="italic text-gray-500">
                              {searchedColor}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
