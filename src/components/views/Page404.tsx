import { Link } from "react-router-dom";
export const Page404 = () => {
    return (
        //         <main className="h-[calc(100vh-4em)] flex flex-col justify-center items-center">
        //             <div className="w-[95%] min-h-[80vh] h-[500px] bg-slate-200  rounded-3xl shadow-2xl flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">

        //                 <h1 className="font-bold text-gray-900 dark:text-white text-center text-5xl">
        //                     404
        //                 </h1>
        //                 <p>
        //                     <span className="text-gray-600 dark:text-gray-300 mt-2">
        //                         The page you are looking for does not exist.
        //                     </span>
        //                 </p>
        //                 <Link
        //                     to="/"
        //                     className="text-gray-600 dark:text-gray-300 text-center font-semibold mt-5 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 py-2 px-5 rounded-lg"
        //                 >
        //                     <span>Go to Home</span>
        //                 </Link>
        //             </div>
        //  </main>

        // <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        //     <div class="text-center">
        //         <p class="text-base font-semibold text-indigo-600">404</p>
        //         <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Page not found</h1>
        //         <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Sorry, we couldn’t find the page you’re looking for.</p>
        //         <div class="mt-10 flex items-center justify-center gap-x-6">
        //             <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go back home</a>
        //             <a href="#" class="text-sm font-semibold text-gray-900">Contact support <span aria-hidden="true">&rarr;</span></a>
        //         </div>
        //     </div>
        // </main>
        <main>
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat">
                <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                    <div className="text-9xl font-bold text-indigo-600 mb-4">404</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Oops! Page Not Found</h1>
                    <p className="text-lg text-gray-600 mb-8">The page you're looking for seems to have gone on a little adventure. Don't
                        worry, we'll help you find your way back home.</p>
                    <Link to="/home"
                        className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                        Go Back Home
                    </Link>
                </div>
            </div></main>





    );
};
