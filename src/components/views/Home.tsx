export const Home = () => {
  return (
    // <main className="bg-slate-200 dark:bg-slate-800 h-[calc(100vh-4em)] flex flex-col justify-center items-center">
    //   <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-gray-200">
    //     Home
    //   </h1>
    // </main>
    <main className="h-[calc(100vh-4em)] flex flex-col justify-center items-center">
      <div className="w-[95%] min-h-[80vh] h-[500px] bg-slate-200  rounded-3xl shadow-2xl flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">

        {/* <div className="w-11/12 max-w-2xl bg-slate-200 dark:bg-slate-800 w-[100%] max-w-[1200px] h-[500px]  bg-white/16 rounded-2xl 
                      flex items-center justify-center
                      text-3xl font-bold text-gray-800 justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]"> */}


        {/* <div className="w-[500px] h-[500px]
                bg-white/10 backdrop-blur-lg
                rounded-3xl
                shadow-xl
                ring-1 ring-white/40
                flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]"></div> */}
        <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-gray-200">
          Home
        </h1>
      </div>
    </main>

  );
};
