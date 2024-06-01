import load from './styles/load.module.scss'

export default function Loading() {
  return (
    <div className={load.loadcheck}>
      <h1>Loading...</h1>
    </div>
  )
}
