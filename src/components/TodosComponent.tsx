const TodosComponent = () => {
  const todos = [
    { id: 1, description: "Learn Linux", status: "true", date: "10/02/2020" },
    { id: 2, description: "Learn DevOps", status: "false", date: "10/02/2020" },
    { id: 3, description: "Learn Kafka", status: "true", date: "10/02/2020" },
    {
      id: 4,
      description: "Learn to play Violin",
      status: "false",
      date: "10/02/2020",
    },
    {
      id: 5,
      description: "Learn communication skills",
      status: "true",
      date: "10/02/2020",
    },
  ];
  return (
    <>
      <div className="flex items-center flex-col mt-24 min-h-[85vh] p-4">
        <h1 className="text-5xl font-bold mb-8">Your Todos</h1>
        <div className="w-full max-w-7xl overflow-x-auto rounded-md">
          <table className="w-full bg-white shadow-md">
            <thead className=" bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Id
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Completion Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Target Date
                </th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-700">{todo.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {todo.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {todo.status}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {todo.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TodosComponent;
