import { useCallback, useEffect, useRef, useState } from 'react'
import { parseLinkHeader } from './parseLinkHeader'

const LIMIT = 50
const value = '_'
function App() {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const nextPhotoUrlRef = useRef()

  // Convert fetch to async function below
  //   fetch('http://localhost:3000/photos?_page=1&_limit=10')
  //     .then((res) => res.json())
  //     .then(setPhotos)
  // }

  // Make above fetch with promise to async function
  async function fetchPhotos(url, { overwrite = false } = {}) {
    setIsLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 2000))
      const res = await fetch(url)
      nextPhotoUrlRef.current = parseLinkHeader(res.headers.get('Link')).next
      // console.log(parseLinkHeader(res.headers.get('Link')))
      const photos = await res.json()
      if (overwrite) {
        setPhotos(photos)
      } else {
        setPhotos((prevPhotos) => {
          return [...prevPhotos, ...photos]
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // When is user at very end of list of photos best way is to use a useCallback to check that.
  // As soon as element is loaded on the page I want to run some code.
  const imageRef = useCallback((image) => {
    if (image == null || nextPhotoUrlRef.current == null) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // console.log(entries)
        fetchPhotos(nextPhotoUrlRef.current)
        observer.unobserve(image) // Image shows up one time and then we stop it
      }
    })
    observer.observe(image)
  }, [])

  useEffect(() => {
    fetchPhotos(
      `http://localhost:3000/photos-short-list?_page=1&_limit=${LIMIT}`,
      {
        overwrite: true,
      }
    )
  }, [])

  return (
    <div className="grid">
      {photos.map((photo, index) => (
        <img
          key={photo.id}
          src={photo.url}
          ref={index === photos.length - 1 ? imageRef : undefined}
          alt=""
        />
      ))}
      {isLoading &&
        Array.from({ length: LIMIT }, (value, (index) => index)).map((n) => {
          return (
            <div key={n} className="skeleton">
              Loading...
            </div>
          )
        })}
    </div>
  )
}

export default App
