import axiosinstance from '../config/axios';
import { UserContext } from '../context/UserContext'
import React, { useContext,useState } from 'react'

const Home = () => {
  const {user}= useContext(UserContext);
  const [isModalOpen, setisModalOpen] = useState('false');
  const [projectName, setprojectName] = useState('')

  async function createProject  (e){
    e.preventDefault();
    const res = await axiosinstance.post('/projects/create', {name: projectName});

    if(res.status === 201){
      setprojectName('');
      setisModalOpen(false);
    }


  }

  return (
    <>
    <main className='p-4'>
      <div className='projects'>
        <button 
          className='project border p-4 border-slate-500 rounded-md font-semibold'
          onClick={() => setisModalOpen(true)}
        >
         New Project<i className='ri-link ml-2'></i> 
        </button>

        <div></div>
      </div>
    </main>

    {isModalOpen && (
      <div className=" fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Create New Project</h2>
          <form onSubmit={createProject}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input 
                value={projectName}
                onChange={(e) => setprojectName(e.target.value)}
                type="text" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title" 
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setisModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  )
}

export default Home