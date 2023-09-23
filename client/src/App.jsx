import { useCallback, useEffect, useState } from 'react'

function App() {
  const [photos, setPhotos] = useState([])

  // Convert fetch to async function below
  //   fetch('http://localhost:3000/photos?_page=1&_limit=10')
  //     .then((res) => res.json())
  //     .then(setPhotos)
  // }

  // Make above fetch with promise to async function
  async function fetchPhotos() {
    const res = await fetch('http://localhost:3000/photos?_page=1&_limit=10')
    const photos = await res.json()
    setPhotos(photos)
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
        fetchPhotos()
        console.log('Last element show')
        observer.unobserve(image) // Image shows up one time and then we stop it
      }
    })
    observer.observe(image)
  }, [])

  useEffect(() => {
    fetchPhotos()
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
