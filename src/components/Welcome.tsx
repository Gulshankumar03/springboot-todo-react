import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import HelloWorldApiService from "@/api/HelloWorldApiService";

const Welcome = () => {
  const [message, setMessage] = useState();

  

  function callHelloWorld() {
    HelloWorldApiService()
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("Error calling the API:", error);
      });
    // .finally(() => setMessage(""));
  }

  return (
    <>
      <div className="flex items-center flex-col justify-center min-h-[90vh] ">
        Welcome to my app
        <span>
          Manage your todos <Link to={`/todos`}>here</Link>
        </span>
        <Button className="m-5" variant={"default"} onClick={callHelloWorld}>
          Say Hello
        </Button>
        <pre>{JSON.stringify(message, null, 2)}</pre>
      </div>
    </>
  );
};

export default Welcome;
