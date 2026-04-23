import { useEffect, useState } from 'react'
import historyService from '../../services/historyService'
import Loader from '../../components/common/Loader/Loader'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory()
      setHistory(data)
    } catch (err) {
      console.error(err)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await historyService.deleteHistory(id)
      setHistory(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <h2>History</h2>

      {history.length === 0 ? (
        <p>No history found</p>
      ) : (
        history.map(item => (
          <div key={item.id}>
            <p><b>Q:</b> {item.question}</p>
            <p><b>A:</b> {item.answer}</p>

            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default HistoryPage