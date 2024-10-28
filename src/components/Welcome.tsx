import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <>
      <div className="flex items-center  flex-col justify-center min-h-[95vh] ">
        Welcome to my app 😊
        <span>
          Manage your todos <Link to={`/todos`}>here</Link>
        </span>
      </div>
    </>
  );
};

export default Welcome;
