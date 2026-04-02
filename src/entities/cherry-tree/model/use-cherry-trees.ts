import { useEffect, useState } from 'react'
import type { CherryTreePoint } from './types'

type CherryTreeStatus = 'loading' | 'ready' | 'error'

export function useCherryTrees() {
  const [points, setPoints] = useState<CherryTreePoint[]>([])
  const [status, setStatus] = useState<CherryTreeStatus>('loading')

  useEffect(() => {
    let active = true

    async function loadCherryTrees() {
      try {
        setStatus('loading')
        const response = await fetch('/data/cherry-trees.json')
        if (!response.ok) {
          throw new Error(`Failed to load cherry tree data: ${response.status}`)
        }

        const data = (await response.json()) as CherryTreePoint[]
        if (!active) {
          return
        }

        setPoints(data)
        setStatus('ready')
      } catch (error) {
        console.error(error)
        if (!active) {
          return
        }

        setStatus('error')
      }
    }

    loadCherryTrees()

    return () => {
      active = false
    }
  }, [])

  return { points, status }
}
