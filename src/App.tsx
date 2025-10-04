import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Dashboard } from '@/pages/Dashboard'
import { CategoryPage } from '@/pages/CategoryPage'
import { TileDetailPage } from '@/pages/TileDetailPage'
import { NotFound } from '@/pages/NotFound'
import { getValidationError } from '@/lib/data'

function App() {
  const validationError = getValidationError()

  if (validationError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full rounded-lg border border-destructive bg-destructive/10 p-6">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Fehler beim Laden der Daten
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            Die Datei structure.json konnte nicht validiert werden:
          </p>
          <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
            {validationError.message}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/:categoryId" element={<CategoryPage />} />
            <Route path="/:categoryId/:tileId" element={<TileDetailPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

