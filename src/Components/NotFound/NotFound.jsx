import React from 'react'
import notfound from '../../imgs/404 Page Not Found Errors_ The Ultimate Guide.jpg'
import notfoundStyles from './NotfoundStyles.module.scss';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  let navigate = useNavigate();
  return (
    <>
    <div className='vh-100 d-flex flex-column justify-content-center align-items-center '>
      <img src={notfound} className='rounded-3 w-50' alt="" />
      <button className={`${notfoundStyles.notfoundBtn} rounded-pill px-5 py-2 my-4`} onClick={()=> navigate('/home')}>Go to home</button>
    </div>
    </>
  )
}
