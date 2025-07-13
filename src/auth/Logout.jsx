import React from 'react'
import axios from 'axios'
import { Base_URL } from '../Api/Base'
import { useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { logout } from '../redux/authSlice'
import {Link} from 'react-router-dom'

const Logout = () => {
const navigate =  useNavigate()
const dispatch = useDispatch()
    const handleLogout =async ()=>{
        try {
           const res = await axios.post(`${Base_URL}/logout`, null, {withCredentials: true});
            dispatch(logout())
           navigate('/')
        } catch (error) {
            
        }
    }

  return (
    <div className ="flex flex-col  gap-2">
      <button onClick={handleLogout} className='p-2 px-8 bg-amber-400 rounded-sm flex items-center'>Logout</button>
      <Link to='/trackings' className='p-2 px-8 bg-amber-400 rounded-sm flex items-center'> All Trackings</Link>
    </div>
  )
}

export default Logout
