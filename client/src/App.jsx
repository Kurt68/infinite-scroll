import { useCallback, useEffect, useRef, useState } from 'react'
import { parseLinkHeader } from './parseLinkHeader'

function App() {
  const [photos, setPhotos] = useState([])
  const nextPhotoUrlRef = useRef()

  // Convert fetch to async function below
  //   fetch('http://localhost:3000/photos?_page=1&_limit=10')
  //     .then((res) => res.json())
  //     .then(setPhotos)
  // }

  // Make above fetch with promise to async function
  async function fetchPhotos(url, { overwrite = false } = {}) {
    const res = await fetch(url)
    nextPhotoUrlRef.current = parseLinkHeader(res.headers.get('Link')).next
     console.log(parseLinkHeader(res.headers.get('Link')))
    const photos = await res.json()
    if (overwrite) {
      //console.log(overwrite)
      setPhotos(photos)
    } else {
      setPhotos((prevPhotos) => {
        return [...prevPhotos, ...photos]
      })
    }
  }
  // console.log(photos)

  // When is user at very end of list of photos best way is to use a useCallback to check that.
  // As soon as element is loaded on the page I want to run some code.
  const imageRef = useCallback((image) => {
    if (image == null) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log(entries)
        //TODO: Load next elements
        fetchPhotos(nextPhotoUrlRef.current)
        console.log('Last element show')
        observer.unobserve(image) // Image shows up one time and then we stop it
      }
    })
    observer.observe(image)
  }, [])

  useEffect(() => {
    fetchPhotos('http://localhost:3000/photos?_page=1&_limit=10', {
      overwrite: true,
    })
  }, [])

  return (
    <div className="grid">
      {photos.map((photo, index) => (
        <img
          src={photo.url}
          key={photo.id}
          ref={index === photos.length - 1 ? imageRef : undefined}
          alt=""
        /> // When is last image element being shown, need reference to last image element
      ))}
    </div>
  )
}

export default App
