"use client"
import { getAccount } from '@/api/account'
import { User } from '@/types'
import { useEffect, useState } from 'react'

const useAccount = () => {

  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true)
        const res = await getAccount()
        setUser(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAccount()
  }, [])
  return {
    user,
    loading
  }
}

export default useAccount