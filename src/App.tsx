import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Snowfall from 'react-snowfall'


// minified version is also included
import 'react-toastify/dist/ReactToastify.min.css';
import './App.css'


function App() {

  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [wichtel, setWichtelName] = useState<string | undefined>(undefined)


  useEffect(() => {
    const fetchCodeWord = async () => {
      setIsLoading(true)
      const res = await fetch('data/' + inputValue)

      if (!res.ok || !res.body) {
        toast.error("Da hat etwas nicht geklappt. Vielleicht stimmt der Code nicht?!")
        setIsLoading(false)
        setWichtelName(undefined)
      } else {
        const name = await res.text()
        setIsLoading(false)
        setWichtelName(name)
      }
    }

    if (inputValue.length > 5) {
      fetchCodeWord()
    }

  }, [inputValue])

  return (
    <>
      <Snowfall />
      <div className=" Logo" style={{
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh'
      }}>
        <div className="container">


          <div className="row vertical-center justify-content-center">
            <div className="p-5 mb-4 bg-light rounded-3 bg-opacity-75 col-md-6 ">
    
                <h1 className="display-5 fw-bold">Wichtelmaschine</h1>
                <p className="fs-4">Für wen bin ich in diesem Jahr der Wichtel?</p>

                {(!wichtel && !isLoading) &&
                  <input placeholder="Hier den Code eingeben" type="text" className="form-control form-control-lg" onChange={(e) => setInputValue(e.target.value)} />
                }
                {(!wichtel && isLoading) &&
                  "Lädt...."
                }
                {wichtel &&
                  `${wichtel}`
                }

            </div>

          </div>
        </div>
      </div>
      <ToastContainer />
    </>

  );
}

export default App;
