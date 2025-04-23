const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg m-3 w-72">
      <div className="flex items-center">
        <div className="bg-blue-500 p-3 rounded-full text-white">{icon}</div>
        <div className="ml-4">
          <h4 className="text-gray-700 text-lg">{title}</h4>
          <p className="text-2xl font-bold text-blue-600">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default StatCard
