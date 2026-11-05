import ProfileCard from './components/ProfileCard.jsx'

function App() {
  const technologies = ['QA Engineering', 'React', 'JavaScript']

  return (
    <main className="page">
      <ProfileCard
        name="Дар'я Журавська"
        group="КН313"
        technologies={technologies}
      />
    </main>
  )
}

export default App
