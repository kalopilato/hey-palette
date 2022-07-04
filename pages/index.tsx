import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import type { NearestColorResult } from '../lib/nearestColor'
import nearestColor from '../lib/nearestColor'
import { paletteObjectsGroupedByName } from '../lib/palette'
import { sentenceCase } from '../lib/stringUtils'

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

  React.useEffect(() => {
    if (result) {
      router.push(`#${result.name}`)
    }
  }, [result, router])

  const reset = () => {
    setValidationError(null)
    setResult(null)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchedColor === '') {
      setValidationError('Maybe enter something first?')
      return
    }

    try {
      setResult(nearestColor(searchedColor))
    } catch (e) {
      setValidationError('I only know about HEX or RGB colors sorry!')
    }
  }

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
                className="block text-2xl font-bold text-gray-800"
              >
                Hey Palette, what color is this?
              </label>
              <input
                id="colorInput"
                type="text"
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
              <button
                type="reset"
                onClick={reset}
                className="px-4 py-2 ml-4 text-gray-700 bg-gray-100 border-2 border-gray-300 rounded hover:border-gray-400 hover:bg-gray-100 hover:text-gray-900"
              >
                Reset
              </button>
            </div>
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
                        className={`flex items-center p-1 bg-white border rounded transition ease-in-out duration-125 ${
                          colorName === result?.name
                            ? 'scale-150 shadow-[0_25px_50px_-12px_rgb(0,0,0)] scroll-mt-56'
                            : 'border-transparent'
                        }`}
                        title={colorData.description}
                      >
                        <div
                          className="mr-8 rounded"
                          style={{
                            backgroundColor: colorData.value,
                            width: '3rem',
                            height: '2rem',
                            border: '1px solid black',
                          }}
                        />
                        <span>{colorName}</span>
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
