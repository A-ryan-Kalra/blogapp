import { Button } from "flowbite-react";

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl ">
      <div className=" flex-1 flex flex-col justify-center">
        <h2 className="text-[20px] font-semibold">
          Want to learn more about Javascript?
        </h2>
        <p className="text-gray-500 my-2">
          Check out these resources with Javascript Projects
        </p>
        <Button
          gradientDuoTone={"purpleToPink"}
          className="rounded-tl-2xl rounded-bl-none text-center "
        >
          <a href="#" target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src={
            "https://stackify.com/wp-content/uploads/2018/10/JavaScript-Tutorials-for-Beginners-881x441-1.jpg"
          }
          alt="javascript course"
        />
      </div>
    </div>
  );
}

export default CallToAction;
