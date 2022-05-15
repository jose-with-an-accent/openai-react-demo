import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [hint, setHint] = useState(null)
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const f = async () => {
    const h = hint ? `Write a product name, followed by its description and price, that is similar to a ${hint} ` : "Write a product name, followed by its description and price."
    try {
      const req = await fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,

        },
        method: "POST",
        body: JSON.stringify({
          prompt: h,
          max_tokens: 256
        })
      })
      const res = await req.json();
      console.log(res);

      const arr = res.choices[0].text.split(`\n`) // openai seems to use newlines to differentiate between description and name, and sometimes price.
      console.log(arr)
      setTitle(arr[2]);
      setDescription(arr[4]);

      //sometimes openAI doesn't follow any actual format; for sake of simplicity we're just choosing next string after the title.
      const nextItems = arr.slice(3, arr.length - 1);
      arr.map(val => {
        if (val !== "") {
          setDescription(val);
          return;
        }
      })
      ///TODO - add logic to separate price
    }
    catch (e) {
      console.log(e);
    }}
  useEffect(() => {
      f()
  }, [])
  return (
    <div className="App">
      <h1>Products Galore</h1>
      <p>Let's make a product so you can preview how your shopify store would look like!</p>
      <input onChange={e => setHint(e.target.value)} />
      <h1>{title}</h1>
      <p>{description}</p>
      <button onClick={() => f()}>Reload</button>
    </div>
  );
}

export default App;
