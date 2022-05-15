import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [prevProducts, setPrevProducts] = [];
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
    }
  }
  useEffect(() => {
    f()
  }, [])
  return (
    <div className="App p-10 h-screen space-y-3 bg-gray-200">
      <h1 className='text-3xl'>Products Galore</h1>
      <p>Let's make a product so you can preview how your shopify store would look like!</p>
      <p className='text-gray-700 text-sm'>Note: the program might not work well, since openAI doesn't provide structured data consistently.</p>
      <input className="outline px-3 py-1.5 rounded-sm outline-gray-600" onChange={e => setHint(e.target.value)} placeholder="Add a category or type of product here to customize it" />
      <button onClick={() => f()} className="bg-blue-600 text-white p-2">Reload</button>

      <div className='w-full flex space-x-3 flex-row p-3 rouned-lg bg-white shadow-lg'>

        <img className='w-36 h-36 object-cover' src="https://images.unsplash.com/photo-1521294102048-6cb73602dc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />
        <div>
          <h2 className='text-xl'>{title}</h2>
          <p>{description}</p>
          <p className='text-green-700'>$0.00</p>
        </div>
      </div>
    </div>
  );
}

export default App;
