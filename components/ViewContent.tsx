import React from "react";
import { CopyableImage, CopyablePre } from "./CopyShare";

const ViewContent = ({item}:{item:messageAi}) => {
  // Function to display the content of the message
  return (
    <>
      <div className="relative flex justify-end ">
        <div className="ml-auto max-w-[98%] border shadow-md rounded-2xl bg-gray-600 p-3">
          <pre className="whitespace-pre-wrap break-words ">{item.input}</pre>
        </div>
      </div>
      {/* display AI's response */}
      <CopyablePre 
        content={item?.content}
        className="relative border rounded-2xl p-4 px-4 shadow-md max-w-[90%] w-fit border-gray-100 bg-gray-600" type={""}/>

    </>
  );
};

export default ViewContent;

export const ViewImage = ({item }:{item:messageAi}) => {
  // Function to display the content of the message
  return (
    <>
      <div className="relative flex justify-end ">
        <div className="ml-auto max-w-[98%] border shadow-md rounded-2xl bg-gray-600 p-3">
          <pre className="whitespace-pre-wrap break-words ">{item.input}</pre>
        </div>
      </div>
      {/* display AI's response */}
      <CopyableImage 
        content={item?.content}
        className="relative border rounded-2xl p-4 px-4 shadow-md max-w-[90%] w-fit border-gray-100 bg-gray-600" type={item.type}/>
        
    </>
  );
};

export const ViewAudio = ({item}:{item:messageAi}) => {
  // Function to display the content of the message
  return (
    <>
      <div className="relative flex justify-end ">
        <div className="ml-auto max-w-[98%] border shadow-md rounded-2xl bg-gray-600 p-3">
          <pre className="whitespace-pre-wrap break-words ">{item.input}</pre>
        </div>
      </div>
      {/* display AI's response */}
      <CopyableImage 
        content={item?.content}
        className="relative border rounded-2xl p-4 px-4 shadow-md max-w-[90%] w-fit border-gray-100 bg-gray-600" type={item.type}/>
    </>
  );
};