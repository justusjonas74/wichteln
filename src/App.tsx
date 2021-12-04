import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function App() {

  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [wichtel, setWichtelName] = useState<string | undefined>(undefined)


  useEffect(() => {
    const fetchCodeWord = async () => {
      setIsLoading(true)
      const res = await fetch('/data/' + inputValue)

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
      {(!wichtel && !isLoading) &&
        <><input type="text" onChange={(e) => setInputValue(e.target.value)} />
          <pre>{inputValue}</pre></>
      }
      {(!wichtel && isLoading) &&
        "Lädt...."
      }
      {wichtel && 
        `${wichtel}`
      }

    </>
  );
}

export default App;
