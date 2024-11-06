import { useState, useEffect } from 'react'
import './index.css'

interface Supplement {
  id: string;
  name: string;
  taken: boolean;
}

function App() {
  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const storedSupplements = localStorage.getItem('supplements')
    return storedSupplements ? JSON.parse(storedSupplements) : []
  })
  const [newSupplementName, setNewSupplementName] = useState('')

  // Load supplements from localStorage and check if it's a new day
  useEffect(() => {
    const lastDate = localStorage.getItem('lastDate')
    const currentDate = new Date().toDateString()
    
    if (lastDate !== currentDate) {
      // It's a new day, reset taken status but keep the supplement list
      const storedSupplements = localStorage.getItem('supplements')
      const supplementsList = storedSupplements 
        ? JSON.parse(storedSupplements).map((supp: Supplement) => ({
            ...supp,
            taken: false
          }))
        : []
      
      setSupplements(supplementsList)
      localStorage.setItem('lastDate', currentDate)
      localStorage.setItem('supplements', JSON.stringify(supplementsList))
    }
  }, [])

  // Save supplements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('supplements', JSON.stringify(supplements))
  }, [supplements])

  const addSupplement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSupplementName.trim()) return

    const newSupplement: Supplement = {
      id: Date.now().toString(),
      name: newSupplementName.trim(),
      taken: false
    }
    setSupplements([...supplements, newSupplement])
    setNewSupplementName('')
  }

  const toggleTaken = (id: string) => {
    setSupplements(supplements.map(supp =>
      supp.id === id ? { ...supp, taken: !supp.taken } : supp
    ))
  }

  const removeSupplement = (id: string) => {
    setSupplements(supplements.filter(supp => supp.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">
          Daily Supplements Tracker
        </h1>
        
        <form onSubmit={addSupplement} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newSupplementName}
              onChange={(e) => setNewSupplementName(e.target.value)}
              placeholder="Enter supplement name"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                placeholder-gray-500 text-gray-100"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newSupplementName.trim()}
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {supplements.map(supplement => (
            <div 
              key={supplement.id}
              className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg 
                border border-gray-700 hover:border-gray-600 transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={supplement.taken}
                onChange={() => toggleTaken(supplement.id)}
                className="w-5 h-5 rounded border-gray-600 text-purple-600 
                  focus:ring-purple-500 focus:ring-offset-gray-900 bg-gray-700
                  cursor-pointer"
              />
              <span 
                className={`flex-1 text-lg ${
                  supplement.taken 
                    ? 'line-through text-gray-500' 
                    : 'text-gray-100'
                }`}
              >
                {supplement.name}
              </span>
              <button
                onClick={() => removeSupplement(supplement.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Delete supplement"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          ))}
          
          {supplements.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No supplements added yet. Add your first supplement above!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
