import type { NextPage } from 'next'

import nearestColor from '../lib/nearestColor'
import { paletteObjectsGroupedByName } from '../lib/palette'
import { toSentenceCase } from '../lib/stringUtils'

import React from 'react'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  const [searchedColor, setSearchedColor] = React.useState('')
  const [result, setResult] = React.useState(null)
  const [validationError, setValidationError] = React.useState(null)

  const onSearchChange = (e) => {
    if(validationError) setValidationError(null)
    if(result) setResult(null)
    setSearchedColor(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(searchedColor === '') {
      setValidationError('Maybe enter something first?')
      return
    }

    try {
      const searchResult = nearestColor(searchedColor)
      setResult(nearestColor(searchedColor))
    } catch (e) {
      setValidationError('Nope. I know about HEX or RGB colors but not whatever that is')
    }
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Hey Palette</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <header className="sticky top-0 flex flex-col items-center justify-center w-full py-4 bg-white border-b">
          <form className="block w-10/12" onSubmit={onSubmit}>
            <label htmlFor="colorInput" className="block text-2xl font-bold text-gray-800">Hey Palette, what color is this?</label>
            <input
              id="colorInput"
              type="text"
              className="w-48 px-4 py-2 mt-2 text-center text-gray-700 border-2 border-gray-200 rounded focus:outline-none focus:border-gray-300"
              autocomplete="off"
              autoFocus
              placeholder="Enter a color"
              onChange={onSearchChange}
            />
            <div className="h-4 pt-2 mb-2 italic">
              {validationError ? (
                <span className="text-red-500">{validationError}</span>
              ) : null}
              {result ? (
                <span className="font-semibold text-gray-700">{`Nearest color: "${result.name}". Distance: ${result.distance}`}</span>
              ) : null}
            </div>
          </form>
        </header>

        <div className="flex w-10/12 my-8">
          <div className="flex flex-wrap justify-center w-full gap-x-16 gap-y-8">
            { Object.entries(paletteObjectsGroupedByName).map(([groupName, group]) => (
              <div className="w-48">
                <h3 className="mb-2 text-lg font-semibold">{toSentenceCase(groupName)}</h3>
                <ol>
                  { Object.entries(group).map(([colorName, colorData]) => (
                    <li
                      className={`flex items-center p-1 border-2 rounded ${colorName === result?.name ? 'border-green-500 bg-green-100' : 'border-white'}`}
                      title={colorData.description}
                    >
                      <div
                        className="mr-8 rounded"
                        style={{backgroundColor: colorData.value, width: '3rem', height: '2rem', border: '1px solid black'}}
                      />
                      <span>{colorName}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
